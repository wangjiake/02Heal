// utils/storage.js
// localStorage 操作的通用服务模块

// 检查是否在客户端环境
const isClient = () => {
    return process.client;
};

// 基本操作：获取数据
export const getData = (key, defaultValue = null) => {
    if (!isClient()) return defaultValue;

    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error getting data for key ${key}:`, error);
        return defaultValue;
    }
};

// 基本操作：设置数据
export const setData = (key, value) => {
    if (!isClient()) return false;

    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error setting data for key ${key}:`, error);
        return false;
    }
};

// 基本操作：删除数据
export const removeData = (key) => {
    if (!isClient()) return false;

    try {
        localStorage.setItem(key, null);
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing data for key ${key}:`, error);
        return false;
    }
};

// 基本操作：触发事件
export const dispatchEvent = (eventName) => {
    if (!isClient()) return false;

    try {
        window.dispatchEvent(new Event(eventName));
        return true;
    } catch (error) {
        console.error(`Error dispatching event ${eventName}:`, error);
        return false;
    }
};

// 将数值格式化为保留2位小数
export const formatToTwoDecimals = (value) => {
    return parseFloat(parseFloat(value).toFixed(2));
};

// 格式化营养对象中的所有数值为2位小数
export const formatNutritionValues = (nutrition) => {
    if (!nutrition) return { calories: 0, protein: 0, fat: 0, carbs: 0 };

    return {
        calories: formatToTwoDecimals(nutrition.calories || 0),
        protein: formatToTwoDecimals(nutrition.protein || 0),
        fat: formatToTwoDecimals(nutrition.fat || 0),
        carbs: formatToTwoDecimals(nutrition.carbs || 0)
    };
};

// ===== 专用方法：营养目标相关 =====

// 获取今日日期格式化为 YYYY-MM-DD，考虑凌晨重置
export const getTodayDateString = () => {
    const now = new Date();
    
    // 使用本地时间获取年月日
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // 如果当前时间是凌晨 0 点，视为昨天（如果仍需要这个逻辑）
    if (now.getHours() === 0) {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    }
    
    // 返回本地时间的日期字符串
    return `${year}-${month}-${day}`;
};

// 获取营养目标
export const getNutritionGoals = () => {
    return getData("nutritionGoals", []);
};

// 设置营养目标
export const setNutritionGoals = (goals) => {
    // 确保所有目标值保留2位小数
    const formattedGoals = goals.map(goal => ({
        ...goal,
        value: parseFloat(parseFloat(goal.value).toFixed(2))
    }));

    const result = setData("nutritionGoals", formattedGoals);
    if (result) {
        dispatchEvent("nutritionGoalsUpdated");
    }
    return result;
};

// 获取原始营养目标
export const getOriginalNutritionGoals = () => {
    return getData("originalNutritionGoals", []);
};

// 设置原始营养目标
export const setOriginalNutritionGoals = (goals) => {
    // 确保所有目标值保留2位小数
    const formattedGoals = goals.map(goal => ({
        ...goal,
        value: parseFloat(parseFloat(goal.value).toFixed(2))
    }));

    return setData("originalNutritionGoals", formattedGoals);
};

// 获取已消耗的营养值
export const getConsumedNutrition = () => {
    return getData("consumedNutrition", { calories: 0, protein: 0, fat: 0, carbs: 0 });
};

// 设置已消耗的营养值
export const setConsumedNutrition = (consumed) => {
    // 确保所有消耗值保留2位小数
    const formattedConsumed = formatNutritionValues(consumed);
    return setData("consumedNutrition", formattedConsumed);
};

// ===== 专用方法：食物相关 =====

// 获取今日食物，考虑凌晨处理
export const getTodayFoods = () => {
    const dateKey = `foods_${getTodayDateString()}`;
    return getData(dateKey, []);
};

// 保存今日食物，考虑凌晨处理
export const saveTodayFoods = (foods) => {
    // 确保食物营养值保留2位小数
    const formattedFoods = foods.map(food => ({
        ...food,
        nutrition: food.nutrition ? formatNutritionValues(food.nutrition) : food.nutrition
    }));

    const dateKey = `foods_${getTodayDateString()}`;
    return setData(dateKey, formattedFoods);
};

// 获取指定日期的食物
export const getFoodsByDate = (dateString) => {
    // 如果请求的是今天的数据，调用getTodayFoods来处理凌晨特殊情况
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];

    if (dateString === currentDate) {
        return getTodayFoods();
    }

    const dateKey = `foods_${dateString}`;
    return getData(dateKey, []);
};

// 保存指定日期的食物
export const saveFoodsByDate = (dateString, foods) => {
    // 如果保存到今天，调用saveTodayFoods来处理凌晨特殊情况
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];

    if (dateString === currentDate) {
        return saveTodayFoods(foods);
    }

    // 确保食物营养值保留2位小数
    const formattedFoods = foods.map(food => ({
        ...food,
        nutrition: food.nutrition ? formatNutritionValues(food.nutrition) : food.nutrition
    }));

    const dateKey = `foods_${dateString}`;
    return setData(dateKey, formattedFoods);
};

// 获取历史记录（默认30天）
export const getFoodHistory = (days = 30) => {
    const history = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        let dateString = date.toISOString().split("T")[0];

        // 如果是今天且当前是凌晨0点，调整为昨天的日期
        if (i === 0 && today.getHours() === 0) {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            dateString = yesterday.toISOString().split("T")[0];
        }

        const foods = getFoodsByDate(dateString);

        if (foods.length > 0) {
            history.push({
                date: dateString,
                foods: foods
            });
        }
    }

    return history;
};

// ===== 专用方法：标签相关 =====

// 获取食物标签
export const getFoodTags = () => {
    return getData("foodTags", []);
};

// 保存食物标签
export const saveFoodTags = (tags) => {
    const result = setData("foodTags", tags);
    if (result) {
        dispatchEvent("foodTagsUpdated");
    }
    return result;
};

// 获取可见标签
export const getVisibleFoodTags = () => {
    return getData("visibleFoodTags", []);
};

// 保存可见标签
export const saveVisibleFoodTags = (tags) => {
    const result = setData("visibleFoodTags", tags);
    if (result) {
        dispatchEvent("foodTagsUpdated");
    }
    return result;
};

// ===== 专用方法：每日重置相关 =====

// 获取上次重置日期
export const getLastResetDate = () => {
    return getData("lastGoalResetDate", "");
};

// 设置上次重置日期
export const setLastResetDate = (dateString) => {
    return setData("lastGoalResetDate", dateString);
};
export const getNutritionGoalsList = () => {
    return getData("nutritionGoalsList", []);
};

// Save a list of goal sets
export const saveNutritionGoalsList = (goalsList) => {
    return setData("nutritionGoalsList", goalsList);
};

// Get the currently active goal set ID
export const getActiveGoalSetId = () => {
    return getData("activeGoalSetId", null);
};

// Set the active goal set ID
export const setActiveGoalSetId = (goalSetId) => {
    const result = setData("activeGoalSetId", goalSetId);
    if (result) {
        // Apply the selected goal set
        applyGoalSet(goalSetId);
        dispatchEvent("activeGoalSetChanged");
    }
    return result;
};

// Apply a specific goal set as the current nutrition goals
export const applyGoalSet = (goalSetId) => {
    const goalsList = getNutritionGoalsList();
    if (!goalsList || goalsList.length === 0) return false;

    const goalSet = goalsList.find(set => set.id === goalSetId);
    if (!goalSet) return false;

    // Set this goal set as the current nutrition goals and original goals
    setNutritionGoals(goalSet.goals);
    setOriginalNutritionGoals(goalSet.goals);

    // Calculate today's consumed nutrition and update remaining goals
    const todayFoods = getTodayFoods();
    if (todayFoods && todayFoods.length > 0) {
        // Calculate the daily totals from the foods
        const dailyTotals = todayFoods.reduce(
            (totals, food) => {
                return {
                    calories: formatToTwoDecimals(totals.calories + parseFloat(food.calories || 0)),
                    protein: formatToTwoDecimals(totals.protein + parseFloat(food.protein || 0)),
                    fat: formatToTwoDecimals(totals.fat + parseFloat(food.fat || 0)),
                    carbs: formatToTwoDecimals(totals.carbs + parseFloat(food.carbs || 0))
                };
            },
            { calories: 0, protein: 0, fat: 0, carbs: 0 }
        );

        // Update the remaining goals based on today's consumption
        updateRemainingNutrition(dailyTotals);
    } else {
        // No foods consumed today, just trigger the update event
        dispatchEvent("nutritionGoalsUpdated");
    }

    return true;
};

// Add a new goal set to the list
export const addGoalSet = (name, goals) => {
    const goalsList = getNutritionGoalsList();

    // Generate a unique ID
    const id = `goal_${Date.now()}`;

    // Format goals to ensure proper decimal values
    const formattedGoals = goals.map(goal => ({
        ...goal,
        value: parseFloat(parseFloat(goal.value).toFixed(2))
    }));

    // Create the new goal set
    const newGoalSet = {
        id,
        name,
        goals: formattedGoals,
        createdAt: new Date().toISOString()
    };

    // Add to the list
    const updatedList = [...goalsList, newGoalSet];
    const result = saveNutritionGoalsList(updatedList);

    if (result) {
        dispatchEvent("nutritionGoalsListUpdated");
    }

    return result ? id : null;
};

// Update an existing goal set
export const updateGoalSet = (id, name, goals) => {
    const goalsList = getNutritionGoalsList();

    // Find the index of the goal set to update
    const index = goalsList.findIndex(set => set.id === id);
    if (index === -1) return false;

    // Format goals to ensure proper decimal values
    const formattedGoals = goals.map(goal => ({
        ...goal,
        value: parseFloat(parseFloat(goal.value).toFixed(2))
    }));

    // Update the goal set
    goalsList[index] = {
        ...goalsList[index],
        name,
        goals: formattedGoals,
        updatedAt: new Date().toISOString()
    };

    const result = saveNutritionGoalsList(goalsList);

    if (result) {
        // If this was the active goal set, reapply it
        const activeId = getActiveGoalSetId();
        if (activeId === id) {
            applyGoalSet(id);
        }

        dispatchEvent("nutritionGoalsListUpdated");
    }

    return result;
};

// Delete a goal set
export const deleteGoalSet = (id) => {
    const goalsList = getNutritionGoalsList();

    // Filter out the goal set to delete
    const updatedList = goalsList.filter(set => set.id !== id);

    // If we're deleting the active goal set, we need to set a new active one
    const activeId = getActiveGoalSetId();
    let needToSetNewActive = activeId === id;

    const result = saveNutritionGoalsList(updatedList);

    if (result) {
        // If we deleted the active goal set, set a new one as active if possible
        if (needToSetNewActive && updatedList.length > 0) {
            setActiveGoalSetId(updatedList[0].id);
        } else if (needToSetNewActive) {
            // No goal sets left, clear the active ID
            setActiveGoalSetId(null);
        }

        dispatchEvent("nutritionGoalsListUpdated");
    }

    return result;
};

// 检查是否需要重置每日目标，考虑凌晨特殊情况
export const checkForDailyReset = () => {
    if (!isClient()) return false;

    const lastResetDate = getLastResetDate();
    const now = new Date();
    const currentHour = now.getHours();

    // 获取应该对比的日期（凌晨0点时视为昨天）
    let dateToCompare;
    if (currentHour === 0) {
        // 凌晨0点，不需要重置
        return false;
    } else {
        // 其他时间，正常对比今天的日期
        dateToCompare = now.toISOString().split("T")[0];
    }

    // 如果没有重置过或者不是今天重置的
    if (!lastResetDate || lastResetDate !== dateToCompare) {
        resetDailyGoals();
        setLastResetDate(dateToCompare);
        return true;
    }

    return false;
};

// 重置每日目标到原始值
export const resetDailyGoals = () => {
    if (!isClient()) return false;

    // 获取当前活动的目标集
    const activeGoalSetId = getActiveGoalSetId();
    if (activeGoalSetId) {
        // 重新应用当前活动的目标集
        applyGoalSet(activeGoalSetId);
    } else {
        // 如果没有活动目标集，检查是否有原始目标保存
        const originalGoals = getOriginalNutritionGoals();
        if (originalGoals && originalGoals.length > 0) {
            // 恢复原始目标
            setNutritionGoals(originalGoals);
        } else {
            // 如果没有保存原始目标，则获取当前目标并保存为原始目标
            const currentGoals = getNutritionGoals();
            if (currentGoals && currentGoals.length > 0) {
                setOriginalNutritionGoals(currentGoals);
            }
        }
    }

    // 清空当日食物记录
    const currentDate = getTodayDateString();
    removeData(`foods_${currentDate}`);

    // 清空已消耗值，确保是0.00格式
    setConsumedNutrition({ calories: 0, protein: 0, fat: 0, carbs: 0 });

    // 触发目标更新事件
    dispatchEvent("nutritionGoalsUpdated");

    return true;
};

// 更新剩余营养目标
export const updateRemainingNutrition = (dailyTotals) => {
    if (!isClient()) return false;

    // 获取原始目标
    const originalGoals = getOriginalNutritionGoals();
    if (!originalGoals || originalGoals.length === 0) return false;

    // 格式化每日总计的值为2位小数
    const formattedDailyTotals = formatNutritionValues(dailyTotals);

    // 保存今日消耗的营养值（已格式化）
    setConsumedNutrition(formattedDailyTotals);

    // 计算剩余目标 (目标 - 已消耗)
    const remainingGoals = originalGoals.map((goal) => {
        const totalConsumed = formattedDailyTotals[goal.key] || 0;

        // 将值转换为数字并计算剩余（允许负值）
        const originalValue = parseFloat(goal.value);
        const remaining = formatToTwoDecimals(originalValue - totalConsumed);

        // 返回新对象，使用parseFloat来存储数值而非字符串
        return {
            ...goal,
            value: remaining,
        };
    });

    // 更新目标为剩余值并触发更新事件
    setNutritionGoals(remainingGoals);

    return true;
};

// ===== 专用方法：冷冻食物计算相关 =====

// 获取保存的冷冻食物配置
export const getFrozenFoodConfigurations = () => {
    return getData("frozenFoodConfigurations", []);
};

// 保存冷冻食物配置
export const saveFrozenFoodConfigurations = (configurations) => {
    return setData("frozenFoodConfigurations", configurations);
};

// 计算冷冻后重量
export const calculateFinalWeight = (originalWeight, lossRate) => {
    if (!originalWeight || !lossRate) return 0;

    const weightValue = parseFloat(originalWeight);
    const lossRateValue = parseFloat(lossRate);

    if (isNaN(weightValue) || isNaN(lossRateValue)) return 0;

    // 计算损失后的重量 = 原始重量 * (1 - 损失率/100)
    return formatToTwoDecimals(weightValue * (1 - lossRateValue / 100));
};

// 计算冷冻后的营养值
export const calculateFinalNutrition = (nutritionPer100g, originalWeight, finalWeight) => {
    // 默认值
    const defaultValues = { calories: 0, protein: 0, fat: 0, carbs: 0 };

    if (!originalWeight || !finalWeight) return defaultValues;

    const weightValue = parseFloat(originalWeight);
    const finalWeightValue = parseFloat(finalWeight);

    if (isNaN(weightValue) || isNaN(finalWeightValue) || weightValue <= 0) return defaultValues;

    // 计算原始营养值总量
    const originalTotalNutrition = {
        calories: (nutritionPer100g.calories * weightValue) / 100,
        protein: (nutritionPer100g.protein * weightValue) / 100,
        fat: (nutritionPer100g.fat * weightValue) / 100,
        carbs: (nutritionPer100g.carbs * weightValue) / 100
    };

    // 计算最终营养值 (保持比例)
    return formatNutritionValues(originalTotalNutrition);
};

// 添加冷冻食物
export const addFrozenFood = (foodName, finalWeight, finalNutrition) => {
    // 准备食物数据
    const newFood = {
        name: `${foodName} (${finalWeight}g)`,
        calories: finalNutrition.calories,
        protein: finalNutrition.protein,
        fat: finalNutrition.fat,
        carbs: finalNutrition.carbs,
        addedAt: new Date().toISOString(),
    };

    // 获取今日食物
    const todayFoods = getTodayFoods();

    // 添加新食物
    const updatedFoods = [...todayFoods, newFood];
    saveTodayFoods(updatedFoods);

    // 计算并更新今日总计
    const dailyTotals = updatedFoods.reduce(
        (totals, food) => {
            return {
                calories: formatToTwoDecimals(totals.calories + parseFloat(food.calories || 0)),
                protein: formatToTwoDecimals(totals.protein + parseFloat(food.protein || 0)),
                fat: formatToTwoDecimals(totals.fat + parseFloat(food.fat || 0)),
                carbs: formatToTwoDecimals(totals.carbs + parseFloat(food.carbs || 0))
            };
        },
        { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );

    // 更新剩余营养目标
    updateRemainingNutrition(dailyTotals);

    return newFood;
};

// 计算袋装食物的营养值
export const calculatePackagedNutrition = (nutritionPer100g, actualWeight) => {
    // 默认值
    const defaultValues = { calories: 0, protein: 0, fat: 0, carbs: 0 };

    if (!actualWeight) return defaultValues;

    const weightValue = parseFloat(actualWeight);
    if (isNaN(weightValue) || weightValue <= 0) return defaultValues;

    // 计算实际重量的营养值 = 每100g的营养值 * (实际重量 / 100)
    const ratio = weightValue / 100;

    return formatNutritionValues({
        calories: nutritionPer100g.calories * ratio,
        protein: nutritionPer100g.protein * ratio,
        fat: nutritionPer100g.fat * ratio,
        carbs: nutritionPer100g.carbs * ratio
    });
};

// 添加袋装食物
export const addPackagedFood = (foodName, weight, nutrition) => {
    // 准备食物数据
    const newFood = {
        name: `${foodName} (${weight}g)`,
        calories: nutrition.calories,
        protein: nutrition.protein,
        fat: nutrition.fat,
        carbs: nutrition.carbs,
        addedAt: new Date().toISOString(),
    };

    // 获取今日食物
    const todayFoods = getTodayFoods();

    // 添加新食物
    const updatedFoods = [...todayFoods, newFood];
    saveTodayFoods(updatedFoods);

    // 计算并更新今日总计
    const dailyTotals = updatedFoods.reduce(
        (totals, food) => {
            return {
                calories: formatToTwoDecimals(totals.calories + parseFloat(food.calories || 0)),
                protein: formatToTwoDecimals(totals.protein + parseFloat(food.protein || 0)),
                fat: formatToTwoDecimals(totals.fat + parseFloat(food.fat || 0)),
                carbs: formatToTwoDecimals(totals.carbs + parseFloat(food.carbs || 0))
            };
        },
        { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );

    // 更新剩余营养目标
    updateRemainingNutrition(dailyTotals);

    return newFood;
};