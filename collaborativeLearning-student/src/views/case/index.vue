<template>
  <div class="case-view commonView">
    <t-table 
      row-key="index" 
      :data="caseTableList" 
      :columns="columnsCase"
      :hover="true"
      :pagination="casePagination"
      :maxHeight="caseHeight"
      @change="onPageChange"
    >
      <template #name="{ row }">
        <router-link :to="{ name: 'CaseDetail', params: { id: row.id, name: row.name } }">
          <t-link theme="primary" :content="row.name"></t-link>
        </router-link>
      </template>
      <template #startTime="{ row }">
        {{timeStamp2time(row.startTime)}}
      </template>
      <template #endTime="{ row }">
        {{timeStamp2time(row.endTime)}}
      </template>
      <template #progress="{ row }">
        <template v-if="row.closeByAdmin == 0">
          <t-tag v-if="row.startTime && !row.endTime" variant="outline" theme="primary" shape="round" content="PROCESSING"></t-tag>
          <t-tag v-else-if="row.startTime && row.endTime" variant="outline" theme="primary" shape="round" content="PROCESSING"></t-tag>
          <t-tag v-else-if="!row.startTime && !row.endTime" variant="outline" theme="danger" shape="round" content="TODO"></t-tag>
        </template>
        <template v-else>
          <t-tag variant="outline" theme="warning" shape="round" content="FINISHED"></t-tag>
        </template>
      </template>
    </t-table>
  </div>
  
</template>

<script setup lang="tsx">
import { ref, onMounted } from 'vue'
import { getCaseList } from '@/api/modules/case'
import { MessagePlugin } from 'tdesign-vue-next'
import { timeStamp2time, timestamp2FormTime } from '@/utils/common'


const caseHeight = window.innerHeight - 192 + 'px'
const caseTableList = ref<any>([])
const casePagination = ref({
  current: 1,
  pageSize: 10,
  pageSizeOptions: [10, 20, 50],
  total: 0,
})
const getCaseListData = (current: number, pageSize: number) => {
  caseTableList.value = []
  getCaseList(current, pageSize)
  .then((res: any)=> {
    casePagination.value = {
      current: current,
      pageSize: pageSize,
      pageSizeOptions: [10, 20, 50],
      total: res.pageData.total,
    }
    caseTableList.value = res.data
  })
  .catch((err: any)=> {
    console.error(err)
  })
}
const columnsCase = ref([
  { colKey: 'id', title: 'Id', width: 80 },
  { colKey: 'name', title: 'Case Name' },
  { colKey: 'startTime', title: 'Start Time' },
  { colKey: 'endTime', title: 'Last Submission' },
  // { colKey: 'duration', title: 'Dration' },
  { colKey: 'createTime', title: 'Create Time', width: 200 },
  { colKey: 'progress', title: 'Progress', width: 150 },
])

const onPageChange = (pageInfo: any) => {
  getCaseListData(pageInfo.pagination.current, pageInfo.pagination.pageSize)
}

onMounted(()=> {
  getCaseListData(1, 10)
})
</script>

<style scoped>
#caseList {
  position: relative;
  min-height: calc(100vh - 136px);
  max-height: calc(100vh - 136px);
  padding-bottom: 12px;
  border-radius: 12px
}

.chatRoom {
  position: relative;
  width: 100%;
  height: 50vh;
  background-color: #e1e1e1e1;
  overflow-y: scroll;
  padding: 12px;
  margin-bottom: 12px;
}

.chatItem {
  position: relative;
  width: 50%;
  height: auto;
  padding: 6px;
  background-color: #ffffff;
  border-radius: 12px;
  margin-bottom: 12px;
}

.chatName {
  font-weight: 600
}

.chatContent, .chatTime {
  margin-top: 6px;
}

.chatContainer {
  display: flex;

  flex-direction: column;
  align-items: flex-end;
}

.chatSubmit {
  margin-top: 8px;
}

.d-player-wrap {
  width: 100%;
  height: 60vh
}
</style>