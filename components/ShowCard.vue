<!-- components/CircularShowCard.vue -->
<template>
    <div class="p-6 bg-white rounded-xl shadow-md">
        <h2 class="text-3xl font-bold text-center mb-6">{{ $t("剩余目标") }}</h2>
        <div v-if="dataLoaded" class="grid grid-cols-2 gap-3 md:gap-6">
            <!-- 写死的每个项目 -->
            <div class="flex justify-center">
                <div
                    :class="[
                        'bg-orange-500',
                        'w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center text-white shadow-lg',
                    ]"
                >
                    <div class="text-sm xs:text-base sm:text-lg md:text-xl">
                        {{ $t("卡路里") }}
                    </div>
                    <div
                        class="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2"
                    >
                        {{ nutritionData.calories }}
                    </div>
                </div>
            </div>
            <div class="flex justify-center">
                <div
                    :class="[
                        'bg-green-500',
                        'w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center text-white shadow-lg',
                    ]"
                >
                    <div class="text-sm xs:text-base sm:text-lg md:text-xl">
                        {{ $t("蛋白质") }}
                    </div>
                    <div
                        class="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2"
                    >
                        {{ nutritionData.protein }}
                    </div>
                </div>
            </div>
            <div class="flex justify-center">
                <div
                    :class="[
                        'bg-yellow-400',
                        'w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center text-white shadow-lg',
                    ]"
                >
                    <div class="text-sm xs:text-base sm:text-lg md:text-xl">
                        {{ $t("脂肪") }}
                    </div>
                    <div
                        class="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2"
                    >
                        {{ nutritionData.fat }}
                    </div>
                </div>
            </div>
            <div class="flex justify-center">
                <div
                    :class="[
                        'bg-blue-400',
                        'w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center text-white shadow-lg',
                    ]"
                >
                    <div class="text-sm xs:text-base sm:text-lg md:text-xl">
                        {{ $t("碳水") }}
                    </div>
                    <div
                        class="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2"
                    >
                        {{ nutritionData.carbs }}
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="flex justify-center items-center h-32">
            <div class="animate-pulse text-gray-400">{{ $t("加载中...") }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getNutritionGoals } from '../utils/storage';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
// 加载状态标志
const dataLoaded = ref(false);

// 存储营养数据
const nutritionData = ref({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0
});

// 加载存储的目标数据
const loadGoals = () => {
    const savedGoals = getNutritionGoals();
    // 如果有存储的数据，设置具体的目标值
    if (savedGoals && savedGoals.length > 0) {
        savedGoals.forEach(item => {
            if (nutritionData.value[item.key] !== undefined) {
                nutritionData.value[item.key] = item.value;
            }
        });
    }
    // 标记为已加载
    dataLoaded.value = true;
};

// 组件挂载时
onMounted(() => {
    // 加载数据
    loadGoals();
});
</script>
