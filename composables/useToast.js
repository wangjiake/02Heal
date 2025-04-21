// composables/useToast.js
import { ref, readonly } from 'vue';

// 创建状态
const visible = ref(false);
const message = ref('');
const type = ref('success');
const duration = ref(3000);

// 显示提示消息
function showToast(options) {
    // 设置消息内容和类型
    message.value = options.message || '操作成功';
    type.value = options.type || 'success';
    duration.value = options.duration || 3000;

    // 显示提示
    visible.value = true;

    // 自动关闭
    if (options.autoClose !== false) {
        setTimeout(() => {
            hideToast();
        }, duration.value);
    }
}

// 隐藏提示消息
function hideToast() {
    visible.value = false;
}

// 快捷方法
function success(message, options = {}) {
    showToast({ message, type: 'success', ...options });
}

function error(message, options = {}) {
    showToast({ message, type: 'error', ...options });
}

function warning(message, options = {}) {
    showToast({ message, type: 'warning', ...options });
}

function info(message, options = {}) {
    showToast({ message, type: 'info', ...options });
}

// 导出 composable
export function useToast() {
    return {
        // 状态
        visible: readonly(visible),
        message: readonly(message),
        type: readonly(type),
        duration: readonly(duration),

        // 方法
        showToast,
        hideToast,
        success,
        error,
        warning,
        info
    };
}