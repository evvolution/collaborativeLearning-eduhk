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
      <template v-if="userStore?.userInfo?.name == JSON.parse(row.content).creator">
        <t-space direction="vertical">
          <!-- <t-button content="Set As Note Record" theme="primary" variant="text" @click="updateRes(row)" /> -->
          <t-space align="center">
            <!-- <t-switch
              v-model="row.opened" 
              size="large" 
              :customValue="[1, 0]" 
              :label="['Pubilc','Private']" 
              @change="changeRes(row)">
            </t-switch> -->
            <!-- <t-tag class="pointer-item" theme="primary" content="Pubilc" v-if="row.opened == 1" @click="changeRes(row, 0)"/>
            <t-tag class="pointer-item" theme="default" content="Private" v-else @click="changeRes(row, 1)"/> -->

            <t-popconfirm 
              content="Are you sure to Delete it?"
              @confirm="delRes(row.id)"
            >
              <t-button content="Delete" theme="danger" variant="outline">
                <template #icon> <t-icon name="delete" />  </template>
              </t-button>
            </t-popconfirm>
          </t-space>
        </t-space>
      </template>
      <template v-else>
        <t-button theme="warning" variant="text" content="Copy To My Notebook" @click="addToResource(row)"/>
      </template>
    </template>
  </t-table>

</template>
  
<script setup lang="ts">
import { ref } from 'vue'
import { addResources, cancelResources, deleteResources, getGroupResByCaseId, updateResources } from '@/api/modules/resource'
import { MessagePlugin } from 'tdesign-vue-next'
import { useUserStore } from '@/store/user'
import { getRealLength } from '@/utils/common'
const ellipsisState = {
  row: 2,
  expandable: true,
  collapsible: true,
}
const userStore = useUserStore()

const emit = defineEmits(['copyToNotebook', 'switchTabsToNotebook'])

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

const getList = (current: number, pageSize: number ) => {
  let param = {
    caseId: props.caseId,
    current: current,
    size: pageSize,

    // 只看学生
    onlyTeacher: 0,
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
  { colKey: 'creator', title: 'Original Creator' },
  { colKey: 'id', title: 'ID' },
  { colKey: 'content', title: 'Content' },
  { colKey: 'attachment', title: 'Attachment' },
  { colKey: 'createTime', title: 'Create Time' },
  { colKey: 'action', title: 'Action' },
])


// init
const initList = () => {
  getList(pagination.value.current, pagination.value.pageSize)
}

// change
const changeRes = (item: any, type: any) => {
  updateResources({
    caseId: props.caseId,
    id: item.id,
    opened: type,
    content: item.content
  })
  .then((res)=> {
    initList()
    MessagePlugin.success('Updated Successfully')
  })
}

// add
const addToResource = (item: any) => {
  emit('copyToNotebook', item)
  // return
  // let param = {
  //   caseId: props.caseId,
  //   type: 3,
  //   content: item.content
  // }
  // addResources(param)
  // .then((res: any)=> {
  //   if (res.msg == 'success') {
  //     return MessagePlugin.success('Added Successfully')
  //   }
  // })
  // .catch((err)=> {
  //   console.error(err)
  // })
}

// changeType
const updateRes = (item: any) => {
  let param = {
    caseId: props.caseId,
    id: item.id,
    content: item.content,
    type: 3
  }
  updateResources(param)
  .then((res: any)=> {
    if (res.code == 200) {
      emit('switchTabsToNotebook', item.id)
      return MessagePlugin.success('Set Successfully')
    }
  })
}

// remove
const removeRes = (item: any) => {
  let param = {
    resourceId: item.id,
    type: 2
  }
  cancelResources(param)
  .then((res: any)=> {
    if (res.code == 200) {
      initList()
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
  initList
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