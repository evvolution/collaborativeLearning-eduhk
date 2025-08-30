<template>
  <t-space align="center">
    <t-select 
      v-if="getFormedTime(Number(timeData))[0] != 0"
      v-model="pickedTime[0]"
      class="timeSelector"
      placeholder="hour"
    >
      <t-option 
        v-for="item in getFormedTime(Number(timeData))[0]" 
        :label="item" 
        :value="item"
      />
    </t-select>
    <span v-if="getFormedTime(Number(timeData))[0] != 0"><h4>H:</h4></span>
    <t-select class="timeSelector" placeholder="min" v-model="pickedTime[1]">
      <t-option 
        v-for="item in getFormedTime(Number(timeData))[1]" 
        :label="item - 1" 
        :value="item - 1"
      />
    </t-select>
    <span><h4>M:</h4></span>
    <t-select class="timeSelector" placeholder="sec" v-model="pickedTime[2]">
      <t-option 
        v-for="item in 60" 
        :label="item - 1" 
        :value="item - 1"
      />
    </t-select>
    <span><h4>S</h4></span>
    <t-button v-if="type == 0" default="Select Start Time" theme="default" disabled></t-button>
    <t-button v-if="type == 1" default="Select End Time" theme="default" disabled></t-button>
  </t-space>
</template>

<script setup lang="ts">
import { getFormedTime } from '@/utils/common'
import { ref, watch } from 'vue'
const props = defineProps({
  timeData: {
    default: '0',
    type: String
  },
  type: {
    default: 0, // 0开始，1结束
    type: Number
  }
})
const emit = defineEmits(['getStart', 'getEnd'])

const pickedTime = ref<any>([])
const getStart = () => {
  let h = pickedTime.value[0] ? pickedTime.value[0] : 0
  let m = pickedTime.value[1] ? pickedTime.value[1] : 0
  let s = pickedTime.value[2] ? pickedTime.value[2] : 0
  let tmpTime = h * 3600 + m * 60 + s 
  if (tmpTime <= props.timeData) {
    return tmpTime
  } else {
    return props.timeData
  }
}

const getEnd = () => {
  let h = pickedTime.value[0] ? pickedTime.value[0] : 0
  let m = pickedTime.value[1] ? pickedTime.value[1] : 0
  let s = pickedTime.value[2] ? pickedTime.value[2] : 0
  let tmpTime = h * 3600 + m * 60 + s 
  if (tmpTime <= props.timeData) {
    return tmpTime
  } else {
    return props.timeData
  }
}

watch(pickedTime.value, (newValue, oldValue)=> {
  if (props.type == 0) {
    emit('getStart', getStart())
  } else {
    emit('getEnd', getEnd())
  }
},{
  deep: true
})
</script>

<style scoped>
.timeSelector {
  width: 80px;
}
</style>