<template>
  <div class="res-view commonView">
    <div class="res-list common-scroll">
      <t-list-item 
        v-for="(item, index) in caseList"
        :class="{ active : currentIndex == index}"
        @click="selectCase(index, item.id)"
      >{{item.name}}
      </t-list-item>
    </div>
    <div class="res-panel" v-if="caseValue">
      <!-- <t-space style="margin-bottom: 12px;">
        <t-upload
          :size-limit="{ size: 10, unit: 'MB' }"
          :request-method="handle_file"
          :autoUpload="true"
          tips="less than 10MB"
          accept="*"
          @remove="handle_remove"
        />
        <t-button theme="primary" :disabled="teamworkList.length == 0" @click="handle_add">ADD</t-button>
      </t-space> -->

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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCaseList, getHomeworkList } from '@/api/modules/case'
import { MessagePlugin } from 'tdesign-vue-next'
import { uploadFileCom } from '@/api/modules/common'

// 获取案例列表
const caseLoading = ref(true)
const caseList = ref()
const caseListTotal = ref()
const initCaseList = (current: number, pageSize: number) => {
  getCaseList(current, pageSize)
  .then((res: any)=> {
    caseList.value = res.data
    caseListTotal.value = res.pageData.total
    caseLoading.value = false
  })
  .catch((err)=> {
    console.error(err)
  })
}

const caseValue = ref<any>(null)
const currentIndex = ref()
const selectCase = (index: any, value: any) => {
  currentIndex.value = index
  caseValue.value = value
  getList(1, 10)
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

const workList = ref<any>([])
const teamworkList = ref<any>([])
const handle_file = (e: any) => {
  teamworkList.value = []
  let tempFileParam = new FormData()
  tempFileParam.append('file', e.raw)
  return new Promise((resolve) => {
    uploadFileCom(tempFileParam)
    .then((res: any)=> {
      if (res.msg === 'success') {
        teamworkList.value.push({
          name: e.raw.name,
          url: res.data.filePath
        })
      } else {
        return MessagePlugin.warning(res.msg)
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

const pagination = ref({
  current: 1,
  pageSize: 10,
  pageSizeOptions: [10, 20, 50],
  total: 0,
})

const getList = (current: number, pageSize: number) => {
  let param = {
    caseId: caseValue.value,
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

// const handle_remove = () => {
//   teamworkList.value = []
// } 

// const handle_add = () => {
//   let param = {
//     caseId: caseValue.value,
//     url: teamworkList.value[0].url,
//     title: teamworkList.value[0].name
//   }
//   addHomework(param)
//   .then((res: any)=> {
//     if (res.msg == 'success') {
//       getList(1, 10)
//       return MessagePlugin.success(`You have added your team work ${teamworkList.value[0].name}`)
//     }
//   })
// }

/* ================================================================================================== */

onMounted(()=> {
  initCaseList(1, 100)
})
</script>

<style scoped lang="scss">
.res-view {
  position: relative;
  display: flex;
}

.res-list {
  flex: 1;
  max-width: 300px;
  max-height: calc(100vh - 56px);
  overflow-y: auto;
  * {
    cursor: pointer;
  }
  .active {
    background-color: #f2f3ff;
    color: #0052d9
  }
}

.res-panel {
  flex: 5;
}
</style>