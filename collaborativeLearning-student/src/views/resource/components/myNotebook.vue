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
    <template #id="{ row }">
      <template v-if="idHigh == row.id">
        <div class="light-Jump" v-if="isFlashing">{{row.id}}</div>
        <div v-else>{{row.id}}</div>
      </template>
      <template v-else>
        {{row.id}}
      </template>
    </template>
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
        :content="JSON.parse(row.content).creator">
      </t-tag>
    </template>
    <template #attachment="{ row }">
      <t-link 
        v-if="JSON.parse(row.content).file" 
        theme="primary" 
        :href="JSON.parse(row.content).file.url"
      >
        <template #content>
          <t-space align="center">
            <t-icon name="file-attachment" size="24"/>
            {{JSON.parse(row.content).file.name}}
          </t-space>
        </template>
      </t-link>
      <template v-else>-</template>
    </template>
    <template #action="{ row }">
      <!-- <t-button
        v-if="userStore?.userInfo?.name == JSON.parse(row.content).creator"
        theme="primary" 
        variant="text" 
        content="Set As Case Factors" 
        @click="addToFactors(row)" 
      /> -->
      <t-space align="center" :size="1">
        <t-popconfirm 
          content="Are you sure to Delete it?"
          @confirm="delRes(row.id)"
        >
          <t-button theme="danger" variant="text" >
            <template #icon> <t-icon name="delete" />  </template>
          </t-button>
        </t-popconfirm>
        <template v-if="row.shareToFactor == 0">
          <t-button v-if="userStore?.userInfo?.name == JSON.parse(row.content).creator" content="Add to Group Notebook" theme="primary" variant="text" @click="addRes(row)" />
        </template>
      </t-space>
    </template>
  </t-table>

</template>
  
<script setup lang="ts">
import { ref } from 'vue'
import { addResources, cancelResources, deleteResources, getGroupResByCaseId, updateResources } from '@/api/modules/resource'
import { MessagePlugin, NotifyPlugin } from 'tdesign-vue-next'
import { useUserStore } from '@/store/user'
import { getRealLength } from '@/utils/common'
const ellipsisState = {
  row: 2,
  expandable: true,
  collapsible: true,
}
const userStore = useUserStore()
const emit = defineEmits(['switchTabsToFactor'])

const maxHeight: number = window.innerHeight - 200
const props = defineProps({
  resType: {
    type: Number,
    default: 0
  },
  caseId: {
    type: Number,
    default: 0
  },
  idHigh: {
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

const clearList = () => {
  list.value = []
}
const getList = (current: number, pageSize: number ) => {
  list.value = []
  let param = {
    caseId: props.caseId,
    current: current,
    size: pageSize,

    // 只看学生
    // onlyTeacher: 0,
    // notebook 里面显示的是笔记
    type: 3, 
    // 显示的是所有的
    // opened: 不传
  }
  getGroupResByCaseId(param)
  .then((res: any)=> {
    list.value = res.data
    pagination.value.current = current
    pagination.value.pageSize = pageSize
    pagination.value.total = res.pageData.total
    flashNew()
  })
  .catch((err)=> {
    console.error(err)
  })
}
const onPageChange = (pageInfo: any) => {
  getList(pageInfo.pagination.current, pageInfo.pagination.pageSize)
}

const columns = ref([
  { colKey: 'creator', title: 'Original Creator'},
  { colKey: 'id', title: 'ID', width: 75},
  { colKey: 'content', title: 'Content' },
  { colKey: 'attachment', title: 'Attachment'},
  { colKey: 'createTime', title: 'Create Time'},
  { colKey: 'action', title: 'Action'}
])

// init
const initList = () => {
  getList(pagination.value.current, pagination.value.pageSize)
}

// add
const addToFactors = (item: any, type: number) => {
  let preJson = JSON.parse(item.content)
  preJson.creator = item.memberName
  addResources({
    caseId: props.caseId,
    type: type,
    opened: 1,
    content: JSON.stringify(preJson)
  })
  .then((res: any)=> {
    if (res.code == 200) {
      return NotifyPlugin.success({
        title: 'Set Successfully',
        content: "You can view in 'Students' Factors' tab"
      })
    } else {
      return MessagePlugin.warning(res.msg)
    }
  })
}

// addRes
const addRes = (item: any) => {
  let preJson = JSON.parse(item.content)
  preJson.creator = item.memberName
  let param = {
    caseId: props.caseId,
    content: item.content,
    type: 2,
    resourceId: item.id,
    opened: 1
  }
  addResources(param)
  .then((res: any)=> {
    if (res.code == 200) {
      // emit('switchTabsToFactor', item.id)
      initList()
      return MessagePlugin.success('Added Successfully')
    }
  })
}


// changeType
const updateRes = (item: any) => {
  let param = {
    caseId: props.caseId,
    id: item.id,
    content: item.content,
    type: 2
  }
  updateResources(param)
  .then((res: any)=> {
    if (res.code == 200) {
      emit('switchTabsToFactor', item.id)
      return MessagePlugin.success('Set Successfully')
    }
  })
}

const removeRes = (item: any) => {
  let param = {
    resourceId: item.id,
    type: 3
  }
  cancelResources(param)
  .then((res: any)=> {
    if (res.code == 200) {
      return MessagePlugin.success('Delete Successfully')
    }
  })
}

// del
const delRes = (id: any) => {
  deleteResources(id)
  .then((res: any)=> {
    if (res.code == 200) {
      initList()
      return MessagePlugin.success('Delete Successfully')
    }
  })
}


const isFlashing = ref(false)
const flashNew = () => {
  if (props.idHigh != 0 && props.idHigh) {
    isFlashing.value = true
    setTimeout(()=> {
      isFlashing.value = false
    }, 3000)
  }
}

initList()

defineExpose({
  initList,
  clearList
})
</script>
  
<style scoped lang="scss">

.light-Jump {
  padding: 6px 10px;
  background-color: orange;
  color: #fff;
  animation: blink 3s infinite;
}

@keyframes blink {
  0% { background-color: transparent; color: #000;}
  20% { background-color: orange; color: #fff;}
  40% { background-color: transparent; color: #000;}
  60% { background-color: orange; color: #fff;}
  80% { background-color: transparent; color: #000;}
  100% { background-color: orange; color: #fff;}
}

</style>