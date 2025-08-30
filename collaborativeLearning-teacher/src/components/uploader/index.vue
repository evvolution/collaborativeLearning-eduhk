<template>
  <t-upload
    :theme="settings?.theme"
    :tips="settings?.tip"
    :size-limit="settings?.fileSize"
    :max="settings?.fileCount"
    :multiple="settings?.isMultiple"
    :auto-upload="settings?.isAuto"

    v-model="uploadedData.display"
    :request-method="handle_fileUpload"
    :upload-all-files-in-one-request="true"
    @change="handle_uploadListTrans"
  >
    <template #fileListDisplay>
      <t-card
        v-for="item in uploadedData.display"
        :bordered="false"
        hover-shadow
      >
        <t-space align="center">
          {{ item.name }}
          <t-icon v-if="uploadedData.display && uploadedData.display.length == 1" 
          name="close" @click="clearFilesList"/>
        </t-space>
      </t-card>
      <div v-if="uploadedData.display && uploadedData.display.length > 1">
        <t-button variant="text" theme="primary" @click="clearFilesList">
          <template #icon>
            <t-icon name="close" />
          </template>
            Clear All
        </t-button>
      </div>
    </template>
  </t-upload>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadFileCom } from '@/api/modules/common'
import { LoadingPlugin } from 'tdesign-vue-next'
import { useSettingStore } from '@/store/setting'

const props = defineProps({
  settings: Object
})
const emit = defineEmits(['handle_getUploadUrl', 'handle_uploadListTrans'])

const handle_getUploadUrl = () => {
  emit('handle_getUploadUrl', uploadedData.value)
}

// 上传展示和返回url
const uploadedData: any = ref({
  display: [],
  data: []
})

// 执行上传
const handle_fileUpload = (uploadData: any) => {
  console.log('e-upload', uploadData)
  // LoadingPlugin(true);
  useSettingStore().allLoading = true
  for (let i = 0; i < uploadData.length; i++) {
    let tempParam = new FormData()
    tempParam.append('file', uploadData[i])
    if (i == uploadData.length - 1) {
      return new Promise((resolve, rejects) => {
        uploadFileCom(tempParam)
        .then((res: any)=> {
          if (res.msg === 'success') {
            uploadedData.value.data.push(res.data.filePath)
            // LoadingPlugin(false);
            useSettingStore().allLoading = false
            handle_getUploadUrl()
          }
        })
        .catch((err: any)=> {
          console.error(err)
        })
        resolve({status: 'success'})
        rejects({status: 'fail'})
      })
    } else {
      new Promise((resolve, rejects) => {
        uploadFileCom(tempParam)
        .then((res: any)=> {
          if (res.msg === 'success') {
            uploadedData.value.data.push(res.data.filePath)
            handle_getUploadUrl()
          }
        })
        .catch((err: any)=> {
          console.error(err)
        })
        resolve({status: 'success'})
        rejects({status: 'fail'})
      })
    }
  }
}

// 选择文件后传输给父组件进行判断
const handle_uploadListTrans = (e: any) => {
  emit('handle_uploadListTrans', e)
}

// 清除当前已选择文件列表
const clearFilesList = () => {
  uploadedData.value = {
    display: [],
    data: []
  }
}

// 用于父组件调用
defineExpose({
  handle_fileUpload,
  clearFilesList
})

</script>

<style lang="scss" scoped>
</style>