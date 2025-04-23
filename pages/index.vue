<!-- pages/index.vue -->
<template>
    <div class="p-4">
        <div class="flex justify-end gap-2 mb-4">
            <button v-for="locale in locales" :key="locale.code" :class="[
                locale.code === currentLocale.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-black border border-gray-300',
                'rounded-lg px-2 py-1 text-xs sm:text-sm hover:bg-gray-100 transition',
            ]" @click="switchLocale(locale.code)">
                {{ locale.label }}
            </button>
        </div>
        <!-- ShowCard组件 -->
        <ShowCardComponent />

        <!-- 底部导航按钮 -->
        <div class="mt-6">
            <div class="flex flex-wrap gap-2 mt-6">
                <button v-for="(tab, index) in tabs" :key="index" :class="[
                    activeTab === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-black border border-gray-300',
                    'rounded-lg px-4 py-2 text-xs sm:text-sm md:text-base whitespace-nowrap min-w-[80px] text-center',
                ]" @click="activeTab = index">
                    {{ tab.name }}
                </button>
            </div>

            <!-- 组件内容区域 -->
            <div class="mt-4">
                <component :is="tabs[activeTab].component" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useHead } from "nuxt/app";

import ShowCardComponent from "~/components/ShowCard.vue";
import AddFoodComponent from "~/components/AddFood.vue";
import SetGoalComponent from "~/components/SetGoal.vue";
import TagManagementComponent from "~/components/TagManagement.vue";
import HistoryRecordComponent from "~/components/HistoryRecord.vue";
import FrozenCalculationComponent from "~/components/FrozenCalculation.vue";
import PackagedCalculationComponent from "~/components/PackagedCalculation.vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute, useLocalePath, useSwitchLocalePath } from '#imports';
const { locale } = useI18n();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
// 支持的语言
const locales = [
    { code: 'en', label: 'English' },
    { code: 'zh_CN', label: '中文' },
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
                "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
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
    { name: t("设置目标"), component: SetGoalComponent },
    { name: t("标签管理"), component: TagManagementComponent },
    { name: t("历史记录"), component: HistoryRecordComponent },
    { name: t("冷冻计算"), component: FrozenCalculationComponent },
    { name: t("袋装计算"), component: PackagedCalculationComponent },
];

// 当前激活的标签
const activeTab = ref(0);
</script>

<style scoped>
/* 覆盖按钮的focus状态 */
button:focus {
  outline: none;
}

/* 如果需要，可以添加更具体的选择器来覆盖激活状态 */
button.bg-blue-600:active, 
button.bg-blue-600:focus {
  background-color: rgb(37, 99, 235) !important;
  color: white !important;
}

button.bg-white:active,
button.bg-white:focus {
  background-color: white !important;
  color: black !important;
}
</style>