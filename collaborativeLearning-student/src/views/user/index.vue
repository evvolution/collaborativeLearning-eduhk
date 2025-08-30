<template>
  <div class="userView commonView">
    <t-card :bordered="false" hover-shadow>
      <template #title><h2>{{userInfos.name}}</h2></template>
      <template #actions>
        <t-space align="end">
          <t-icon name="user-password" size="large" @click="showPwd = true"/>
          <t-icon name="edit-2" size="large" @click="infoVisible = true"/>
          <t-avatar shape="round" size="72px" :image="userInfos.head"></t-avatar>
        </t-space>
      </template>
      <t-descriptions column="1">
        <t-descriptions-item label="Email">{{userInfos.email}}</t-descriptions-item>
        <t-descriptions-item label="Group">{{userInfos.groupName}}</t-descriptions-item>
        <t-descriptions-item label="Introduction">{{userInfos.introduction}}</t-descriptions-item>
      </t-descriptions>
    </t-card>
  </div>
  
  <t-dialog
    v-model:visible="showPwd"
    header="Change Password"
    :destroyOnClose="true"
    @confirm="changePwd"
    @cancel="showPwd = false"
  >
    <t-form label-align="top">
      <t-form-item label="New Password">
        <t-input v-model="pwd" type="password" />
      </t-form-item>
      <t-form-item label="Confirm Password">
        <t-input v-model="pwd_c" type="password" />
      </t-form-item>
    </t-form>
  </t-dialog>

  <t-drawer 
    v-model:visible="infoVisible" 
    header="User Information Settings" 
    @confirm="handleUpdate" 
    @close="handleClose"
    size="large"
    :closeOnOverlayClick="false"
  >
    <t-form label-align="top">
      <t-form-item label="Upload Your Avatar" name="avatar">
        <t-space align="center" breakLine >
          <!-- <t-upload
            v-model="userDefaultAList"
            :image-viewer-props="true"
            :size-limit="{ size: 200, unit: 'KB' }"
            :request-method="handle_file"
            theme="image"
            tips="less than 200KB"
            accept="image/*"
            :show-image-file-name="true"
            :upload-all-files-in-one-request="true"
            :locale="{
              triggerUploadText: {
                image: 'your avatar',
              },
            }"
          >
          </t-upload> -->
          <t-radio-group 
            size="small" 
            @change="getCurrentRadio"
            :defaultValue="userDefaultPic"
          >
            <t-radio-button 
              :value="item" 
              style="width: 100px; height: 100px; padding: 6px;"
              v-for="item in userDefaultAvatars"
              variant="primary-filled"
            >
              <t-image :src="item" style="width: 88px; height: 88px;"></t-image>
            </t-radio-button>
          </t-radio-group>

        </t-space>
      </t-form-item>
      <t-form-item label="User Name" name="userName" :initial-data="userInfos.username">
        <t-input v-model="userInfos.username" disabled/>
      </t-form-item>
      <t-form-item label="Name" name="name" :initial-data="userInfos.name">
        <t-input placeholder="Please input your name..." v-model="userInfos.name"/>
      </t-form-item>
      <t-form-item label="Email" name="email" :initial-data="userInfos.email">
        <t-input placeholder="Please input your email..." v-model="userInfos.email"/>
      </t-form-item>
      <t-form-item label="Introduction" name="introduction" :initial-data="userInfos.introduction">
        <t-textarea
          v-model="userInfos.introduction"
          placeholder="Please input your introduction..."
          name="description"
          :autosize="{ minRows: 5, maxRows: 8 }"
        />
      </t-form-item>
    </t-form>
  </t-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MessagePlugin, NotifyPlugin,type UploadProps } from 'tdesign-vue-next'
import { pngUrl } from '@/utils/common'
import { uploadFileCom } from '@/api/modules/common'
import { updateUsrInfo } from '@/api/modules/usr'

import { useUserStore } from '@/store/user'
import { logoutSys } from '@/api/modules/login'
import { RESEETSTORE } from '@/utils/reset'
import router from '@/router'
const userStore = useUserStore()
const userInfos = userStore.userInfo
const orgUsrInfo = JSON.parse(JSON.stringify(userInfos))

const infoVisible = ref(false)

const handleClose = () => {
  userInfos.email = orgUsrInfo.email
  userInfos.head = orgUsrInfo.head
  userInfos.introduction = orgUsrInfo.introduction
  userInfos.name = orgUsrInfo.name
  infoVisible.value = false
}
const handleUpdate = () => {

  let updateParam = {
    "email": userInfos.email,
    "head": usrAvatar.value,
    "id": userInfos.id,
    "introduction": userInfos.introduction,
    "name": userInfos.name,
  }
  if (updateParam.email == '') {
    NotifyPlugin('warning', { title: 'EMAIL IS BLANK', content: 'Please input your email' })
    return
  }
  if (updateParam.head == '') {
    NotifyPlugin('warning', { title: 'AVATAR IS BLANK', content: 'Please set your avatar' })
    return
  }

  if (updateParam.introduction == '') {
    NotifyPlugin('warning', { title: 'INTRODUCTION IS BLANK', content: 'Please input your introduction' })
    return
  }

  if (updateParam.name == '') {
    NotifyPlugin('warning', { title: 'NAME IS BLANK', content: 'Please input your name' })
    return
  }
  
  updateUsrInfo(updateParam)
  .then((res: any)=> {
    if (res.code == 200) {
      infoVisible.value = false
      NotifyPlugin('success', { 
        title: 'UPDATE SUCCESSFULLY', 
        content: 'You have updated your infomation.',
        duration: 1500,
      })
    }
  })
  .catch((err)=>{
    console.error(err)
  })
}

const usrAvatar = ref()
const userDefaultAList = ref<UploadProps['value']>([])
const userDefaultPic = ref()
const userDefaultAvatars = ref<any>([])
const initDefaultUserAvatars = () => {
  for ( let i = 0; i < 74; i++ ) {
    userDefaultAvatars.value.push(pngUrl(`defaultAvatar${i}`))
  } 
  if (userInfos.head.includes('defaultAvatar')) {
    userDefaultPic.value = userInfos.head
  } else {
    userDefaultAList.value?.push({
      url: userInfos.head
    })
  }
}

const getCurrentRadio = (e: any) => {
  usrAvatar.value = e
  userInfos.head = e
}

const handle_file = (e: any) => {
  let tempFileParam = new FormData()
  tempFileParam.append('file', e.raw)
  return new Promise((resolve) => {
    uploadFileCom(tempFileParam)
    .then((res: any)=> {
      console.log(res)
      if (res.msg === 'success') {
        usrAvatar.value = res.data.filePath
        userInfos.head = res.data.filePath
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

const showPwd = ref(false)
const changePwd = () => {
  if(pwd.value != pwd_c.value) {
    return MessagePlugin.warning('Please set same password')
  }
  userInfos.password = pwd.value
  updateUsrInfo(userInfos)
  .then(async (res)=> {
    MessagePlugin.success('Please relogin')
    logoutSys()
    RESEETSTORE()
    router.push({name: 'Login'})
  })
}

const pwd = ref<any>()
const pwd_c = ref<any>()

// 初始化默认头像
initDefaultUserAvatars()
</script>

<style scoped>
.userView {
  position: relative;
  width: 50%;
  height: calc(100vh - 108px);
  margin: 12px auto;
  padding: 12px;
}
</style>