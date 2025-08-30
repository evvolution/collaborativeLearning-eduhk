<template>
  <div class="video-class">
    <div class="video-player">
      <video
        v-if="videoData"
        ref="caseVideo"
        controls
        :src="videoData.video"
        width="100%"
        height="500"
      >
      </video>
    </div>
    <div class="video-pad">
      <t-row align="center">
        <t-col :span="6">Task Information</t-col>
        <t-col :span="6" style="text-align: right">
          <t-button theme="primary" @click="addAnnotate = true" content="Add New Annotate"></t-button>
        </t-col>
      </t-row>
      <t-form label-align="top" v-if="videoData">
        <t-form-item>
          <template #label>
            <t-tag content="Description" theme="primary" shape="round"/>
          </template>
          {{ videoData.description }}
        </t-form-item >
        <t-form-item>
          <template #label>
            <t-tag content="Attachments" theme="primary" shape="round"/>
          </template>
          <t-space align="center" breakLine>
            <t-button variant="text" v-for="item in videoData.attachmentList" @click="getAttachment(item)" :content="item.name">
              <template #icon><t-icon name="file-attachment" ></t-icon></template>
            </t-button>
          </t-space>
        </t-form-item >
      </t-form>
    </div>
  </div>
  <addAnnotateModal 
    :addAnnotate="addAnnotate" 
    :caseVideoTime_s="caseVideoTime_s" 
    :caseVideoTime_e="caseVideoTime_e"
    :caseVideoTime_full="caseVideoTime_full"
    @get-annotate-start-time="getStartTime"
    @get-annotate-end-time="getEndTime"
    @close-add="handle_closeAdd"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { getCaseDetail } from '@/api/modules/case'
import { pngUrl } from '@/utils/common'
import { MessagePlugin } from 'tdesign-vue-next'
import emitter from '@/utils/mitt'

import addAnnotateModal  from './addAnnotate.vue'
const props = defineProps({
  currentCaseId: Number
})

const videoData = ref()
const initVideo = () => {
  if (!props.currentCaseId) {
    return MessagePlugin.error('System Error')
  }
  getCaseDetail(props.currentCaseId)
  .then((res: any)=> {
    videoData.value = res.data
    setTimeout(()=> {
      caseVideoTime_full.value = caseVideo.value.duration.toFixed(0)
    }, 100)
  })
}
const getAttachment = (item: any) => {
  window.location.href = item.path
}

const addAnnotate = ref(false)
const handle_closeAdd = () => {
  addAnnotate.value = false
}

const caseVideo = ref<any>(null)
const caseVideoTime_full = ref<any>()
const caseVideoTime_s = ref<any>()
const caseVideoTime_e = ref<any>()
const getStartTime = () => {
  if (caseVideo.value) {
    caseVideoTime_s.value = caseVideo.value.currentTime
  }
}
const getEndTime = () => {
  if (caseVideo.value) {
    caseVideoTime_e.value = caseVideo.value.currentTime
  }
}

initVideo()

</script>

<style lang="scss" scoped>
.video-class {
  width: 100%;
  display: flex;
  flex-direction: column;
  column-gap: 16px;
}
.video-pad {
  width: 100%;
  margin-top: 12px;
}
</style>