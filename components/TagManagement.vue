<!-- components/TagManagement.vue -->
<template>
    <div class="card p-5 sm:p-6">
        <h2 class="section-title mb-5">
            {{ isEditing ? $t("编辑标签") : $t("快速添加标签管理") }}
        </h2>

        <form @submit.prevent="isEditing ? updateTag() : saveTag()" class="space-y-4 mb-6">
            <div>
                <label class="form-label">{{ $t("标签名称") }}</label>
                <input type="text" v-model="tagName" :placeholder="$t('输入标签名称')"
                    class="input-modern" :disabled="isEditing && editingTag.fixed" />
            </div>

            <div v-for="(item, index) in nutritionValues" :key="index">
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
                <button type="submit" class="btn-success w-full sm:w-auto">
                    {{ isEditing ? $t("保存修改") : $t("保存标签") }}
                </button>
                <button type="button" @click="cancelEdit" class="btn-secondary w-full sm:w-auto">
                    {{ isEditing ? $t("取消编辑") : $t("清空表单") }}
                </button>
            </div>
        </form>

        <div v-if="mergedTags.length > 0" class="mt-8 pt-6 border-t border-slate-100">
            <h3 class="section-title mb-4">{{ $t("已保存的标签") }}</h3>
            <div class="space-y-3">
                <div v-for="(tag, index) in mergedTags" :key="index"
                    class="flex justify-between items-center gap-4 p-3 rounded-xl transition-colors"
                    :class="tag.fixed ? 'bg-brand-50 border border-brand-100' : 'bg-slate-50 hover:bg-slate-100'">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                            <p class="font-medium text-slate-800 truncate">{{ tag.nameKey ? $t(tag.nameKey) : tag.name }}</p>
                            <span v-if="tag.fixed"
                                class="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-brand-100 text-brand-700">
                                {{ $t("系统标签") }}
                            </span>
                        </div>
                        <p class="text-xs text-slate-500 mt-1">
                            {{ tag.calories }}kcal &middot;
                            {{ $t("蛋白质") }} {{ tag.protein }}g &middot;
                            {{ $t("脂肪") }} {{ tag.fat }}g &middot;
                            {{ $t("碳水") }} {{ tag.carbs }}g
                        </p>
                    </div>
                    <div class="flex items-center gap-1 flex-shrink-0">
                        <button @click="editTag(tag)"
                            class="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                            :title="$t('编辑标签')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button @click="toggleTagVisibility(tag)"
                            class="p-1.5 rounded-lg transition-colors"
                            :class="tag.visible ? 'text-brand-500 hover:text-brand-700 hover:bg-brand-50' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'"
                            :title="tag.visible ? $t('隐藏标签') : $t('显示标签')">
                            <svg v-if="tag.visible" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        </button>
                        <button v-if="!tag.fixed" @click="removeTag(tag)"
                            class="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                            :title="$t('删除标签')">
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
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
    getData,
    setData,
    getFoodTags,
    saveFoodTags,
    getVisibleFoodTags,
    saveVisibleFoodTags,
    dispatchEvent,
} from '../utils/storage';
import { formatNumberInput } from '../utils/format';
import { getFixedTags } from '../utils/constants';
import { useI18n } from "vue-i18n";
import { useToast } from "../composables/useToast";

const { t } = useI18n();
const toast = useToast();

// 响应式数据
const tagName = ref('');
const nutritionValues = ref([
    { title: t('卡路里'), value: '', color: 'bg-orange-500', key: 'calories' },
    { title: t('蛋白质') + ' (g)', value: '', color: 'bg-green-500', key: 'protein' },
    { title: t('脂肪') + ' (g)', value: '', color: 'bg-yellow-400', key: 'fat' },
    { title: t('碳水') + ' (g)', value: '', color: 'bg-blue-400', key: 'carbs' },
]);
const savedTags = ref([]);
const isEditing = ref(false);
const editingTag = ref(null);
const originalTagName = ref('');

// 固定标签列表 - 不可删除但可以隐藏
const fixedTags = ref(getFixedTags());

// 合并固定标签和用户标签
const mergedTags = computed(() => {
    return [...fixedTags.value, ...savedTags.value];
});

// 从 localStorage 获取固定标签的可见性
const getFixedTagsVisibility = () => {
    return getData('fixedTagsVisibility', null);
};

// 保存固定标签的可见性（用 id 作为 key，避免语言切换后 key 不匹配）
const saveFixedTagsVisibility = () => {
    const visibilityMap = {};
    fixedTags.value.forEach((tag) => {
        visibilityMap[tag.id] = tag.visible;
    });
    setData('fixedTagsVisibility', visibilityMap);
};

// 更新可见标签
const updateVisibleTags = () => {
    // 合并固定标签和用户标签中所有可见的
    const visibleTags = mergedTags.value.filter((tag) => tag.visible);
    saveVisibleFoodTags(visibleTags);

    // 单独保存固定标签的可见性
    saveFixedTagsVisibility();

    // 触发自定义事件，通知其他组件标签已更新
    dispatchEvent('foodTagsUpdated');
};

// 定义emit事件
const emit = defineEmits(['tag-added', 'tag-updated']);

const formatNumber = formatNumberInput;

// 保存标签
const saveTag = () => {
    // 检查标签名称
    if (!tagName.value.trim()) {
        toast.error(t('请输入标签名称!'));
        return;
    }

    if (fixedTags.value.some((tag) => tag.name === tagName.value.trim())) {
        toast.error(t('标签名称已存在于系统标签中!'));
        return;
    }

    if (savedTags.value.some((tag) => tag.name === tagName.value.trim())) {
        toast.error(t('标签名称已存在!'));
        return;
    }

    nutritionValues.value.forEach((item) => {
        if (!item.value || item.value.trim() === '') {
            item.value = '0';
        }
    });

    const newTag = {
        name: tagName.value,
        calories:
            parseFloat(
                nutritionValues.value.find((item) => item.key === 'calories')
                    .value
            ) || 0,
        protein:
            parseFloat(
                nutritionValues.value.find((item) => item.key === 'protein')
                    .value
            ) || 0,
        fat:
            parseFloat(
                nutritionValues.value.find((item) => item.key === 'fat').value
            ) || 0,
        carbs:
            parseFloat(
                nutritionValues.value.find((item) => item.key === 'carbs').value
            ) || 0,
        visible: true,
        fixed: false,
        createdAt: new Date().toISOString(),
    };

    savedTags.value.push(newTag);
    saveFoodTags(savedTags.value);
    updateVisibleTags();
    resetForm();
    toast.success(t('标签已保存!'));
    emit('tag-added', newTag);
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
    nutritionValues.value.find((item) => item.key === 'calories').value =
        tag.calories.toString();
    nutritionValues.value.find((item) => item.key === 'protein').value =
        tag.protein.toString();
    nutritionValues.value.find((item) => item.key === 'fat').value =
        tag.fat.toString();
    nutritionValues.value.find((item) => item.key === 'carbs').value =
        tag.carbs.toString();
};

// 更新标签
const updateTag = () => {
    if (!tagName.value.trim()) {
        toast.error(t('请输入标签名称!'));
        return;
    }

    if (tagName.value !== originalTagName.value) {
        if (fixedTags.value.some((tag) => tag.name === tagName.value.trim())) {
            toast.error(t('标签名称已存在于系统标签中!'));
            return;
        }

        if (
            savedTags.value.some(
                (tag) =>
                    tag.name === tagName.value.trim() &&
                    tag.name !== originalTagName.value
            )
        ) {
            toast.error(t('标签名称已存在!'));
            return;
        }
    }

    // 处理输入值，如果为空则默认为0
    nutritionValues.value.forEach((item) => {
        if (!item.value || item.value.trim() === '') {
            item.value = '0';
        }
    });

    // 获取更新后的营养值
    const updatedCalories =
        parseFloat(
            nutritionValues.value.find((item) => item.key === 'calories').value
        ) || 0;
    const updatedProtein =
        parseFloat(
            nutritionValues.value.find((item) => item.key === 'protein').value
        ) || 0;
    const updatedFat =
        parseFloat(
            nutritionValues.value.find((item) => item.key === 'fat').value
        ) || 0;
    const updatedCarbs =
        parseFloat(
            nutritionValues.value.find((item) => item.key === 'carbs').value
        ) || 0;

    // 更新标签
    if (editingTag.value.fixed) {
        // 更新固定标签（只允许修改营养值，不允许修改名称）
        const tagIndex = fixedTags.value.findIndex(
            (t) => t.id === editingTag.value.id
        );
        if (tagIndex !== -1) {
            fixedTags.value[tagIndex].calories = updatedCalories;
            fixedTags.value[tagIndex].protein = updatedProtein;
            fixedTags.value[tagIndex].fat = updatedFat;
            fixedTags.value[tagIndex].carbs = updatedCarbs;

            // 保存固定标签的修改
            setData('fixedTags', fixedTags.value);
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
    originalTagName.value = '';

    toast.success(t('标签已更新!'));
    emit('tag-updated', editingTag.value);
};

// 取消编辑
const cancelEdit = () => {
    if (isEditing.value) {
        // 取消编辑，恢复表单
        isEditing.value = false;
        editingTag.value = null;
        originalTagName.value = '';
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
        const tagIndex = fixedTags.value.findIndex((t) => t.id === tag.id);
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

    const status = tag.visible ? t('隐藏') : t('可见');
    toast.success(t('标签已设为') + status + '!');
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

            toast.success(t('标签已删除!'));
        }
    }
};

// 重置表单
const resetForm = () => {
    tagName.value = '';
    nutritionValues.value.forEach((item) => {
        item.value = '';
    });
};

// 组件挂载时，从存储服务获取保存的标签和固定标签可见性
onMounted(() => {
    const savedTagsData = getFoodTags();
    if (savedTagsData && savedTagsData.length > 0) {
        savedTags.value = savedTagsData;
    }

    // 恢复固定标签的可见性（用 id 匹配）
    const fixedTagsVisibility = getFixedTagsVisibility();
    if (fixedTagsVisibility) {
        fixedTags.value.forEach((tag) => {
            if (fixedTagsVisibility[tag.id] !== undefined) {
                tag.visible = fixedTagsVisibility[tag.id];
            }
        });
    }

    // 检查是否有保存的固定标签修改（用 id 匹配）
    const savedFixedTags = getData('fixedTags', null);
    if (savedFixedTags) {
        savedFixedTags.forEach((savedTag) => {
            const index = fixedTags.value.findIndex(
                (t) => t.id === savedTag.id
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