<!-- components/FrozenCalculation.vue -->
<template>
    <div class="card p-5 sm:p-6">
        <h2 class="section-title mb-5">{{ $t("冷冻食物计算") }}</h2>

        <!-- Saved configs dropdown -->
        <div class="mb-6">
            <label id="saved-config-label" class="form-label">{{ $t("选择保存的配置") }}</label>
            <div class="flex gap-3">
                <div ref="dropdownRef" class="relative w-full">
                    <button type="button" @click="toggleDropdown"
                        class="input-modern flex items-center justify-between cursor-pointer"
                        aria-haspopup="listbox" :aria-expanded="isOpen ? 'true' : 'false'"
                        aria-labelledby="saved-config-label">
                        <span class="truncate">{{ selectedConfigName || $t("选择配置") }}</span>
                        <svg class="w-5 h-5 text-slate-400 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z" clip-rule="evenodd" />
                        </svg>
                    </button>

                    <ul v-if="isOpen"
                        class="absolute z-10 mt-2 max-h-56 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-elevated border border-slate-100"
                        tabindex="-1" role="listbox">
                        <li class="relative cursor-pointer py-2.5 px-4 text-slate-700 select-none hover:bg-brand-50 hover:text-brand-700 rounded-lg mx-1"
                            role="option" @click="selectConfig('', '')"
                            :class="{ 'bg-brand-50 text-brand-700 font-medium': selectedConfigId === '' }">
                            {{ $t("选择配置") }}
                        </li>
                        <li v-for="config in savedConfigurations" :key="config.id"
                            class="relative cursor-pointer py-2.5 px-4 text-slate-700 select-none hover:bg-brand-50 hover:text-brand-700 rounded-lg mx-1"
                            role="option" @click="selectConfig(config.id, config.name)"
                            :class="{ 'bg-brand-50 text-brand-700 font-medium': selectedConfigId === config.id }">
                            {{ config.name }}
                        </li>
                    </ul>
                </div>
                <button v-if="selectedConfigId" @click="deleteConfiguration" class="btn-danger whitespace-nowrap">
                    {{ $t("删除配置") }}
                </button>
            </div>
        </div>

        <form @submit.prevent="calculateAndAddFood" class="space-y-4">
            <div>
                <label class="form-label">{{ $t("食物名称") }}</label>
                <input type="text" v-model="foodName" class="input-modern" :placeholder="$t('例如: 煎鸡胸肉')" />
            </div>

            <div v-for="(item, index) in nutritionValues" :key="index">
                <label class="form-label">{{ item.title }}</label>
                <div class="relative">
                    <input type="text" inputmode="decimal" v-model="item.value" @input="formatNumber(item)" class="input-modern pr-14" />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <span class="text-slate-400 text-sm">{{ item.key === "calories" ? "kcal" : "g" }}</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="form-label">{{ $t("原始重量") }} (g)</label>
                    <div class="relative">
                        <input type="text" inputmode="decimal" v-model="weight" @input="formatWeightInput" class="input-modern pr-14" />
                        <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <span class="text-slate-400 text-sm">g</span>
                        </div>
                    </div>
                </div>
                <div>
                    <label class="form-label">{{ $t("损失率") }} (%)</label>
                    <div class="relative">
                        <input type="text" inputmode="decimal" v-model="lossRate" @input="formatLossRateInput" class="input-modern pr-14" />
                        <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <span class="text-slate-400 text-sm">%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Results -->
            <div class="mt-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h3 class="text-sm font-semibold text-slate-700 mb-3">{{ $t("计算结果") }}</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div class="text-center p-2">
                        <p class="text-xs text-slate-500">{{ $t("冷冻后重量") }}</p>
                        <p class="text-lg font-bold text-slate-800">{{ finalWeight }}g</p>
                    </div>
                    <div class="text-center p-2">
                        <p class="text-xs text-slate-500">{{ $t("卡路里") }}</p>
                        <p class="text-lg font-bold text-amber-600">{{ finalNutrition.calories }} kcal</p>
                    </div>
                    <div class="text-center p-2">
                        <p class="text-xs text-slate-500">{{ $t("蛋白质") }}</p>
                        <p class="text-lg font-bold text-emerald-600">{{ finalNutrition.protein }}g</p>
                    </div>
                    <div class="text-center p-2">
                        <p class="text-xs text-slate-500">{{ $t("脂肪") }}</p>
                        <p class="text-lg font-bold text-violet-600">{{ finalNutrition.fat }}g</p>
                    </div>
                    <div class="text-center p-2">
                        <p class="text-xs text-slate-500">{{ $t("碳水") }}</p>
                        <p class="text-lg font-bold text-sky-600">{{ finalNutrition.carbs }}g</p>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" class="btn-success w-full sm:w-auto">{{ $t("计算并添加食物") }}</button>
                <button type="button" @click="saveConfiguration" class="btn-primary w-full sm:w-auto">{{ $t("保存当前配置") }}</button>
                <button type="button" @click="resetForm" class="btn-secondary w-full sm:w-auto">{{ $t("清空表单") }}</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject, watch } from "vue";
import {
    getFrozenFoodConfigurations,
    saveFrozenFoodConfigurations,
    calculateFinalWeight,
    calculateFinalNutrition,
    addFrozenFood,
} from "../utils/storage";
import { formatNumberInput, formatRefNumberInput } from "../utils/format";
import { useI18n } from 'vue-i18n'
import { useToast } from "../composables/useToast";

const { t } = useI18n()
const toast = useToast();

// 响应式数据
const foodName = ref("");
const weight = ref("");
const lossRate = ref("30"); // 默认损失率为30%
const selectedConfigId = ref("");
const selectedConfigName = ref("");
const savedConfigurations = ref([]);
const isOpen = ref(false);

// 营养值输入
const nutritionValues = ref([
    {
        title: t('卡路里 (每100g)'),
        value: "",
        color: "bg-orange-500",
        key: "calories",
    },
    {
        title: t('蛋白质 (每100g)'),
        value: "",
        color: "bg-green-500",
        key: "protein",
    },
    { title: t('脂肪 (每100g)'), value: "", color: "bg-yellow-400", key: "fat" },
    { title: t('碳水 (每100g)'), value: "", color: "bg-blue-400", key: "carbs" },
]);

// 定义emit事件
const emit = defineEmits(["food-added"]);

// 切换下拉菜单
const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

// 选择配置
const selectConfig = (id, name) => {
    selectedConfigId.value = id;
    selectedConfigName.value = name;
    isOpen.value = false;

    if (id) {
        applySelectedConfig();
    }
};

// 点击外部关闭下拉菜单
const dropdownRef = ref(null);
const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isOpen.value = false;
    }
};

// 加载保存的配置
const loadSavedConfigurations = () => {
    savedConfigurations.value = getFrozenFoodConfigurations();
};

// 应用选择的配置
const applySelectedConfig = () => {
    if (!selectedConfigId.value) return;

    const selectedConfig = savedConfigurations.value.find(
        (config) => config.id === selectedConfigId.value
    );

    if (selectedConfig) {
        foodName.value = selectedConfig.name;

        // 应用营养值
        nutritionValues.value.forEach((item) => {
            if (item.key === "calories") {
                item.value =
                    selectedConfig.nutritionPer100g.calories.toString();
            } else if (item.key === "protein") {
                item.value = selectedConfig.nutritionPer100g.protein.toString();
            } else if (item.key === "fat") {
                item.value = selectedConfig.nutritionPer100g.fat.toString();
            } else if (item.key === "carbs") {
                item.value = selectedConfig.nutritionPer100g.carbs.toString();
            }
        });

        // 应用损失率
        lossRate.value = selectedConfig.lossRate.toString();

        // 重量可能需要用户每次单独输入，所以不设置

        // 显示提示
        showToast(t('已加载配置')+(`: ${selectedConfig.name}`));
    }
};

// 保存当前配置
const saveConfiguration = () => {
    // 检查是否有必要的输入
    if (!foodName.value || !isFormValid()) {
        showToast(t('请填写完整的食物信息'), "error");
        return;
    }

    // 准备配置数据
    const newConfig = {
        id: Date.now().toString(), // 使用时间戳作为唯一ID
        name: foodName.value,
        nutritionPer100g: {
            calories: parseFloat(
                nutritionValues.value.find((item) => item.key === "calories")
                    .value
            ),
            protein: parseFloat(
                nutritionValues.value.find((item) => item.key === "protein")
                    .value
            ),
            fat: parseFloat(
                nutritionValues.value.find((item) => item.key === "fat").value
            ),
            carbs: parseFloat(
                nutritionValues.value.find((item) => item.key === "carbs").value
            ),
        },
        lossRate: parseFloat(lossRate.value),
    };

    // 添加到配置列表
    const configs = [...savedConfigurations.value, newConfig];
    saveFrozenFoodConfigurations(configs);

    // 更新本地状态
    savedConfigurations.value = configs;
    selectedConfigId.value = newConfig.id;
    selectedConfigName.value = newConfig.name;

    // 显示提示
    showToast(t('配置已保存')+(`: ${newConfig.name}`));
};

// 删除选中的配置
const deleteConfiguration = () => {
    if (!selectedConfigId.value) return;

    const updatedConfigs = savedConfigurations.value.filter(
        (config) => config.id !== selectedConfigId.value
    );

    // 保存更新后的配置
    saveFrozenFoodConfigurations(updatedConfigs);

    // 更新本地状态
    savedConfigurations.value = updatedConfigs;
    selectedConfigId.value = "";
    selectedConfigName.value = "";

    // 显示提示
    showToast(t('配置已删除'));
};

// 获取当前营养值每100g对象
const getNutritionPer100g = () => {
    return {
        calories: parseFloat(
            nutritionValues.value.find((item) => item.key === "calories")
                .value || 0
        ),
        protein: parseFloat(
            nutritionValues.value.find((item) => item.key === "protein")
                .value || 0
        ),
        fat: parseFloat(
            nutritionValues.value.find((item) => item.key === "fat").value || 0
        ),
        carbs: parseFloat(
            nutritionValues.value.find((item) => item.key === "carbs").value ||
                0
        ),
    };
};

// 计算最终重量
const finalWeight = computed(() => {
    if (!weight.value || !lossRate.value) return "0.00";

    const result = calculateFinalWeight(weight.value, lossRate.value);
    return result.toString();
});

// 计算最终营养值
const finalNutrition = computed(() => {
    // 默认值
    const defaultValues = {
        calories: "0.00",
        protein: "0.00",
        fat: "0.00",
        carbs: "0.00",
    };

    if (!weight.value || !finalWeight.value) return defaultValues;

    // 获取每100克的营养值
    const nutritionPer100g = getNutritionPer100g();

    // 计算冷冻后的营养值
    const result = calculateFinalNutrition(
        nutritionPer100g,
        weight.value,
        finalWeight.value
    );

    return {
        calories: result.calories.toString(),
        protein: result.protein.toString(),
        fat: result.fat.toString(),
        carbs: result.carbs.toString(),
    };
});

// 计算并添加食物
const calculateAndAddFood = () => {
    // 验证表单
    if (!isFormValid()) {
        showToast(t('请填写完整的食物信息'), "error");
        return;
    }

    // 使用storage.js中的方法添加食物
    const newFood = addFrozenFood(foodName.value, finalWeight.value, {
        calories: parseFloat(finalNutrition.value.calories),
        protein: parseFloat(finalNutrition.value.protein),
        fat: parseFloat(finalNutrition.value.fat),
        carbs: parseFloat(finalNutrition.value.carbs),
    });

    // 显示提示
    showToast(t('已添加冷冻食物')+(`: ${newFood.name}`));

    // 触发组件事件
    emit("food-added", newFood);
};

// 验证表单
const isFormValid = () => {
    // 检查食物名称
    if (!foodName.value) return false;

    // 检查重量和损失率
    if (!weight.value || !lossRate.value) return false;

    // 检查营养值
    for (const item of nutritionValues.value) {
        if (!item.value) return false;
    }

    return true;
};

const formatNumber = formatNumberInput;

// 格式化重量输入
const formatWeightInput = () => {
    formatRefNumberInput(weight);
};

// 格式化损失率输入
const formatLossRateInput = () => {
    formatRefNumberInput(lossRate);

    const lossRateValue = parseFloat(lossRate.value);
    if (!isNaN(lossRateValue) && lossRateValue > 100) {
        lossRate.value = "100";
    }
};

// 重置表单
const resetForm = () => {
    foodName.value = "";
    weight.value = "";
    lossRate.value = "30"; // 重置为默认值
    selectedConfigId.value = "";
    selectedConfigName.value = "";

    // 重置营养值
    nutritionValues.value.forEach((item) => {
        item.value = "";
    });
};

const showToast = (message, type = "success") => {
    toast[type](message);
};

// 组件挂载时
onMounted(() => {
    // 加载保存的配置
    loadSavedConfigurations();

    // 添加点击外部关闭下拉菜单的事件监听
    document.addEventListener("click", handleClickOutside);
});

// 在组件卸载前移除事件监听
onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});

// 初始化 selectedConfigName
watch(selectedConfigId, (newId) => {
    if (newId) {
        const config = savedConfigurations.value.find((c) => c.id === newId);
        if (config) {
            selectedConfigName.value = config.name;
        }
    } else {
        selectedConfigName.value = "";
    }
});
</script>