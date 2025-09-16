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
      <t-form-item label="Time" name="startTime">
        <t-time-range-picker v-model="timeRange" />
        <!-- <t-space direction="vertical"> -->
          <!-- <t-input-adornment> -->
            <!-- <template #append>
              <t-button default="Set Start Time" theme="default" @click="getAnnotateStartTime"></t-button>
            </template> -->
            <!-- <t-input v-model="displayS" clearable placeholder="please set start time, e.g. 11:22" /> -->
          <!-- </t-input-adornment> -->
          <!-- <timePlugin :time-data="caseVideoTime_full" :type="0" @get-start="handle_selectedSTime"/> -->
        <!-- </t-space> -->
      </t-form-item>
      <!-- <t-form-item label="End Time" name="endTime" requiredMark> -->
        <!-- <t-space direction="vertical"> -->
          <!-- <t-input-adornment> -->
            <!-- <template #append>
              <t-button default="Set End Time" theme="default" @click="getAnnotateEndTime"></t-button>
            </template> -->
          <!-- <t-input v-model="displayE" clearable placeholder="please set end time, e.g. 11:22" /> -->
          <!-- </t-input-adornment> -->
          <!-- <timePlugin :time-data="caseVideoTime_full" :type="1" @get-end="handle_selectedETime"/> -->
        <!-- </t-space> -->
      <!-- </t-form-item> -->

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
  displayE.value = ''
  displayS.value = ''
  emit('closeAdd')
}

const timeRange = ref<any>()

const annotateData = ref<any>({})
const handle_add = () => {
  let preJson = {}
  if (timeRange.value) {
    preJson = {
      // text: `${Number(props.caseVideoTime_s).toFixed(0)}s   ~ ${Number(props.caseVideoTime_e).toFixed(0)}s : ${annotateData.value.content}`,
      text: `${timeRange.value[0]} ~ ${timeRange.value[1]} : ${annotateData.value.content}`,
      file: annotateAttachmentList.value[0],
      creator: userStore?.userInfo?.name
    }
  } else {
    preJson = {
      // text: `${Number(props.caseVideoTime_s).toFixed(0)}s   ~ ${Number(props.caseVideoTime_e).toFixed(0)}s : ${annotateData.value.content}`,
      text: `00:00:00 ~ 00:00:00 : ${annotateData.value.content}`,
      file: annotateAttachmentList.value[0],
      creator: userStore?.userInfo?.name
    }
  }
  annotateData.value.caseId = caseId
  annotateData.value.type = 1
  annotateData.value.opened = 0
  annotateData.value.content = JSON.stringify(preJson)
  addResources(annotateData.value)
  .then((res: any)=> {
    if (res.msg == 'success') {
      annotateData.value = {}
      closeAdd()
      emitter.emit('freshNotes')
      return MessagePlugin.success('Added Successfully')
    }
  })
  .catch((err)=> {
    console.error(err)
  })
}
const getAnnotateStartTime = () => {
  emit('getAnnotateStartTime')
}
const getAnnotateEndTime = () => {
  emit('getAnnotateEndTime')
}

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

const displayS = ref()
const displayE = ref()
const allowSaveS = ref(false)
const allowSaveE = ref(false)
watch(displayS, (newValue, oldValue)=> {
  if (/^[0-9:]+$/.test(displayS.value)) {
    allowSaveS.value = true
  } else {
    allowSaveS.value = false
  }
}, {
  deep: true
})

watch(displayE, (newValue, oldValue)=> {
  if (/^[0-9:]+$/.test(displayE.value)) {
    allowSaveE.value = true
  } else {
    allowSaveE.value = false
  }
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

const selectedS = ref<any>(null)
const selectedE = ref<any>(null)
const handle_selectedSTime = (val: any) => {
  selectedS.value = val
}
const handle_selectedETime = (val: any) => {
  selectedE.value = val
}

</script>

<style scoped lang="scss"></style>