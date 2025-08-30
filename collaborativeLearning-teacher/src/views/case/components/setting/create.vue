<template>
  <t-dialog 
    :visible="createCase"
    :closeBtn="false"
    :closeOnOverlayClick="false"
    header="Create New Case"
    width="50%"
    :destroyOnClose="true"
  >
    <t-form :data="newCaseData" label-align="top">
      <t-row :gutter="12" style="width: 100%;">
        <t-col :span="6">
          <t-form-item label="Title" name="name" requiredMark>
            <t-input v-model="newCaseData.name" clearable></t-input>
          </t-form-item>
          <t-form-item label="Description" name="description" requiredMark>
            <t-textarea v-model="newCaseData.description" :autosize="{ minRows: 3, maxRows: 5 }" placeholder="please enter desc." :maxlength="200"></t-textarea>
          </t-form-item>
          <!-- <t-form-item label="Period" name="period" requiredMark>
            <t-date-range-picker allow-input clearable @pick="onPick"/>
          </t-form-item> -->
        </t-col>
        <t-col :span="6">
          <t-form-item label="Video" name="video" requiredMark>
            <MyUploader 
              ref="videoUploader" 
              :settings="uploaderSettingVideo" 
              @handle_upload-list-trans="getFileData_video" 
              @handle_get-upload-url="getFilePath_video"
            />
          </t-form-item>
          <t-form-item label="Attachment(s)" name="attachment">
            <MyUploader 
              ref="attachmentUploader" 
              :settings="uploaderSettingAattachment"
              @handle_upload-list-trans="getFileData_attachment" 
              @handle_get-upload-url="getFilePath_attachment" 
            />
          </t-form-item>
        </t-col>
      </t-row>
    </t-form>
    <template #footer>
      <t-space align="center">
        <t-button default="Cancel" theme="default" @click="cancelCreate"></t-button>
        <t-button default="Create" @click="uploadBeforeCreate"></t-button>
      </t-space>
    </template>
  </t-dialog>
  <t-loading :loading="uploadStateLoading" text="createing..." fullscreen />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MyUploader from '@/components/uploader/index.vue'
import type { uploaderSettings } from '@/models/common'
import { DialogPlugin, MessagePlugin, type DialogInstance } from 'tdesign-vue-next'
import { createNewCase } from '@/api/modules/case'

const props = defineProps({
  createCase: Boolean
})
const emit = defineEmits(['cancelCreate', 'closeCreate'])

const cancelCreate = () => {
  emit('cancelCreate', false)
}

const closeCreate = () => {
  newCaseData.value = {
    name: '',
    description: '',
    video: '',
    attachmentList: []
  }
  uploaderData_video.value = []
  uploaderData_attachment.value = []
  videoUploader.value.clearFilesList()
  attachmentUploader.value.clearFilesList()
  emit('closeCreate')
}

const uploaderSettingVideo = ref<uploaderSettings>({
  tip: 'less than 500MB, only one',
  fileSize: { size: 500, unit: 'MB' },
  fileCount: 1,
  isAuto: false,
  isImageType: false,
  isMultiple: false,
})

const uploaderSettingAattachment = ref<uploaderSettings>({
  tip: 'each file less than 10MB, no more than 5 files',
  fileSize: { size: 10, unit: 'MB' },
  fileCount: 5,
  isAuto: false,
  isImageType: false,
  isMultiple: true,
})

const newCaseData: any = ref({
  name: '',
  description: '',
  video: '',
  attachmentList: []
})

const getFilePath_video = (val: any) => {
  uploaderData_video.value = val
  newCaseData.value.video = val.data[0]
}

const getFilePath_attachment = (val: any) => {
  uploaderData_attachment.value = val
  for (let i = 0; i < val.data.length; i++) {
    newCaseData.value.attachmentList[i] = {
      "name": val.display[i].name,
      "path": val.data[i]
    }
  }
}

const uploaderData_video = ref<any>([])
const uploaderData_attachment = ref<any>([])
const videoUploader = ref<any>()
const attachmentUploader = ref<any>()

const getFileData_video = (val: any) => {
  for (let i = 0; i < val.length; i++) {
    uploaderData_video.value[i] = val[i].raw
  }
}

const getFileData_attachment = (val: any) => {
  for (let i = 0; i < val.length; i++) {
    uploaderData_attachment.value[i] = val[i].raw
  }
}

const uploadStateLoading = ref(false)
let c_confirm: DialogInstance | null = null
const uploadBeforeCreate = () => {
  if (uploaderData_video.value.length == 0) {
    return MessagePlugin.warning('please upload the case video') 
  }
  uploadStateLoading.value = true
  let promisesArr: any[] = []
  if (uploaderData_attachment.value.length == 0) {
    promisesArr = [
      videoUploader.value.handle_fileUpload(uploaderData_video.value)
    ]
  } else {
    promisesArr = [
      videoUploader.value.handle_fileUpload(uploaderData_video.value),
      attachmentUploader.value.handle_fileUpload(uploaderData_attachment.value)
    ]
  }
  Promise.all(promisesArr)
  .then(results => {
    let donePromise: any = []
    results.forEach((result: any) => {
      console.log(result)
      if (result.status == 'success') {
        donePromise.push(1)
      } else {
        donePromise.push(0)
      }
    })
    if (!donePromise.includes(0)) {
      uploadStateLoading.value = false
      c_confirm =  DialogPlugin.confirm({
        header: 'Creating New Case',
        body: 'Are you sure to Creating it?',
        confirmBtn: 'ok',
        cancelBtn: 'cancel',
        onConfirm: () => {
          create()
          c_confirm?.hide()
        },
        onClose: () => {
          initPreUpload()
          initReceiveUpload()
          MessagePlugin.warning('You need to reupload files')
          c_confirm?.hide()
        }
      })
    }
  })
}

const initPreUpload = () => {
  videoUploader.value.clearFilesList()
  attachmentUploader.value.clearFilesList()
}

const initReceiveUpload = () => {
  uploaderData_video.value = []
  uploaderData_attachment.value = []
}

const create = () => {
  if (newCaseData.value.name == '') {
    return MessagePlugin.warning('please set the case title')
  }
  if (newCaseData.value.description == '') {
    return MessagePlugin.warning('please set the case desc.')
  }
  if (newCaseData.value.video == '') {
    return MessagePlugin.warning('please upload the case video')
  }
  
  console.log('presendData:', newCaseData.value)
  createNewCase(newCaseData.value)
  .then((res: any) => {
    console.log(res)
    if (res.msg == 'success') {
      MessagePlugin.success('Case Created')
      closeCreate()
    }
  })
  .catch((err)=> {
    console.error(err)
  })
}

// const onPick = (value: any, context: { partial: string }) => {
//   if (context.partial == 'start') {
//     newCaseData.value.startTime = value.getTime()
//   }
//   if (context.partial == 'end') {
//     newCaseData.value.endTime = value.getTime()
//   }
// }

defineExpose({ 
  create
})
</script>

<style lang="scss" scoped></style>