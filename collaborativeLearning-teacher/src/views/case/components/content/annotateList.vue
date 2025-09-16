<template>
  <div class="notes" ref="notes">
    <div style="margin: 12px 0;">
      <t-select
        style="width: 20vw;"
        v-model="currentGroup"
        placeholder="please select group"
        clearable
        @change="getListByGroup"
        @clear="clearGroup"
      >
        <t-option 
          v-for="item in groupList"
          :value="item.id"
          :label="item.name"
        ></t-option>
      </t-select>
    </div>
    <t-table
      row-key="index"
      :columns="columns"
      :data="notesList"
      tableLayout="auto"
      :pagination="notePagination"
      :maxHeight="notesTableHeight"
      @change="onPageChange"
    >
      <template #content="{ row }">
        <t-typography-paragraph v-if="getRealLength(JSON.parse(row.content).text) > 110" copyable :ellipsis="ellipsisState">
          <t-typography-text copyable>
            <!-- {{getFormedTimeForList(JSON.parse(row.content).text)}} -->
            <!-- {{ getFormedTimeForList(JSON.parse(row.content).text) }} -->
            {{JSON.parse(row.content).text}}
          </t-typography-text>
        </t-typography-paragraph>
        <t-typography-text v-else copyable>{{JSON.parse(row.content).text}}</t-typography-text>
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
      <template #creator="{ row }">
        <t-tag v-if="row.teacherName" theme="primary" shape="round" variant="outline" :content="row.teacherName"></t-tag>
        <t-tag v-else theme="default" shape="round" :content="row.memberName"></t-tag>
      </template>
      <template #groupName="{ row }">
        <t-space v-if="row.groupName">
          {{ row.groupName }}
        </t-space>
        <t-space v-else>
          -
        </t-space>
      </template>
      <template #opened="{ row }">
        <t-space align="center" v-if="(userStore?.userInfo.id == row.teacherId) && row.teacherId">
          <t-switch v-model="row.opened" :customValue="[1, 0]" :label="['Public','Private']" @change="changeRes(row)"></t-switch>
        </t-space>
        <t-space v-else>
          -
        </t-space>
      </template>
      <template #action="{ row }">
        <t-space align="start" direction="vertical">
          <t-button v-if="row.shareToFactor == 0" theme="success" variant="text" content="Add To Teaching Factors" @click="addToResourcePlus(row, 2)" />
          <t-button v-else theme="danger" variant="text" content="Remove Teaching Factors" color="#ad352f" @click="removeRes(row, 2)"/>

          <t-button v-if="row.shareToNote == 0" theme="warning" variant="text" content="Add To My Notebook" @click="addToResourcePlus(row, 3)"/>
          <t-button v-else theme="danger" variant="text" content="Remove Note" @click="removeRes(row, 3)"/>
        </t-space>
      </template>
    </t-table>
  </div>
</template>

<script setup lang="tsx">
import { ref, onMounted } from 'vue'
import emitter from '@/utils/mitt'
import { MessagePlugin } from 'tdesign-vue-next'
import { addResources, cancelResources, getGroupResByCaseId, updateResources } from '@/api/modules/resource'
import { getRealLength, getFormedTimeForList } from '@/utils/common'
const ellipsisState = {
  row: 2,
  expandable: true,
  collapsible: true,
}
import { useUserStore } from '@/store/user'
import { getGroupList } from '@/api/modules/users'
const userStore = useUserStore()

const currentGroup = ref<any>()
const groupList = ref<any>([])
const initGroup = () => {
  getGroupList().then((res)=> {
    groupList.value = res.data
  })
}

const getListByGroup = () => {
  getResListData(notePagination.value.current, notePagination.value.pageSize, currentGroup.value)
}

const clearGroup = () => {
  getResListData(notePagination.value.current, notePagination.value.pageSize)
}

const props = defineProps({
  currentCaseId: Number
})

const notePagination = ref({
  current: 1,
  pageSize: 10,
  pageSizeOptions: [10, 20, 50],
  total: 0,
})

const notesList = ref()
const getResListData = (current: number, pageSize: number, groupNum?: any) => {
  if (!props.currentCaseId) {
    return MessagePlugin.error('System Error')
  }
  let param = {
    caseId: props.currentCaseId,
    current: current,
    size: pageSize,
    type: 1,
    groupNum: groupNum
  }
  getGroupResByCaseId(param)
  .then((res: any)=> {
    notePagination.value = {
      current: current,
      pageSize: pageSize,
      pageSizeOptions: [10, 20, 50],
      total: res.pageData.total,
    }
    notesList.value = res.data
  })
}

const onPageChange = (pageInfo: any) => {
  if (!props.currentCaseId) {
    return MessagePlugin.error('System Error')
  }
  getResListData(pageInfo.pagination.current, pageInfo.pagination.pageSize)
}

// tables
const columns = [
  { colKey: 'id', title: 'Id' },
  { colKey: 'content', title: 'Content'},
  { colKey: 'attachment', title: 'Attachment' },
  { colKey: 'createTime', title: 'Create Time' },
  { colKey: 'creator', title: 'Creator' },
  { colKey: 'groupName', title: 'Group' },
  { colKey: 'opened', title: 'Opened' },
  { colKey: 'action', title: 'Action' },
]

const notes = ref()
const notesTableHeight = ref()

// 监听刷新事件
emitter.on('freshNotes', () => {
  if (!props.currentCaseId) {
    return MessagePlugin.error('System Error')
  }
  getResListData(notePagination.value.current, notePagination.value.pageSize)
})

const changeRes = (item: any) => {
  updateResources({
    id: item.id,
    opened: item.opened,
    content: item.content
  })
  .then((res)=> {
    MessagePlugin.success('Updated Successfully')
  })
}

const addToResourcePlus = (item: any, type: number) => {
  let param = {
    caseId: props.currentCaseId,
    type: type,
    resourceId: item.id,
    content: item.content
  }
  addResources(param)
  .then((res: any)=> {
    if (res.msg == 'success') {
      if (type == 2) {
        item.shareToFactor = 1
        return MessagePlugin.success('Added to Case Factors Successfully')
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
      getResListData(notePagination.value.current, notePagination.value.pageSize)
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

onMounted(()=> {
  if (!props.currentCaseId) {
    return MessagePlugin.error('System Error')
  }
  initGroup()
  getResListData(notePagination.value.current, notePagination.value.pageSize)
  notesTableHeight.value = notes.value.offsetHeight - 120
})
</script>

<style lang="scss" scoped>
.notes {
  height: 100%;
}
</style>