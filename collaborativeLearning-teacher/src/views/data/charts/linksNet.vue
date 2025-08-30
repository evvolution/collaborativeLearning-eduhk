<template>
  <div class="chart-container">
    <h3>Interactive Group Network</h3>
    <div class="charts-grid">
      <div 
        v-for="(group, index) in groupNetData" 
        :key="group.groupId" 
        class="chart-item"
      >
        <div :id="`graph-chart-${group.groupId}`" class="graph-chart"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, onBeforeUnmount } from 'vue'
import { getGroupList } from '@/api/modules/users';
import { getLinks } from '@/api/modules/data';
import * as echarts from 'echarts';

// 存储网络图数据
const groupNetData = ref<any[]>([]);
const chartInstances = ref<Map<number, echarts.ECharts>>(new Map());

// 初始化数据
const initData = async () => {
  try {
    // 1. 获取所有组
    const resGroup: any = await getGroupList();
    const groupList = resGroup.data.filter((item: any) => item.id !== 10);
    
    if (groupList.length === 0) {
      return;
    }

    // 清空之前的数据
    groupNetData.value = [];
    
    // 2. 根据组的数量获取每个组的关系数据
    for (const group of groupList) {
      try {
        // 获取群聊关系数据
        const resLinks: any = await getLinks(group.id);
        
        // 将组和关系数据添加到数组中
        groupNetData.value.push({
          groupId: group.id,
          groupName: group.name,
          data: resLinks
        });
      } catch (err) {
        console.error(`获取组 ${group.id} 的关系数据失败:`, err);
      }
    }
    
    // 检查是否有数据
    if (groupNetData.value.length === 0) {
      return;
    }
    
    // 3. 生成图表
    await nextTick();
    initCharts();
  } catch (err: any) {
    console.error('获取数据失败:', err);
  }
}

// 初始化所有图表
const initCharts = () => {
  // 清除之前的图表实例
  disposeAllCharts();
  
  // 为每个群组创建图表
  groupNetData.value.forEach((groupData: any) => {
    initSingleChart(groupData);
  });
  
  // 添加窗口大小变化时自动调整图表大小的功能
  window.addEventListener('resize', handleResize);
}

// 初始化单个图表
const initSingleChart = (groupData: any) => {
  const chartId = `graph-chart-${groupData.groupId}`;
  const chartDom = document.getElementById(chartId);
  
  if (!chartDom) {
    return;
  }
  
  try {
    const chart = echarts.init(chartDom);
    chartInstances.value.set(groupData.groupId, chart);
    
    // 设置图表选项
    const option = generateChartOption(groupData);
    chart.setOption(option);
  } catch (err: any) {
    console.error(`初始化图表 ${groupData.groupId} 失败:`, err);
  }
}

// 处理窗口大小变化
const handleResize = () => {
  chartInstances.value.forEach((chart) => {
    chart.resize();
  });
}

// 生成图表配置
const generateChartOption = (groupData: any) => {
  // 处理数据
  const rawData = groupData.data?.data || {};
  
  // 节点数据
  const nodes = (rawData.data || []).map((name: string) => ({
    name,
    value: name,
    symbolSize: 40,
    itemStyle: {
      // 生成较深的随机颜色，避免太浅的颜色
      color: generateDeeperColor()
    }
  }));

  // 生成较深的随机颜色函数
  function generateDeeperColor() {
    // 限制RGB值的最大值为200，确保颜色不会太浅
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    
    // 转换为16进制颜色代码
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  // 关系数据
  const links = (rawData.links || []).map((link: any) => {
    // 检查是否存在反向边
    const hasReverse = rawData.links.some(
      (l: any) => l.source === link.target && l.target === link.source
    );
    
    return {
      source: link.source,
      target: link.target,
      value: link.count,

      lineStyle: {
        width: Math.sqrt(link.count) * 2.5,
        color: hasReverse 
          ? (link.source > link.target ? '#ff7f0e' : '#1f77b4') // 双向边使用不同颜色
          : '#2ca02c', // 单向边使用绿色
        curveness: hasReverse ? 0.2 : 0, // 双向边添加曲率
        opacity: 0.8
      },
      symbolSize: [4, 8]
    };
  });
  
  // 返回图表配置
  return {
    title: {
      text: `${groupData.groupName}`,
      top: 'top',
      left: 'left'
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params: any) {
        if (params.dataType === 'node') {
          return `${params.name}`;
        } else if (params.dataType === 'edge') {
          return `${params.data.source} -> ${params.data.target}: ${params.data.value || ''} times of interaction`;
        }
        return '';
      }
    },
    series: [{
      name: 'interactive net',
      type: 'graph',
      layout: 'force',
      data: nodes,
      links: links,
      roam: true,
      draggable: true,
      label: {
        show: true,
        position: 'bottom',
        formatter: '{b}'
      },
      force: {
        repulsion: 300,
        edgeLength: 200,
        gravity: 0.1
      },
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          width: 10
        }
      }
    }]
  };
}

// 销毁所有图表实例
const disposeAllCharts = () => {
  chartInstances.value.forEach((chart) => {
    chart.dispose();
  });
  chartInstances.value.clear();
}

// 生命周期钩子
onMounted(() => {
  initData();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  disposeAllCharts();
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.charts-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-item {
  width: 100%;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 16px;
  box-sizing: border-box;
  margin-bottom: 10px;
}

.graph-chart {
  width: 100%;
  height: 400px;
}
</style>