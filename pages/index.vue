<!-- pages/index.vue -->
<template>
    <div class="p-4">
        <div class="flex justify-end gap-2 mb-4">
            <button v-for="locale in locales" :key="locale.code"
                class="rounded-lg px-2 py-1 text-xs sm:text-sm hover:bg-gray-100 transition min-w-[80px] text-center"
                :class="[
                    locale.code === currentLocale.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-black border border-gray-300'
                ]" @click="switchLocale(locale.code)">
                {{ locale.label }}
            </button>
        </div>

        <!-- ShowCard组件 -->
        <div class="show-card-container" style="min-height: 200px">
            <ShowCardComponent />
        </div>

        <!-- 底部导航按钮 - 移除了外层div的mt-6 -->
        <div>
            <div class="flex flex-wrap gap-4 mt-6">
                <button v-for="(tab, index) in tabs" :key="index"
                    class="rounded-xl px-5 py-2.5 text-xs sm:text-sm md:text-base whitespace-nowrap min-w-[100px] text-center font-medium"
                    :class="[
                        activeTab === index
                            ? 'bg-blue-300 text-[#1C1C1CFF] hover:bg-blue-300'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    ]" @click="activeTab = index">
                    {{ tab.name }}
                </button>
            </div>

            <!-- 组件内容区域 - 添加了最小高度和过渡效果 -->
            <div class="mt-4 component-wrapper" style="min-height: 300px">
                <component :is="tabs[activeTab].component" class="tab-content-transition" />
            </div>
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

