<!-- components/AddFood.vue -->
<template>
    <div class="card p-5 sm:p-6">
        <h2 class="section-title mb-5">{{ $t("添加食物") }}</h2>

        <!-- Quick tags -->
        <div v-if="visibleTags.length > 0" class="mb-6">
            <p class="form-label">{{ $t("快速添加标签") }}</p>
            <div class="flex flex-wrap gap-2">
                <button v-for="(tag, index) in visibleTags" :key="index" @click="applyTag(tag)"
                    class="tag-brand">
                    {{ tag.nameKey ? $t(tag.nameKey) : tag.name }}
                </button>
            </div>
        </div>

        <form @submit.prevent="addFood" class="space-y-4">
            <div>
                <label class="form-label">{{ $t("食物名称") }}</label>
                <input type="text" v-model="foodName" :placeholder="$t('输入食物名称')"
                    class="input-modern" />
            </div>

            <div v-for="(item, index) in nutritionValues" :key="index">
                <label :for="'nutrition-' + item.key" class="form-label">{{ item.title }}</label>
                <div class="relative">
                    <input :id="'nutrition-' + item.key" type="text" inputmode="decimal" v-model="item.value"
                        @input="formatNumber(item)"
                        class="input-modern pr-14"
                        :aria-label="item.title" />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <span class="text-slate-400 text-sm">
                            {{ item.key === "calories" ? "kcal" : "g" }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" class="btn-primary w-full sm:w-auto">
                    {{ $t("添加食物") }}
                </button>
                <button type="button" @click="resetForm" class="btn-secondary w-full sm:w-auto">
                    {{ $t("清空表单") }}
                </button>
            </div>
        </form>

        <div v-if="todayFoods.length > 0" class="mt-8 pt-6 border-t border-slate-100">
            <h3 class="section-title mb-4">{{ $t("今日添加的食物") }}</h3>
            <div class="space-y-3">
                <div v-for="(food, index) in todayFoods" :key="index"
                    class="flex justify-between items-center gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div class="flex-1 min-w-0">
                        <p class="font-medium text-slate-800 truncate">
                            {{ food.name || $t("未命名食物") }}
                        </p>
                        <p class="text-xs text-slate-500 mt-1">
                            {{ formatDisplayNumber(food.calories) }} kcal
                            &middot; {{ $t("蛋白质") }} {{ formatDisplayNumber(food.protein) }}g
                            &middot; {{ $t("脂肪") }} {{ formatDisplayNumber(food.fat) }}g
                            &middot; {{ $t("碳水") }} {{ formatDisplayNumber(food.carbs) }}g
                        </p>
                    </div>
                    <button @click="removeFood(index)"
                        class="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-50 flex-shrink-0"
                        :aria-label="$t('删除')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="mt-4 p-4 rounded-xl bg-brand-50 border border-brand-100">
                <p class="text-sm font-semibold text-brand-800">
                    {{ $t("今日总计") }}:
                    {{ formatDisplayNumber(dailyTotals.calories) }} kcal &middot;
                    {{ $t("蛋白质") }} {{ formatDisplayNumber(dailyTotals.protein) }}g &middot;
                    {{ $t("脂肪") }} {{ formatDisplayNumber(dailyTotals.fat) }}g &middot;
                    {{ $t("碳水") }} {{ formatDisplayNumber(dailyTotals.carbs) }}g
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
    getTodayFoods,
    saveTodayFoods,
    getVisibleFoodTags,
    updateRemainingNutrition,
    checkForDailyReset,
} from "../utils/storage";
import { formatNumberInput } from "../utils/format";
import { useI18n } from "vue-i18n";
import { useToast } from "../composables/useToast";

const { t } = useI18n();
const toast = useToast();

// 添加食物名称
const foodName = ref("");

// 响应式数据
const nutritionValues = ref([
    { title: t('卡路里'), value: "", color: "bg-orange-500", key: "calories" },
    { title: t('蛋白质') + "(g)", value: "", color: "bg-green-500", key: "protein" },
    { title: t('脂肪') + "(g)", value: "", color: "bg-yellow-400", key: "fat" },
    { title: t('碳水') + "(g)", value: "", color: "bg-blue-400", key: "carbs" },
]);
const todayFoods = ref([]);
const visibleTags = ref([]);

// 用于显示格式化为2位小数的数值
const formatDisplayNumber = (value) => {
    return parseFloat(value || 0).toFixed(2);
};

// 用于计算时保持2位小数精度
const formatCalculationNumber = (value) => {
    return parseFloat(parseFloat(value || 0).toFixed(2));
};

// 计算每日总计（确保保留2位小数）
const dailyTotals = computed(() => {
    return todayFoods.value.reduce(
        (totals, food) => {
            return {
                calories: formatCalculationNumber(
                    totals.calories + parseFloat(food.calories || 0)
                ),
                protein: formatCalculationNumber(
                    totals.protein + parseFloat(food.protein || 0)
                ),
                fat: formatCalculationNumber(totals.fat + parseFloat(food.fat || 0)),
                carbs: formatCalculationNumber(
                    totals.carbs + parseFloat(food.carbs || 0)
                ),
            };
        },
        { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
});

const formatNumber = formatNumberInput;

// 应用标签数据到表单
const applyTag = (tag) => {
    // 设置食物名称（固定标签用翻译名）
    const displayName = tag.nameKey ? t(tag.nameKey) : tag.name;
    foodName.value = displayName;

    nutritionValues.value.forEach((item) => {
        if (item.key === "calories") {
            item.value = tag.calories.toString();
        } else if (item.key === "protein") {
            item.value = tag.protein.toString();
        } else if (item.key === "fat") {
            item.value = tag.fat.toString();
        } else if (item.key === "carbs") {
            item.value = tag.carbs.toString();
        }
    });

    // 添加食物（自动填充后立即添加）
    const newFood = {
        name: displayName,
        calories: formatCalculationNumber(tag.calories),
        protein: formatCalculationNumber(tag.protein),
        fat: formatCalculationNumber(tag.fat),
        carbs: formatCalculationNumber(tag.carbs),
        addedAt: new Date().toISOString(),
    };

    // 添加到今日食物列表
    todayFoods.value.push(newFood);
    saveTodayFoods(todayFoods.value);
    updateRemainingNutrition(dailyTotals.value);

    // 清空表单
    resetForm();

    toast.success(t('已添加') + (` "${displayName}"!`));

    // 触发组件事件
    emit("food-added", newFood);
};

// 定义emit事件
const emit = defineEmits(["food-added"]);

// 添加食物
const addFood = (event = null) => {
    // 如果传入的是事件对象，防止表单默认提交行为
    if (event && typeof event === "object" && event.preventDefault) {
        event.preventDefault();
    }

    // 处理输入值，如果为空则默认为0
    nutritionValues.value.forEach((item) => {
        if (!item.value || item.value.trim() === "") {
            item.value = "0";
        }
    });

    // 获取食物名称（使用用户输入的名称，如果为空则使用默认值）
    const name = foodName.value || t('未命名食物');

    // 准备食物数据（确保所有营养值保留2位小数）
    const newFood = {
        name: name,
        calories: formatCalculationNumber(
            nutritionValues.value.find((item) => item.key === "calories").value
        ),
        protein: formatCalculationNumber(
            nutritionValues.value.find((item) => item.key === "protein").value
        ),
        fat: formatCalculationNumber(
            nutritionValues.value.find((item) => item.key === "fat").value
        ),
        carbs: formatCalculationNumber(
            nutritionValues.value.find((item) => item.key === "carbs").value
        ),
        addedAt: new Date().toISOString(),
    };

    // 添加到今日食物列表
    todayFoods.value.push(newFood);
    saveTodayFoods(todayFoods.value);
    updateRemainingNutrition(dailyTotals.value);

    // 清空表单
    resetForm();

    toast.success(t('食物已添加!'));

    // 触发组件事件
    emit("food-added", newFood);
};

// 移除食物
const removeFood = (index) => {
    todayFoods.value.splice(index, 1);
    saveTodayFoods(todayFoods.value);
    updateRemainingNutrition(dailyTotals.value);

    toast.success(t('食物已删除!'));
};

// 重置表单
const resetForm = () => {
    // 重置食物名称
    foodName.value = "";

    nutritionValues.value.forEach((item) => {
        item.value = "";
    });
};

// 加载可见标签
const loadVisibleTags = () => {
    visibleTags.value = getVisibleFoodTags();
};

// 事件处理器引用
const handleTagsUpdated = () => {
    loadVisibleTags();
};

// 组件挂载时
onMounted(() => {
    checkForDailyReset();

    const savedFoods = getTodayFoods();
    if (savedFoods && savedFoods.length > 0) {
        todayFoods.value = savedFoods;
        updateRemainingNutrition(dailyTotals.value);
    }

    loadVisibleTags();

    if (process.client) {
        window.addEventListener("foodTagsUpdated", handleTagsUpdated);
    }
});

onUnmounted(() => {
    if (process.client) {
        window.removeEventListener("foodTagsUpdated", handleTagsUpdated);
    }
});
</script>
