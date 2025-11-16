<template>
  <t-dialog 
    :visible="editCase"
    :closeBtn="false"
    :closeOnOverlayClick="false"
    top="50px"
    width="50vw"
    @opened="getEditDetail"
  >
    <template #header>
      <t-space align="center">
        <t-tag theme="primary" default="EDITING"></t-tag> {{editCaseData.name}}
      </t-space>
    </template>
    <t-form :data="editCaseData" label-align="top">
      <t-space style="width: 100%;">
        <t-space direction="vertical" style="width: 100%;">
          <t-form-item label="Title" name="name" requiredMark>
            <t-input v-model="editCaseData.name" clearable></t-input>
          </t-form-item>
          <t-form-item label="Description" name="description" requiredMark>
            <t-textarea v-model="editCaseData.description" :autosize="{ minRows: 3, maxRows: 5 }" placeholder="please enter desc." :maxlength="200"></t-textarea>
          </t-form-item>

          <t-form-item label="Sno" name="sno" requiredMark>
            <t-input v-model="editCaseData.sno" tips="Sort by number in descending order."></t-input>
          </t-form-item>
          <t-form-item label="State" name="state" requiredMark>
            <t-radio-group v-model="editCaseData.state">
              <t-radio :value="1">Enable</t-radio>
              <t-radio :value="0">Disable</t-radio>
            </t-radio-group>
          </t-form-item>
        </t-space>  

        <t-form-item label="Uploaded Files" name="mix" v-if="!isReUpload">
          <t-space direction="vertical" style="width: 100%;">
            <t-tag default="Video" theme="primary" variant="outline"/>
            <video :src="editCaseData.video" controls style="width: 100%; height: 200px;"></video>
            <t-tag default="Attachment(s)" theme="primary" variant="outline"/>
            <t-space align="center" breakLine>
              <t-button variant="text" v-for="item in editCaseData.attachmentList" @click="getAttachment(item)" :content="item.name">
                <template #icon><t-icon name="file-attachment" ></t-icon></template>
              </t-button>
            </t-space>
            <t-button content="Clear All Files And Reupload" block theme="warning" @click="clearUploadedFiles"/>
          </t-space>
        </t-form-item>
        <template v-else>
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
        </template>
      </t-space>
    </t-form>
    <template #footer>
      <t-space align="center">
        <t-button default="Cancel" theme="default" @click="cancelEdit"></t-button>
        <t-button default="Save" @click="uploadBeforeEditSave"></t-button>
      </t-space>
    </template>
  </t-dialog>
  <t-loading :loading="uploadStateLoading" text="editing..." fullscreen />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MyUploader from '@/components/uploader/index.vue'
import type { uploaderSettings } from '@/models/common'
import { DialogPlugin, MessagePlugin, type DialogInstance } from 'tdesign-vue-next'
import { updateNewCase, getCaseDetail } from '@/api/modules/case'

const props = defineProps({
  editCase: Boolean,
  editCaseId: Number
})

const editCaseData = ref<any>({
  name: '',
  description: '',
  sno: 0,
  // startTime: '',
  // endTime: '',
  video: '',
  attachmentList: [
    {
      "caseId": 0,
      "createTime": "",
      "id": 0,
      "name": "",
      "path": ""
    }
  ]
})
const timePeriod = ref<any>([])

const getEditDetail = () => {
  if (props.editCaseId) {
    getCaseDetail(props.editCaseId)
    .then((res)=> {
      console.log(res)
      editCaseData.value = res.data
      // timePeriod.value = [timeStamp2time(res.data.startTime), timeStamp2time(res.data.endTime)]
    })
  }
}

const getAttachment = (item: any) => {
  window.location.href = item.path
}
const isReUpload = ref(false)
const clearUploadedFiles = () => {
  editCaseData.value.video = ''
  editCaseData.value.attachmentList = []
  isReUpload.value = true
}

const emit = defineEmits(['cancelEdit', 'closeEdit'])
const cancelEdit = () => {
  emit('cancelEdit', false)
}
const closeEdit = () => {
  emit('closeEdit')
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

const getFilePath_video = (val: any) => {
  uploaderData_video.value = val
  editCaseData.value.video = val.data[0]
}

const getFilePath_attachment = (val: any) => {
  uploaderData_attachment.value = val
  for (let i = 0; i < val.data.length; i++) {
    editCaseData.value.attachmentList[i] = {
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
let e_confirm: DialogInstance | null = null
const uploadBeforeEditSave = () => {
  if ( isReUpload.value ) {
    if (uploaderData_video.value.length == 0) {
      return MessagePlugin.warning('please upload the case video222') 
    }
    uploadStateLoading.value = true
    const promises = [
      videoUploader.value.handle_fileUpload(uploaderData_video.value),
      attachmentUploader.value.handle_fileUpload(uploaderData_attachment.value)
    ]
    Promise.all(promises)
    .then(results => {
      let donePromise: any = []
      results.forEach((result: any) => {
        if (result.status == 'success') {
          donePromise.push(1)
        } else {
          donePromise.push(0)
        }
      })
      if (!donePromise.includes(0)) {
        uploadStateLoading.value = false
        doubleConfirmEdit()
      }
    })
  } else {
    doubleConfirmEdit()
  }
}

const doubleConfirmEdit = () => {
  e_confirm = DialogPlugin.confirm({
    header: `Editing ${editCaseData.value.name}`,
    body: 'Are you sure to EDIT current case?',
    confirmBtn: 'ok',
    cancelBtn: 'cancel',
    onConfirm: () => {
      edit()
      e_confirm?.hide()
    },
    onClose: () => {
      if (isReUpload) {
        initPreUpload()
        initReceiveUpload()
        MessagePlugin.warning('You need to reupload files')
      } 
      e_confirm?.hide()
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

const edit = () => {
  if (editCaseData.value.name == '') {
    return MessagePlugin.warning('please set the case title')
  }
  if (editCaseData.value.description == '') {
    return MessagePlugin.warning('please set the case desc.')
  }
  if (editCaseData.value.video == '') {
    return MessagePlugin.warning('please upload the case video111')
  }

  console.log('presendData:', editCaseData.value)
  updateNewCase(editCaseData.value)
  .then((res: any) => {
    console.log(res)
    if (res.msg == 'success') {
      MessagePlugin.success('Case Modified')
      closeEdit()
    }
  })
  .catch((err)=> {
    console.error(err)
  })
}

defineExpose({ 
  edit
})
</script>

<style lang="scss" scoped></style>