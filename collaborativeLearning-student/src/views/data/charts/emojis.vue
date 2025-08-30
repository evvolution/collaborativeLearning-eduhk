<template>
  <div class="chart-content" ref="chart"></div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

const chart = ref()

const initChart = () => {
  const myChart = echarts.init(chart.value);
    
  // 此处粘贴图表代码
  let option = {
    title: {
      text: 'Emoji Usage Frequency',
      subtext: 'Fake Data',
      left: 'left'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'right'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: examplesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  
  myChart.setOption(option)
}

const examplesData = [
  { value: 1048, name: '😀 Sustaining'},
  { value: 735, name: '🤨 Normal' },
  { value: 223, name: '🙁 Opposed' }
]

onMounted(()=> {
  initChart()
})
</script>
<style scoped lang="scss">
.chart-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>