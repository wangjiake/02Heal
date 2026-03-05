<template>
    <div>
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
            <h1 class="text-2xl font-bold text-slate-800 tracking-tight">{{ $t('使用指南') }}</h1>
            <NuxtLink :to="localePath('/')"
                class="btn-secondary !py-1.5 !px-3 !text-sm">
                {{ $t('返回首页') }}
            </NuxtLink>
        </div>

        <div class="space-y-6">
            <!-- Science: Calorie Deficit -->
            <div class="rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-6 sm:p-8 shadow-elevated">
                <h2 class="text-lg font-bold text-white mb-4">{{ $t('guide_science_title') }}</h2>
                <p class="text-sm text-brand-100 leading-relaxed mb-5">{{ $t('guide_science_intro') }}</p>

                <!-- Deficit table -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                    <div class="rounded-xl bg-white/10 border border-white/10 p-4 text-center">
                        <p class="text-brand-200 text-xs mb-1">{{ $t('guide_science_daily_deficit') }}</p>
                        <p class="text-white text-xl font-bold">300–500</p>
                        <p class="text-brand-200 text-xs">kcal</p>
                        <div class="mt-2 pt-2 border-t border-white/10">
                            <p class="text-brand-200 text-xs">{{ $t('guide_science_weekly_loss') }}</p>
                            <p class="text-emerald-300 text-sm font-semibold">~0.3–0.5 kg</p>
                        </div>
                    </div>
                    <div class="rounded-xl bg-white/10 border border-white/10 p-4 text-center">
                        <p class="text-brand-200 text-xs mb-1">{{ $t('guide_science_daily_deficit') }}</p>
                        <p class="text-white text-xl font-bold">500–750</p>
                        <p class="text-brand-200 text-xs">kcal</p>
                        <div class="mt-2 pt-2 border-t border-white/10">
                            <p class="text-brand-200 text-xs">{{ $t('guide_science_weekly_loss') }}</p>
                            <p class="text-amber-300 text-sm font-semibold">~0.5–0.75 kg</p>
                        </div>
                    </div>
                    <div class="rounded-xl bg-white/10 border border-white/10 p-4 text-center">
                        <p class="text-brand-200 text-xs mb-1">{{ $t('guide_science_daily_deficit') }}</p>
                        <p class="text-white text-xl font-bold">750–1100</p>
                        <p class="text-brand-200 text-xs">kcal</p>
                        <div class="mt-2 pt-2 border-t border-white/10">
                            <p class="text-brand-200 text-xs">{{ $t('guide_science_weekly_loss') }}</p>
                            <p class="text-rose-300 text-sm font-semibold">~0.75–1 kg</p>
                        </div>
                    </div>
                </div>

                <!-- Recommendations -->
                <div class="rounded-xl bg-white/5 border border-white/10 p-4">
                    <h3 class="text-sm font-semibold text-white mb-2">{{ $t('guide_science_recommend_title') }}</h3>
                    <ul class="space-y-2 text-sm text-brand-100">
                        <li class="flex items-start gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                            {{ $t('guide_science_recommend1') }}
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                            {{ $t('guide_science_recommend2') }}
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                            {{ $t('guide_science_recommend3') }}
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                            {{ $t('guide_science_recommend4') }}
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Ask AI -->
            <div class="card p-5 sm:p-6">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-brand-600 text-white flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93"></path>
                            <path d="M8.24 4.47A4 4 0 0 1 12 2"></path>
                            <path d="M12 6v2"></path>
                            <circle cx="12" cy="14" r="6"></circle>
                            <path d="M12 11v3l2 1"></path>
                        </svg>
                    </div>
                    <h2 class="section-title">{{ $t('guide_ai_title') }}</h2>
                </div>
                <p class="text-sm text-slate-600 leading-relaxed mb-4">{{ $t('guide_ai_desc') }}</p>

                <!-- Prompt template -->
                <div class="relative rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <p class="text-xs text-slate-400 mb-2">{{ $t('guide_ai_prompt_label') }}</p>
                    <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-line select-all" ref="promptRef">{{ $t('guide_ai_prompt') }}</p>
                    <button @click="copyPrompt"
                        class="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                        :title="$t('guide_ai_copy')">
                        <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="text-emerald-500">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </button>
                </div>

                <p class="text-xs text-slate-400 mt-3">{{ $t('guide_ai_hint') }}</p>
            </div>

            <!-- 1. Dashboard -->
            <div class="card p-5 sm:p-6">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm">1</div>
                    <h2 class="section-title">{{ $t('guide_dashboard_title') }}</h2>
                </div>
                <p class="text-sm text-slate-600 leading-relaxed">{{ $t('guide_dashboard_desc') }}</p>
            </div>

            <!-- 2. Add Food -->
            <div class="card p-5 sm:p-6">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">2</div>
                    <h2 class="section-title">{{ $t('guide_addfood_title') }}</h2>
                </div>
                <p class="text-sm text-slate-600 leading-relaxed mb-3">{{ $t('guide_addfood_desc') }}</p>
                <ul class="space-y-2 text-sm text-slate-600">
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                        {{ $t('guide_addfood_step1') }}
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                        {{ $t('guide_addfood_step2') }}
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                        {{ $t('guide_addfood_step3') }}
                    </li>
                </ul>
            </div>

            <!-- 3. Frozen Calculation -->
            <div class="card p-5 sm:p-6">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">3</div>
                    <h2 class="section-title">{{ $t('guide_frozen_title') }}</h2>
                </div>
                <p class="text-sm text-slate-600 leading-relaxed mb-3">{{ $t('guide_frozen_desc') }}</p>
                <ul class="space-y-2 text-sm text-slate-600">
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0"></span>
                        {{ $t('guide_frozen_step1') }}
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0"></span>
                        {{ $t('guide_frozen_step2') }}
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0"></span>
                        {{ $t('guide_frozen_step3') }}
                    </li>
                </ul>
            </div>

            <!-- 4. Packaged Calculation -->
            <div class="card p-5 sm:p-6">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-sm">4</div>
                    <h2 class="section-title">{{ $t('guide_packaged_title') }}</h2>
                </div>
                <p class="text-sm text-slate-600 leading-relaxed mb-3">{{ $t('guide_packaged_desc') }}</p>
                <ul class="space-y-2 text-sm text-slate-600">
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0"></span>
                        {{ $t('guide_packaged_step1') }}
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0"></span>
                        {{ $t('guide_packaged_step2') }}
                    </li>
                </ul>
            </div>

            <!-- 5. Tag Management -->
            <div class="card p-5 sm:p-6">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">5</div>
                    <h2 class="section-title">{{ $t('guide_tags_title') }}</h2>
                </div>
                <p class="text-sm text-slate-600 leading-relaxed mb-3">{{ $t('guide_tags_desc') }}</p>
                <ul class="space-y-2 text-sm text-slate-600">
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                        {{ $t('guide_tags_step1') }}
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                        {{ $t('guide_tags_step2') }}
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                        {{ $t('guide_tags_step3') }}
                    </li>
                </ul>
            </div>

            <!-- 6. Set Goals -->
            <div class="card p-5 sm:p-6">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">6</div>
                    <h2 class="section-title">{{ $t('guide_goals_title') }}</h2>
                </div>
                <p class="text-sm text-slate-600 leading-relaxed mb-3">{{ $t('guide_goals_desc') }}</p>
                <ul class="space-y-2 text-sm text-slate-600">
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></span>
                        {{ $t('guide_goals_step1') }}
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></span>
                        {{ $t('guide_goals_step2') }}
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></span>
                        {{ $t('guide_goals_step3') }}
                    </li>
                </ul>
            </div>

            <!-- 7. History -->
            <div class="card p-5 sm:p-6">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">7</div>
                    <h2 class="section-title">{{ $t('guide_history_title') }}</h2>
                </div>
                <p class="text-sm text-slate-600 leading-relaxed">{{ $t('guide_history_desc') }}</p>
            </div>

            <!-- 8. Import/Export -->
            <div class="card p-5 sm:p-6">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-sm">8</div>
                    <h2 class="section-title">{{ $t('guide_import_title') }}</h2>
                </div>
                <p class="text-sm text-slate-600 leading-relaxed">{{ $t('guide_import_desc') }}</p>
            </div>

            <!-- Tips -->
            <div class="rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-6 shadow-elevated">
                <h2 class="text-lg font-bold text-white mb-3">{{ $t('guide_tips_title') }}</h2>
                <ul class="space-y-2 text-sm text-brand-100">
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-brand-300 mt-1.5 flex-shrink-0"></span>
                        {{ $t('guide_tip1') }}
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-brand-300 mt-1.5 flex-shrink-0"></span>
                        {{ $t('guide_tip2') }}
                    </li>
                    <li class="flex items-start gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-brand-300 mt-1.5 flex-shrink-0"></span>
                        {{ $t('guide_tip3') }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocalePath } from '#imports';

const { t } = useI18n();
const localePath = useLocalePath();

const copied = ref(false);
const copyPrompt = async () => {
    try {
        await navigator.clipboard.writeText(t('guide_ai_prompt'));
        copied.value = true;
        setTimeout(() => { copied.value = false; }, 2000);
    } catch {}
};

useSeoMeta({
    title: t('使用指南'),
    description: t('guide_seo_desc'),
});
</script>
