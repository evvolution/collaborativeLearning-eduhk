<template>
  <div class="home-view">
    <div class="quick-info">
      Welcome! {{userStore.userInfo.name}}
    </div>
    <div class="quick-entrance-content">
      <div class="quick-entrance qStart" @click="toSurvey">
        <t-image :src="cover_start" :fit="'fill'" class="quick-image"/>
        <t-comment author="Survey" />
      </div>

      <div class="quick-entrance q0" @click="quickGo('Case', 1)">
        <t-image :src="cover_task" :fit="'fill'" class="quick-image"/>
        <t-comment author="Cases" />
      </div>
      <div class="quick-entrance q1" @click="quickGo('Resource', 2)">
        <t-image :src="cover_resource" :fit="'fill'" class="quick-image"/>
        <t-comment author="Resource" />
      </div>
      <div class="quick-entrance q2" @click="quickGo('Data', 3)">
        <t-image :src="cover_Datas" :fit="'fill'" class="quick-image"/>
        <t-comment author="Datas" />
      </div>
    </div>
    <!-- <div class="guide-show" @click="display_guide">Show Guide</div> -->
     <div class="guide-show">
        <t-button theme="primary" variant="text" content="Guide" @click="display_guide">
          <template #icon><t-icon name="help-circle" /></template>
        </t-button>
     </div>
  </div>
  <t-guide
    v-model="currentGuide"
    :steps="steps"
    @finish="handle_finish"
    @skip="handle_Skip"
  />
  <t-dialog 
    v-model:visible="nomoreguide"
    header="Close Guide"
    body="Don't show home guide any more"
    @confirm="setGuideNomore"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { pngUrl, jpgUrl } from '@/utils/common'
const cover_start = pngUrl('qstart')
const cover_task = jpgUrl('c1')
const cover_resource = jpgUrl('c2')
const cover_Datas = jpgUrl('c3')
console.log(cover_start)
import router from '@/router'
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
import { useRouterStore } from '@/store/router'

const routerStore = useRouterStore()

const toSurvey = () => {
  router.push({name: 'survey'})
}

const quickGo = (name: any, index: number) => {

  router.push({name: name})
}

const nomoreguide = ref(false)
const currentGuide = ref(-1)
const steps = [
  {
    element: '.qStart',
    title: 'Quick Entrance',
    body: 'Click me and visit the survey',
    placement: 'bottom-right',
  },
  {
    element: '.q0',
    title: 'Quick Entrance',
    body: 'Click me and visit the cases page',
    placement: 'bottom-right',
  },
  {
    element: '.q1',
    title: 'Quick Entrance',
    body: 'Click me and visit the resource page',
    placement: 'bottom-right',
  },
  {
    element: '.q2',
    title: 'Quick Entrance',
    body: 'Click me and visit the data page(developing)',
    placement: 'bottom-right',
  },
]

const handle_finish = () => {
  if (!localStorage.getItem('homeNoMore')) {
    nomoreguide.value = true
  }
}

const handle_Skip = () => {
  localStorage.setItem('homeNoMore', '1')
  nomoreguide.value = false
}

const setGuideNomore = () => {
  localStorage.setItem('homeNoMore', '1')
  nomoreguide.value = false
}

const initGuide_home = () => {
  if (!localStorage.getItem('homeNoMore')) {
    setTimeout(() => {
      currentGuide.value = 0
    }, 800)
  }
}

const display_guide = () => {
  currentGuide.value = 0
}

initGuide_home()

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
  padding-top: 2vh;
  padding-bottom: 5vh;
  font-size: 1.5vw;
  font-weight: bold;
  color: #fff;
  background: -webkit-linear-gradient(45deg, #f26326, #006437);
  -webkit-background-clip: text;
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