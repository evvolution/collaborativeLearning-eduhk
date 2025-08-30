<template>
  <t-layout>
    <t-aside class="menu"><menuBar /></t-aside>
    <t-layout>
      <t-header><navBar /></t-header>
      <t-content>
        <!-- <t-watermark
          :watermark-content="{ text: userStore.userInfo.name }"
          :y="120"
          :x="80"
          :width="200"
          :height="100"
        >  -->
          <content />
        <!-- </t-watermark> -->
      </t-content>
    </t-layout>
  </t-layout>
  <div class="full_loading" v-if="settingStore.allLoading">
    <t-loading text="loading..." fullscreen />
  </div>
</template>

<script setup lang="ts">
import navBar from './components/navBar.vue'
import menuBar from './components/menu.vue'
import content from './components/content.vue'
// import footerLine from './components/footer.vue'

import { useUserStore } from '@/store/user'
const userStore = useUserStore()
import { useSettingStore } from '@/store/setting'
const settingStore = useSettingStore()
</script>

<style scoped>
.menu {
  width: auto;
  height: 100vh;
}
.full_loading {
  position: fixed;
  background-color: #ffffff80;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
}
</style>