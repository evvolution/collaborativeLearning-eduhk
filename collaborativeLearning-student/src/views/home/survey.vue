<template>
  <questions :is-plugin="true" :survey-id="currentSet" v-if="!isUrl"/>
  <t-space v-else align="center">
    <t-alert :message="currentSet" />
    <t-button @click="router.push({name: 'Home'})">Back</t-button>
  </t-space>
  
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
// import { getSurvey } from '@/api/modules/common'
import questions from '../case/questions.vue'

import axios from 'axios'
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
const token = userStore.token
// 创建一个新的axios实例，不包含全局拦截器
const instance = axios.create({
  // 设置axios实例的配置
})
const currentSet = ref<any>()
const isUrl = ref(false)
// 发送请求时，使用这个新的axios实例发送请求
instance.post(`http://47.76.37.174:8088/api/student/getSurvey?token=${token}`)
  .then(response => {
    // 处理响应
    console.log(response.data.data)
    if (response.data.data.name.includes('http')) {
      window.open(response.data.data.name, '_blank')
      currentSet.value = response.data.data.name
      isUrl.value = true
    } else {
      currentSet.value = response.data.data.name
      isUrl.value = false
    }
  })
  .catch(error => {
    // 处理错误
  });


// const initSurvey = () => {
//   getSurvey().then((res)=> {
//     if (res.data.name.includes('http')) {
//       window.open(res.data.name, '_blank')
//       currentSet.value = res.data.name
//       isUrl.value = true
//     } else {
//       currentSet.value = res.data.name
//       isUrl.value = false
//     }
//   })
// }

// initSurvey()
</script>