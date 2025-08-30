<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getPast30DaysChat } from '@/api/modules/data';
import * as echarts from 'echarts';

const xAxisData = ref<any>([]);
const yAxisData = ref<any>([]);
const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 初始化数据
const initData = async () => {
  try {
    await loadGroupData();
    initChart();
  } catch (error) {
    console.error('获取数据失败:', error);
  }
}

// 加载指定组的数据
const loadGroupData = async () => {
  try {
    // 清空之前的数据
    xAxisData.value = [];
    yAxisData.value = [];
    
    const resChat = await getPast30DaysChat();
    
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
      title: {
        text: 'Chat Count Analyse',
        left: 'left'
      },
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
  min-height: 200px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.chart {
  width: 100%;
  height: 100%
}
</style>