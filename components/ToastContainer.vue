<!-- components/ToastContainer.vue -->
<template>
    <div class="fixed inset-0 z-50 pointer-events-none flex flex-col items-end justify-start p-4 space-y-3">
        <div v-for="toast in toasts" :key="toast.id" class="pointer-events-auto transform" :class="[
            'transition-all duration-300 ease-out',
            toast.isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
        ]">
            <div class="flex items-center gap-3 px-4 py-3 rounded-xl shadow-elevated backdrop-blur-sm"
                :class="getColorClass(toast.type)">
                <p class="text-sm font-medium">{{ toast.message }}</p>
                <button @click="hideToast(toast.id)"
                    class="p-0.5 rounded-lg opacity-70 hover:opacity-100 transition-opacity">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from "vue";

// 维护多个Toast的数组
const toasts = ref([]);
let nextId = 0;
const ANIMATION_DURATION = 300;

// 根据类型获取颜色样式
const getColorClass = (type) => {
    switch (type) {
        case "success":
            return "bg-emerald-600 text-white";
        case "error":
            return "bg-rose-600 text-white";
        case "warning":
            return "bg-amber-500 text-white";
        case "info":
            return "bg-brand-600 text-white";
        default:
            return "bg-emerald-600 text-white";
    }
};

// 添加Toast
const addToast = (message, type = "success", duration = 3000) => {
    const id = nextId++;
    const toast = {
        id,
        message,
        type,
        isVisible: false
    };

    toasts.value.push(toast);

    nextTick(() => {
        setTimeout(() => {
            const index = toasts.value.findIndex(t => t.id === id);
            if (index !== -1) {
                toasts.value[index].isVisible = true;
            }
        }, 20);
    });

    setTimeout(() => {
        hideToast(id);
    }, duration);

    return id;
};

// 隐藏Toast
const hideToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index !== -1) {
        toasts.value[index].isVisible = false;

        setTimeout(() => {
            removeToast(id);
        }, ANIMATION_DURATION);
    }
};

// 移除Toast
const removeToast = (id) => {
    const index = toasts.value.findIndex((toast) => toast.id === id);
    if (index !== -1) {
        toasts.value.splice(index, 1);
    }
};

// 暴露全局方法
if (process.client) {
    window.$toast = {
        show: (message, type, duration) => addToast(message, type, duration),
        success: (message, duration) => addToast(message, "success", duration),
        error: (message, duration) => addToast(message, "error", duration),
        warning: (message, duration) => addToast(message, "warning", duration),
        info: (message, duration) => addToast(message, "info", duration),
    };
}

// 导出方法供组件内使用
defineExpose({
    addToast,
    hideToast,
    removeToast,
    success: (message, duration) => addToast(message, "success", duration),
    error: (message, duration) => addToast(message, "error", duration),
    warning: (message, duration) => addToast(message, "warning", duration),
    info: (message, duration) => addToast(message, "info", duration),
});
</script>