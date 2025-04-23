<!-- components/HistoryRecords.vue -->
<template>
    <div class="p-4 bg-white rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">{{ $t("历史记录") }}</h2>

        <!-- 日期选择器 -->
        <div class="mb-4">
            <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button v-for="(date, index) in dateOptions" :key="index" @click="selectDate(date.value)"
                    class="px-3 py-1.5 rounded-full text-sm whitespace-nowrap" :class="selectedDate === date.value
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        ">
                    {{ date.label }}
                </button>
            </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="py-12 flex justify-center">
            <div class="animate-pulse text-gray-400">{{ $t("加载中...") }}</div>
        </div>

        <!-- 无数据状态 -->
        <div v-else-if="currentRecords.length === 0" class="py-8 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p>{{ $t("这个时间段没有记录") }}</p>
        </div>

        <!-- 数据展示 -->
        <div v-else>
            <!-- 日期分组显示 -->
            <div v-for="(group, date) in groupedRecords" :key="date" class="mb-6">
                <h3 class="text-md font-semibold mb-2 text-gray-700 border-l-4 border-blue-500 pl-2">
                    {{ formatDateHeader(date) }}
                </h3>

                <div class="space-y-3">
                    <div v-for="(record, index) in group" :key="index"
                        class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="font-medium">
                                    {{ record.name || $t("未命名食物") }}
                                </p>
                                <p class="text-xs text-gray-500 mt-1">
                                    {{ formatTime(record.addedAt) }}
                                </p>
                            </div>
                            <div class="flex space-x-2">
                                <button @click="editRecord(record, date)"
                                    class="text-blue-500 hover:text-blue-700 focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button @click="removeRecord(record, date)"
                                    class="text-red-500 hover:text-red-700 focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs">
                            <div class="flex items-center">
                                <div class="w-2 h-2 rounded-full bg-orange-500 mr-1"></div>
                                <span>{{ $t("卡路里") }}: {{ record.calories }}kcal</span>
                            </div>
                            <div class="flex items-center">
                                <div class="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                                <span>{{ $t("蛋白质") }}: {{ record.protein }}g</span>
                            </div>
                            <div class="flex items-center">
                                <div class="w-2 h-2 rounded-full bg-yellow-400 mr-1"></div>
                                <span>{{ $t("脂肪") }}: {{ record.fat }}g</span>
                            </div>
                            <div class="flex items-center">
                                <div class="w-2 h-2 rounded-full bg-blue-400 mr-1"></div>
                                <span>{{ $t("碳水") }}: {{ record.carbs }}g</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 总计摘要 -->
            <div class="mt-4 pt-4 border-t border-gray-200">
                <p class="font-bold mb-2">{{ $t("时间段总计") }}:</p>
                <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div class="flex items-center">
                        <div class="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                        <span>{{ $t("卡路里") }}: {{ periodTotals.calories }}kcal</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span>{{ $t("蛋白质") }}: {{ periodTotals.protein }}g</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                        <span>{{ $t("脂肪") }}: {{ periodTotals.fat }}g</span>
                    </div>
                    <div class="flex items-center">
                        <div class="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                        <span>{{ $t("碳水") }}: {{ periodTotals.carbs }}g</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 编辑记录弹窗 -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg w-full max-w-md p-4">
            <h3 class="text-lg font-bold mb-4">{{ $t("编辑食物记录") }}</h3>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ $t("食物名称") }}
                </label>
                <input type="text" v-model="editingRecord.name"
                    class="block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>

            <div v-for="item in editingNutrition" :key="item.key" class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ item.title }}
                </label>
                <div class="relative rounded-md shadow-sm">
                    <input type="text" inputmode="decimal" v-model="item.value" @input="formatEditNumber(item)"
                        class="block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-md" />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span class="text-gray-500 sm:text-sm">
                            {{ item.key === "calories" ? "kcal" : "g" }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="flex space-x-3 mt-6">
                <button @click="saveEdit" class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    {{ $t("保存") }}
                </button>
                <button @click="cancelEdit"
                    class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                    {{ $t("取消") }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue";
import {
    getFoodsByDate,
    saveFoodsByDate,
    updateRemainingNutrition,
    getTodayDateString,
} from "../utils/storage";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
// 尝试注入 toast 服务
const toast = inject("toast", null);

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
            // 只显示今天
            break;
        case "yesterday":
            // 只显示昨天
            startDate.setDate(today.getDate() - 1);
            endDate.setDate(today.getDate() - 1);
            break;
        case "week":
            // 显示过去7天
            startDate.setDate(today.getDate() - 6);
            break;
        case "month":
            // 显示过去30天
            startDate.setDate(today.getDate() - 29);
            break;
        case "all":
            // 显示所有记录（假设最多90天）
            startDate.setDate(today.getDate() - 89);
            break;
        default:
            // 默认显示过去7天
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

    // 按顺序为每个日期加载记录
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

    // Format with two decimal places
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

    // 设置编辑表单的营养值
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

// 格式化编辑时的数字输入
const formatEditNumber = (item) => {
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

// 保存编辑
const saveEdit = () => {
    // 更新记录数据
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

    // 找到并更新原始记录
    const dateRecords = records.value[editingDate.value];
    const recordIndex = dateRecords.findIndex(
        (r) => r.addedAt === editingRecord.value.addedAt
    );

    if (recordIndex !== -1) {
        dateRecords[recordIndex] = { ...editingRecord.value };

        // 保存回存储
        saveFoodsByDate(editingDate.value, dateRecords);

        // 如果是今天的记录，更新剩余目标
        if (editingDate.value === getTodayDateString()) {
            // 重新计算今日总计
            const todayRecords = records.value[getTodayDateString()] || [];
            const todayTotals = todayRecords.reduce(
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

            // 更新剩余目标
            updateRemainingNutrition(todayTotals);
        }

        // 显示成功提示
        if (toast) {
            toast.success(t('记录已更新!'));
        } else if (window.$toast) {
            window.$toast.success(t('记录已更新!'));
        }
    }

    // 关闭弹窗
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
    // 找到记录
    const dateRecords = records.value[date];
    const recordIndex = dateRecords.findIndex(
        (r) => r.addedAt === record.addedAt
    );

    if (recordIndex !== -1) {
        // 从数组中删除
        dateRecords.splice(recordIndex, 1);

        // 如果日期没有记录了，从记录对象中删除此日期
        if (dateRecords.length === 0) {
            delete records.value[date];
        } else {
            // 否则更新此日期的记录
            records.value[date] = dateRecords;
        }

        // 保存回存储
        saveFoodsByDate(date, dateRecords);

        // 如果是今天的记录，更新剩余目标
        if (date === getTodayDateString()) {
            // 重新计算今日总计
            const todayRecords = records.value[getTodayDateString()] || [];
            const todayTotals = todayRecords.reduce(
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

            // 更新剩余目标
            updateRemainingNutrition(todayTotals);
        }

        // 显示成功提示
        if (toast) {
            toast.success(t('记录已删除!'));
        } else if (window.$toast) {
            window.$toast.success(t('记录已删除!'));
        }
    }
};

// 组件挂载时
onMounted(() => {
    // 加载记录
    loadRecords();
});
</script>

<style scoped>
/* 隐藏滚动条但保留滚动功能 */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
