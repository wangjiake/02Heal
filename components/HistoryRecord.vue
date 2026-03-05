<!-- components/HistoryRecords.vue -->
<template>
    <div class="card p-5 sm:p-6">
        <h2 class="section-title mb-5">{{ $t("历史记录") }}</h2>

        <!-- 日期选择器 -->
        <div class="mb-6">
            <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button v-for="(date, index) in dateOptions" :key="index" @click="selectDate(date.value)"
                    class="rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200"
                    :class="selectedDate === date.value
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-white hover:text-slate-800 hover:shadow-card'">
                    {{ date.label }}
                </button>
            </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="py-12 flex justify-center">
            <div class="animate-pulse text-slate-400 text-sm">{{ $t("加载中...") }}</div>
        </div>

        <!-- 无数据状态 -->
        <div v-else-if="currentRecords.length === 0" class="py-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-slate-200" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p class="text-slate-400 text-sm">{{ $t("这个时间段没有记录") }}</p>
        </div>

        <!-- 数据展示 -->
        <div v-else>
            <div v-for="(group, date) in groupedRecords" :key="date" class="mb-6">
                <div class="flex items-center gap-2 mb-3">
                    <div class="w-1 h-5 rounded-full bg-brand-500"></div>
                    <h3 class="text-sm font-semibold text-slate-700">
                        {{ formatDateHeader(date) }}
                    </h3>
                </div>

                <div class="space-y-2">
                    <div v-for="(record, index) in group" :key="index"
                        class="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div class="flex justify-between items-start gap-3">
                            <div class="flex-1 min-w-0">
                                <p class="font-medium text-slate-800 truncate">
                                    {{ record.name || $t("未命名食物") }}
                                </p>
                                <p class="text-xs text-slate-400 mt-0.5">
                                    {{ formatTime(record.addedAt) }}
                                </p>
                            </div>
                            <div class="flex items-center gap-1 flex-shrink-0">
                                <button @click="editRecord(record, date)"
                                    class="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                                <button @click="removeRecord(record, date)"
                                    class="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-x-4 gap-y-1 mt-2.5 text-xs">
                            <div class="flex items-center gap-1.5">
                                <div class="nutrition-dot-amber"></div>
                                <span class="text-slate-600">{{ $t("卡路里") }}: {{ record.calories }}kcal</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <div class="nutrition-dot-emerald"></div>
                                <span class="text-slate-600">{{ $t("蛋白质") }}: {{ record.protein }}g</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <div class="nutrition-dot-violet"></div>
                                <span class="text-slate-600">{{ $t("脂肪") }}: {{ record.fat }}g</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <div class="nutrition-dot-sky"></div>
                                <span class="text-slate-600">{{ $t("碳水") }}: {{ record.carbs }}g</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 总计摘要 -->
            <div class="mt-6 p-4 rounded-xl bg-brand-50 border border-brand-100">
                <p class="text-sm font-semibold text-brand-800 mb-2">{{ $t("时间段总计") }}</p>
                <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div class="flex items-center gap-1.5">
                        <div class="nutrition-dot-amber"></div>
                        <span class="text-brand-700">{{ $t("卡路里") }}: {{ periodTotals.calories }}kcal</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <div class="nutrition-dot-emerald"></div>
                        <span class="text-brand-700">{{ $t("蛋白质") }}: {{ periodTotals.protein }}g</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <div class="nutrition-dot-violet"></div>
                        <span class="text-brand-700">{{ $t("脂肪") }}: {{ periodTotals.fat }}g</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <div class="nutrition-dot-sky"></div>
                        <span class="text-brand-700">{{ $t("碳水") }}: {{ periodTotals.carbs }}g</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 编辑记录弹窗 -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-elevated">
            <h3 class="section-title mb-5">{{ $t("编辑食物记录") }}</h3>

            <div class="space-y-4">
                <div>
                    <label class="form-label">{{ $t("食物名称") }}</label>
                    <input type="text" v-model="editingRecord.name" class="input-modern" />
                </div>

                <div v-for="item in editingNutrition" :key="item.key">
                    <label class="form-label">{{ item.title }}</label>
                    <div class="relative">
                        <input type="text" inputmode="decimal" v-model="item.value"
                            @input="formatEditNumber(item)" class="input-modern pr-14" />
                        <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <span class="text-slate-400 text-sm">
                                {{ item.key === "calories" ? "kcal" : "g" }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex gap-3 mt-6">
                <button @click="saveEdit" class="btn-primary flex-1">
                    {{ $t("保存") }}
                </button>
                <button @click="cancelEdit" class="btn-secondary flex-1">
                    {{ $t("取消") }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
    getFoodsByDate,
    saveFoodsByDate,
    updateRemainingNutrition,
    getTodayDateString,
    calculateDailyTotals,
} from "../utils/storage";
import { formatNumberInput } from "../utils/format";
import { useI18n } from "vue-i18n";
import { useToast } from "../composables/useToast";

const { t } = useI18n();
const toast = useToast();

// 响应式数据
const loading = ref(true);
const records = ref({}); // 按日期存储记录
const selectedDate = ref("week"); // 默认显示最近一周
const showEditModal = ref(false);
const editingRecord = ref(null);
const editingDate = ref(null);
const editingNutrition = ref([]);

// 日期选择项
const dateOptions = [
    { label: t('今天'), value: "today" },
    { label: t('昨天'), value: "yesterday" },
    { label: t('本周'), value: "week" },
    { label: t('本月'), value: "month" },
    { label: t('全部'), value: "all" },
];

// 获取日期范围
const getDateRange = (option) => {
    const today = new Date();
    const endDate = new Date(today);
    let startDate = new Date(today);

    switch (option) {
        case "today":
            break;
        case "yesterday":
            startDate.setDate(today.getDate() - 1);
            endDate.setDate(today.getDate() - 1);
            break;
        case "week":
            startDate.setDate(today.getDate() - 6);
            break;
        case "month":
            startDate.setDate(today.getDate() - 29);
            break;
        case "all":
            startDate.setDate(today.getDate() - 89);
            break;
        default:
            startDate.setDate(today.getDate() - 6);
    }

    return { startDate, endDate };
};

// 加载指定日期范围的记录
const loadRecords = async () => {
    loading.value = true;
    records.value = {};

    const { startDate, endDate } = getDateRange(selectedDate.value);
    const dateArray = getDatesArray(startDate, endDate);

    for (const date of dateArray) {
        const dateString = formatDate(date);
        const dayRecords = getFoodsByDate(dateString);

        if (dayRecords && dayRecords.length > 0) {
            records.value[dateString] = dayRecords;
        }
    }

    loading.value = false;
};

// 生成日期范围数组
const getDatesArray = (start, end) => {
    const datesArray = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
        datesArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return datesArray;
};

// 格式化日期为YYYY-MM-DD
const formatDate = (date) => {
    return date.toISOString().split("T")[0];
};

// 选择日期范围
const selectDate = (option) => {
    selectedDate.value = option;
    loadRecords();
};

// 显示日期头部
const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (formatDate(today) === dateString) {
        return t('今天');
    } else if (formatDate(yesterday) === dateString) {
        return t('昨天');
    } else {
        return `${date.getMonth() + 1}${t('月')}${date.getDate()}${t('日')}`;
    }
};

// 格式化时间
const formatTime = (isoString) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
};

// 获取当前选中时间范围的记录
const currentRecords = computed(() => {
    const result = [];
    Object.keys(records.value).forEach((date) => {
        records.value[date].forEach((record) => {
            result.push({
                ...record,
                date,
            });
        });
    });
    return result;
});

// 按日期分组的记录
const groupedRecords = computed(() => {
    return records.value;
});

// 时间段总计
const periodTotals = computed(() => {
    const totals = currentRecords.value.reduce(
        (totals, record) => {
            return {
                calories: totals.calories + parseFloat(record.calories || 0),
                protein: totals.protein + parseFloat(record.protein || 0),
                fat: totals.fat + parseFloat(record.fat || 0),
                carbs: totals.carbs + parseFloat(record.carbs || 0),
            };
        },
        { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );

    return {
        calories: totals.calories.toFixed(2),
        protein: totals.protein.toFixed(2),
        fat: totals.fat.toFixed(2),
        carbs: totals.carbs.toFixed(2),
    };
});

// 编辑记录
const editRecord = (record, date) => {
    editingRecord.value = { ...record };
    editingDate.value = date;

    editingNutrition.value = [
        { title: t('卡路里'), value: record.calories.toString(), key: "calories" },
        {
            title: t('蛋白质') + " (g)",
            value: record.protein.toString(),
            key: "protein",
        },
        { title: t('脂肪') + " (g)", value: record.fat.toString(), key: "fat" },
        { title: t('碳水') + " (g)", value: record.carbs.toString(), key: "carbs" },
    ];

    showEditModal.value = true;
};

const formatEditNumber = formatNumberInput;

// 保存编辑
const saveEdit = () => {
    editingRecord.value.name = editingRecord.value.name || t('未命名食物');
    editingRecord.value.calories =
        parseFloat(
            editingNutrition.value.find((i) => i.key === "calories").value
        ) || 0;
    editingRecord.value.protein =
        parseFloat(editingNutrition.value.find((i) => i.key === "protein").value) ||
        0;
    editingRecord.value.fat =
        parseFloat(editingNutrition.value.find((i) => i.key === "fat").value) || 0;
    editingRecord.value.carbs =
        parseFloat(editingNutrition.value.find((i) => i.key === "carbs").value) ||
        0;

    const dateRecords = records.value[editingDate.value];
    const recordIndex = dateRecords.findIndex(
        (r) => r.addedAt === editingRecord.value.addedAt
    );

    if (recordIndex !== -1) {
        dateRecords[recordIndex] = { ...editingRecord.value };

        saveFoodsByDate(editingDate.value, dateRecords);

        if (editingDate.value === getTodayDateString()) {
            const todayRecords = records.value[getTodayDateString()] || [];
            updateRemainingNutrition(calculateDailyTotals(todayRecords));
        }

        toast.success(t('记录已更新!'));
    }

    cancelEdit();
};

// 取消编辑
const cancelEdit = () => {
    showEditModal.value = false;
    editingRecord.value = null;
    editingDate.value = null;
    editingNutrition.value = [];
};

// 删除记录
const removeRecord = (record, date) => {
    const dateRecords = records.value[date];
    const recordIndex = dateRecords.findIndex(
        (r) => r.addedAt === record.addedAt
    );

    if (recordIndex !== -1) {
        dateRecords.splice(recordIndex, 1);

        if (dateRecords.length === 0) {
            delete records.value[date];
        } else {
            records.value[date] = dateRecords;
        }

        saveFoodsByDate(date, dateRecords);

        if (date === getTodayDateString()) {
            const todayRecords = records.value[getTodayDateString()] || [];
            updateRemainingNutrition(calculateDailyTotals(todayRecords));
        }

        toast.success(t('记录已删除!'));
    }
};

// 组件挂载时
onMounted(() => {
    loadRecords();
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>