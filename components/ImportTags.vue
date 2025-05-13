<!-- components/ImportTags.vue -->
<template>
    <div class="py-4">
        <h2 class="text-xl font-semibold mb-4">{{ $t('导入标签') }}</h2>

        <div class="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <!-- 文本导入 -->
            <div class="mb-4">
                <label class="block text-gray-700 font-medium mb-2">{{ $t('粘贴标签数据') }}</label>
                <textarea v-model="importText" class="w-full h-48 border border-gray-300 rounded-lg p-3 text-sm"
                    :placeholder="$t('粘贴食物数据...')"></textarea>
                <p class="text-xs text-gray-500 mt-1">{{ $t('格式示例') }}</p>
            </div>

            <!-- 导入选项 -->
            <div class="mb-4">
                <div class="flex items-center mb-2">
                    <input type="checkbox" id="overwriteExisting" v-model="overwriteExisting" class="mr-2">
                    <label for="overwriteExisting" class="text-sm text-gray-700">
                        {{ $t('覆盖同名标签') }}
                    </label>
                </div>
            </div>

            <!-- 按钮组 -->
            <div class="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                    class="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-200 transition"
                    @click="exportAllTags">
                    {{ $t('导出标签') }}
                </button>
                <button
                    class="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-200 transition"
                    @click="clearText">
                    {{ $t('清空') }}
                </button>
                <button
                    class="bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-600 transition"
                    @click="importTags">
                    {{ $t('导入标签') }}
                </button>
            </div>
        </div>

        <!-- 导入结果提示 -->
        <div v-if="importResult" :class="[
            importResult.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800',
            'p-4 rounded-lg border mb-4'
        ]">
            <div class="flex">
                <div v-if="importResult.success" class="flex-shrink-0">
                    <svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div v-else class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium">{{ importResult.message }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getVisibleFoodTags, saveVisibleFoodTags } from '~/utils/storage';

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
                try {
                    const evalResult = new Function('return ' + importText.value)();
                    tagsToImport = Array.isArray(evalResult)
                        ? evalResult
                        : [evalResult];
                } catch (evalError) {
                    importResult.value = {
                        success: false,
                        message: t('数据解析失败，请检查格式')
                    };
                    return;
                }
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

        // ✅ 保存用户标签（供标签管理使用）
        saveFoodTags(updatedTags);

        // ✅ 构建可见标签列表（系统标签 + 用户标签）
        const fixedTags = [
            {
                name: t('鸡蛋'),
                calories: 72,
                protein: 6.3,
                fat: 4.8,
                carbs: 0.6,
                visible: true,
                fixed: true,
                createdAt: new Date().toISOString(),
            },
            {
                name: t('香蕉'),
                calories: 105,
                protein: 1.3,
                fat: 0.4,
                carbs: 27,
                visible: true,
                fixed: true,
                createdAt: new Date().toISOString(),
            }
        ];

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