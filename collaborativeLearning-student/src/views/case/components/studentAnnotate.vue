<template>
  <t-table
    row-key="index"
    :data="list"
    :columns="columns"
    :bordered="true"
    :show-header="false"
    cell-empty-content="-"
    :pagination="pagination"
    :maxHeight="maxHeight"
    @change="onPageChange"
  >
    <template #content="{ row }">
      <!-- <t-popup trigger="hover" placement="right-bottom">
        <template #content>
          
        </template> -->
      <t-card style="margin-bottom: 6px;">
        <t-space direction="vertical">
          <t-link theme="primary" @click="handle_notePresend(JSON.parse(row.content).text)">
            <!-- {{ getFormedTimeForList(JSON.parse(row.content).text) }} -->
            {{JSON.parse(row.content).text}}
          </t-link>
          <t-link 
            v-if="JSON.parse(row.content).file" 
            theme="primary" 
            :href="JSON.parse(row.content).file.url"
          >
            <template #content>
              <t-space align="center">
                <t-popup :content="JSON.parse(row.content).file.name" placement="right" show-arrow >
                  <t-icon name="file-attachment" size="20"/>
                </t-popup>
              </t-space>
            </template>
          </t-link>
        </t-space>
      </t-card>
      <!-- </t-popup> -->
  
      <t-space align="center">
        <t-tag  
          shape="round" 
          :content="row.id"
        ></t-tag>
        <h4>{{ JSON.parse(row.content).creator }}</h4>
        {{row.createTime}}
      </t-space>

      <!-- <t-descriptions title="Additional Infomation" :bordered="false" :column="3">
        <t-descriptions-item label="ID">{{row.id}}</t-descriptions-item>
        <t-descriptions-item label="Creator">
          <t-tag 
            :theme="userStore?.userInfo?.name == JSON.parse(row.content).creator ? 'primary' : 'warning'" 
            shape="round" 
            :content="JSON.parse(row.content).creator"
          ></t-tag>
        </t-descriptions-item>
        <t-descriptions-item label="Create Time">{{row.createTime}}</t-descriptions-item>
      </t-descriptions> -->
    </template>
    <template #action="{ row }">
      <t-space direction="vertical">
        <!-- <t-button 
          :theme="userStore?.userInfo?.name == JSON.parse(row.content).creator ? 'primary' : 'warning'"
          size="small" 
          content="Add To My Notebook" 
          @click="addToResource(row)"
        /> -->
        <!-- <t-space align="center"> -->
          <!-- <t-popup v-if="row.shareToFactor == 0" trigger="hover" placement="bottom" content="Add To Case Factors">
            <t-icon name="heart" @click="addToResourcePlus(row, 2)" />
          </t-popup>
          <t-popup v-else trigger="hover" placement="bottom" content="Remove Case Factors">
            <t-icon name="heart-filled" color="#ad352f" @click="removeRes(row, 2)"/>
          </t-popup> -->

          <!-- <t-popup v-if="row.shareToNote == 0" trigger="hover" placement="bottom" content="Add To My Notebook">
            <t-icon name="folder-add-1" @click="addToResourcePlus(row, 3)"/>
          </t-popup>
          <t-popup v-else trigger="hover" placement="bottom" content="Remove note">
            <t-icon name="folder-add-1" color="#ad352f" @click="removeRes(row, 3)"/>
          </t-popup>
        </t-space> -->

        <!-- <t-switch
          v-if="userStore?.userInfo?.name == JSON.parse(row.content).creator"
          v-model="row.opened"  
          :customValue="[1, 0]" 
          :label="['Pubilc','Private']" 
          @change="changeRes(row)">
        </t-switch> -->
      </t-space>
    </template>
  </t-table>

</template>
  
<script setup lang="ts">
import { computed, ref } from 'vue'
import { addResources, cancelResources, getGroupResByCaseId, updateResources } from '@/api/modules/resource'
import { MessagePlugin, type TableProps } from 'tdesign-vue-next'
import emitter from '@/utils/mitt'
import { useUserStore } from '@/store/user'
import { getFormedTimeForList } from '@/utils/common'
const userStore = useUserStore()

const handle_notePresend = (noteContent: string) => {
  emitter.emit('preSendData', noteContent)
}

// 监听刷新事件
emitter.on('freshNotes', () => {
  if (!props.caseId) {
    return MessagePlugin.error('System Error')
  }
  initList()
})

const maxHeight: number = window.innerHeight - 200
const props = defineProps({
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

const getList = (current: number, pageSize: number ) => {
  let param = {
    caseId: props.caseId,
    current: current,
    size: pageSize,

    // 只看学生
    onlyTeacher: 0,
    // 看学生全部公开的
    // opened: 1,
    // resource 里面显示的是要素
    type: 1
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
  // { colKey: 'id', title: 'ID', width: 80 },
  // { colKey: 'creator', title: 'Creator'},
  { colKey: 'content', title: 'Content'},
  // { colKey: 'action', title: 'Action', width: 100},
])

// init
const initList = () => {
  getList(pagination.value.current, pagination.value.pageSize)
}

// change
const changeRes = (item: any) => {
  updateResources({
    caseId: props.caseId,
    id: item.id,
    opened: item.opened,
    content: item.content
  })
  .then((res)=> {
    MessagePlugin.success('Updated Successfully')
  })
}

// add
// const addToResource = (item: any) => {
//   let param = {
//     caseId: props.caseId,
//     type: 3,
//     content: item.content
//   }
//   addResources(param)
//   .then((res: any)=> {
//     if (res.msg == 'success') {
//       return MessagePlugin.success('Added Successfully')
//     }
//   })
//   .catch((err)=> {
//     console.error(err)
//   })
// }

const addToResourcePlus = (item: any, type: number) => {
  let param = {
    caseId: props.caseId,
    type: type,
    resourceId: item.id,
    content: item.content
  }
  addResources(param)
  .then((res: any)=> {
    if (res.msg == 'success') {
      if (type == 2) {
        item.shareToFactor = 1
        return MessagePlugin.success('Added to Group Factors Successfully')
      } else if (type == 3) {
        item.shareToNote = 1
        return MessagePlugin.success('Added to My Notebook Successfully')
      }
    }
  })
  .catch((err)=> {
    console.error(err)
  })
}

const removeRes = (item: any, type: number) => {
  let param = {
    resourceId: item.id,
    type: type
  }
  cancelResources(param)
  .then((res: any)=> {
    if (res.code == 200) {
      if (type == 2) {
        item.shareToFactor = 0
        return MessagePlugin.success('Removed Successfully')
      } else if (type == 3) {
        item.shareToNote = 0
        return MessagePlugin.success('Removed Successfully')
      }
    }
  })
}

initList()

defineExpose({
  initList
})
</script>
  
<style scoped lang="scss">
</style>