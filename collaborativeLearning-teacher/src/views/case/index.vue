<template>
  <div class="case-view commonView">
    <t-space style="margin-bottom: 12px;" align="center">
      <t-button @click="createCase = true" content="Create New Case"></t-button>
    </t-space>

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
      <!-- <template #progress="{ row }">
        <t-tag v-if="row.startTime" variant="outline" theme="primary" shape="round" content="PROCESSING"></t-tag>
        <t-tag v-else variant="outline" theme="danger" shape="round" content="TODO"></t-tag>
      </template> -->
      <template #state="{ row }">
        <t-tag v-if="row.state == 1" theme="success" shape="round" content="ENABLE" @click="setCaseAvailable(row, 0)" class="pointer-tag"></t-tag>
        <t-tag v-else-if="row.state == 0" theme="danger" shape="round" content="DISABLE" @click="setCaseAvailable(row, 1)" class="pointer-tag"></t-tag>
      </template>
      <template #operation="{ row }">
        <t-space align="center">
          <t-tag theme="primary" default="Edit" @click="editCaseById(row.id)" class="pointer-tag">
            <template #icon><t-icon name="edit-2" /></template>
          </t-tag>
          <template v-if="row.closeByAdmin == 0">
            <t-popconfirm content="Are you sure to finish current case?" @confirm="manualCase(row, 1)">
              <t-tag theme="warning" default="CLOSE" class="pointer-tag"></t-tag>
            </t-popconfirm>
          </template>
          <template v-else>
            <t-popconfirm content="Are you sure to reboot current case?" @confirm="manualCase(row, 0)">
              <t-tag theme="warning" variant="outline" class="pointer-tag" default="CLOSED"></t-tag>
            </t-popconfirm>
          </template>
          <!-- <router-link :to="{ name: 'CaseDashboard', params: { id: row.id } }">
            <t-tag theme="default" default="Dashboard">
              <template #icon><t-icon name="dashboard" /></template>
            </t-tag>
          </router-link> -->
          <t-popconfirm content="Are you sure to delete this case?" @confirm="deleteCaseById(row)">
            <t-tag theme="danger" default="Delete" class="pointer-tag">
              <template #icon><t-icon name="delete" /></template>
            </t-tag>
          </t-popconfirm>
        </t-space>
      </template>
    </t-table>
  </div>
  
  <create :create-case="createCase" @cancel-create="handle_cancelCreate" @close-create="handle_closeCreate"/>
  <edit :edit-case="editCase" :edit-case-id="editCaseId" @cancel-edit="handle_cancelEdit" @close-edit="handle_closeEdit"/>
</template>

<script setup lang="tsx">
import { ref, onMounted } from 'vue'
import { deleteCase, getCaseList, updateNewCase } from '@/api/modules/case'
import create from './components/setting/create.vue'
import edit from './components/setting/edit.vue'
import { MessagePlugin } from 'tdesign-vue-next'

const createCase = ref(false)
const handle_cancelCreate = () => {
  createCase.value = false
}
const handle_closeCreate = () => {
  createCase.value = false
  getCaseListData(1, 10)
}

const editCase = ref(false)
const editCaseId = ref<any>()
const editCaseById = (id: Number) => {
  editCase.value = true
  editCaseId.value = id
}
const handle_cancelEdit = () => {
  editCase.value = false
}
const handle_closeEdit = () => {
  editCase.value = false
  getCaseListData(1, 10)
}

const setCaseAvailable = (data: any, state: any) => {
  let preData = data
  preData.state = state
  const flag = ['ENABLED', 'DISABLED']
  updateNewCase(preData)
  .then((res: any)=> {
    if (res.msg == 'success') {
      MessagePlugin.success(`${data.name} has been ${flag[state]}`)
      getCaseListData(1, 10)
    }
  })
  .catch((err) => {
    console.error(err)
  })
}

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
  .catch((err)=> {
    console.error(err)
  })
}
const columnsCase = ref([
  { colKey: 'id', title: 'Id' },
  { colKey: 'name', title: 'Case Name' },
  { colKey: 'createTime', title: 'Create Time' },
  // { colKey: 'progress', title: 'Progress', width: 100 },
  { colKey: 'state', title: 'State' },
  { colKey: 'operation', title: 'Operation' },
])

const onPageChange = (pageInfo: any) => {
  getCaseListData(pageInfo.pagination.current, pageInfo.pagination.pageSize)
}

const manualCase = (data: any, type: any) => {
  let preData = data
  preData.closeByAdmin = type
  updateNewCase(preData)
  .then((res: any)=> {
    if (res.msg == 'success') {
      MessagePlugin.success(`${data.name} has been ${type == 1 ? 'closed' : 'reboot'}`)
      getCaseListData(1, 10)
    }
  })
  .catch((err) => {
    console.error(err)
  })
}

const deleteCaseById = async (data: any) => {
  let preData = data
  preData.display = 0
  try {
    const res: any = await updateNewCase(preData)
    if (res.code == 200) {
      MessagePlugin.success(`${data.name} has been deleted`)
      getCaseListData(1, 10)
    }
  } catch (err) {
    console.error(err)
  }
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