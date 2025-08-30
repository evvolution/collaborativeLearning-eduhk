<template>
  <div class="chart-content" ref="chart"></div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import { emoji } from '@/api/modules/data'

const chart = ref()

const initChart = () => {
  emoji()
  .then((res)=> {
    console.log(res)
    _data.value[0] = {
      name: '😀 Sustaining', value: res.data[0].count
    }
    _data.value[1] = {
      name: '🤨 Normal', value: res.data[1].count
    }

    const myChart = echarts.init(chart.value);
    
    let option = {
      title: {
        text: 'Emoji Usage Frequency',
        // subtext: 'Fake Data',
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
          data: _data.value,
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
  })
  .catch((err: any)=> {
    console.error(err)
  })
}

const _data = ref<any>([])

const exampleData = ref([
  { value: 1048, name: '😀 Sustaining'},
  { value: 735, name: '🤨 Normal' },
  { value: 223, name: '🙁 Opposed' }
])

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