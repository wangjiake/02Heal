<!-- components/CircularShowCard.vue -->
<template>
    <div class="p-6 bg-white rounded-xl shadow-md">
        <h2 class="text-3xl font-bold text-center mb-6">今天剩余目标</h2>
        <div v-if="dataLoaded" class="grid grid-cols-2 gap-3 md:gap-6">
            <div
                v-for="(item, index) in nutritionData"
                :key="index"
                class="flex justify-center"
            >
                <div
                    :class="[
                        item.color,
                        parseFloat(item.value) < 0 ? 'bg-red-500' : item.color,
                        'w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center text-white shadow-lg',
                    ]"
                >
                    <div class="text-sm xs:text-base sm:text-lg md:text-xl">
                        {{ item.title }}
                    </div>
                    <div
                        class="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2"
                    >
                        {{ item.value }}
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="flex justify-center items-center h-32">
            <div class="animate-pulse text-gray-400">加载中...</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getNutritionGoals } from "../utils/storage";

// 创建响应式数据
const nutritionData = ref([]);
// 加载状态标志
const dataLoaded = ref(false);

// 默认营养数据（如果没有存储数据）
const defaultNutritionData = [
    {
        title: "卡路里",
        value: "0",
        color: "bg-orange-500",
        key: "calories",
    },
    {
        title: "蛋白质",
        value: "0",
        color: "bg-green-500",
        key: "protein",
    },
    {
        title: "脂肪",
        value: "0",
        color: "bg-yellow-400",
        key: "fat",
    },
    {
        title: "碳水",
        value: "0",
        color: "bg-blue-400",
        key: "carbs",
    },
];

// 加载存储的目标数据
const loadGoals = () => {
    const savedGoals = getNutritionGoals();
    if (savedGoals && savedGoals.length > 0) {
        nutritionData.value = savedGoals;
    } else {
        // 如果没有存储数据，使用默认值
        nutritionData.value = [...defaultNutritionData];
    }
    // 标记为已加载
    dataLoaded.value = true;
};

// 设置监听器
const setupEventListeners = () => {
    if (process.client) {
        // 监听自定义事件
        window.addEventListener("nutritionGoalsUpdated", () => {
            loadGoals();
        });
    }
};

// 组件挂载时
onMounted(() => {
    // 加载数据
    loadGoals();

    // 设置事件监听器
    setupEventListeners();
});

// 导出公共方法
defineExpose({
    refreshData: loadGoals,
});
</script>
