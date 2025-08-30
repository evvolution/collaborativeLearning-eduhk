<template>
  <div class="word-cloud-container">
    <div class="selection-panel">
      <t-space direction="horizontal" size="medium" class="selection-form">
        <t-select
          v-model="selectedGroupId"
          placeholder="please select a group"
          :style="{ width: '300px' }"
        >
          <t-option
            v-for="group in groupList"
            :key="group.id"
            :label="group.name"
            :value="group.id"
          />
        </t-select>
        
        <t-select
          v-model="selectedCaseId"
          placeholder="please select a case"
          :style="{ width: '200px' }"
        >
          <t-option
            v-for="caseItem in caseList"
            :key="caseItem.id"
            :label="caseItem.name"
            :value="caseItem.id"
          />
        </t-select>
        
        <t-button 
          theme="primary" 
          @click="fetchWordCloudData" 
          :disabled="!isSelectionComplete"
        >
          Get Word Cloud
        </t-button>
      </t-space>
    </div>
    <myWordCloud :data="wordFrequencyData" height="500px" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { getGroupList } from '@/api/modules/users';
import { wordsInGroup } from '@/api/modules/data';
import { getCaseList } from '@/api/modules/case';
import { MessagePlugin } from 'tdesign-vue-next';
import myWordCloud from '../component/myWordCloud.vue';

import 'echarts-wordcloud'

// 数据存储
const groupList = ref<any>([]); // 存储所有组的列表
const caseList = ref<any>([]); // 存储所有案例的列表
const selectedGroupId = ref<number | null>(null); // 选择的组ID
const selectedCaseId = ref<number | null>(null); // 选择的案例ID
const loading = ref<boolean>(false); // 加载状态
const noDataAvailable = ref<boolean>(false); // 无数据状态
const wordFrequencyData = ref<Array<{name: string, value: number}>>([]);

// 计算属性：检查是否两个选择都已完成
const isSelectionComplete = computed(() => {
  return selectedGroupId.value !== null && selectedCaseId.value !== null;
});

// 初始化数据
const initData = async () => {
  try {
    // 1. 获取所有组
    const resGroup: any = await getGroupList();
    groupList.value = resGroup.data.filter((item: any) => item.id !== 10);

    // 2. 获取所有案例
    const resCase: any = await getCaseList(1, 100);
    caseList.value = resCase.data;
  } catch (err: any) {
    console.error('获取数据失败:', err);
    MessagePlugin.error('Failed to load data, please try again later');
  }
};

// 获取词云数据
const fetchWordCloudData = async () => {
  if (!isSelectionComplete.value) return;
  
  loading.value = true;
  noDataAvailable.value = false;
  wordFrequencyData.value = [];
  
  try {
    const response: any = await wordsInGroup(selectedGroupId.value, selectedCaseId.value);
    console.log('API响应数据:', response);
    
    // 检查数据是否有效
    if (!response.data || !response.data.links) {
      console.error('无效的数据结构:', response.data);
      noDataAvailable.value = true;
      return;
    }
    
    // 提取词语和对应的频率
    const rawWordFrequency = response.data.links;
    console.log('词频数据:', rawWordFrequency);
    
    // 检查数据结构
    if (!Array.isArray(rawWordFrequency) || rawWordFrequency.length === 0) {
      console.error('词频数据为空或不是数组');
      noDataAvailable.value = true;
      return;
    }
    
    // 检查数据格式并过滤有效数据
    const validData = rawWordFrequency.filter(item => 
      item && typeof item === 'object' && 
      'target' in item && 'count' in item &&
      typeof item.target === 'string' && 
      typeof item.count === 'number'
    );
    
    if (validData.length === 0) {
      console.error('没有有效的词频数据项', rawWordFrequency[0]);
      noDataAvailable.value = true;
      return;
    }
    
    // 将target和count转换为name和value
    const transformedData = validData.map(item => ({
      name: item.target,
      value: item.count
    }));
    
    console.log('转换后的词频数据:', transformedData);
    
    // 存储处理后的数据
    wordFrequencyData.value = transformedData;
    
    // 显示成功消息
    MessagePlugin.success(`Successfully loaded ${validData.length} word frequency items`);
  } catch (err: any) {
    console.error('获取词云数据失败:', err);
    MessagePlugin.error('Failed to load word cloud data, please try again later');
    noDataAvailable.value = true;
  } finally {
    loading.value = false;
  }
};

// 获取频率最高的词
const getTopWord = () => {
  if (wordFrequencyData.value.length === 0) {
    return { word: '无数据', count: 0 };
  }
  
  const topItem = [...wordFrequencyData.value].sort((a, b) => b.value - a.value)[0];
  return { word: topItem.name, count: topItem.value };
};



// 生命周期钩子
onMounted(() => {
  initData();
});
</script>

<style scoped>
.word-cloud-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.selection-panel {
  padding: 16px;
  background-color: var(--td-bg-color-container, #fff);
  border-radius: var(--td-radius-medium, 3px);
  margin-bottom: 24px;
  box-shadow: var(--td-shadow-1, 0 1px 10px rgba(0, 0, 0, 0.05));
}

.selection-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.data-container {
  flex: 1;
  min-height: 400px;
  padding: 20px;
  background: var(--td-bg-color-container);
  border-radius: var(--td-radius-medium);
  box-shadow: var(--td-shadow-1);
  
  h3 {
    margin: 0 0 16px;
    color: var(--td-text-color-primary);
  }

  .status-message {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    min-height: 400px;
    
    &.loading {
      flex-direction: column;
      color: var(--td-text-color-secondary);
    }
  }

  .summary {
    margin-top: 20px;
    display: flex;
    gap: 24px;
    
    &-item {
      background: var(--td-bg-color-component);
      padding: 12px 16px;
      border-radius: var(--td-radius-small);
      
      .label {
        font-weight: 500;
        margin-right: 8px;
      }
      
      .value {
        color: var(--td-brand-color);
        font-weight: 600;
        margin-right: 4px;
      }
      
      .count {
        color: var(--td-text-color-secondary);
      }
    }
  }

  .note {
    margin-top: 24px;
    padding: 12px;
    background: var(--td-bg-color-component-hover);
    border-left: 4px solid var(--td-brand-color);
    border-radius: var(--td-radius-small);
  }
}
</style>