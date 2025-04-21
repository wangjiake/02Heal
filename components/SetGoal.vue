<!-- components/SetGoal.vue -->
<template>
    <div class="p-4 bg-white rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">设置目标</h2>

        <form @submit.prevent="saveGoals" class="space-y-4">
            <div
                v-for="(item, index) in nutritionGoals"
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
                    class="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    保存目标
                </button>
                <button
                    type="button"
                    @click="resetToDefault"
                    class="w-full sm:w-auto px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    重置默认值
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";

// 尝试注入 toast 服务
const toast = inject("toast", null);

// 默认营养目标数据
const defaultNutritionGoals = [
    { title: "卡路里", value: "2000", color: "bg-orange-500", key: "calories" },
    {
        title: "蛋白质 (g)",
        value: "150.0",
        color: "bg-green-500",
        key: "protein",
    },
    { title: "脂肪 (g)", value: "65.0", color: "bg-yellow-400", key: "fat" },
    { title: "碳水 (g)", value: "250.0", color: "bg-blue-400", key: "carbs" },
];

// 响应式数据
const nutritionGoals = ref([...defaultNutritionGoals]);

// 从 localStorage 获取目标
const getGoalsFromLocalStorage = () => {
    if (process.client) {
        const savedGoals = localStorage.getItem("nutritionGoals");
        if (savedGoals) {
            return JSON.parse(savedGoals);
        }
    }
    return null;
};

// 保存目标到 localStorage
const saveGoalsToLocalStorage = (goals) => {
    if (process.client) {
        localStorage.setItem("nutritionGoals", JSON.stringify(goals));
    }
};

// 定义emit事件
const emit = defineEmits(["goals-updated"]);

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

// 保存用户设置的目标
const saveGoals = () => {
    // 验证所有值是否为有效数字
    const allValid = nutritionGoals.value.every(
        (item) =>
            item.value &&
            !isNaN(parseFloat(item.value)) &&
            isFinite(parseFloat(item.value))
    );

    if (!allValid) {
        // 显示错误提示
        if (toast) {
            toast.error("请输入有效的数字!");
        } else if (window.$toast) {
            window.$toast.error("请输入有效的数字!");
        }
        return;
    }

    saveGoalsToLocalStorage(nutritionGoals.value);
    // 触发自定义事件，通知其他组件目标已更新
    if (process.client) {
        window.dispatchEvent(new Event("nutritionGoalsUpdated"));

        // 使用 Toast 提示 (优先使用注入的 toast 服务)
        if (toast) {
            toast.success("营养目标已保存!");
        } else if (window.$toast) {
            window.$toast.success("营养目标已保存!");
        }
    }
    // 触发组件事件
    emit("goals-updated");
};

// 重置为默认目标
const resetToDefault = () => {
    nutritionGoals.value = [...defaultNutritionGoals];
    saveGoalsToLocalStorage(nutritionGoals.value);
    // 触发自定义事件，通知其他组件目标已重置
    if (process.client) {
        window.dispatchEvent(new Event("nutritionGoalsUpdated"));

        // 使用 Toast 提示 (优先使用注入的 toast 服务)
        if (toast) {
            toast.success("已重置为默认目标!");
        } else if (window.$toast) {
            window.$toast.success("已重置为默认目标!");
        }
    }
    // 触发组件事件
    emit("goals-updated");
};

// 组件挂载时，从 localStorage 获取保存的目标
onMounted(() => {
    const savedGoals = getGoalsFromLocalStorage();
    if (savedGoals) {
        nutritionGoals.value = savedGoals;
    }
});
</script>
