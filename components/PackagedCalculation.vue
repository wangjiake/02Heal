<!-- components/PackagedCalculation.vue -->
<template>
    <div class="p-4 bg-white rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">{{ $t("袋装食品计算") }}</h2>

        <form @submit.prevent="calculateAndAddFood" class="space-y-4">
            <!-- 食物名称 -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t("食物名称") }}
                </label>
                <input
                    type="text"
                    v-model="foodName"
                    class="block w-full pl-3 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    :placeholder="$t('例如: 蛋白棒')"
                />
            </div>

            <!-- 基本营养素 (每100g) -->
            <div
                v-for="(item, index) in nutritionValues"
                :key="index"
                class="mb-4"
            >
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ item.title }}
                </label>
                <div class="relative rounded-md shadow-sm">
                    <input
                        type="text"
                        inputmode="decimal"
                        v-model="item.value"
                        @input="formatNumber(item)"
                        class="block w-full pl-3 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    />
                    <div
                        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                    >
                        <span class="text-gray-500 sm:text-sm">
                            {{ item.key === "calories" ? "kcal" : "g" }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- 实际重量 -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t("实际重量") }} (g)
                </label>
                <div class="relative rounded-md shadow-sm">
                    <input
                        type="text"
                        inputmode="decimal"
                        v-model="weight"
                        @input="formatWeightInput"
                        class="block w-full pl-3 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    />
                    <div
                        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                    >
                        <span class="text-gray-500 sm:text-sm">g</span>
                    </div>
                </div>
            </div>

            <!-- 常用重量快速选择 -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t("常用重量快速选择") }}
                </label>
                <div class="flex flex-wrap gap-2">
                    <button
                        v-for="(w, index) in commonWeights"
                        :key="index"
                        type="button"
                        @click="weight = w.toString()"
                        class="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors text-sm font-medium"
                    >
                        {{ w }}g
                    </button>
                </div>
            </div>

            <!-- 计算结果 -->
            <div class="mt-6 p-4 bg-gray-100 rounded-lg">
                <h3 class="text-md font-bold mb-2">{{ $t("计算结果") }}:</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-700">{{ $t("卡路里") }}:</p>
                        <p class="text-lg font-medium">
                            {{ finalNutrition.calories }}kcal
                        </p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-700">{{ $t("蛋白质") }}:</p>
                        <p class="text-lg font-medium">
                            {{ finalNutrition.protein }}g
                        </p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-700">{{ $t("脂肪") }}:</p>
                        <p class="text-lg font-medium">
                            {{ finalNutrition.fat }}g
                        </p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-700">{{ $t("碳水") }}:</p>
                        <p class="text-lg font-medium">
                            {{ finalNutrition.carbs }}g
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 mt-6">
                <!-- 计算和添加按钮 -->
                <button
                    type="submit"
                    class="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    {{ $t("计算并添加食物") }}
                </button>
                <!-- 清空表单按钮 -->
                <button
                    type="button"
                    @click="resetForm"
                    class="w-full sm:w-auto px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    {{ $t("清空表单") }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import {
    formatToTwoDecimals,
    calculatePackagedNutrition,
    addPackagedFood,
} from '../utils/storage';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
// 尝试注入 toast 服务
const toast = inject('toast', null);

// 响应式数据
const foodName = ref('');
const weight = ref('');

// 常用重量选择
const commonWeights = [25, 30, 45, 50, 60, 75, 100, 115, 150, 200];

// 营养值输入 (每100g)
const nutritionValues = ref([
    {
        title: t('卡路里 (每100g)')  ,
        value: '',
        color: 'bg-orange-500',
        key: 'calories',
    },
    {
        title: t('蛋白质 (每100g)')  ,
        value: '',
        color: 'bg-green-500',
        key: 'protein',
    },
    { 
        title: t('脂肪 (每100g)')  , 
        value: '', 
        color: 'bg-yellow-400', 
        key: 'fat' 
    },
    { 
        title: t('碳水 (每100g)')  , 
        value: '', 
        color: 'bg-blue-400', 
        key: 'carbs' 
    },
]);

// 定义emit事件
const emit = defineEmits(['food-added']);

// 获取当前营养值每100g对象
const getNutritionPer100g = () => {
    return {
        calories: parseFloat(
            nutritionValues.value.find((item) => item.key === 'calories')
                .value || 0
        ),
        protein: parseFloat(
            nutritionValues.value.find((item) => item.key === 'protein')
                .value || 0
        ),
        fat: parseFloat(
            nutritionValues.value.find((item) => item.key === 'fat').value || 0
        ),
        carbs: parseFloat(
            nutritionValues.value.find((item) => item.key === 'carbs').value ||
                0
        ),
    };
};

// 计算最终营养值
const finalNutrition = computed(() => {
    // 默认值
    const defaultValues = {
        calories: '0.00',
        protein: '0.00',
        fat: '0.00',
        carbs: '0.00',
    };

    if (!weight.value) return defaultValues;

    // 使用storage.js中的方法计算袋装食物营养值
    const nutritionPer100g = getNutritionPer100g();
    const results = calculatePackagedNutrition(nutritionPer100g, weight.value);

    return {
        calories: results.calories.toString(),
        protein: results.protein.toString(),
        fat: results.fat.toString(),
        carbs: results.carbs.toString(),
    };
});

// 计算并添加食物
const calculateAndAddFood = () => {
    // 验证表单
    if (!isFormValid()) {
        showToast(t('请填写完整的食物信息'), 'error');
        return;
    }

    // 使用storage.js中的方法添加袋装食物
    const newFood = addPackagedFood(foodName.value, weight.value, {
        calories: parseFloat(finalNutrition.value.calories),
        protein: parseFloat(finalNutrition.value.protein),
        fat: parseFloat(finalNutrition.value.fat),
        carbs: parseFloat(finalNutrition.value.carbs),
    });

    // 显示提示
    showToast(t('已添加食物') + ': ' + newFood.name);

    // 触发组件事件
    emit('food-added', newFood);
};

// 验证表单
const isFormValid = () => {
    // 检查食物名称
    if (!foodName.value) return false;

    // 检查重量
    if (!weight.value) return false;

    // 检查营养值
    for (const item of nutritionValues.value) {
        if (!item.value) return false;
    }

    return true;
};

// 格式化数字，确保输入有效
const formatNumber = (item) => {
    // 如果不是数字格式，转换为有效数字或清空
    if (item.value && isNaN(parseFloat(item.value))) {
        item.value = '';
    }

    // 移除非数字和非小数点字符
    if (item.value) {
        item.value = item.value.replace(/[^\d.]/g, '');

        // 确保只有一个小数点
        const parts = item.value.split('.');
        if (parts.length > 2) {
            item.value = parts[0] + '.' + parts.slice(1).join('');
        }
    }
};

// 格式化重量输入
const formatWeightInput = () => {
    formatNumber({ value: weight.value });
};

// 重置表单
const resetForm = () => {
    foodName.value = '';
    weight.value = '';

    // 重置营养值
    nutritionValues.value.forEach((item) => {
        item.value = '';
    });
};

// 显示提示
const showToast = (message, type = 'success') => {
    if (toast) {
        if (type === 'success') {
            toast.success(message);
        } else if (type === 'error') {
            toast.error(message);
        }
    } else if (window.$toast) {
        if (type === 'success') {
            window.$toast.success(message);
        } else if (type === 'error') {
            window.$toast.error(message);
        }
    }
};
</script>