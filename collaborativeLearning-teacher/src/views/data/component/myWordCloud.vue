<template>
  <div ref="chartRef" :style="{ width: width, height: height }"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'
import 'echarts-wordcloud'

const props = defineProps({
    // 词云数据
    data: {
        type: Array,
        required: true
    },
    // 容器宽度
    width: {
        type: String,
        default: '100%'
    },
    // 容器高度
    height: {
        type: String,
        default: '300px'
    },
    // 文字大小范围
    sizeRange: {
        type: Array,
        default: () => [30, 60]
    },
    // 旋转角度范围
    rotationRange: {
        type: Array,
        default: () => [0, 0]
    },
    // 自定义颜色数组
    colors: {
        type: Array,
        default: () => ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', '#FF9F1C', '#2EC4B6', '#E71D36']
    },
    // 形状
    shape: {
        type: String,
        default: 'circle'
    }
})

// 定义事件
const emit = defineEmits(['click'])

const chartRef = ref(null)
let chart = null

// 初始化词云图
const initChart = () => {
    if (!chartRef.value) return

    chart = echarts.init(chartRef.value)
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            show: true,
            formatter: '{b}: {c}',
            textStyle: {
                color: '#5BE9FF'
            },
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderColor: '#5BE9FF',
            borderWidth: 1
        },
        series: [{
            type: 'wordCloud',
            shape: props.shape,
            left: 'center',
            top: 'center',
            width: '90%',
            height: '90%',
            sizeRange: props.sizeRange,
            rotationRange: props.rotationRange,
            rotationStep: 45,
            gridSize: 12,
            drawOutOfBound: false,
            textStyle: {
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                color: function () {
                    return props.colors[Math.floor(Math.random() * props.colors.length)]
                }
            },
            emphasis: {
                textStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 255, 255, 0.5)'
                }
            },
            data: props.data.sort((a, b) => b.value - a.value)
        }]
    }

    chart.setOption(option)

    // 注册点击事件
    chart.on('click', (params) => {
        emit('click', {
            name: params.name,
            value: params.value,
            dataIndex: params.dataIndex,
            data: props.data[params.dataIndex]
        })
    })
}

// 处理窗口大小变化
const handleResize = () => {
    chart && chart.resize()
}

// 监听数据变化
watch(() => props.data, () => {
    initChart()
}, { deep: true })

onMounted(() => {
    initChart()
    window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
    if (chart) {
        chart.dispose()
        chart = null
    }
    window.removeEventListener('resize', handleResize)
})
</script>