// 格式化数字输入，确保输入有效
export const formatNumberInput = (item) => {
    if (item.value && isNaN(parseFloat(item.value))) {
        item.value = '';
    }

    if (item.value) {
        item.value = item.value.replace(/[^\d.]/g, '');

        const parts = item.value.split('.');
        if (parts.length > 2) {
            item.value = parts[0] + '.' + parts.slice(1).join('');
        }
    }
};

// 格式化 ref 值的数字输入（用于独立的 ref 变量）
export const formatRefNumberInput = (ref) => {
    if (ref.value && isNaN(parseFloat(ref.value))) {
        ref.value = '';
    }

    if (ref.value) {
        ref.value = ref.value.replace(/[^\d.]/g, '');

        const parts = ref.value.split('.');
        if (parts.length > 2) {
            ref.value = parts[0] + '.' + parts.slice(1).join('');
        }
    }
};
