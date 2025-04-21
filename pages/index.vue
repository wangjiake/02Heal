<!-- pages/index.vue -->
<template>
    <div class="p-4">
      <!-- ShowCard组件 -->
      <ShowCardComponent />
      
      <!-- 底部导航按钮 -->
      <div class="mt-6">
        <div class="flex justify-between">
          <button 
            v-for="(tab, index) in tabs" 
            :key="index"
            :class="[
              activeTab === index ? 'bg-blue-600 text-white' : 'bg-white text-black border border-gray-300', 
              'rounded-lg px-1 sm:px-4 py-2 text-center flex-1 mx-1 whitespace-nowrap text-xs sm:text-sm md:text-base overflow-hidden'
            ]"
            @click="activeTab = index"
          >
            {{ tab.name }}
          </button>
        </div>
        
        <!-- 组件内容区域 -->
        <div class="mt-4">
          <component :is="tabs[activeTab].component" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import ShowCardComponent from "~/components/ShowCard.vue";
  import AddFoodComponent from "~/components/AddFood.vue";
  import SetGoalComponent from "~/components/SetGoal.vue";
  import TagManagementComponent from "~/components/TagManagement.vue";
  import HistoryRecordComponent from "~/components/HistoryRecord.vue";
  
  // 定义标签数据
  const tabs = [
    { name: '添加食物', component: AddFoodComponent },
    { name: '设置目标', component: SetGoalComponent },
    { name: '标签管理', component: TagManagementComponent },
    { name: '历史记录', component: HistoryRecordComponent }
  ];
  
  // 当前激活的标签
  const activeTab = ref(0);
  </script>