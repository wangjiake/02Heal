// 固定标签数据（系统内置标签）
// nameKey 用于多语言动态翻译，name 不再使用
export const getFixedTags = () => [
    {
        id: 'egg',
        nameKey: '鸡蛋',
        calories: 72,
        protein: 6.3,
        fat: 4.8,
        carbs: 0.6,
        visible: true,
        fixed: true,
        createdAt: new Date().toISOString(),
    },
    {
        id: 'banana',
        nameKey: '香蕉',
        calories: 105,
        protein: 1.3,
        fat: 0.4,
        carbs: 27,
        visible: true,
        fixed: true,
        createdAt: new Date().toISOString(),
    },
];
