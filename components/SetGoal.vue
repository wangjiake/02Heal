<!-- components/SetGoal.vue -->
<template>
    <div class="card p-5 sm:p-6">
        <h2 class="section-title mb-5">{{ $t("运动日和非运动日目标") }}</h2>

        <!-- 目标列表选择 -->
        <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-semibold text-slate-700">{{ $t("目标列表") }}</h3>
                <button @click="showCreateForm = true; editingIndex = null; resetGoalForm();"
                    class="btn-primary !py-1.5 !px-3 !text-sm">
                    {{ $t("新建目标") }}
                </button>
            </div>

            <!-- 目标集合列表 -->
            <div v-if="goalsList.length > 0" class="space-y-3">
                <div v-for="(goalSet, index) in goalsList" :key="goalSet.id"
                    class="flex items-center justify-between gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer"
                    :class="activeGoalSetId === goalSet.id
                        ? 'bg-brand-50 border-2 border-brand-300 shadow-sm'
                        : 'bg-slate-50 border border-slate-100 hover:bg-slate-100'"
                    @click="selectGoalSet(goalSet.id)">
                    <div class="flex-1 min-w-0">
                        <div class="font-medium text-slate-800">{{ goalSet.translationKey ? $t(goalSet.translationKey) : goalSet.name }}</div>
                        <div class="text-xs text-slate-500 mt-1">
                            {{ getGoalValue(goalSet, "calories") }} kcal &middot;
                            {{ $t("蛋白质") }} {{ getGoalValue(goalSet, "protein") }}g &middot;
                            {{ $t("脂肪") }} {{ getGoalValue(goalSet, "fat") }}g &middot;
                            {{ $t("碳水") }} {{ getGoalValue(goalSet, "carbs") }}g
                        </div>
                    </div>
                    <div class="flex items-center gap-1 flex-shrink-0" @click.stop>
                        <button @click="editGoalSet(index)"
                            class="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button @click="confirmDeleteGoalSet(goalSet.id)"
                            class="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                            :disabled="goalsList.length === 1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div v-else class="text-slate-400 text-center py-8 text-sm">
                {{ $t("没有保存的目标，请创建新目标") }}
            </div>
        </div>

        <!-- 创建/编辑目标表单 -->
        <div v-if="showCreateForm" class="border-t border-slate-100 pt-6 mt-6">
            <div class="flex justify-between items-center mb-5">
                <h3 class="text-base font-semibold text-slate-700">
                    {{ editingIndex !== null ? $t("编辑目标") : $t("创建新目标") }}
                </h3>
                <button @click="showCreateForm = false"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <form @submit.prevent="saveGoalSet" class="space-y-4">
                <div>
                    <label class="form-label">{{ $t("目标名称") }}</label>
                    <input type="text" v-model="goalForm.name" class="input-modern"
                        :placeholder="$t('例如: 减脂目标, 增肌目标')" required />
                </div>

                <div v-for="(item, index) in goalForm.goals" :key="index">
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

                <div class="flex flex-col sm:flex-row gap-3 pt-2">
                    <button type="submit" class="btn-primary w-full sm:w-auto">
                        {{ editingIndex !== null ? $t("更新目标") : $t("保存新目标") }}
                    </button>
                    <button type="button" @click="resetToDefault" class="btn-secondary w-full sm:w-auto">
                        {{ $t("重置为默认值") }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
    getNutritionGoals,
    setNutritionGoals,
    setOriginalNutritionGoals,
    dispatchEvent,
    getNutritionGoalsList,
    saveNutritionGoalsList,
    getActiveGoalSetId,
    setActiveGoalSetId,
    addGoalSet,
    updateGoalSet,
    deleteGoalSet,
    applyGoalSet,
} from '../utils/storage';
import { formatNumberInput } from '../utils/format';
import { useI18n } from "vue-i18n";
import { useToast } from "../composables/useToast";

const { t } = useI18n();
const toast = useToast();

// 默认营养目标数据
const defaultNutritionGoals = [
    { title: t('卡路里'), value: '1558', color: 'bg-orange-500', key: 'calories' },
    {
        title: t('蛋白质'),
        value: '136.0',
        color: 'bg-green-500',
        key: 'protein',
    },
    { title: t('脂肪'), value: '43.0', color: 'bg-yellow-400', key: 'fat' },
    { title: t('碳水'), value: '155.0', color: 'bg-blue-400', key: 'carbs' },
];

// 响应式数据
const goalsList = ref([]);
const activeGoalSetId = ref(null);
const showCreateForm = ref(false);
const editingIndex = ref(null);

// 表单数据
const goalForm = ref({
    name: '',
    goals: [...defaultNutritionGoals],
});

// 定义emit事件
const emit = defineEmits(['goals-updated']);

// 辅助函数：从目标集中获取指定键的值
const getGoalValue = (goalSet, key) => {
    const goal = goalSet.goals.find((g) => g.key === key);
    return goal ? parseFloat(goal.value).toFixed(1) : '0.0';
};

const formatNumber = formatNumberInput;

// 重置表单为默认值
const resetGoalForm = () => {
    goalForm.value = {
        name: '',
        goals: JSON.parse(JSON.stringify(defaultNutritionGoals)),
    };
};

// 重置当前编辑的目标为默认目标
const resetToDefault = () => {
    goalForm.value.goals = JSON.parse(JSON.stringify(defaultNutritionGoals));
};

// 选择目标集
const selectGoalSet = (id) => {
    if (activeGoalSetId.value === id) return;

    setActiveGoalSetId(id);
    activeGoalSetId.value = id;

    toast.success(t('已切换目标集，并更新了今日剩余目标!'));

    // 触发组件事件
    emit('goals-updated');
};

// 编辑目标集
const editGoalSet = (index) => {
    const goalSet = goalsList.value[index];

    goalForm.value = {
        id: goalSet.id,
        name: goalSet.name,
        goals: JSON.parse(JSON.stringify(goalSet.goals)),
    };

    editingIndex.value = index;
    showCreateForm.value = true;
};

// 确认删除目标集
const confirmDeleteGoalSet = (id) => {
    // 如果只有一个目标集，不允许删除
    if (goalsList.value.length <= 1) {
        toast.error(t('至少需要保留一个目标集!'));
        return;
    }

    // 直接删除，不显示确认对话框
    deleteGoalSet(id);

    // 刷新列表
    goalsList.value = getNutritionGoalsList();
    activeGoalSetId.value = getActiveGoalSetId();

    toast.success(t('目标集已删除!'));

    // 触发组件事件
    emit('goals-updated');
};

// 保存目标集
const saveGoalSet = () => {
    // 验证所有值是否为有效数字
    const allValid = goalForm.value.goals.every(
        (item) =>
            item.value &&
            !isNaN(parseFloat(item.value)) &&
            isFinite(parseFloat(item.value))
    );

    if (!allValid) {
        toast.error(t('请输入有效的数字!'));
        return;
    }

    let result = false;

    if (editingIndex.value !== null) {
        // 更新现有目标集
        result = updateGoalSet(
            goalForm.value.id,
            goalForm.value.name,
            goalForm.value.goals
        );
    } else {
        // 添加新目标集
        const newId = addGoalSet(goalForm.value.name, goalForm.value.goals);
        result = !!newId;

        // 如果这是第一个目标集，自动设为活动目标
        if (result && goalsList.value.length === 0) {
            setActiveGoalSetId(newId);
        }
    }

    if (result) {
        const wasEditing = editingIndex.value !== null;

        goalsList.value = getNutritionGoalsList();
        activeGoalSetId.value = getActiveGoalSetId();

        showCreateForm.value = false;
        editingIndex.value = null;

        toast.success(wasEditing ? t('目标集已更新!') : t('新目标集已创建!'));
        emit('goals-updated');
    }
};

// 组件挂载时
onMounted(() => {
    // 获取目标集列表
    let savedGoalsList = getNutritionGoalsList();

    // 如果没有保存的目标集，创建一个默认的
    if (!savedGoalsList || savedGoalsList.length === 0) {
        const defaultId = addGoalSet(t('默认目标'), defaultNutritionGoals, '默认目标');
        if (defaultId) {
            setActiveGoalSetId(defaultId);
            savedGoalsList = getNutritionGoalsList();
        }
    }

    // 为旧数据补上 translationKey（兼容已有 localStorage 数据）
    const defaultGoalNames = ['默认目标', 'Default Goal', 'デフォルト目標'];
    let needSave = false;
    savedGoalsList.forEach((goalSet) => {
        if (!goalSet.translationKey && defaultGoalNames.includes(goalSet.name)) {
            goalSet.translationKey = '默认目标';
            needSave = true;
        }
    });
    if (needSave) {
        saveNutritionGoalsList(savedGoalsList);
    }

    goalsList.value = savedGoalsList;

    // 获取当前活动的目标集ID
    activeGoalSetId.value = getActiveGoalSetId();

    // 如果没有活动目标集ID但有目标集，设置第一个为活动
    if (!activeGoalSetId.value && goalsList.value.length > 0) {
        setActiveGoalSetId(goalsList.value[0].id);
        activeGoalSetId.value = goalsList.value[0].id;
    }
});
</script>