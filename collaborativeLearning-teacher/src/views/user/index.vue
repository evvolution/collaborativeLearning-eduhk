<template>
  <div class="user-view commonView">
    <t-tabs theme="card" defaultValue="1">
      <t-tab-panel value="1" label="Roster">
        <rosterList />
      </t-tab-panel>
      <t-tab-panel value="2" label="Group">
        <groupMrg />
      </t-tab-panel>
      <t-tab-panel value="3" label="My Profile">
        <t-card :bordered="false" hover-shadow>
          <template #title><h2>{{userInfos.name}}</h2></template>
          <template #actions>
            <t-space align="end">
              <t-icon name="edit" size="large" @click="visible = true"/>
              <t-avatar shape="round" size="72px" :image="userInfos.head"></t-avatar>
            </t-space>
          </template>
        </t-card>
      </t-tab-panel>
    </t-tabs>
  </div>
  
  <t-drawer 
    v-model:visible="visible" 
    header="User Information Settings" 
    :on-confirm="handleClose" 
    @close="handleClose"
    @confirm="updateTInfo"
    size="large"
  >
    <t-form label-align="top">
      <t-form-item label="Avatar" name="avatar" :initial-data="userInfos.avatar">
        <t-space align="center" breakLine >
          <t-radio-group 
            v-model="userInfos.head"
            size="small" 
            default-value="https://vote.apkhubs.cn/static/avatars/defaultAvatar0.png">
            <t-radio-button 
              :value="item" 
              style="width: 100px; height: 100px; padding: 6px;"
              v-for="item in userAvatars"
              variant="primary-filled"
            >
              <t-image :src="item" style="width: 88px; height: 88px;"></t-image>
            </t-radio-button>
          </t-radio-group>
          <!-- <t-upload
            v-model="userCostumAvatar"
            :image-viewer-props="true"
            :size-limit="{ size: 200, unit: 'KB' }"
            :action="handle_avatarUpload"
            theme="image"
            tips="Upload your avatar"
            accept="image/*"
            :show-image-file-name="true"
            :upload-all-files-in-one-request="true"
            :locale="{
              triggerUploadText: {
                image: 'your avatar',
              },
            }"
            @onSelectChange="handle_file"
          >
          </t-upload> -->
        </t-space>
      </t-form-item>
      <t-form-item label="User Name" name="userName" :initial-data="userInfos.username">
        <t-input v-model="userInfos.username" disabled/>
      </t-form-item>
      <t-form-item label="Name" name="name" :initial-data="userInfos.name">
        <t-input placeholder="Please input your name..." v-model="userInfos.name"/>
      </t-form-item>
      <!-- <t-form-item label="Email" name="email" :initial-data="userInfos.email">
        <t-input placeholder="Please input your email..." v-model="userInfos.email"/>
      </t-form-item>
      <t-form-item label="Introduction" name="introduction" :initial-data="userInfos.introduction">
        <t-textarea
          v-model="userInfos.introduction"
          placeholder="Please input your introduction..."
          name="description"
          :autosize="{ minRows: 5, maxRows: 8 }"
        />
      </t-form-item> -->
    </t-form>
  </t-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { pngUrl, jpgUrl } from '@/utils/common'
import { uploadFileCom } from '@/api/modules/common'

import rosterList from './roster.vue'
import groupMrg from './group.vue'

import { useUserStore } from '@/store/user'
import { updateInfo } from '@/api/modules/users'
const userStore = useUserStore()
const userInfos = userStore.userInfo

const visible = ref(false)
const handleClose = () => {
  visible.value = false
}

const userCostumAvatar = ref([])
const userAvatars = ref<any>([])
const initDefaultUserAvatars = () => {
  for ( let i = 0; i < 74; i++ ) {
    userAvatars.value.push(pngUrl(`defaultAvatar${i}`))
  } 
}

const fileParam = ref()
const handle_file = (e: any) => {
  fileParam.value = new FormData()
  fileParam.value.append('key', "file")
  fileParam.value.append('type', "file")
  fileParam.value.append('src', e.file)
  console.log(e)
  console.log(fileParam.value)
}
const handle_avatarUpload = () => {
  uploadFileCom(fileParam.value)
}

initDefaultUserAvatars()

const updateTInfo = () => {
  updateInfo(userInfos)
  .then((res)=> {
    MessagePlugin.success('Updated')
    handleClose()
  })
}

</script>

<style scoped>
.user-view {
  position: relative;
  padding: 12px;
}
</style>