<!-- components/ImportTags.vue -->
<template>
    <div class="card p-5 sm:p-6">
        <h2 class="section-title mb-5">{{ $t('导入标签') }}</h2>

        <div class="space-y-4">
            <div>
                <label class="form-label">{{ $t('粘贴标签数据') }}</label>
                <textarea v-model="importText"
                    class="input-modern !h-48 resize-none"
                    :placeholder="$t('粘贴食物数据...')"></textarea>
                <p class="text-xs text-slate-400 mt-1.5">{{ $t('格式示例') }}</p>
            </div>

            <div>
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="overwriteExisting"
                        class="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500/20" />
                    <span class="text-sm text-slate-600">{{ $t('覆盖同名标签') }}</span>
                </label>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 pt-2">
                <button class="btn-secondary w-full sm:w-auto" @click="exportAllTags">
                    {{ $t('导出标签') }}
                </button>
                <button class="btn-secondary w-full sm:w-auto" @click="clearText">
                    {{ $t('清空') }}
                </button>
                <button class="btn-primary w-full sm:w-auto" @click="importTags">
                    {{ $t('导入标签') }}
                </button>
            </div>
        </div>

        <!-- 导入结果提示 -->
        <div v-if="importResult" class="mt-5 p-4 rounded-xl flex items-start gap-3"
            :class="importResult.success
                ? 'bg-emerald-50 border border-emerald-200'
                : 'bg-rose-50 border border-rose-200'">
            <svg v-if="importResult.success" class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd" />
            </svg>
            <svg v-else class="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd" />
            </svg>
            <p class="text-sm font-medium"
                :class="importResult.success ? 'text-emerald-800' : 'text-rose-800'">
                {{ importResult.message }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getVisibleFoodTags, saveVisibleFoodTags, getFoodTags, saveFoodTags } from '~/utils/storage';
import { getFixedTags } from '~/utils/constants';

const { t } = useI18n();

// 表单状态
const importText = ref('');
const overwriteExisting = ref(false);
const importResult = ref(null);

// 清空文本框
const clearText = () => {
    importText.value = '';
    importResult.value = null;
};

// 导出所有标签到文本框
const exportAllTags = () => {
    try {
        // 获取所有可见标签
        const allTags = getVisibleFoodTags();

        if (!allTags || allTags.length === 0) {
            importResult.value = {
                success: false,
                message: t('没有可导出的标签')
            };
            return;
        }

        // 格式化为JSON字符串，使用2个空格缩进
        importText.value = JSON.stringify(allTags, null, 2);

        importResult.value = {
            success: true,
            message: t('成功导出') + ' ' + allTags.length + ' ' + t('个标签')
        };
    } catch (error) {
        console.error('导出错误:', error);
        importResult.value = {
            success: false,
            message: t('导出失败: ') + error.message
        };
    }
};

// 导入标签
const importTags = () => {
    try {
        if (!importText.value.trim()) {
            importResult.value = {
                success: false,
                message: t('请输入标签数据')
            };
            return;
        }

        // 解析输入内容为 JSON
        let tagsToImport = [];
        let parsedData;

        try {
            parsedData = JSON.parse(importText.value);
            tagsToImport = Array.isArray(parsedData)
                ? parsedData
                : [parsedData];
        } catch (jsonError) {
            try {
                const processedText = importText.value
                    .replace(/'/g, '"')
                    .replace(/(\w+):/g, '"$1":')
                    .replace(/,\s*}/g, '}')
                    .replace(/,\s*]/g, ']');
                parsedData = JSON.parse(processedText);
                tagsToImport = Array.isArray(parsedData)
                    ? parsedData
                    : [parsedData];
            } catch (e) {
                importResult.value = {
                    success: false,
                    message: t('数据解析失败，请检查格式')
                };
                return;
            }
        }

        // 验证每个标签
        if (tagsToImport.length === 0) {
            importResult.value = {
                success: false,
                message: t('没有可导入的标签数据')
            };
            return;
        }

        const invalidTag = tagsToImport.find(
            tag => !tag.name || typeof tag.name !== 'string' || tag.name.trim() === ''
        );
        if (invalidTag) {
            importResult.value = {
                success: false,
                message: t('标签数据格式不正确，请确保每个标签都有name属性')
            };
            return;
        }

        // 标准化标签结构
        tagsToImport = tagsToImport.map(tag => ({
            name: tag.name,
            calories: parseFloat(tag.calories || 0),
            protein: parseFloat(tag.protein || 0),
            fat: parseFloat(tag.fat || 0),
            carbs: parseFloat(tag.carbs || 0),
            visible: tag.visible !== undefined ? tag.visible : true,
            fixed: false,
            createdAt: tag.createdAt || new Date().toISOString()
        }));

        // 获取已有用户标签
        const existingTags = getFoodTags();

        let updatedTags;
        if (overwriteExisting.value) {
            updatedTags = tagsToImport.reduce((acc, newTag) => {
                const index = acc.findIndex(tag => tag.name === newTag.name);
                if (index !== -1) {
                    acc[index] = {
                        ...acc[index],
                        ...newTag,
                        updatedAt: new Date().toISOString()
                    };
                } else {
                    acc.push({
                        ...newTag,
                        createdAt: new Date().toISOString()
                    });
                }
                return acc;
            }, [...existingTags]);
        } else {
            const newNames = new Set(existingTags.map(tag => tag.name));
            const newUniqueTags = tagsToImport.filter(tag => !newNames.has(tag.name));
            updatedTags = [
                ...existingTags,
                ...newUniqueTags.map(tag => ({
                    ...tag,
                    createdAt: new Date().toISOString()
                }))
            ];
        }

        saveFoodTags(updatedTags);

        const fixedTags = getFixedTags();

        const visibleTags = [...fixedTags, ...updatedTags].filter(tag => tag.visible !== false);
        saveVisibleFoodTags(visibleTags);

        importResult.value = {
            success: true,
            message: t('标签导入成功，共导入') + ' ' + tagsToImport.length + ' ' + t('个标签')
        };
        importText.value = '';
    } catch (error) {
        console.error(t('导入错误:'), error);
        importResult.value = {
            success: false,
            message: t('导入失败: ') + error.message
        };
    }
};
</script>