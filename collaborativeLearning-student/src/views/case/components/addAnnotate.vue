<template>
  <t-drawer 
    :visible="addAnnotate"
    :closeBtn="false"
    :closeOnOverlayClick="false"
    header="Add New Annotate"
    @confirm="handle_add"
    @cancel="closeAdd"
    :showOverlay='false'
    size="30%"
  >
    <t-form :data="annotateData" label-align="top">
      <t-form-item label="Start Time" name="startTime" requiredMark>
        <t-time-range-picker v-model="timeRange" />
      </t-form-item>

      <t-form-item label="Annotate" name="content" requiredMark>
        <t-textarea v-model="annotateData.content" :autosize="{ minRows: 8, maxRows: 8 }" placeholder="please enter annotate." :maxlength="500"></t-textarea>
      </t-form-item>
      <t-form-item label="Annotate Attachment">
        <t-upload
          :size-limit="{ size: 10, unit: 'MB' }"
          :request-method="handle_file"
          :autoUpload="true"
          tips="less than 10MB"
          accept="*"
          @remove="handle_remove"
        />
      </t-form-item>
    </t-form>
  </t-drawer>
</template>

<script setup lang="ts">
import { addResources } from '@/api/modules/resource'
import { MessagePlugin } from 'tdesign-vue-next'
import { computed, ref, watch } from 'vue'
import timePlugin from './timePlugin.vue'
import emitter from '@/utils/mitt'
import { useUserStore } from '@/store/user'
import { uploadFileCom } from '@/api/modules/common'
const userStore = useUserStore()

const url = window.location.href
const caseId = Number(url.split('/')[url.split('/').length - 1])
const props = defineProps({
  addAnnotate: Boolean,
  caseVideoTime_s: String,
  caseVideoTime_e: String,
  caseId: Number,
  caseVideoTime_full: String
})
const emit = defineEmits(['handle_add','getAnnotateStartTime', 'getAnnotateEndTime', 'closeAdd'])
const closeAdd = () => {
  timeRange.value = ''
  emit('closeAdd')
}

const annotateData = ref<any>({})
const handle_add = () => {
  if (timeRange.value) {
    if (secondsSinceMidnight(timeRange.value[0]) > Number(props.caseVideoTime_full)) {
      timeRange.value = ''
      return MessagePlugin.warning('Out of video time')
    } else if(secondsSinceMidnight(timeRange.value[1]) > Number(props.caseVideoTime_full)) {
      timeRange.value = ''
      return MessagePlugin.warning('Out of video time')
    }
    let preJson = {
      text: `${timeRange.value[0]} ~ ${timeRange.value[1]} : ${annotateData.value.content}`,
      file: annotateAttachmentList.value[0],
      creator: userStore?.userInfo?.name
    }
    annotateData.value.caseId = caseId
    annotateData.value.type = 1
    annotateData.value.opened = 0
    annotateData.value.content = JSON.stringify(preJson)
    addResources(annotateData.value)
    .then((res: any)=> {
      if (res.msg == 'success') {

        annotateData.value.type = 3
        addResources(annotateData.value)
        .then((res: any)=> {
          if (res.msg == 'success') {
            annotateData.value = {}
            closeAdd()
            emitter.emit('freshNotes')
            return MessagePlugin.success('Added Successfully')
          }
        })


        // annotateData.value = {}
        // closeAdd()
        // emitter.emit('freshNotes')
        // return MessagePlugin.success('Added Successfully')
      }
    })
    .catch((err)=> {
      console.error(err)
    })
  } else {
    return MessagePlugin.warning('Error Time Type')
  }
}

// const getAnnotateStartTime = () => {
//   console.log('33333', props.caseVideoTime_s)
//   emit('getAnnotateStartTime')
// }
// const getAnnotateEndTime = () => {
//   emit('getAnnotateEndTime')
// }

// setTimeout(()=> {getAnnotateStartTime()}, 50)
// console.log('3333', props.caseVideoTime_full)

const timeRange = ref<any>()

const annotateAttachmentList = ref<any>([])
const handle_file = (e: any) => {
  annotateAttachmentList.value = []
  let tempFileParam = new FormData()
  tempFileParam.append('file', e.raw)
  return new Promise((resolve) => {
    uploadFileCom(tempFileParam)
    .then((res: any)=> {
      if (res.msg === 'success') {
        annotateAttachmentList.value.push({
          name: e.raw.name,
          url: res.data.filePath
        })
      } else {
        return MessagePlugin.warning(res.msg)
      }
    })
    .catch((err: any)=> {
      console.error(err)
    })
    resolve({
      status: 'success'
    })
  })
}
const handle_remove = () => {
  annotateAttachmentList.value = []
} 

const secondsSinceMidnight = (timeStr: any) => {
  const parts = timeStr.split(':').map(Number)
  const [hours, minutes, seconds] = parts
  return hours * 3600 + minutes * 60 + seconds
}

watch(timeRange, (newValue, oldValue)=> {
  // console.log(newValue[0])
  // console.log(newValue[1])
  // if (secondsSinceMidnight(newValue[0]) > Number(props.caseVideoTime_full)) {
  //   timeRange.value = ''
  //   alert('Out of video time')
  // } else if(secondsSinceMidnight(newValue[1]) > Number(props.caseVideoTime_full)) {
  //   timeRange.value = ''
  //   alert('Out of video time')
  // }
}, {
  deep: true
})

// const displayS = computed(()=>{
//   if (selectedS.value) {
//     return selectedS.value
//   } else {
//     return props.caseVideoTime_s
//   }
// })

// const displayE = computed(()=>{
//   if (selectedE.value) {
//     return selectedE.value
//   } else {
//     return props.caseVideoTime_e
//   }
// })

// const selectedS = ref<any>(null)
// const selectedE = ref<any>(null)
// const handle_selectedSTime = (val: any) => {
//   selectedS.value = val
// }
// const handle_selectedETime = (val: any) => {
//   selectedE.value = val
// }

</script>

<style scoped lang="scss"></style>