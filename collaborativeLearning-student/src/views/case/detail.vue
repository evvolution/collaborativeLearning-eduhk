<template>
  <div class="detail-view">
    <div class="detail-header">
      <div class="title">
        <t-button variant="text" theme="primary" shape="round" @click="back2List" content="Back">
          <template #icon><t-icon name="arrow-left" color="#0052d9" /></template>
        </t-button>
        <h2>{{currentCaskName}}</h2>    
      </div>
      <div class="action">
        <t-space align="center" block>
          <!-- <t-button theme="success" shape="round" content="Team Work" @click="showTeamWorkModal">
            <template #icon><t-icon name="file-teams" /></template>
          </t-button> -->
          <t-button theme="success" variant="text" content="Resource" @click="toRes">
            <template #icon><t-icon name="file-attachment" /></template>
          </t-button>
          <t-button theme="primary" variant="text" content="Guide" @click="display_guide">
            <template #icon><t-icon name="help-circle" /></template>
          </t-button>
          <t-button theme="warning" shape="round" content="Questionnaire" @click="toQuestion" class="c2">
            <template #icon><t-icon name="questionnaire" /></template>
          </t-button>
        </t-space>
      </div>
    </div>

    <div class="detail-class">
      <div class="video c0">
        <videoclass :currentCaseId="currentCaseId" />
      </div>
      <div class="note c1">
        <t-tag variant="outline" theme="primary" content="Annotate List" shape="round"/>
        <annotateList :currentCaseId="currentCaseId"/>
      </div>
      <div class="chat">
        <chatroom :currentCaseId="currentCaseId"/>
      </div>
    </div>
  </div>

  <!-- ======================== -->
  <!-- <t-dialog
    v-model:visible="showTeamWork"
    header="Team Work File"
    @opened="getList"
    width="60%"
    @confirm="handle_add"
    :destroyOnClose="true"
  >
    <t-form-item label="Team Work">
      <t-upload
        :size-limit="{ size: 10, unit: 'MB' }"
        :request-method="handle_file"
        :autoUpload="true"
        tips="less than 10MB"
        accept="*"
        @remove="handle_remove"
      />
    </t-form-item>
    <t-table
      :data="workList" 
      :columns="columns"
      :hover="true"
      maxHeight="300"
      :pagination="pagination"
      @change="onPageChange"
    >
      <template #download="{ row }">
        <t-link :href="row.url" theme="primary">
          <template #content>
            <t-space align="center">
              <t-icon name="download" />Download
            </t-space>
          </template>
        </t-link>
      </template>
    </t-table>
  </t-dialog> -->

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
import { ref, onUnmounted } from 'vue'

import router from '@/router'
import { useUserStore } from '@/store/user'
const userStore = useUserStore()

import videoclass from './components/videoclass.vue'
import annotateList from './components/annotateList.vue'
import chatroom from './components/chatroom.vue'
import { addHomework, getHomeworkList } from '@/api/modules/case'
import { uploadFileCom } from '@/api/modules/common'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRouterStore } from '@/store/router'
const routerStore = useRouterStore()
const url = window.location.href
const currentCaseId = Number(url.split('/')[url.split('/').length - 1])
const currentCaskName = window.decodeURI(url.split('/')[url.split('/').length - 2])

//==================================================================> 通用

const toRes = () => {
  routerStore.currentMenu = 2
  router.push({name: 'Resource', query: {id: currentCaseId}})
}

const back2List = () => {
  routerStore.currentMenu = 1
  router.push({ name: 'Case' })
}

const toQuestion = () => {
  router.push({ name: 'CaseQuestionnaire' })
}

const nomoreguide = ref(false)
const currentGuide = ref(-1)
const steps = [
  {
    element: '.c0',
    title: 'Video Case',
    body: "You can click 'Add New Annotate' to add your annotates",
    placement: 'right',
  },
  {
    element: '.c1',
    title: 'Annotates List',
    body: "You can click the icon to add the annotate into your notebook",
    placement: 'right',
  },
  {
    element: '.c2',
    title: 'Questionnaire',
    body: "You can click this button and visit the questionnaires page",
    placement: 'bottom',
  },
]

const handle_finish = () => {
  if (!localStorage.getItem('caseDetailNoMore')) {
    nomoreguide.value = true
  }
}

const handle_Skip = () => {
  localStorage.setItem('caseDetailNoMore', '1')
  nomoreguide.value = false
}

const setGuideNomore = () => {
  localStorage.setItem('caseDetailNoMore', '1')
  nomoreguide.value = false
}

const initGuide_caseDetail = () => {
  if (!localStorage.getItem('caseDetailNoMore')) {
    setTimeout(() => {
      currentGuide.value = 0
    }, 800)
  }
}

const display_guide = () => {
  currentGuide.value = 0
}

initGuide_caseDetail()

// const showTeamWork = ref(false)
// const workList = ref<any>([])
// const showTeamWorkModal = () => {
//   showTeamWork.value = true
// }

// const pagination = ref({
//   current: 1,
//   pageSize: 10,
//   pageSizeOptions: [10, 20, 50],
//   total: 0,
// })

// const getList = (current: number, pageSize: number) => {
//   let param = {
//     caseId: currentCaseId,
//     current: current,
//     size: pageSize
//   }
//   getHomeworkList(param)
//   .then((res: any)=> {
//     workList.value = res.data
//     pagination.value.current = current
//     pagination.value.pageSize = pageSize
//     pagination.value.total = res.pageData.total
//   })
// }

// const columns = ref([
//   { colKey: 'id', title: 'ID'},
//   { colKey: 'title', title: 'Title'},
//   { colKey: 'memberName', title: 'Member Name'},
//   { colKey: 'groupName', title: 'Group Name'},
//   { colKey: 'createTime', title: 'Create Time' },
//   { colKey: 'download', title: 'Download'}
// ])

// const onPageChange = (pageInfo: any) => {
//   getList(pageInfo.pagination.current, pageInfo.pagination.pageSize)
// }

// const teamworkList = ref<any>([])
// const handle_file = (e: any) => {
//   teamworkList.value = []
//   let tempFileParam = new FormData()
//   tempFileParam.append('file', e.raw)
//   return new Promise((resolve) => {
//     uploadFileCom(tempFileParam)
//     .then((res: any)=> {
//       if (res.msg === 'success') {
//         teamworkList.value.push({
//           name: e.raw.name,
//           url: res.data.filePath
//         })
//       } else {
//         return MessagePlugin.warning(res.msg)
//       }
//     })
//     .catch((err: any)=> {
//       console.error(err)
//     })
//     resolve({
//       status: 'success'
//     })
//   })
// }

// const handle_remove = () => {
//   teamworkList.value = []
// } 

// const handle_add = () => {
//   let param = {
//     caseId: currentCaseId,
//     url: teamworkList.value[0].url,
//     title: teamworkList.value[0].name
//   }
//   addHomework(param)
//   .then((res: any)=> {
//     if (res.msg == 'success') {
//       showTeamWork.value = false
//       return MessagePlugin.success(`You have added your team work ${teamworkList.value[0].name}`)
//     }
//   })
// }

</script>

<style scoped lang="scss">
.detail-view {
  position: fixed;
  width: 100vw;
  height: 100vh;
  padding: 12px;
}

.detail-header {
  display: flex;
  height: 56px;
  .title {
    flex: 1;
    display: flex;
    align-items: center;
    column-gap: 16px;
  }
  .action {
    flex: 1;
    display: flex;
    justify-content: flex-end
  }
}

.detail-class {
  height: calc(100vh - 80px);
  display: flex;
  column-gap: 16px;
  .video {
    flex: 2;
  }
  .note {
    flex: 1;
  }
  .chat {
    flex: 2;
    padding: 12px;
    background-color: #f5f5f5;
  }
}
</style>