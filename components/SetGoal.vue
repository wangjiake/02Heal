<!-- components/SetGoal.vue -->
<template>
    <div class="p-4 bg-white rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">{{ $t("运动日和非运动日目标") }}</h2>

        <!-- 目标列表选择 -->
        <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-medium">{{ $t("目标列表") }}</h3>
                <button
                    @click="
                        showCreateForm = true;
                        editingIndex = null;
                        resetGoalForm();
                    "
                    class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                    {{ $t("新建目标") }}
                </button>
            </div>

            <!-- 目标集合列表 -->
            <div v-if="goalsList.length > 0" class="mb-3 space-y-2">
                <div
                    v-for="(goalSet, index) in goalsList"
                    :key="goalSet.id"
                    class="flex items-center justify-between p-3 bg-gray-50 border rounded hover:bg-gray-100"
                    :class="{
                        'border-blue-500 bg-blue-50':
                            activeGoalSetId === goalSet.id,
                    }"
                >
                    <div
                        class="flex-grow cursor-pointer"
                        @click="selectGoalSet(goalSet.id)"
                    >
                        <div class="font-medium">{{ goalSet.name }}</div>
                        <div class="text-xs text-gray-500">
                            {{ $t("卡路里") }}: {{ getGoalValue(goalSet, "calories") }} kcal
                            | {{ $t("蛋白质") }}: {{ getGoalValue(goalSet, "protein") }}g |
                            {{ $t("脂肪") }}: {{ getGoalValue(goalSet, "fat") }}g | {{ $t("碳水") }}:
                            {{ getGoalValue(goalSet, "carbs") }}g
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button
                            @click="editGoalSet(index)"
                            class="text-blue-500 hover:text-blue-700 focus:outline-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                            </svg>
                        </button>
                        <button
                            @click="confirmDeleteGoalSet(goalSet.id)"
                            class="text-red-500 hover:text-red-700 focus:outline-none"
                            :disabled="goalsList.length === 1"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div v-else class="text-gray-500 text-center py-4">
                {{ $t("没有保存的目标，请创建新目标") }}
            </div>
        </div>

        <!-- 创建/编辑目标表单 -->
        <div v-if="showCreateForm" class="border-t pt-4 mt-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium">
                    {{ editingIndex !== null ? $t("编辑目标") : $t("创建新目标") }}
                </h3>
                <button
                    @click="showCreateForm = false"
                    class="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <form @submit.prevent="saveGoalSet" class="space-y-4">
                <!-- 目标名称 -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ $t("目标名称") }}
                    </label>
                    <input
                        type="text"
                        v-model="goalForm.name"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        :placeholder="$t('例如: 减脂目标, 增肌目标')"
                        required
                    />
                </div>

                <!-- 营养目标数值 -->
                <div
                    v-for="(item, index) in goalForm.goals"
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
                            class="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        class="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {{ editingIndex !== null ? $t("更新目标") : $t("保存新目标") }}
                    </button>
                    <button
                        type="button"
                        @click="resetToDefault"
                        class="w-full sm:w-auto px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        {{ $t("重置为默认值") }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
// 导入存储服务
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
import { useI18n } from "vue-i18n";

const { t } = useI18n();
// 尝试注入 toast 服务
const toast = inject('toast', null);

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

// 格式化数字，确保输入有效
const formatNumber = (item) => {
    // 如果不是数字格式，转换为有效数字或清空
    if (item.value && isNaN(parseFloat(item.value))) {
        item.value = '';
    }

    // 移除非数字和非小数点字符
    if (item.value) {
        item.value = item.value.replace(/[^\d.]/g, '');

        // 确保只有一个小数点
        const parts = item.value.split('.');
        if (parts.length > 2) {
            item.value = parts[0] + '.' + parts.slice(1).join('');
        }
    }
};

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

    // 注意：不需要在这里手动计算今日消耗，已在 applyGoalSet 函数中实现
    // applyGoalSet 会自动计算今日已消耗的营养并更新剩余目标

    // 显示提示
    if (toast) {
        toast.success(t('已切换目标集，并更新了今日剩余目标!'));
    } else if (window.$toast) {
        window.$toast.success(t('已切换目标集，并更新了今日剩余目标!'));
    }

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
        if (toast) {
            toast.error(t('至少需要保留一个目标集!'));
        } else if (window.$toast) {
            window.$toast.error(t('至少需要保留一个目标集!'));
        }
        return;
    }

    // 直接删除，不显示确认对话框
    deleteGoalSet(id);

    // 刷新列表
    goalsList.value = getNutritionGoalsList();
    activeGoalSetId.value = getActiveGoalSetId();

    // 显示提示
    if (toast) {
        toast.success(t('目标集已删除!'));
    } else if (window.$toast) {
        window.$toast.success(t('目标集已删除!'));
    }

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
        // 显示错误提示
        if (toast) {
            toast.error(t('请输入有效的数字!'));
        } else if (window.$toast) {
            window.$toast.error(t('请输入有效的数字!'));
        }
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
        // 刷新列表
        goalsList.value = getNutritionGoalsList();
        activeGoalSetId.value = getActiveGoalSetId();

        // 关闭表单
        showCreateForm.value = false;
        editingIndex.value = null;

        // 显示成功提示
        if (toast) {
            toast.success(
                editingIndex.value !== null
                    ? t('目标集已更新!')
                    : t('新目标集已创建!')
            );
        } else if (window.$toast) {
            window.$toast.success(
                editingIndex.value !== null
                    ? t('目标集已更新!')
                    : t('新目标集已创建!')
            );
        }

        // 触发组件事件
        emit('goals-updated');
    }
};

// 组件挂载时
onMounted(() => {
    // 获取目标集列表
    let savedGoalsList = getNutritionGoalsList();

    // 如果没有保存的目标集，创建一个默认的
    if (!savedGoalsList || savedGoalsList.length === 0) {
        const defaultId = addGoalSet(t('默认目标'), defaultNutritionGoals);
        if (defaultId) {
            setActiveGoalSetId(defaultId);
            savedGoalsList = getNutritionGoalsList();
        }
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