<template>
  <div class="detail-view">
    <div class="detail-header">
      <div class="title">
        <t-button variant="text" theme="primary" shape="round" @click="back" content="Back">
          <template #icon><t-icon name="arrow-left" color="#0052d9" /></template>
        </t-button>
        <h2>{{currentCaskName}}</h2>    
      </div>

      <div class="action">
        <t-space align="center" block>
          <!-- <t-button theme="success" shape="round" content="Team Work" @click="showTeamWorkModal">
            <template #icon><t-icon name="file-teams" /></template>
          </t-button> -->

          <router-link :to="{ name: 'CaseQuestions', params: { id: currentCaseId } }">
            <t-button theme="warning" shape="round" content="Questionnaire Setting" @click="">
              <template #icon><t-icon name="setting" /></template>
            </t-button>
          </router-link>
          
          <!-- <t-button variant="outline" theme="warning" shape="round" content="Dashboard">
            <template #icon><t-icon name="dashboard" /></template>
          </t-button> -->

          <!-- <t-button variant="outline" theme="primary" shape="round" @click="back" content="Back">
            <template #icon><t-icon name="logout" color="#0052d9" /></template>
          </t-button> -->
        </t-space>
      </div>
    </div>

    <div class="detail-class">
      <div class="video">
        <videoclass :currentCaseId="currentCaseId" />
      </div>
      <div class="note">
        <annotateList :currentCaseId="currentCaseId"/>
      </div>
    </div>
  </div>

  <!-- ======================== -->
  <t-dialog
    v-model:visible="showTeamWork"
    :footer="false"
    header="Team Work File"
    @opened="getList"
    width="60%"
  >
    <t-table
      :data="workList" 
      :columns="columns"
      :hover="true"
      maxHeight="450"
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
  </t-dialog>
</template>

<script setup lang="ts">
import router from '@/router'
import videoclass from './components/content/videoclass.vue'
import annotateList from './components/content/annotateList.vue'
import { ref } from 'vue'
import { getHomeworkList } from '@/api/modules/case';

const url = window.location.href
const currentCaseId = Number(url.split('/')[url.split('/').length - 1])
const currentCaskName = window.decodeURI(url.split('/')[url.split('/').length - 2])

const back = () => {
  router.push({ name: 'Case'})
}

const showTeamWork = ref(false)
const workList = ref<any>([])
const showTeamWorkModal = () => {
  showTeamWork.value = true
}

const pagination = ref({
  current: 1,
  pageSize: 10,
  pageSizeOptions: [10, 20, 50],
  total: 0,
})

const getList = (current: number, pageSize: number) => {
  let param = {
    caseId: currentCaseId,
    current: current,
    size: pageSize
  }
  getHomeworkList(param)
  .then((res: any)=> {
    workList.value = res.data
    pagination.value.current = current
    pagination.value.pageSize = pageSize
    pagination.value.total = res.pageData.total
  })
}

const columns = ref([
  { colKey: 'id', title: 'ID'},
  { colKey: 'title', title: 'Title'},
  { colKey: 'memberName', title: 'Member Name'},
  { colKey: 'groupName', title: 'Group Name'},
  { colKey: 'createTime', title: 'Create Time' },
  { colKey: 'download', title: 'Download'}
])

const onPageChange = (pageInfo: any) => {
  getList(pageInfo.pagination.current, pageInfo.pagination.pageSize)
}
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
    flex: 1;
  }
  .note {
    flex: 2;
  }
}
</style>