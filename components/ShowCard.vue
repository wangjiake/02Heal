<template>
    <div class="p-6 bg-white rounded-xl shadow-md">
        <h2 class="text-3xl font-bold text-center mb-6">
            {{ activeGoalName }} - {{ $t("剩余目标") }}
        </h2>

        <div v-if="dataLoaded" class="grid grid-cols-2 gap-3 md:gap-6">
            <div v-for="(item, index) in nutritionData" :key="index" class="flex justify-center">
                <div :class="[
                    item.color,
                    parseFloat(item.value) < 0 ? 'bg-red-500' : item.color,
                    'w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center text-[#1C1C1CFF] shadow-lg',
                ]">
                    <div class="text-sm xs:text-base sm:text-lg md:text-xl">
                        {{ $t(item.title) }}
                    </div>
                    <div class="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">
                        {{ item.value }}
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="grid grid-cols-2 gap-3 md:gap-6">
            <div v-for="i in 4" :key="i" class="flex justify-center">
                <div
                    class="w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gray-200 rounded-full skeleton-item shimmer-effect">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getNutritionGoals, getActiveGoalSetId, getNutritionGoalsList } from '../utils/storage';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
// 创建响应式数据
const nutritionData = ref([]);
// 加载状态标志
const dataLoaded = ref(false);

const activeGoalName = ref('');

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
    const goalsList = getNutritionGoalsList();
    const activeId = getActiveGoalSetId();

    // 设置名称
    const activeGoal = goalsList.find(g => g.id === activeId);
    activeGoalName.value = activeGoal ? activeGoal.name : t('默认');

    nutritionData.value = savedGoals && savedGoals.length > 0
        ? savedGoals
        : [...defaultNutritionData];

    dataLoaded.value = true;
};


// 设置监听器
const setupEventListeners = () => {
    if (process.client) {
        // 监听自定义事件
        window.addEventListener('nutritionGoalsUpdated', () => {
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

<style scoped>
/* 骨架屏闪光效果 */
.shimmer-effect {
    position: relative;
    overflow: hidden;
}

.shimmer-effect::after {
    content: '';
    position: absolute;
    top: -100%;
    left: -100%;
    width: 300%;
    height: 300%;
    background: linear-gradient(to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.2) 25%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0.2) 75%,
            rgba(255, 255, 255, 0) 100%);
    animation: shimmer 1.5s infinite;
    transform: rotate(30deg);
}

@keyframes shimmer {
    0% {
        transform: translateX(-100%) translateY(-100%) rotate(30deg);
    }

    100% {
        transform: translateX(100%) translateY(100%) rotate(30deg);
    }
}
</style>