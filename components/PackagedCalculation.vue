<!-- components/PackagedCalculation.vue -->
<template>
    <div class="card p-5 sm:p-6">
        <h2 class="section-title mb-5">{{ $t("袋装食品计算") }}</h2>

        <form @submit.prevent="calculateAndAddFood" class="space-y-4">
            <div>
                <label class="form-label">{{ $t("食物名称") }}</label>
                <input type="text" v-model="foodName" class="input-modern"
                    :placeholder="$t('例如: 蛋白棒')" />
            </div>

            <div v-for="(item, index) in nutritionValues" :key="index">
                <label class="form-label">{{ item.title }}</label>
                <div class="relative">
                    <input type="text" inputmode="decimal" v-model="item.value"
                        @input="formatNumber(item)" class="input-modern pr-14" />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <span class="text-slate-400 text-sm">
                            {{ item.key === "calories" ? "kcal" : "g" }}
                        </span>
                    </div>
                </div>
            </div>

            <div>
                <label class="form-label">{{ $t("实际重量") }} (g)</label>
                <div class="relative">
                    <input type="text" inputmode="decimal" v-model="weight"
                        @input="formatWeightInput" class="input-modern pr-14" />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <span class="text-slate-400 text-sm">g</span>
                    </div>
                </div>
            </div>

            <div>
                <label class="form-label">{{ $t("常用重量快速选择") }}</label>
                <div class="flex flex-wrap gap-2">
                    <button v-for="(w, index) in commonWeights" :key="index"
                        type="button" @click="weight = w.toString()" class="tag-brand">
                        {{ w }}g
                    </button>
                </div>
            </div>

            <div class="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h3 class="text-sm font-semibold text-slate-700 mb-3">{{ $t("计算结果") }}</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-xs text-slate-500 mb-0.5">{{ $t("卡路里") }}</p>
                        <p class="text-lg font-bold text-amber-600">
                            {{ finalNutrition.calories }}<span class="text-xs font-normal ml-0.5">kcal</span>
                        </p>
                    </div>
                    <div>
                        <p class="text-xs text-slate-500 mb-0.5">{{ $t("蛋白质") }}</p>
                        <p class="text-lg font-bold text-emerald-600">
                            {{ finalNutrition.protein }}<span class="text-xs font-normal ml-0.5">g</span>
                        </p>
                    </div>
                    <div>
                        <p class="text-xs text-slate-500 mb-0.5">{{ $t("脂肪") }}</p>
                        <p class="text-lg font-bold text-violet-600">
                            {{ finalNutrition.fat }}<span class="text-xs font-normal ml-0.5">g</span>
                        </p>
                    </div>
                    <div>
                        <p class="text-xs text-slate-500 mb-0.5">{{ $t("碳水") }}</p>
                        <p class="text-lg font-bold text-sky-600">
                            {{ finalNutrition.carbs }}<span class="text-xs font-normal ml-0.5">g</span>
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" class="btn-success w-full sm:w-auto">
                    {{ $t("计算并添加食物") }}
                </button>
                <button type="button" @click="resetForm" class="btn-secondary w-full sm:w-auto">
                    {{ $t("清空表单") }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
    formatToTwoDecimals,
    calculatePackagedNutrition,
    addPackagedFood,
} from '../utils/storage';
import { formatNumberInput, formatRefNumberInput } from '../utils/format';
import { useI18n } from "vue-i18n";
import { useToast } from "../composables/useToast";

const { t } = useI18n();
const toast = useToast();

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

const formatNumber = formatNumberInput;

// 格式化重量输入
const formatWeightInput = () => {
    formatRefNumberInput(weight);
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

const showToast = (message, type = 'success') => {
    toast[type](message);
};
</script>