<template>
  <div class="panel">
    <t-space>
      <t-input v-model="urlToSet" style="width: 30vw;" placeholder="url or id"/>
      <t-button @click="saveSurvey">Save</t-button>
    </t-space>
    <br/><br/>
    <t-space>
      <t-alert message="You can set your goal URL or Questionnaire id" />
    </t-space>
  </div>
</template>

<script setup lang="ts">
import { updateSurvey, getSurvey } from '@/api/modules/common'
import { MessagePlugin } from 'tdesign-vue-next'
import { ref } from 'vue'
const urlToSet = ref<any>('')
const saveSurvey = () => {
  if (urlToSet.value) {
    updateSurvey(urlToSet.value).then((res: any)=> {
      if(res.msg == 'success') {
        return MessagePlugin.success('Updated')
      }
    })
  } else {
    return MessagePlugin.warning('Url or id is necessary')
  }
}

const initSurvey = () => {
  getSurvey().then((res)=> {
    urlToSet.value = res.data.name
  })
}

initSurvey()
</script>

<style lang="scss" scoped>
.panel {
  padding: 12px;
}
</style>