<!-- components/ToastContainer.vue -->
<template>
    <div
        class="fixed inset-0 z-50 pointer-events-none flex flex-col items-end justify-start p-4 space-y-4"
    >
        <transition-group name="toast">
            <div
                v-for="toast in toasts"
                :key="toast.id"
                class="pointer-events-auto transform transition-all duration-300 ease-in-out"
                :class="[getColorClass(toast.type)]"
            >
                <div class="flex items-center p-4 rounded-lg shadow-lg">
                    <div class="flex items-center">
                        <!-- 图标 -->
                        <div class="mr-3" v-if="getIcon(toast.type)">
                            <component
                                :is="getIcon(toast.type)"
                                class="w-5 h-5"
                            />
                        </div>
                        <!-- 消息内容 -->
                        <p class="font-medium">{{ toast.message }}</p>
                    </div>
                    <!-- 关闭按钮 -->
                    <button
                        @click="removeToast(toast.id)"
                        class="ml-4 p-1 rounded-full hover:bg-opacity-20 hover:bg-black focus:outline-none"
                    >
                        <svg
                            class="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// 维护多个Toast的数组
const toasts = ref([]);
let nextId = 0;

// 根据类型获取颜色样式
const getColorClass = (type) => {
    switch (type) {
        case "success":
            return "bg-green-500 text-white";
        case "error":
            return "bg-red-500 text-white";
        case "warning":
            return "bg-yellow-500 text-white";
        case "info":
            return "bg-blue-500 text-white";
        default:
            return "bg-green-500 text-white";
    }
};

// 根据类型获取图标 (这里使用 null 因为我们使用简单的样式)
const getIcon = (type) => {
    return null;
};

// 添加Toast
const addToast = (message, type = "success", duration = 3000) => {
    const id = nextId++;
    const toast = { id, message, type };
    toasts.value.push(toast);

    // 自动关闭
    setTimeout(() => {
        removeToast(id);
    }, duration);

    return id;
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
    removeToast,
    success: (message, duration) => addToast(message, "success", duration),
    error: (message, duration) => addToast(message, "error", duration),
    warning: (message, duration) => addToast(message, "warning", duration),
    info: (message, duration) => addToast(message, "info", duration),
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s;
}
.toast-enter-from {
    opacity: 0;
    transform: translateX(100%);
}
.toast-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
</style>
