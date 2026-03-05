import { inject } from 'vue';

export function useToast() {
    const injectedToast = inject('toast', null);

    const show = (message, type = 'success') => {
        const target = injectedToast || (process.client ? window.$toast : null);
        if (target && target[type]) {
            target[type](message);
        }
    };

    return {
        success: (message) => show(message, 'success'),
        error: (message) => show(message, 'error'),
        warning: (message) => show(message, 'warning'),
        info: (message) => show(message, 'info'),
    };
}
