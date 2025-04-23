<!-- components/AddFood.vue -->
<template>
    <div class="p-4 bg-white rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">添加食物</h2>

        <!-- 可用标签区域 -->
        <div v-if="visibleTags.length > 0" class="mb-6">
            <h3 class="text-md font-medium mb-2">快速添加标签:</h3>
            <div class="flex flex-wrap gap-2">
                <button
                    v-for="(tag, index) in visibleTags"
                    :key="index"
                    @click="applyTag(tag)"
                    class="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                    {{ tag.name }}
                </button>
            </div>
        </div>

        <form @submit.prevent="addFood" class="space-y-4">
            <!-- 食物名称输入字段 -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    食物名称
                </label>
                <input
                    type="text"
                    v-model="foodName"
                    placeholder="输入食物名称"
                    class="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
            </div>

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

            <div class="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                    type="submit"
                    class="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    添加食物
                </button>
                <button
                    type="button"
                    @click="resetForm"
                    class="w-full sm:w-auto px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    清空表单
                </button>
            </div>
        </form>

        <div v-if="todayFoods.length > 0" class="mt-8">
            <h3 class="text-lg font-bold mb-3">今日添加的食物</h3>
            <ul class="divide-y divide-gray-200">
                <li
                    v-for="(food, index) in todayFoods"
                    :key="index"
                    class="py-3 flex justify-between items-center gap-4"
                >
                    <div class="flex-1">
                        <p class="font-medium">
                            {{ food.name || "未命名食物" }}
                        </p>
                        <p class="text-sm text-gray-500 break-words">
                            卡路里: {{ formatDisplayNumber(food.calories) }}kcal
                            | 蛋白质: {{ formatDisplayNumber(food.protein) }}g |
                            脂肪: {{ formatDisplayNumber(food.fat) }}g | 碳水:
                            {{ formatDisplayNumber(food.carbs) }}g
                        </p>
                    </div>
                    <button
                        @click="removeFood(index)"
                        class="text-red-500 hover:text-red-700 focus:outline-none p-1 flex-shrink-0"
                        aria-label="删除"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M3 6h18"></path>
                            <path
                                d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
                            ></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                    </button>
                </li>
            </ul>
            <div class="mt-4 pt-4 border-t border-gray-200">
                <p class="font-bold">
                    今日总计:
                    {{ formatDisplayNumber(dailyTotals.calories) }}kcal, 蛋白质:
                    {{ formatDisplayNumber(dailyTotals.protein) }}g, 脂肪:
                    {{ formatDisplayNumber(dailyTotals.fat) }}g, 碳水:
                    {{ formatDisplayNumber(dailyTotals.carbs) }}g
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue";
// 导入存储服务
import {
    getTodayFoods,
    saveTodayFoods,
    getVisibleFoodTags,
    updateRemainingNutrition,
    checkForDailyReset,
} from "../utils/storage";

// 尝试注入 toast 服务
const toast = inject("toast", null);

// 添加食物名称
const foodName = ref("");

// 响应式数据
const nutritionValues = ref([
    { title: "卡路里", value: "", color: "bg-orange-500", key: "calories" },
    { title: "蛋白质 (g)", value: "", color: "bg-green-500", key: "protein" },
    { title: "脂肪 (g)", value: "", color: "bg-yellow-400", key: "fat" },
    { title: "碳水 (g)", value: "", color: "bg-blue-400", key: "carbs" },
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
                fat: formatCalculationNumber(
                    totals.fat + parseFloat(food.fat || 0)
                ),
                carbs: formatCalculationNumber(
                    totals.carbs + parseFloat(food.carbs || 0)
                ),
            };
        },
        { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
});

// 格式化数字，确保输入有效
const formatNumber = (item) => {
    // 如果不是数字格式，转换为有效数字或清空
    if (item.value && isNaN(parseFloat(item.value))) {
        item.value = "";
    }

    // 移除非数字和非小数点字符
    if (item.value) {
        item.value = item.value.replace(/[^\d.]/g, "");

        // 确保只有一个小数点
        const parts = item.value.split(".");
        if (parts.length > 2) {
            item.value = parts[0] + "." + parts.slice(1).join("");
        }
    }
};

// 应用标签数据到表单
const applyTag = (tag) => {
    // 设置食物名称
    foodName.value = tag.name;

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
        name: tag.name,
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

    // 显示提示
    if (toast) {
        toast.success(`已添加 "${tag.name}"!`);
    } else if (window.$toast) {
        window.$toast.success(`已添加 "${tag.name}"!`);
    }

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
    const name = foodName.value || "未命名食物";

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

    // 显示成功提示
    if (toast) {
        toast.success("食物已添加!");
    } else if (window.$toast) {
        window.$toast.success("食物已添加!");
    }

    // 触发组件事件
    emit("food-added", newFood);
};

// 移除食物
const removeFood = (index) => {
    todayFoods.value.splice(index, 1);
    saveTodayFoods(todayFoods.value);
    updateRemainingNutrition(dailyTotals.value);

    // 显示提示
    if (toast) {
        toast.success("食物已删除!");
    } else if (window.$toast) {
        window.$toast.success("食物已删除!");
    }
};

// 重置表单
const resetForm = () => {
    // 重置食物名称
    foodName.value = "";

    nutritionValues.value.forEach((item) => {
        item.value = "";
    });
};

// 设置标签变化的监听器
const setupTagEventListener = () => {
    if (process.client) {
        window.addEventListener("foodTagsUpdated", () => {
            loadVisibleTags();
        });
    }
};

// 加载可见标签
const loadVisibleTags = () => {
    visibleTags.value = getVisibleFoodTags();
};

// 组件挂载时
onMounted(() => {
    // 先检查是否需要重置每日目标
    checkForDailyReset();

    // 获取今日食物
    const savedFoods = getTodayFoods();
    if (savedFoods && savedFoods.length > 0) {
        todayFoods.value = savedFoods;
        updateRemainingNutrition(dailyTotals.value);
    }

    // 加载可见标签
    loadVisibleTags();

    // 设置标签变化的监听器
    setupTagEventListener();
});
</script>
