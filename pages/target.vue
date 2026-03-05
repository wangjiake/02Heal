<template>
    <div class="card p-5 sm:p-6 max-w-md mx-auto">
        <h2 class="section-title mb-5">{{ $t("目标设定") }}</h2>

        <div class="space-y-4">
            <div>
                <label class="form-label">{{ $t("目标内容") }}</label>
                <input v-model="goal" :placeholder="$t('如：背单词300个')" class="input-modern" />
            </div>
            <div>
                <label class="form-label">{{ $t("目标数量") }}</label>
                <input type="number" v-model.number="total" min="1" class="input-modern" />
            </div>
            <div>
                <label class="form-label">{{ $t("拆解天数") }}</label>
                <input type="number" v-model.number="days" min="1" class="input-modern" />
            </div>

            <button @click="generateTasks" class="btn-primary w-full">
                {{ $t("生成每日任务") }}
            </button>
        </div>

        <div v-if="tasks.length" class="mt-8 pt-6 border-t border-slate-100">
            <h3 class="text-base font-semibold text-slate-700 mb-4">{{ $t("每日任务") }}</h3>
            <div class="space-y-2">
                <div v-for="(task, idx) in tasks" :key="idx"
                    class="flex items-center justify-between gap-3 p-3 rounded-xl transition-colors"
                    :class="task.completed ? 'bg-emerald-50' : 'bg-slate-50'">
                    <span class="text-sm text-slate-700">
                        {{ $t('dayTask', { day: idx + 1, count: task.count }) }}
                    </span>
                    <button @click="toggleComplete(idx)"
                        class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200"
                        :class="task.completed
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-rose-500 text-white hover:bg-rose-600'">
                        {{ task.completed ? $t('已完成') : $t('未完成') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const goal = ref('')
const total = ref(0)
const days = ref(0)
const tasks = ref([])
const today = ref(getToday())

function getToday() {
    const now = new Date()
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}

const STORAGE_KEY = 'target_data_v1'

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

            if (today.value !== getToday()) {
                resetToday()
                today.value = getToday()
                saveData()
            }
        } catch (e) {
            console.error(t('数据解析失败:'), e)
            localStorage.removeItem(STORAGE_KEY)
        }
    }
}

function saveData() {
    const dataToSave = {
        goal: String(goal.value),
        total: parseInt(total.value) || 0,
        days: parseInt(days.value) || 0,
        tasks: tasks.value,
        today: today.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
}

function generateTasks() {
    const goalStr = String(goal.value).trim()
    const totalNum = parseInt(total.value) || 0
    const daysNum = parseInt(days.value) || 0

    if (!goalStr || totalNum <= 0 || daysNum <= 0) {
        alert(t('请填写完整信息'))
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

    today.value = getToday()
    saveData()
}

function toggleComplete(idx) {
    tasks.value[idx].completed = !tasks.value[idx].completed
    saveData()
}

function resetToday() {
    const dayIdx = getDayIndex()
    if (dayIdx >= 0 && dayIdx < tasks.value.length) {
        tasks.value[dayIdx].completed = false
    }
}

function getDayIndex() {
    const startDate = new Date(today.value)
    const now = new Date(getToday())
    const diff = Math.floor((now - startDate) / (1000 * 60 * 60 * 24))
    return diff < tasks.value.length ? diff : tasks.value.length - 1
}

watch([goal, total, days, tasks], saveData, { deep: true })

function setMidnightTimer() {
    const now = new Date()
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
    const msToMidnight = nextMidnight - now
    setTimeout(() => {
        resetToday()
        today.value = getToday()
        saveData()
        setMidnightTimer()
    }, msToMidnight)
}

onMounted(() => {
    loadData()
    setMidnightTimer()
})
</script>