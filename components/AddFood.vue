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
                    class="py-3 flex justify-between items-center"
                >
                    <div>
                        <p class="font-medium">{{ food.name || '未命名食物' }}</p>
                        <p class="text-sm text-gray-500">
                            卡路里: {{ food.calories }}kcal | 蛋白质:
                            {{ food.protein }}g | 脂肪: {{ food.fat }}g | 碳水:
                            {{ food.carbs }}g
                        </p>
                    </div>
                    <button
                        @click="removeFood(index)"
                        class="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                        删除
                    </button>
                </li>
            </ul>
            <div class="mt-4 pt-4 border-t border-gray-200">
                <p class="font-bold">
                    今日总计: {{ dailyTotals.calories }}kcal, 蛋白质:
                    {{ dailyTotals.protein }}g, 脂肪: {{ dailyTotals.fat }}g,
                    碳水: {{ dailyTotals.carbs }}g
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue";

// 尝试注入 toast 服务
const toast = inject("toast", null);

// 响应式数据
const nutritionValues = ref([
    { title: "卡路里", value: "", color: "bg-orange-500", key: "calories" },
    { title: "蛋白质 (g)", value: "", color: "bg-green-500", key: "protein" },
    { title: "脂肪 (g)", value: "", color: "bg-yellow-400", key: "fat" },
    { title: "碳水 (g)", value: "", color: "bg-blue-400", key: "carbs" },
]);
const todayFoods = ref([]);
const visibleTags = ref([]);

// 计算每日总计
const dailyTotals = computed(() => {
    return todayFoods.value.reduce(
        (totals, food) => {
            return {
                calories: totals.calories + parseFloat(food.calories || 0),
                protein: totals.protein + parseFloat(food.protein || 0),
                fat: totals.fat + parseFloat(food.fat || 0),
                carbs: totals.carbs + parseFloat(food.carbs || 0),
            };
        },
        { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
});

// 从 localStorage 获取今日食物
const getFoodsFromLocalStorage = () => {
    if (process.client) {
        const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 格式
        const savedFoods = localStorage.getItem(`foods_${currentDate}`);
        if (savedFoods) {
            return JSON.parse(savedFoods);
        }
    }
    return [];
};

// 从 localStorage 获取可见标签
const getVisibleTagsFromLocalStorage = () => {
    if (process.client) {
        const visibleTagsData = localStorage.getItem("visibleFoodTags");
        if (visibleTagsData) {
            return JSON.parse(visibleTagsData);
        }
    }
    return [];
};

// 保存食物到 localStorage
const saveFoodsToLocalStorage = (foods) => {
    if (process.client) {
        const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 格式
        localStorage.setItem(`foods_${currentDate}`, JSON.stringify(foods));
    }
};

// 更新剩余目标营养值
const updateRemainingNutrition = () => {
    if (process.client) {
        // 获取原始目标
        const originalGoalsStr = localStorage.getItem("originalNutritionGoals");
        if (!originalGoalsStr) return;

        const originalGoals = JSON.parse(originalGoalsStr);

        // 计算剩余目标 (目标 - 已消耗)
        const remainingGoals = originalGoals.map((goal) => {
            const totalConsumed = dailyTotals.value[goal.key] || 0;

            // 将值转换为数字并计算剩余
            const originalValue = parseFloat(goal.value);
            const remaining = Math.max(0, originalValue - totalConsumed);

            // 返回新对象
            return {
                ...goal,
                value: remaining.toFixed(1),
            };
        });

        // 保存今日消耗的营养值（独立存储）
        const consumed = {
            calories: dailyTotals.value.calories,
            protein: dailyTotals.value.protein,
            fat: dailyTotals.value.fat,
            carbs: dailyTotals.value.carbs,
        };

        localStorage.setItem("consumedNutrition", JSON.stringify(consumed));

        // 更新目标为剩余值并触发更新事件
        localStorage.setItem("nutritionGoals", JSON.stringify(remainingGoals));
        window.dispatchEvent(new Event("nutritionGoalsUpdated"));
    }
};

// 定义emit事件
const emit = defineEmits(["food-added"]);

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
    nutritionValues.value.forEach(item => {
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
    addFood(tag.name);
    
    // 显示提示
    if (toast) {
        toast.success(`已添加 "${tag.name}"!`);
    } else if (window.$toast) {
        window.$toast.success(`已添加 "${tag.name}"!`);
    }
};

// 添加食物
const addFood = (foodName = null) => {
    // 处理输入值，如果为空则默认为0
    nutritionValues.value.forEach((item) => {
        if (!item.value || item.value.trim() === "") {
            item.value = "0";
        }
    });

    // 准备食物数据
    const newFood = {
        name: foodName || "食物", // 使用传入的名称或默认名称
        calories:
            parseFloat(
                nutritionValues.value.find((item) => item.key === "calories")
                    .value
            ) || 0,
        protein:
            parseFloat(
                nutritionValues.value.find((item) => item.key === "protein")
                    .value
            ) || 0,
        fat:
            parseFloat(
                nutritionValues.value.find((item) => item.key === "fat").value
            ) || 0,
        carbs:
            parseFloat(
                nutritionValues.value.find((item) => item.key === "carbs").value
            ) || 0,
        addedAt: new Date().toISOString(),
    };

    // 添加到今日食物列表
    todayFoods.value.push(newFood);
    saveFoodsToLocalStorage(todayFoods.value);
    updateRemainingNutrition();

    // 清空表单
    resetForm();

    // 显示成功提示
    if (!foodName) { // 只有手动添加时才显示提示，标签自动添加时已经有提示了
        if (toast) {
            toast.success("食物已添加!");
        } else if (window.$toast) {
            window.$toast.success("食物已添加!");
        }
    }

    // 触发组件事件
    emit("food-added", newFood);
};

// 移除食物
const removeFood = (index) => {
    todayFoods.value.splice(index, 1);
    saveFoodsToLocalStorage(todayFoods.value);
    updateRemainingNutrition();

    // 显示提示
    if (toast) {
        toast.success("食物已删除!");
    } else if (window.$toast) {
        toast.success("食物已删除!");
    }
};

// 重置表单
const resetForm = () => {
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
    visibleTags.value = getVisibleTagsFromLocalStorage();
};

// 检查是否需要重置每日目标
const checkForDailyReset = () => {
    if (process.client) {
        // 获取上次重置的日期
        const lastResetDate = localStorage.getItem("lastGoalResetDate");
        const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD 格式

        // 如果没有重置过或者不是今天重置的
        if (!lastResetDate || lastResetDate !== currentDate) {
            // 重置日期并回复原始目标值
            resetDailyGoals();
            localStorage.setItem("lastGoalResetDate", currentDate);
        }
    }
};

// 重置每日目标到原始值
const resetDailyGoals = () => {
    if (process.client) {
        // 检查是否有原始目标保存
        const originalGoalsStr = localStorage.getItem("originalNutritionGoals");
        if (originalGoalsStr) {
            // 恢复原始目标
            localStorage.setItem("nutritionGoals", originalGoalsStr);
        } else {
            // 如果没有保存原始目标，则获取当前目标并保存为原始目标
            const currentGoals = localStorage.getItem("nutritionGoals");
            if (currentGoals) {
                localStorage.setItem("originalNutritionGoals", currentGoals);
            }
        }

        // 清空当日食物记录
        const currentDate = new Date().toISOString().split("T")[0];
        localStorage.removeItem(`foods_${currentDate}`);
        todayFoods.value = [];

        // 触发目标更新事件
        window.dispatchEvent(new Event("nutritionGoalsUpdated"));
    }
};

// 组件挂载时
onMounted(() => {
    // 先检查是否需要重置每日目标
    checkForDailyReset();

    // 确保原始目标存在
    if (process.client && !localStorage.getItem("originalNutritionGoals")) {
        const goals = localStorage.getItem("nutritionGoals");
        if (goals) {
            localStorage.setItem("originalNutritionGoals", goals);
        }
    }

    // 获取今日食物
    const savedFoods = getFoodsFromLocalStorage();
    if (savedFoods && savedFoods.length > 0) {
        todayFoods.value = savedFoods;
        updateRemainingNutrition();
    }
    
    // 加载可见标签
    loadVisibleTags();
    
    // 设置标签变化的监听器
    setupTagEventListener();
});
</script>