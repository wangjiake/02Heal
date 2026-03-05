<template>
    <div class="rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-6 sm:p-8 shadow-elevated">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {{ activeGoalName }}
            </h2>
            <span class="text-brand-200 text-sm font-medium">{{ $t("剩余目标") }}</span>
        </div>

        <div v-if="dataLoaded" class="grid grid-cols-2 gap-3 sm:gap-4">
            <div v-for="(item, index) in nutritionData" :key="index"
                class="rounded-xl p-4 sm:p-5 backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02]"
                :class="[
                    parseFloat(item.value) < 0
                        ? 'bg-rose-500/20 border border-rose-400/30'
                        : 'bg-white/10 border border-white/10'
                ]">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-2 h-2 rounded-full" :class="getDotClass(item.key)"></div>
                    <span class="text-brand-100 text-xs sm:text-sm font-medium">
                        {{ $t(item.title) }}
                    </span>
                </div>
                <div class="text-white text-xl sm:text-2xl font-bold tracking-tight">
                    {{ item.value }}
                </div>
            </div>
        </div>

        <div v-else class="grid grid-cols-2 gap-3 sm:gap-4">
            <div v-for="i in 4" :key="i"
                class="rounded-xl p-4 sm:p-5 bg-white/10 border border-white/10 animate-pulse">
                <div class="h-3 w-16 bg-white/20 rounded mb-3"></div>
                <div class="h-7 w-20 bg-white/20 rounded"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getNutritionGoals, getActiveGoalSetId, getNutritionGoalsList } from '../utils/storage';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const nutritionData = ref([]);
const dataLoaded = ref(false);
const activeGoalRaw = ref(null);
const activeGoalName = computed(() => {
    if (!activeGoalRaw.value) return t('默认');
    return activeGoalRaw.value.translationKey
        ? t(activeGoalRaw.value.translationKey)
        : activeGoalRaw.value.name;
});

const defaultNutritionData = [
    { title: "卡路里", value: "0", color: "bg-orange-500", key: "calories" },
    { title: "蛋白质", value: "0", color: "bg-green-500", key: "protein" },
    { title: "脂肪", value: "0", color: "bg-yellow-400", key: "fat" },
    { title: "碳水", value: "0", color: "bg-blue-400", key: "carbs" },
];

const getDotClass = (key) => {
    const map = {
        calories: 'bg-amber-400',
        protein: 'bg-emerald-400',
        fat: 'bg-violet-400',
        carbs: 'bg-sky-400',
    };
    return map[key] || 'bg-white';
};

const loadGoals = () => {
    const savedGoals = getNutritionGoals();
    const goalsList = getNutritionGoalsList();
    const activeId = getActiveGoalSetId();

    activeGoalRaw.value = goalsList.find(g => g.id === activeId) || null;

    nutritionData.value = savedGoals && savedGoals.length > 0
        ? savedGoals
        : [...defaultNutritionData];

    dataLoaded.value = true;
};

const handleGoalsUpdated = () => {
    loadGoals();
};

onMounted(() => {
    loadGoals();
    if (process.client) {
        window.addEventListener('nutritionGoalsUpdated', handleGoalsUpdated);
    }
});

onUnmounted(() => {
    if (process.client) {
        window.removeEventListener('nutritionGoalsUpdated', handleGoalsUpdated);
    }
});

defineExpose({
    refreshData: loadGoals,
});
</script>
