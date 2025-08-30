<template>
  <t-head-menu>
    <template #operations>
      <!-- <t-dropdown>
        <t-button variant="text">
          language
        </t-button>
        <t-dropdown-menu>
          <t-dropdown-item :value="1" @click="setLanguage">CN</t-dropdown-item>
          <t-dropdown-item :value="2" @click="setLanguage">CN-hk</t-dropdown-item>
          <t-dropdown-item :value="3" @click="setLanguage">EN</t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown> -->
      <t-dropdown>
        <t-button variant="text">
          {{userStore?.userInfo.name}}
        </t-button>
        <t-dropdown-menu>
          <!-- <t-dropdown-item :value="1" @click="getProfile"><template #prefixIcon><t-icon name="user" /></template>User</t-dropdown-item> -->
          <t-dropdown-item :value="2" @click="handle_logout"><template #prefixIcon><t-icon name="logout" /></template>Logout</t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown>
    </template>
  </t-head-menu>
  <t-dialog
    placement="center"
    header="LOGOUT"
    body="Are you sure to logout?"
    :visible="logoutmodal"
    :on-confirm="logout"
    :on-close="handle_logout_close"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

import { useUserStore } from '@/store/user'
const userStore = useUserStore()
import { useRouterStore } from '@/store/router'
const routerStore = useRouterStore()

const logoutmodal = ref(false)
const handle_logout = () => {
  logoutmodal.value = true
}
const handle_logout_close = () => {
  logoutmodal.value = false
}

const logout = async () => {
  await userStore.Logout()
  MessagePlugin.info('Logout')
  router.push({ path: '/login', query: { redirect: route.fullPath } })
}

const getProfile = () => {
  router.push({ path: '/user', query: { redirect: route.fullPath } })
  routerStore.currentMenu = 6
}


// 切换语言
const setLanguage = () => {

}

onMounted(()=> {
  
})
</script>