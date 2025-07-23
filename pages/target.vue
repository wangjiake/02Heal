<template>
    <div class="target-page">
        <h2>目标设定</h2>
        <div>
            <label>目标内容：</label>
            <input v-model="goal" placeholder="如：背单词300个" />
        </div>
        <div>
            <label>目标数量：</label>
            <input type="number" v-model.number="total" min="1" />
        </div>
        <div>
            <label>拆解天数：</label>
            <input type="number" v-model.number="days" min="1" />
        </div>
        <button @click="generateTasks">生成每日任务</button>

        <div v-if="tasks.length">
            <h3>每日任务</h3>
            <ul>
                <li v-for="(task, idx) in tasks" :key="idx">
                    第{{ idx + 1 }}天：{{ task.count }}个
                    <button @click="toggleComplete(idx)" :class="task.completed ? 'completed-btn' : 'incomplete-btn'">
                        {{ task.completed ? '已完成' : '未完成' }}
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const goal = ref('')
const total = ref(0)
const days = ref(0)
const tasks = ref([])
const today = ref(getToday())

function getToday() {
    const now = new Date()
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}

// 本地存储键
const STORAGE_KEY = 'target_data_v1'

// 加载本地数据
function loadData() {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
        try {
            const parsed = JSON.parse(data)
            goal.value = parsed.goal || ''
            total.value = parseInt(parsed.total) || 0
            days.value = parseInt(parsed.days) || 0
            tasks.value = parsed.tasks || []
            today.value = parsed.today || getToday()


            // 如果日期不是今天，重置当天完成状态
            if (today.value !== getToday()) {
                resetToday()
                today.value = getToday()
                saveData()
            }
        } catch (e) {
            console.error('数据解析失败:', e)
            // 清除损坏的数据
            localStorage.removeItem(STORAGE_KEY)
        }
    }
}
// 保存数据到本地
function saveData() {
    const dataToSave = {
        goal: String(goal.value),
        total: parseInt(total.value) || 0,  // 确保是数字
        days: parseInt(days.value) || 0,    // 确保是数字
        tasks: tasks.value,
        today: today.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
}

// 修复后的生成每日任务函数
function generateTasks() {
    // 清理并强制转换为数字
    const goalStr = String(goal.value).trim()
    const totalNum = parseInt(total.value) || 0
    const daysNum = parseInt(days.value) || 0


    if (!goalStr || totalNum <= 0 || daysNum <= 0) {
        alert('请填写完整信息')
        return
    }

    const daily = Math.floor(totalNum / daysNum)
    const remainder = totalNum % daysNum


    tasks.value = []
    for (let i = 0; i < daysNum; i++) {
        const count = i < remainder ? daily + 1 : daily
        tasks.value.push({
            count: count,
            completed: false
        })
    }

    // 验证总数是否正确
    const totalCheck = tasks.value.reduce((sum, task) => sum + task.count, 0)

    today.value = getToday()
    saveData()
}


// 切换完成状态
function toggleComplete(idx) {
    tasks.value[idx].completed = !tasks.value[idx].completed
    saveData()
}

// 重置当天完成状态
function resetToday() {
    const dayIdx = getDayIndex()
    if (dayIdx >= 0 && dayIdx < tasks.value.length) {
        tasks.value[dayIdx].completed = false
    }
}

// 获取今天是第几天
function getDayIndex() {
    // 以目标生成当天为第1天
    const startDate = new Date(today.value)
    const now = new Date(getToday())
    const diff = Math.floor((now - startDate) / (1000 * 60 * 60 * 24))
    return diff < tasks.value.length ? diff : tasks.value.length - 1
}

// 监听数据变化自动保存
watch([goal, total, days, tasks], saveData, { deep: true })

// 0点自动刷新当天完成状态
function setMidnightTimer() {
    const now = new Date()
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
    const msToMidnight = nextMidnight - now
    setTimeout(() => {
        resetToday()
        today.value = getToday()
        saveData()
        setMidnightTimer() // 递归设置下一天
    }, msToMidnight)
}

onMounted(() => {
    loadData()
    setMidnightTimer()
})
</script>

<style scoped>
.target-page {
    max-width: 420px;
    margin: 40px auto;
    padding: 28px 24px;
    border-radius: 16px;
    background: linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%);
    box-shadow: 0 4px 24px rgba(80, 120, 200, 0.12);
}

h2,
h3 {
    color: #3a6ea5;
    margin-bottom: 18px;
    font-weight: 600;
    letter-spacing: 1px;
}

label {
    display: inline-block;
    width: 90px;
    color: #4a4a4a;
    font-weight: 500;
}

input {
    margin-bottom: 12px;
    padding: 6px 12px;
    border: 1px solid #bcdffb;
    border-radius: 6px;
    outline: none;
    transition: border-color 0.2s;
}

input:focus {
    border-color: #3a6ea5;
}

button {
    margin-left: 10px;
    padding: 6px 18px;
    border: none;
    border-radius: 6px;
    background: #3a6ea5;
    color: #fff;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(58, 110, 165, 0.08);
    transition: background 0.2s;
}

button:hover {
    background: #24548c;
}

ul {
    padding-left: 0;
}

li {
    list-style: none;
    margin-bottom: 10px;
    background: #f6fbff;
    border-radius: 6px;
    padding: 8px 12px;
    box-shadow: 0 1px 4px rgba(80, 120, 200, 0.04);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.completed-btn {
    background: #4caf50;
    color: #fff;
}

.completed-btn:hover {
    background: #388e3c !important;
}

.incomplete-btn {
    background: #f44336;
    color: #fff;
}

.incomplete-btn:hover {
    background: #c62828 !important;
}
</style>
