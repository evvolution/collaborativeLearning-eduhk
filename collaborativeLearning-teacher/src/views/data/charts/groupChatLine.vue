<template>
  <div class="chart-container">
    <h3>Chat Count Analyse</h3>

    <!-- 原生Tab按钮组 -->
    <div class="tabs">
      <button 
        v-for="group in groupList" 
        :key="group.id"
        :class="['tab-button', { active: activeGroupId === group.id }]"
        @click="activeGroupId = group.id"
      >
        {{ group.name }}
      </button>
    </div>
    
    <!-- 图表容器 -->
    <div class="content-area">
      <div v-if="activeGroup">
        <h3>{{ activeGroup.name }} last 30 days chat data</h3>
        <div ref="chartRef" class="chart"></div>
      </div>
      <div v-else>
        请选择一个组
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { getGroupList } from '@/api/modules/users';
import { getPast30DaysChat } from '@/api/modules/data';
import * as echarts from 'echarts';

const groupList = ref<any>([]);
const activeGroupId = ref<number | null>(null);
const xAxisData = ref<any>([]);
const yAxisData = ref<any>([]);
const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 计算当前选中的组
const activeGroup = computed(() => {
  return groupList.value.find((group: any) => group.id === activeGroupId.value);
});

// 初始化数据
const initData = async () => {
  try {
    // 获取群列表
    const resGroup = await getGroupList();
    // 去掉id=10的群
    groupList.value = resGroup.data.filter((item: any) => item.id !== 10);
    
    if (groupList.value.length > 0) {
      // 默认选中第一个组
      activeGroupId.value = groupList.value[0].id;
      await loadGroupData(activeGroupId.value);
      initChart();
    }
  } catch (error) {
    console.error('获取数据失败:', error);
  }
}

// 加载指定组的数据
const loadGroupData = async (groupId: any) => {
  try {
    // 清空之前的数据
    xAxisData.value = [];
    yAxisData.value = [];
    
    const resChat = await getPast30DaysChat(groupId);
    
    // 获取日期列表（假设所有学生的日期相同）
    const dateList = resChat.data.group[0]?.studentList[0]?.past30DayPost.map((item: any) => item.postTime) || [];
    
    // 设置x轴数据为日期（倒序排列）
    xAxisData.value = [...dateList].reverse();
    
    // 为每个学生创建一条折线
    for (const item of resChat.data.group[0]?.studentList || []) {
      let chatCount = []
      for (const chat of item.past30DayPost) {
        chatCount.push(chat.postCount)
      }
      // 倒序排列聊天数据
      chatCount = chatCount.reverse();
      
      yAxisData.value.push({
        name: item.name,
        type: 'line',
        data: chatCount,
        smooth: true,
        // 生成较深的随机颜色
        itemStyle: {
          color: generateDeeperColor()
        }
      });
    }
    
    // 如果图表已初始化，则更新图表
    if (chartInstance) {
      updateChart();
    }
  } catch (error) {
    console.error('加载组数据失败:', error);
  }
}

// 生成较深的随机颜色
const generateDeeperColor = () => {
  const r = Math.floor(Math.random() * 200);
  const g = Math.floor(Math.random() * 200);
  const b = Math.floor(Math.random() * 200);
  return `rgb(${r}, ${g}, ${b})`;
}

  // 初始化图表
  const initChart = () => {
    if (chartRef.value) {
      // 如果已经有实例，先销毁
      if (chartInstance) {
        chartInstance.dispose();
      }
      chartInstance = echarts.init(chartRef.value);
      updateChart();
      
      // 监听窗口大小变化，调整图表大小
      window.addEventListener('resize', () => {
        chartInstance?.resize();
      });
    }
  }

  // 更新图表
  const updateChart = () => {
    if (!chartInstance) return;
    
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: yAxisData.value.map((item: any) => item.name),
        top: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData.value,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: 'post count',
      },
      series: yAxisData.value
    };
    
    // 使用notMerge: true，确保完全替换旧的配置，而不是合并
    chartInstance.setOption(option, true);
  }

// 使用一个标志来跟踪是否是首次加载
const isInitialLoad = ref(true);

// 监听activeGroupId变化，加载新的组数据
watch(activeGroupId, async (newGroupId) => {
  // 如果是首次加载，跳过watch触发的加载，因为initData已经加载了数据
  if (newGroupId && !isInitialLoad.value) {
    await loadGroupData(newGroupId);
  } else if (isInitialLoad.value) {
    // 首次加载后将标志设置为false
    isInitialLoad.value = false;
  }
});

// 组件挂载时初始化数据
onMounted(() => {
  initData();
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.tabs {
  display: flex;
  overflow-x: auto;
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 20px;
}

.tab-button {
  padding: 10px 20px;
  margin-right: 5px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: #409eff;
}

.tab-button.active {
  color: #409eff;
  border-bottom: 2px solid #409eff;
}

.content-area {
  min-height: 300px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.chart {
  width: 100%;
  height: 500px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>