<!-- components/Toast.vue -->
<template>
    <div
        v-if="isVisible"
        class="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out"
        :class="[
            isVisible
                ? 'translate-x-0 opacity-100'
                : 'translate-x-full opacity-0',
            colorClass,
        ]"
    >
        <div class="flex items-center p-4 rounded-lg shadow-lg">
            <div class="flex items-center">
                <!-- 图标区域 -->
                <div class="mr-3" v-if="icon">
                    <component :is="icon" class="w-5 h-5" />
                </div>
                <!-- 消息内容 -->
                <p class="font-medium">{{ message }}</p>
            </div>
            <!-- 关闭按钮 -->
            <button
                @click="close"
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
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

// 定义props
const props = defineProps({
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: "success",
        validator: (value) =>
            ["success", "error", "warning", "info"].includes(value),
    },
    duration: {
        type: Number,
        default: 3000,
    },
    autoClose: {
        type: Boolean,
        default: true,
    },
    isVisible: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["close"]);

// 计算样式类
const colorClass = computed(() => {
    switch (props.type) {
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
});

// 计算图标组件
const icon = computed(() => {
    // 这里使用内联SVG图标，也可以使用其他图标库
    return null;
});

// 关闭提示
const close = () => {
    emit("close");
};

// 自动关闭
watch(
    () => props.isVisible,
    (newVal) => {
        if (newVal && props.autoClose) {
            setTimeout(() => {
                close();
            }, props.duration);
        }
    }
);
</script>
