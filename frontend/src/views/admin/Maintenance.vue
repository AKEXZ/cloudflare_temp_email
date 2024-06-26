<script setup>
import { ref, h, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n'
import { CleaningServicesFilled } from '@vicons/material'

import { useGlobalState } from '../../store'
import { api } from '../../api'

const { localeCache, adminAuth, showAdminAuth } = useGlobalState()
const message = useMessage()
const cleanupModel = ref({
    enableMailsAutoCleanup: false,
    cleanMailsDays: 30,
    enableUnknowMailsAutoCleanup: false,
    cleanUnknowMailsDays: 30,
    enableAddressAutoCleanup: false,
    cleanAddressDays: 30,
    enableSendBoxAutoCleanup: false,
    cleanSendBoxDays: 30,
})

const { t } = useI18n({
    locale: localeCache.value || 'zh',
    messages: {
        en: {
            tip: 'Please input the cleanup days',
            mailBoxLabel: 'Clean up days for mailbox',
            mailUnknowLabel: "Clean up days for unknow receiver",
            addressUnActiveLabel: "Clean up days for unactive address",
            sendBoxLabel: "Clean up days for sendbox",
            cleanupNow: "Cleanup now",
            autoCleanup: "Auto cleanup",
            cleanupSuccess: "Cleanup success",
            save: "Save",
        },
        zh: {
            tip: '请输入清理天数',
            mailBoxLabel: '收件箱清理天数',
            mailUnknowLabel: "无收件人邮件清理天数",
            addressUnActiveLabel: "未活跃地址清理天数",
            sendBoxLabel: "发件箱清理天数",
            autoCleanup: "自动清理",
            cleanupSuccess: "清理成功",
            cleanupNow: "立即清理",
            save: "保存",
        }
    }
});

const cleanup = async (cleanType, cleanDays) => {
    try {
        await api.fetch('/admin/cleanup', {
            method: 'POST',
            body: JSON.stringify({ cleanType, cleanDays })
        });
        message.success(t('cleanupSuccess'));
    } catch (error) {
        message.error(error.message || "error");
    }
}

const fetchData = async () => {
    try {
        const res = await api.fetch('/admin/auto_cleanup');
        if (res) Object.assign(cleanupModel.value, res);
    } catch (error) {
        message.error(error.message || "error");
    }
}

const save = async () => {
    try {
        await api.fetch('/admin/auto_cleanup', {
            method: 'POST',
            body: JSON.stringify(cleanupModel.value)
        });
        message.success(t('cleanupSuccess'));
    } catch (error) {
        message.error(error.message || "error");
    }
}

onMounted(async () => {
    if (!adminAuth.value) {
        showAdminAuth.value = true;
        return;
    }
    await fetchData();
})
</script>


<template>
    <div class="center">
        <n-card>
            <n-form :model="cleanupModel">
                <n-form-item-row :label="t('mailBoxLabel')">
                    <n-checkbox v-model:checked="cleanupModel.enableMailsAutoCleanup">
                        {{ t('autoCleanup') }}
                    </n-checkbox>
                    <n-input-number v-model:value="cleanupModel.cleanMailsDays" :placeholder="t('tip')" />
                    <n-button @click="cleanup('mails', cleanupModel.cleanMailsDays)">
                        <template #icon>
                            <n-icon :component="CleaningServicesFilled" />
                        </template>
                        {{ t('cleanupNow') }}
                    </n-button>
                </n-form-item-row>
                <n-form-item-row :label="t('mailUnknowLabel')">
                    <n-checkbox v-model:checked="cleanupModel.enableUnknowMailsAutoCleanup">
                        {{ t('autoCleanup') }}
                    </n-checkbox>
                    <n-input-number v-model:value="cleanupModel.cleanUnknowMailsDays" :placeholder="t('tip')" />
                    <n-button @click="cleanup('mails_unknow', cleanupModel.cleanUnknowMailsDays)">
                        <template #icon>
                            <n-icon :component="CleaningServicesFilled" />
                        </template>
                        {{ t('cleanupNow') }}
                    </n-button>
                </n-form-item-row>
                <n-form-item-row :label="t('addressUnActiveLabel')">
                    <n-checkbox v-model:checked="cleanupModel.enableAddressAutoCleanup">
                        {{ t('autoCleanup') }}
                    </n-checkbox>
                    <n-input-number v-model:value="cleanupModel.cleanAddressDays" :placeholder="t('tip')" />
                    <n-button @click="cleanup('address', cleanupModel.cleanAddressDays)">
                        <template #icon>
                            <n-icon :component="CleaningServicesFilled" />
                        </template>
                        {{ t('cleanupNow') }}
                    </n-button>
                </n-form-item-row>
                <n-form-item-row :label="t('mailBoxLabel')">
                    <n-checkbox v-model:checked="cleanupModel.enableSendBoxAutoCleanup">
                        {{ t('autoCleanup') }}
                    </n-checkbox>
                    <n-input-number v-model:value="cleanupModel.cleanSendBoxDays" :placeholder="t('tip')" />
                    <n-button @click="cleanup('sendbox', cleanupModel.cleanSendBoxDays)">
                        <template #icon>
                            <n-icon :component="CleaningServicesFilled" />
                        </template>
                        {{ t('cleanupNow') }}
                    </n-button>
                </n-form-item-row>
                <n-button @click="save" type="primary" block :loading="loading">
                    {{ t('save') }}
                </n-button>
            </n-form>
        </n-card>
    </div>
</template>

<style scoped>
.n-card {
    max-width: 800px;
}

.center {
    display: flex;
    text-align: center;
    place-items: center;
    justify-content: center;
}

.item {
    display: flex;
    margin: 10px;
}
</style>
