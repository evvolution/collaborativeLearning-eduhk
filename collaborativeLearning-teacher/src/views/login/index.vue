<template>
  <div class="loginView">
    <div class="section-left">
      <t-swiper class="login-swiper--swiper" animation="fade" :navigation="{ showSlideBtn: 'never', type:'dots' }" :interval="6000" :stopOnHover="false">
        <t-swiper-item>
          <t-image :src="jpgUrl('class0')" fit="cover" class="login-swiper-item" />
        </t-swiper-item>
        <t-swiper-item>
          <t-image :src="jpgUrl('class1')" fit="cover" class="login-swiper-item" />
        </t-swiper-item>
        <t-swiper-item>
          <t-image :src="jpgUrl('class2')" fit="cover" class="login-swiper-item" />
        </t-swiper-item>
      </t-swiper>
    </div>
    <div class="section-right">
      <t-form class="sectionForm" ref="form" :data="loginForm" :colon="true" :label-width="0"  @submit="handleLogin">
        <t-space align="center" class="loginForm">
          <img height="46" src="https://www.eduhk.hk/cms/assets/shared/img/logo_foot.png" alt="logo" />
          Collaborative Learning Teacher
        </t-space>

        <t-form-item name="username">
          <t-input v-model="loginForm.username" clearable size="large" placeholder="please enter your username">
            <template #prefix-icon>
              <desktop-icon />
            </template>
          </t-input>
        </t-form-item>

        <t-form-item name="password">
          <t-input v-model="loginForm.password" type="password" clearable size="large" placeholder="please enter your password">
            <template #prefix-icon>
              <t-icon name="lock-on" />
            </template>
          </t-input>
        </t-form-item>

        <t-form-item name="code" class="mixLine">
          <t-input class="login-code" v-model="loginForm.code" size="large" clearable placeholder="captcha">
            <template #prefix-icon>
              <t-icon name="info-circle" />
            </template>
          </t-input>
          <t-image class="login-code" fit="contain" :src="captchaImg" @click="initCaptcha"/>
        </t-form-item>

        <t-form-item name="uuid" class="unvisible">
          <t-input v-model="loginForm.uuid"></t-input>
        </t-form-item>

        <t-form-item>
          <t-button theme="primary" type="submit" size="large" block>LOGIN</t-button>
        </t-form-item>
      </t-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import router from '@/router'
import { useUserStore } from '@/store/user'
import { pngUrl, jpgUrl } from '@/utils/common'

import { getCaptcha, loginSys } from '@/api/modules/login'
import { useRouterStore } from '@/store/router'

const loginForm = ref({
  username: '',
  password: '',
  code: '',
  uuid: ''
});

const userStore = useUserStore()
const routerStore = useRouterStore()

const handleLogin = () => {
  loginSys(loginForm.value.username, loginForm.value.password, loginForm.value.uuid, loginForm.value.code)
  .then((res: any)=> {
    if (res.code != 200) {
      MessagePlugin.error(res.msg)
      initCaptcha()
    } else {
      MessagePlugin.success('Welcome, ' + res.data.name);
      userStore.setToken(res.data.token)
      userStore.setUserInfo(res.data)
      router.push({
        name: 'Home'
      })
      routerStore.currentMenu = 0
    }
  })
  .catch((err: any)=> {
    console.error(err)
  })
}

const captchaImg = ref()
const initCaptcha = () => {
  loginForm.value.code = ''
  getCaptcha()
  .then((res)=> {
    loginForm.value.uuid = res.data.uuid
    captchaImg.value = res.data.imageBase64
  })
  .catch((err)=> {
    console.error(err)
  })
}

onMounted(()=> {
  initCaptcha()
})

</script>

<style lang="scss" scoped>
.loginView {
  position: fixed;
  display: flex;
  width: 100vw;
  height: 100vh;
  column-gap: 12px;
}

.section-left {
  flex: 1;
  position: relative;
  height: 100vh;
  width: 100%;
}

.login-swiper-item {
  position: relative;
  width: 100%;
  height: 100vh;
  img {
    position: relative;
    width: 100%;
    height: 100vh;
  }
}

.section-right {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loginForm {
  margin-bottom: 24px;
  font-family: hkclass,Arial,PingFangTC,"Microsoft JhengHei revise","Microsoft JhengHei","Microsoft YaHei",sans-serif;
}

.sectionForm {
  width: 320px;
}

.login-code {
  width: 160px;
  height: 40px
}
</style>