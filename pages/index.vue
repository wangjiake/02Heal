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

        <!-- ShowCard组件 - Added skeleton placeholder while loading -->
        <div class="show-card-container">
            <div v-if="!isShowCardLoaded" class="bg-gray-100 animate-pulse rounded-lg"
                style="height: 200px; width: 100%;"></div>
            <ShowCardComponent v-else @mounted="isShowCardLoaded = true" />
        </div>

        <!-- 底部导航按钮 -->
        <div>
            <div class="flex flex-wrap gap-4 mt-6">
                <button v-for="(tab, index) in tabs" :key="index"
                    class="rounded-xl px-5 py-2.5 text-xs sm:text-sm md:text-base whitespace-nowrap min-w-[100px] text-center font-medium"
                    :class="[
                        activeTab === index
                            ? 'bg-blue-300 text-[#1C1C1CFF] hover:bg-blue-600'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    ]" @click="activeTab = index">
                    {{ tab.name }}
                </button>
            </div>

            <!-- Component content area with improved layout stability -->
            <div class="mt-4 component-wrapper relative">
                <!-- Placeholder that maintains consistent height -->
                <div v-if="!isComponentLoaded" class="bg-gray-50 rounded-lg" style="height: 400px; width: 100%;"></div>

                <!-- Actual component with stable height -->
                <div v-else class="tab-content-transition">
                    <component :is="tabs[activeTab].component" @mounted="handleComponentMounted" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useHead } from "nuxt/app";

// Eagerly import the most critical component
import ShowCardComponent from "~/components/ShowCard.vue";

// Track loading states
const isShowCardLoaded = ref(false);
const isComponentLoaded = ref(false);

// Pre-load initial tab component
const AddFoodComponent = defineAsyncComponent({
    loader: () => import("~/components/AddFood.vue"),
    loadingComponent: null, // We handle our own placeholder
    delay: 0, // No delay
    timeout: 5000 // 5 second timeout
});

// Define other components with async loading
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

// Supported languages
const locales = [
    { code: 'en', label: 'English' },
    { code: 'zh_CN', label: '中文' },
    { code: 'ja', label: '日本語' },
];

// Track current locale
const currentLocale = ref(locale.value);

// Switch locale and maintain current path
const switchLocale = async (newLocale) => {
    if (newLocale === currentLocale.value) return;

    currentLocale.value = newLocale; // Immediately update UI state

    const switchLocalePath = useSwitchLocalePath();
    const newPath = switchLocalePath(newLocale);
    await router.push(newPath);
};

useHead({
    meta: [
        {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
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

// Define tab data
const tabs = [
    { name: t("添加食物"), component: AddFoodComponent },
    { name: t("冷冻计算"), component: FrozenCalculationComponent },
    { name: t("袋装计算"), component: PackagedCalculationComponent },
    { name: t("标签管理"), component: TagManagementComponent },
    { name: t("设置目标"), component: SetGoalComponent },
    { name: t("历史记录"), component: HistoryRecordComponent },
    { name: t("导入标签"), component: ImportTags },
];

// Active tab
const activeTab = ref(0);

// Handle component mounting
const handleComponentMounted = () => {
    isComponentLoaded.value = true;
};

// Mark the first tab component as loaded after mounting
onMounted(() => {
    // Set a small timeout to ensure the component has time to render
    setTimeout(() => {
        isComponentLoaded.value = true;
    }, 100);

    // Preload the first few tabs to reduce later layout shifts
    setTimeout(() => {
        import("~/components/FrozenCalculation.vue");
        import("~/components/PackagedCalculation.vue");
    }, 1000);
});
</script>

<style scoped>
/* Override button focus state */
button:focus {
    outline: none;
}

/* More specific selectors to override active state */
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

/* Add smooth transition effects */
.tab-content-transition {
    transition: opacity 0.3s ease;
    width: 100%;
}

.component-wrapper {
    position: relative;
    min-height: 400px;
    /* Consistent height to avoid layout shifts */
    contain-intrinsic-size: 0 400px;
    /* Modern browsers - helps prevent CLS */
}

/* Style for ShowCard component container */
.show-card-container {
    position: relative;
    width: 100%;
    height: 200px;
    /* Fixed height */
    contain-intrinsic-size: 0 200px;
    /* Modern browsers - helps prevent CLS */
    margin-bottom: 1.5rem;
}

/* Animation for placeholders */
@keyframes pulse {

    0%,
    100% {
        opacity: 0.6;
    }

    50% {
        opacity: 0.8;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>