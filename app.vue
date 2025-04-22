<template>
    <NuxtLayout style="min-height: 100vh; display: flex; flex-direction: column;">
        <NuxtPage />
    </NuxtLayout>
    <ToastContainer ref="toastContainer" />
</template>

<script setup>
import { ref, provide, onMounted } from "vue";
import ToastContainer from "~/components/ToastContainer.vue";

const toastContainer = ref(null);

// 在组件挂载后，提供 toast 方法给全局
onMounted(() => {
    if (process.client && toastContainer.value) {
        const toast = {
            success: (message, duration) =>
                toastContainer.value.success(message, duration),
            error: (message, duration) =>
                toastContainer.value.error(message, duration),
            warning: (message, duration) =>
                toastContainer.value.warning(message, duration),
            info: (message, duration) =>
                toastContainer.value.info(message, duration),
        };

        // 提供给 Composition API 使用
        provide("toast", toast);
    }
});
</script>
