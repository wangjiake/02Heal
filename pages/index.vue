<!-- pages/index.vue -->
<template>
    <div>
        <!-- Top bar -->
        <div class="flex items-center justify-between mb-6">
            <NuxtLink :to="localePath('/guide')"
                class="text-sm text-slate-500 hover:text-brand-600 transition-colors flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                {{ $t('使用指南') }}
            </NuxtLink>
            <div class="flex gap-1.5">
                <button v-for="locale in locales" :key="locale.code"
                    class="rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200"
                    :class="[
                        locale.code === currentLocale
                            ? 'bg-brand-600 text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                    ]" @click="switchLocale(locale.code)">
                    {{ locale.label }}
                </button>
            </div>
        </div>

        <!-- Shutdown notice -->
        <div class="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {{ $t('shutdown_notice') }}
        </div>

        <!-- Dashboard card -->
        <div class="mb-8">
            <ShowCardComponent />
        </div>

        <!-- Tab navigation -->
        <div class="mb-6">
            <div class="flex flex-wrap gap-2">
                <button v-for="(tab, index) in tabs" :key="index"
                    class="rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200"
                    :class="[
                        activeTab === index
                            ? 'bg-brand-600 text-white shadow-sm'
                            : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-800 hover:border-slate-300'
                    ]" @click="activeTab = index">
                    {{ tab.name }}
                </button>
            </div>
        </div>

        <!-- Tab content -->
        <div class="min-h-[300px]">
            <component :is="tabs[activeTab].component" />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useHead } from "nuxt/app";

const ShowCardComponent = defineAsyncComponent(() => import("~/components/ShowCard.vue"));
const AddFoodComponent = defineAsyncComponent(() => import("~/components/AddFood.vue"));
const SetGoalComponent = defineAsyncComponent(() => import("~/components/SetGoal.vue"));
const TagManagementComponent = defineAsyncComponent(() => import("~/components/TagManagement.vue"));
const HistoryRecordComponent = defineAsyncComponent(() => import("~/components/HistoryRecord.vue"));
const FrozenCalculationComponent = defineAsyncComponent(() => import("~/components/FrozenCalculation.vue"));
const PackagedCalculationComponent = defineAsyncComponent(() => import("~/components/PackagedCalculation.vue"));
const ImportTags = defineAsyncComponent(() => import("~/components/ImportTags.vue"));

import { useI18n } from "vue-i18n";
import { useRouter, useRoute, useLocalePath, useSwitchLocalePath } from '#imports';
const { locale } = useI18n();
const router = useRouter();
const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
// 支持的语言
const locales = [
    { code: 'en', label: 'English' },
    { code: 'zh-CN', label: '中文' },
    { code: 'ja', label: '日本語' },
];

// 使用ref跟踪当前语言
const currentLocale = ref(locale.value);

// 切换语言并保留当前路径
const switchLocale = async (newLocale) => {
    if (newLocale === currentLocale.value) return;

    currentLocale.value = newLocale; // 立即更新UI状态

    const switchLocalePath = useSwitchLocalePath();
    const newPath = switchLocalePath(newLocale);
    await router.push(newPath);
};
useHead({
    meta: [
        {
            name: "viewport",
            content:
                "width=device-width, initial-scale=1.0",
        },
    ],
});
useSeoMeta({
    title: t("减脂计算器"),
    ogTitle: t("减脂计算器"),
    description: t(
        "专业的减脂计算工具，帮助您科学控制热量摄入，追踪健康饮食计划。"
    ),
    ogDescription: t(
        "专业的减脂计算工具，帮助您科学控制热量摄入，追踪健康饮食计划。"
    ),
    ogImage:
        "https://3651224.xyz/d/BQACAgUAAyEGAASJ4sQbAAIBWGgIkSKsOaaV6EcFMIqPkvhm6nifAAJdGAACq9dBVNDGtBUH-ClJNgQ",
    twitterCard: "summary_large_image",
    // twitterSite: "@mytwitter",
    // twitterCreator: "@mytwitter",
    ogUrl:
        "https://3651224.xyz/d/BQACAgUAAyEGAASJ4sQbAAIBWGgIkSKsOaaV6EcFMIqPkvhm6nifAAJdGAACq9dBVNDGtBUH-ClJNgQ",
    ogType: "website",
    ogLocale: "en_US",
    ogSiteName: t("减脂计算器"),
    twitterTitle: t("减脂计算器"),
    twitterDescription: t(
        "专业的减脂计算工具，帮助您科学控制热量摄入，追踪健康饮食计划。"
    ),
    twitterImage:
        "https://3651224.xyz/d/BQACAgUAAyEGAASJ4sQbAAIBWGgIkSKsOaaV6EcFMIqPkvhm6nifAAJdGAACq9dBVNDGtBUH-ClJNgQ",
});
// 定义标签数据
const tabs = [
    { name: t("添加食物"), component: AddFoodComponent },
    { name: t("冷冻计算"), component: FrozenCalculationComponent },
    { name: t("袋装计算"), component: PackagedCalculationComponent },
    { name: t("标签管理"), component: TagManagementComponent },
    { name: t("设置目标"), component: SetGoalComponent },
    { name: t("历史记录"), component: HistoryRecordComponent },
    { name: t("导入标签"), component: ImportTags },
];

// 当前激活的标签
const activeTab = ref(0);
</script>
