<template>
    <NuxtLayout style="min-height: 100vh; display: flex; flex-direction: column;">
        <NuxtPage />
    </NuxtLayout>
    <ToastContainer ref="toastContainer" />
</template>

<script setup>
import { ref, provide } from "vue";
import ToastContainer from "~/components/ToastContainer.vue";
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

useHead({
    htmlAttrs: {
        lang: locale,
        dir: 'ltr',
    },
    script: [
        {
            src: 'https://www.googletagmanager.com/gtag/js?id=G-V40T838F5J',
            async: true,
            defer: true  // 延迟加载，不阻塞渲染
        },
        {
            innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-V40T838F5J');
      `,
            tagPosition: 'bodyClose'  // 放到 body 末尾
        }
    ]
})

const toastContainer = ref(null);

// provide 应该在 setup 顶层调用，不要放 onMounted 里
const toast = {
    success: (message, duration) => toastContainer.value?.success(message, duration),
    error: (message, duration) => toastContainer.value?.error(message, duration),
    warning: (message, duration) => toastContainer.value?.warning(message, duration),
    info: (message, duration) => toastContainer.value?.info(message, duration),
};

provide("toast", toast);
</script>