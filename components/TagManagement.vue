<!-- components/TagManagement.vue -->
<template>
    <div class="p-4 bg-white rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">
            {{ isEditing ? "编辑标签" : "标签管理" }}
        </h2>

        <form
            @submit.prevent="isEditing ? updateTag() : saveTag()"
            class="space-y-4 mb-6"
        >
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    标签名称
                </label>
                <div class="relative rounded-md shadow-sm">
                    <input
                        type="text"
                        v-model="tagName"
                        placeholder="输入标签名称"
                        class="block w-full pl-3 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                        :disabled="isEditing && editingTag.fixed"
                    />
                </div>
            </div>

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

            <div class="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                    type="submit"
                    class="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                    {{ isEditing ? "保存修改" : "保存标签" }}
                </button>
                <button
                    type="button"
                    @click="cancelEdit"
                    class="w-full sm:w-auto px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                    {{ isEditing ? "取消编辑" : "清空表单" }}
                </button>
            </div>
        </form>

        <div v-if="mergedTags.length > 0" class="mt-8">
            <h3 class="text-lg font-bold mb-3">已保存的标签</h3>
            <ul class="divide-y divide-gray-200">
                <li
                    v-for="(tag, index) in mergedTags"
                    :key="index"
                    class="py-3 flex justify-between items-center"
                    :class="{ 'bg-gray-50': tag.fixed }"
                >
                    <div class="flex-1">
                        <div class="flex items-center">
                            <p class="font-medium">{{ tag.name }}</p>
                            <span
                                v-if="tag.fixed"
                                class="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full"
                            >
                                系统标签
                            </span>
                        </div>
                        <p class="text-sm text-gray-500">
                            卡路里: {{ tag.calories }}kcal | 蛋白质:
                            {{ tag.protein }}g | 脂肪: {{ tag.fat }}g | 碳水:
                            {{ tag.carbs }}g
                        </p>
                    </div>
                    <div class="flex space-x-3">
                        <button
                            @click="editTag(tag)"
                            class="text-blue-500 hover:text-blue-700 focus:outline-none"
                            title="编辑标签"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                        </button>
                        <button
                            @click="toggleTagVisibility(tag)"
                            class="focus:outline-none"
                            :title="tag.visible ? '隐藏标签' : '显示标签'"
                        >
                            <svg
                                v-if="tag.visible"
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-6 w-6 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                            <svg
                                v-else
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-6 w-6 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                />
                            </svg>
                        </button>
                        <button
                            v-if="!tag.fixed"
                            @click="removeTag(tag)"
                            class="text-red-500 hover:text-red-700 focus:outline-none"
                            title="删除标签"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-6 w-6"
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
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from "vue";
import {
    getData,
    setData,
    getFoodTags,
    saveFoodTags,
    getVisibleFoodTags,
    saveVisibleFoodTags,
    dispatchEvent,
} from "../utils/storage";

// 尝试注入 toast 服务
const toast = inject("toast", null);

// 响应式数据
const tagName = ref("");
const nutritionValues = ref([
    { title: "卡路里", value: "", color: "bg-orange-500", key: "calories" },
    { title: "蛋白质 (g)", value: "", color: "bg-green-500", key: "protein" },
    { title: "脂肪 (g)", value: "", color: "bg-yellow-400", key: "fat" },
    { title: "碳水 (g)", value: "", color: "bg-blue-400", key: "carbs" },
]);
const savedTags = ref([]);
const isEditing = ref(false);
const editingTag = ref(null);
const originalTagName = ref("");

// 固定标签列表 - 不可删除但可以隐藏
const fixedTags = ref([
    {
        name: "鸡蛋",
        calories: 72,
        protein: 6.3,
        fat: 4.8,
        carbs: 0.6,
        visible: true,
        fixed: true,
        createdAt: new Date().toISOString(),
    },
    {
        name: "香蕉",
        calories: 105,
        protein: 1.3,
        fat: 0.4,
        carbs: 27,
        visible: true,
        fixed: true,
        createdAt: new Date().toISOString(),
    },
    {
        name: "全粒面包",
        calories: 155,
        protein: 5.2,
        fat: 2.8,
        carbs: 25.5,
        visible: true,
        fixed: true,
        createdAt: new Date().toISOString(),
    },
    {
        name: "牛奶",
        calories: 102,
        protein: 5.1,
        fat: 5.8,
        carbs: 7.4,
        visible: true,
        fixed: true,
        createdAt: new Date().toISOString(),
    },
    {
        name: "蛋白粉",
        calories: 132,
        protein: 26.5,
        fat: 1.4,
        carbs: 3.3,
        visible: true,
        fixed: true,
        createdAt: new Date().toISOString(),
    },
    {
        name: "肌酸",
        calories: 18,
        protein: 4.4,
        fat: 0,
        carbs: 0,
        visible: true,
        fixed: true,
        createdAt: new Date().toISOString(),
    },
]);

// 合并固定标签和用户标签
const mergedTags = computed(() => {
    return [...fixedTags.value, ...savedTags.value];
});

// 从 localStorage 获取固定标签的可见性
const getFixedTagsVisibility = () => {
    return getData("fixedTagsVisibility", null);
};

// 保存固定标签的可见性
const saveFixedTagsVisibility = () => {
    const visibilityMap = {};
    fixedTags.value.forEach((tag) => {
        visibilityMap[tag.name] = tag.visible;
    });
    setData("fixedTagsVisibility", visibilityMap);
};

// 更新可见标签
const updateVisibleTags = () => {
    // 合并固定标签和用户标签中所有可见的
    const visibleTags = mergedTags.value.filter((tag) => tag.visible);
    saveVisibleFoodTags(visibleTags);

    // 单独保存固定标签的可见性
    saveFixedTagsVisibility();

    // 触发自定义事件，通知其他组件标签已更新
    dispatchEvent("foodTagsUpdated");
};

// 定义emit事件
const emit = defineEmits(["tag-added", "tag-updated"]);

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

// 保存标签
const saveTag = () => {
    // 检查标签名称
    if (!tagName.value.trim()) {
        if (toast) {
            toast.error("请输入标签名称!");
        } else if (window.$toast) {
            window.$toast.error("请输入标签名称!");
        }
        return;
    }

    // 检查是否与固定标签重名
    if (fixedTags.value.some((tag) => tag.name === tagName.value.trim())) {
        if (toast) {
            toast.error("标签名称已存在于系统标签中!");
        } else if (window.$toast) {
            window.$toast.error("标签名称已存在于系统标签中!");
        }
        return;
    }

    // 检查是否与用户标签重名
    if (savedTags.value.some((tag) => tag.name === tagName.value.trim())) {
        if (toast) {
            toast.error("标签名称已存在!");
        } else if (window.$toast) {
            window.$toast.error("标签名称已存在!");
        }
        return;
    }

    // 处理输入值，如果为空则默认为0
    nutritionValues.value.forEach((item) => {
        if (!item.value || item.value.trim() === "") {
            item.value = "0";
        }
    });

    // 准备标签数据
    const newTag = {
        name: tagName.value,
        calories:
            parseFloat(
                nutritionValues.value.find((item) => item.key === "calories")
                    .value
            ) || 0,
        protein:
            parseFloat(
                nutritionValues.value.find((item) => item.key === "protein")
                    .value
            ) || 0,
        fat:
            parseFloat(
                nutritionValues.value.find((item) => item.key === "fat").value
            ) || 0,
        carbs:
            parseFloat(
                nutritionValues.value.find((item) => item.key === "carbs").value
            ) || 0,
        visible: true, // 默认可见
        fixed: false, // 用户添加的标签不是固定的
        createdAt: new Date().toISOString(),
    };

    // 添加到标签列表
    savedTags.value.push(newTag);
    saveFoodTags(savedTags.value);
    updateVisibleTags();

    // 清空表单
    resetForm();

    // 显示成功提示
    if (toast) {
        toast.success("标签已保存!");
    } else if (window.$toast) {
        window.$toast.success("标签已保存!");
    }

    // 触发组件事件
    emit("tag-added", newTag);
};

// 编辑标签
const editTag = (tag) => {
    // 设置编辑状态
    isEditing.value = true;
    editingTag.value = tag;
    originalTagName.value = tag.name;

    // 填充表单数据
    tagName.value = tag.name;

    // 填充营养值
    nutritionValues.value.find((item) => item.key === "calories").value =
        tag.calories.toString();
    nutritionValues.value.find((item) => item.key === "protein").value =
        tag.protein.toString();
    nutritionValues.value.find((item) => item.key === "fat").value =
        tag.fat.toString();
    nutritionValues.value.find((item) => item.key === "carbs").value =
        tag.carbs.toString();
};

// 更新标签
const updateTag = () => {
    if (!tagName.value.trim()) {
        if (toast) {
            toast.error("请输入标签名称!");
        } else if (window.$toast) {
            window.$toast.error("请输入标签名称!");
        }
        return;
    }

    // 如果修改了名称，检查是否与其他标签重名
    if (tagName.value !== originalTagName.value) {
        // 检查是否与固定标签重名
        if (fixedTags.value.some((tag) => tag.name === tagName.value.trim())) {
            if (toast) {
                toast.error("标签名称已存在于系统标签中!");
            } else if (window.$toast) {
                window.$toast.error("标签名称已存在于系统标签中!");
            }
            return;
        }

        // 检查是否与其他用户标签重名
        if (
            savedTags.value.some(
                (tag) =>
                    tag.name === tagName.value.trim() &&
                    tag.name !== originalTagName.value
            )
        ) {
            if (toast) {
                toast.error("标签名称已存在!");
            } else if (window.$toast) {
                window.$toast.error("标签名称已存在!");
            }
            return;
        }
    }

    // 处理输入值，如果为空则默认为0
    nutritionValues.value.forEach((item) => {
        if (!item.value || item.value.trim() === "") {
            item.value = "0";
        }
    });

    // 获取更新后的营养值
    const updatedCalories =
        parseFloat(
            nutritionValues.value.find((item) => item.key === "calories").value
        ) || 0;
    const updatedProtein =
        parseFloat(
            nutritionValues.value.find((item) => item.key === "protein").value
        ) || 0;
    const updatedFat =
        parseFloat(
            nutritionValues.value.find((item) => item.key === "fat").value
        ) || 0;
    const updatedCarbs =
        parseFloat(
            nutritionValues.value.find((item) => item.key === "carbs").value
        ) || 0;

    // 更新标签
    if (editingTag.value.fixed) {
        // 更新固定标签（只允许修改营养值，不允许修改名称）
        const tagIndex = fixedTags.value.findIndex(
            (t) => t.name === originalTagName.value
        );
        if (tagIndex !== -1) {
            fixedTags.value[tagIndex].calories = updatedCalories;
            fixedTags.value[tagIndex].protein = updatedProtein;
            fixedTags.value[tagIndex].fat = updatedFat;
            fixedTags.value[tagIndex].carbs = updatedCarbs;

            // 保存固定标签的修改
            setData("fixedTags", fixedTags.value);
        }
    } else {
        // 更新用户标签
        const tagIndex = savedTags.value.findIndex(
            (t) => t.name === originalTagName.value
        );
        if (tagIndex !== -1) {
            savedTags.value[tagIndex].name = tagName.value;
            savedTags.value[tagIndex].calories = updatedCalories;
            savedTags.value[tagIndex].protein = updatedProtein;
            savedTags.value[tagIndex].fat = updatedFat;
            savedTags.value[tagIndex].carbs = updatedCarbs;

            // 保存用户标签
            saveFoodTags(savedTags.value);
        }
    }

    // 更新可见标签
    updateVisibleTags();

    // 清空表单并退出编辑模式
    resetForm();
    isEditing.value = false;
    editingTag.value = null;
    originalTagName.value = "";

    // 显示成功提示
    if (toast) {
        toast.success("标签已更新!");
    } else if (window.$toast) {
        window.$toast.success("标签已更新!");
    }

    // 触发组件事件
    emit("tag-updated", editingTag.value);
};

// 取消编辑
const cancelEdit = () => {
    if (isEditing.value) {
        // 取消编辑，恢复表单
        isEditing.value = false;
        editingTag.value = null;
        originalTagName.value = "";
        resetForm();
    } else {
        // 如果不是编辑模式，则清空表单
        resetForm();
    }
};

// 切换标签可见性
const toggleTagVisibility = (tag) => {
    // 找出是固定标签还是用户标签
    if (tag.fixed) {
        // 固定标签 - 直接在fixedTags中找到并修改
        const tagIndex = fixedTags.value.findIndex((t) => t.name === tag.name);
        if (tagIndex !== -1) {
            fixedTags.value[tagIndex].visible =
                !fixedTags.value[tagIndex].visible;
            saveFixedTagsVisibility();
        }
    } else {
        // 用户标签 - 在savedTags中找到并修改
        const tagIndex = savedTags.value.findIndex((t) => t.name === tag.name);
        if (tagIndex !== -1) {
            savedTags.value[tagIndex].visible =
                !savedTags.value[tagIndex].visible;
            saveFoodTags(savedTags.value);
        }
    }

    updateVisibleTags();

    const status = tag.visible ? "隐藏" : "可见"; // 注意这里取反，因为UI会立即更新
    if (toast) {
        toast.success(`标签已设为${status}!`);
    } else if (window.$toast) {
        window.$toast.success(`标签已设为${status}!`);
    }
};

// 移除标签
const removeTag = (tag) => {
    // 只允许删除非固定标签
    if (!tag.fixed) {
        const tagIndex = savedTags.value.findIndex((t) => t.name === tag.name);
        if (tagIndex !== -1) {
            savedTags.value.splice(tagIndex, 1);
            saveFoodTags(savedTags.value);
            updateVisibleTags();

            // 显示提示
            if (toast) {
                toast.success("标签已删除!");
            } else if (window.$toast) {
                window.$toast.success("标签已删除!");
            }
        }
    }
};

// 重置表单
const resetForm = () => {
    tagName.value = "";
    nutritionValues.value.forEach((item) => {
        item.value = "";
    });
};

// 组件挂载时，从存储服务获取保存的标签和固定标签可见性
onMounted(() => {
    const savedTagsData = getFoodTags();
    if (savedTagsData && savedTagsData.length > 0) {
        savedTags.value = savedTagsData;
    }

    // 恢复固定标签的可见性
    const fixedTagsVisibility = getFixedTagsVisibility();
    if (fixedTagsVisibility) {
        fixedTags.value.forEach((tag) => {
            if (fixedTagsVisibility[tag.name] !== undefined) {
                tag.visible = fixedTagsVisibility[tag.name];
            }
        });
    }

    // 检查是否有保存的固定标签修改
    const savedFixedTags = getData("fixedTags", null);
    if (savedFixedTags) {
        // 更新固定标签的营养值
        savedFixedTags.forEach((savedTag) => {
            const index = fixedTags.value.findIndex(
                (t) => t.name === savedTag.name
            );
            if (index !== -1) {
                fixedTags.value[index].calories = savedTag.calories;
                fixedTags.value[index].protein = savedTag.protein;
                fixedTags.value[index].fat = savedTag.fat;
                fixedTags.value[index].carbs = savedTag.carbs;
            }
        });
    }

    // 初始化可见标签
    updateVisibleTags();
});
</script>
