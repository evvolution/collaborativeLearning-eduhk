<template>
  <t-table
    row-key="index"
    :data="list"
    :columns="columns"
    :bordered="true"
    :show-header="true"
    cell-empty-content="-"
    :pagination="pagination"
    :maxHeight="maxHeight"
    @change="onPageChange"
  >
    <template #content="{ row }">
      <t-typography-paragraph v-if="getRealLength(JSON.parse(row.content).text) > 60" copyable :ellipsis="ellipsisState">
        <t-typography-text copyable>
          {{JSON.parse(row.content).text}}
        </t-typography-text>
      </t-typography-paragraph>
      <t-typography-text v-else copyable>{{JSON.parse(row.content).text}}</t-typography-text>
    </template>
    <template #creator="{ row }">
      <t-tag 
        :theme="userStore?.userInfo?.name == JSON.parse(row.content).creator ? 'primary' : 'warning'" 
        shape="round" 
        :content="JSON.parse(row.content).creator"
      ></t-tag>
    </template>
    <template #attachment="{ row }">
      <t-link 
        v-if="JSON.parse(row.content).file" 
        theme="primary" 
        :href="JSON.parse(row.content).file.url"
      >
        <template #content>
          <t-space align="center">
            <t-popup :content="JSON.parse(row.content).file.name" placement="right" show-arrow >
              <t-icon name="file-attachment" size="32"/>
            </t-popup>
          </t-space>
        </template>
      </t-link>
      <template v-else>-</template>
    </template>
    <template #action="{ row }">
      <t-button theme="warning" variant="text" content="Add To My Notebook" @click="addToResource(row)"/>
    </template>
  </t-table>

</template>
  
<script setup lang="ts">
import { ref } from 'vue'
import { addResources, getGroupResByCaseId } from '@/api/modules/resource'
import { MessagePlugin } from 'tdesign-vue-next'
import { useUserStore } from '@/store/user'
import { getRealLength } from '@/utils/common'
const ellipsisState = {
  row: 2,
  expandable: true,
  collapsible: true,
}
const userStore = useUserStore()

const maxHeight: number = window.innerHeight - 200
const props = defineProps({
  resType: {
    type: Number,
    default: 0
  },
  caseId: {
    type: Number,
    default: 0
  }
})

const list = ref<any>([])
const pagination = ref({
  current: 1,
  pageSize: 10,
  pageSizeOptions: [10, 20, 50],
  total: 0,
})

const getList = (current: number, pageSize: number) => {
  let param = {
    caseId: props.caseId,
    current: current,
    size: pageSize,

    // 只看学生
    // onlyTeacher: 0,
    // resource 里面显示的是要素
    type: 2,
    // 只看学生公开的
    // opened: 1
  }
  getGroupResByCaseId(param)
  .then((res: any)=> {
    list.value = res.data
    pagination.value.current = current
    pagination.value.pageSize = pageSize
    pagination.value.total = res.pageData.total
  })
  .catch((err)=> {
    console.error(err)
  })
}
const onPageChange = (pageInfo: any) => {
  getList(pageInfo.pagination.current, pageInfo.pagination.pageSize)
}

const columns = ref([
  { colKey: 'creator', title: 'Original Creator' },
  { colKey: 'id', title: 'ID' },
  { colKey: 'content', title: 'Content' },
  { colKey: 'attachment', title: 'Attachment' },
  { colKey: 'createTime', title: 'Create Time' },
  { colKey: 'action', title: 'Action' },
])

const addToResource = (item: any) => {
  let param = {
    caseId: props.caseId,
    type: 3,
    content: item.content
  }
  addResources(param)
  .then((res: any)=> {
    if (res.msg == 'success') {
      return MessagePlugin.success('Added Successfully')
    }
  })
  .catch((err)=> {
    console.error(err)
  })
}

// init
const initList = () => {
  getList(pagination.value.current, pagination.value.pageSize)
}

initList()

defineExpose({
  initList
})
</script>
  
<style scoped lang="scss">
</style>