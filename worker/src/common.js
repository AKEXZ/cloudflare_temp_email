import { Jwt } from 'hono/utils/jwt'

import { getDomains, getStringValue } from './utils';

export const newAddress = async (c, name, domain, enablePrefix) => {
    // remove special characters
    name = name.replace(/[^a-zA-Z0-9.]/g, '')
    // check name length
    if (name.length < 0) {
        return c.text("Name too short", 400)
    }
    if (name.length > 100) {
        return c.text("Name too long (max 100)", 400)
    }
    // check domain, generate random domain
    const domains = getDomains(c);
    if (!domain || !domains.includes(domain)) {
        domain = domains[Math.floor(Math.random() * domains.length)];
    }
    // create address
    if (enablePrefix) {
        name = getStringValue(c.env.PREFIX) + name + "@" + domain;
    } else {
        name = name + "@" + domain;
    }
    try {
        const { success } = await c.env.DB.prepare(
            `INSERT INTO address(name) VALUES(?)`
        ).bind(name).run();
        if (!success) {
            return c.text("Failed to create address", 500)
        }
    } catch (e) {
        if (e.message && e.message.includes("UNIQUE")) {
            return c.text("Address already exists, please retry a new address", 400)
        }
        return c.text("Failed to create address", 500)
    }
    let address_id = 0;
    try {
        address_id = await c.env.DB.prepare(
            `SELECT id FROM address where name = ?`
        ).bind(name).first("id");
    } catch (error) {
        console.log(error);
    }
    // create jwt
    const jwt = await Jwt.sign({
        address: name,
        address_id: address_id
    }, c.env.JWT_SECRET)
    return c.json({
        jwt: jwt
    })
}

export const cleanup = async (c, cleanType, cleanDays) => {
    if (!cleanType || !cleanDays || cleanDays < 0 || cleanDays > 30) {
        throw new Error("Invalid cleanType or cleanDays")
    }
    console.log(`Cleanup ${cleanType} before ${cleanDays} days`);
    switch (cleanType) {
        case "mails":
            await c.env.DB.prepare(`
                DELETE FROM raw_mails WHERE created_at < datetime('now', '-${cleanDays} day')`
            ).run();
            break;
        case "mails_unknow":
            await c.env.DB.prepare(`
                DELETE FROM raw_mails WHERE address NOT IN
                (select name from address) AND created_at < datetime('now', '-${cleanDays} day')`
            ).run();
            break;
        case "address":
            await c.env.DB.prepare(`
                DELETE FROM address WHERE updated_at < datetime('now', '-${cleanDays} day')`
            ).run();
            break;
        case "sendbox":
            await c.env.DB.prepare(`
                DELETE FROM sendbox WHERE created_at < datetime('now', '-${cleanDays} day')`
            ).run();
            break;
        default:
            throw new Error("Invalid cleanType")
    }
    return true;
}
