<!-- components/FrozenCalculation.vue -->
<template>
    <div class="p-4 bg-white rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">冷冻食物计算</h2>

        <!-- 保存的配置下拉列表 -->
        <div class="mb-6">
            <label
                id="saved-config-label"
                class="block text-sm font-medium text-gray-700 mb-1"
            >
                选择保存的配置
            </label>
            <div class="flex gap-3">
                <div class="relative w-full">
                    <button
                        type="button"
                        @click="toggleDropdown"
                        class="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-3 pl-3 text-left text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg h-[54px]"
                        aria-haspopup="listbox"
                        :aria-expanded="isOpen ? 'true' : 'false'"
                        aria-labelledby="saved-config-label"
                    >
                        <span
                            class="col-start-1 row-start-1 flex items-center pr-6 truncate"
                        >
                            <span class="block truncate">{{
                                selectedConfigName || "-- 选择配置 --"
                            }}</span>
                        </span>
                        <svg
                            class="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 mr-2"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>

                    <!-- 下拉菜单 -->
                    <ul
                        v-if="isOpen"
                        class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm"
                        tabindex="-1"
                        role="listbox"
                        aria-labelledby="saved-config-label"
                        :aria-activedescendant="
                            selectedConfigId
                                ? `config-option-${selectedConfigId}`
                                : ''
                        "
                    >
                        <!-- 空选项 -->
                        <li
                            class="relative cursor-default py-2 pl-3 pr-9 text-gray-900 select-none hover:bg-indigo-600 hover:text-white"
                            id="config-option-empty"
                            role="option"
                            @click="selectConfig('', '')"
                            :class="{
                                'bg-indigo-600 text-white':
                                    selectedConfigId === '',
                            }"
                        >
                            <div class="flex items-center">
                                <span class="block truncate font-normal"
                                    >-- 选择配置 --</span
                                >
                            </div>
                            <span
                                v-if="selectedConfigId === ''"
                                class="absolute inset-y-0 right-0 flex items-center pr-4 text-white"
                            >
                                <svg
                                    class="size-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    data-slot="icon"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </span>
                        </li>

                        <!-- 配置选项 -->
                        <li
                            v-for="config in savedConfigurations"
                            :key="config.id"
                            class="relative cursor-default py-2 pl-3 pr-9 text-gray-900 select-none hover:bg-indigo-600 hover:text-white"
                            :id="`config-option-${config.id}`"
                            role="option"
                            @click="selectConfig(config.id, config.name)"
                            :class="{
                                'bg-indigo-600 text-white':
                                    selectedConfigId === config.id,
                            }"
                        >
                            <div class="flex items-center">
                                <span
                                    class="block truncate"
                                    :class="
                                        selectedConfigId === config.id
                                            ? 'font-semibold'
                                            : 'font-normal'
                                    "
                                >
                                    {{ config.name }}
                                </span>
                            </div>
                            <span
                                v-if="selectedConfigId === config.id"
                                class="absolute inset-y-0 right-0 flex items-center pr-4"
                                :class="
                                    selectedConfigId === config.id
                                        ? 'text-white'
                                        : 'text-indigo-600'
                                "
                            >
                                <svg
                                    class="size-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    data-slot="icon"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </span>
                        </li>
                    </ul>
                </div>
                <button
                    v-if="selectedConfigId"
                    @click="deleteConfiguration"
                    class="px-4 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 h-[54px] whitespace-nowrap text-xs sm:text-sm md:text-base"
                >
                    删除配置
                </button>
            </div>
        </div>

        <form @submit.prevent="calculateAndAddFood" class="space-y-4">
            <!-- 食物名称 -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    食物名称
                </label>
                <input
                    type="text"
                    v-model="foodName"
                    class="block w-full pl-3 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="例如: 煎鸡胸肉"
                />
            </div>

            <!-- 基本营养素 -->
            <div
                v-for="(item, index) in nutritionValues"
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

            <!-- 重量和损失率 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        原始重量 (g)
                    </label>
                    <div class="relative rounded-md shadow-sm">
                        <input
                            type="text"
                            inputmode="decimal"
                            v-model="weight"
                            @input="formatWeightInput"
                            class="block w-full pl-3 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                        />
                        <div
                            class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                        >
                            <span class="text-gray-500 sm:text-sm">g</span>
                        </div>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        损失率 (%)
                    </label>
                    <div class="relative rounded-md shadow-sm">
                        <input
                            type="text"
                            inputmode="decimal"
                            v-model="lossRate"
                            @input="formatLossRateInput"
                            class="block w-full pl-3 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                        />
                        <div
                            class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                        >
                            <span class="text-gray-500 sm:text-sm">%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 计算结果 -->
            <div class="mt-6 p-4 bg-gray-100 rounded-lg">
                <h3 class="text-md font-bold mb-2">计算结果:</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-sm text-gray-700">冷冻后重量:</p>
                        <p class="text-lg font-medium">{{ finalWeight }}g</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-700">卡路里:</p>
                        <p class="text-lg font-medium">
                            {{ finalNutrition.calories }}kcal
                        </p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-700">蛋白质:</p>
                        <p class="text-lg font-medium">
                            {{ finalNutrition.protein }}g
                        </p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-700">脂肪:</p>
                        <p class="text-lg font-medium">
                            {{ finalNutrition.fat }}g
                        </p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-700">碳水:</p>
                        <p class="text-lg font-medium">
                            {{ finalNutrition.carbs }}g
                        </p>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 mt-6">
                <!-- 计算和添加按钮 -->
                <button
                    type="submit"
                    class="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    计算并添加食物
                </button>
                <!-- 保存配置按钮 -->
                <button
                    type="button"
                    @click="saveConfiguration"
                    class="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    保存当前配置
                </button>
                <!-- 清空表单按钮 -->
                <button
                    type="button"
                    @click="resetForm"
                    class="w-full sm:w-auto px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    清空表单
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, inject, watch } from "vue";
import {
    getTodayFoods,
    formatToTwoDecimals,
    formatNutritionValues,
    getFrozenFoodConfigurations,
    saveFrozenFoodConfigurations,
    calculateFinalWeight,
    calculateFinalNutrition,
    addFrozenFood,
} from "../utils/storage";

// 尝试注入 toast 服务
const toast = inject("toast", null);

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
        title: "卡路里 (每100g)",
        value: "",
        color: "bg-orange-500",
        key: "calories",
    },
    {
        title: "蛋白质 (每100g)",
        value: "",
        color: "bg-green-500",
        key: "protein",
    },
    { title: "脂肪 (每100g)", value: "", color: "bg-yellow-400", key: "fat" },
    { title: "碳水 (每100g)", value: "", color: "bg-blue-400", key: "carbs" },
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
const handleClickOutside = (event) => {
    const dropdownEl = document.querySelector(".relative");
    if (dropdownEl && !dropdownEl.contains(event.target)) {
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
        showToast(`已加载配置: ${selectedConfig.name}`);
    }
};

// 保存当前配置
const saveConfiguration = () => {
    // 检查是否有必要的输入
    if (!foodName.value || !isFormValid()) {
        showToast("请填写完整的食物信息", "error");
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
    showToast(`配置已保存: ${newConfig.name}`);
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
    showToast("配置已删除");
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
        showToast("请填写完整的食物信息", "error");
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
    showToast(`已添加冷冻食物: ${newFood.name}`);

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

// 格式化重量输入
const formatWeightInput = () => {
    formatNumber({ value: weight.value });
};

// 格式化损失率输入
const formatLossRateInput = () => {
    formatNumber({ value: lossRate.value });

    // 确保损失率在合理范围内 (0-100)
    const lossRateValue = parseFloat(lossRate.value);
    if (!isNaN(lossRateValue)) {
        if (lossRateValue > 100) {
            lossRate.value = "100";
        }
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

// 显示提示
const showToast = (message, type = "success") => {
    if (toast) {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message);
        }
    } else if (window.$toast) {
        if (type === "success") {
            window.$toast.success(message);
        } else if (type === "error") {
            window.$toast.error(message);
        }
    }
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
