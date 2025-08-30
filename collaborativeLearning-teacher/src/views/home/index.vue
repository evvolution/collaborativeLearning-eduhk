<template>
  <div class="home-view">
    <div class="quick-info">
      Welcome! {{userStore.userInfo.name}}
    </div>
    <div class="quick-entrance-content">
      <div class="quick-entrance" @click="handle_quickJump('Case', 1)">
        <t-image :src="jpgUrl('common/c2')" :fit="'fill'"  class="quick-image"/>
        <t-comment author="Cases" />
      </div>
      <div class="quick-entrance" @click="handle_quickJump('Data', 3)">
        <t-image :src="jpgUrl('common/c3')" :fit="'fill'"  class="quick-image"/>
        <t-comment author="Datas" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { jpgUrl } from '@/utils/common'
import { useUserStore } from '@/store/user'
import { useRouterStore } from '@/store/router'
import router from '@/router';
const userStore = useUserStore()
const routerStore = useRouterStore()

const handle_quickJump = (target: string, mIndex: number) => {
  router.push({name: target})
  routerStore.currentMenu = mIndex
}
</script>
<style scoped lang="scss">
.home-view {
  position: relative;
  height: calc(100vh - 56px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.quick-info {
  padding-bottom: 5vh;
  font-size: 1.5vw;
  line-height: 1.6vw;
  font-weight: bold;
  color: #fff;
  background: -webkit-linear-gradient(45deg, #f26326, #006437);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.quick-entrance-content {
  display: flex;
  column-gap: 2vw;
}

.quick-entrance {
  padding: 16px;
}

.quick-entrance:hover {
  border: 2px solid;
  border-image: linear-gradient(to right, #8f41e9, #578aef) 1;
  cursor: pointer;
}

.quick-image {
  width: 320px;
  height: 180px;
  margin-bottom: 12px;
}
</style>