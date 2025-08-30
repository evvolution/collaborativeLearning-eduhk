<template>
  <t-space align="center" style="margin: 12px;">
    <t-button content="Add User" @click="showAdd = true"></t-button>
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
  </t-space>
  <t-table
    row-key="index"
    :data="stuList"
    :columns="columns"
    :stripe="true"
    :bordered="true"
    :hover="true"
    table-layout="fixed"
    :max-height="maxHeight"
    size="medium"
    :show-header="true"
    cell-empty-content="-"
  >
    <template #head="{ row }">
      <t-avatar shape="round" size="30px" :image="row.head"></t-avatar> 
    </template>
    <template #action="{ row }">
      <t-space align="center">
        <t-button variant="text" theme="success" @click="openEdit(row)">Edit</t-button>
        <t-popconfirm 
          :content="`Are you sure to reset${row.name}'s password?'`"
          @confirm="resetPwd(row)"
        >
          <t-button variant="text" theme="primary">Reset Password</t-button>
        </t-popconfirm>
      </t-space>
    </template>
  </t-table>
  <add-new 
    :show="showAdd"
    @cancel-add="showAdd = false"
    @confirm-add="initList"
  />
  <edit
    :visible="showEdit"
    :user-data="currentUser"
    @cancel-edit="showEdit = false"
    @confirm-edit="initList"
  />
</template>
  
<script setup lang="ts">
import { getGroupList, getStudentList, resetStudentPassword, updateStudent } from '@/api/modules/users';
import { ref } from 'vue'
import addNew from './components/addNew.vue'
import edit from './components/edit.vue'
import NotificationPlugin from 'tdesign-vue-next/es/notification/plugin';

const maxHeight: number = window.innerHeight - 200
const stuList = ref()

const currentGroup = ref<any>()
const groupList = ref<any>([])
const initGroup = () => {
  getGroupList().then((res)=> {
    groupList.value = res.data
  })
}

const getListByGroup = () => {
  initList(currentGroup.value)
}

const clearGroup = () => {
  initList()
}


const columns = ref([
  {
    colKey: 'id',
    title: 'ID',
  },
  {
    colKey: 'head',
    title: 'Avatar',
  },
  {
    colKey: 'name',
    title: 'Student Name',
  },
  {
    colKey: 'username',
    title: 'Student Account Name',
  },
  {
    colKey: 'groupName',
    title: 'Group',
  },
  {
    colKey: 'action',
    title: 'Action',
  }
])

// add
const showAdd = ref(false)

// edit
const showEdit = ref(false)
const currentUser = ref<any>({})
const openEdit = (item: any) => {
  showEdit.value = true
  currentUser.value = item
}

// pwd
const resetPwd = (item: any) => {
  resetStudentPassword(item.id)
  .then((res)=> {
    NotificationPlugin.success({
      title: `You have reset ${item.name}'s password`,
      content: 'New Password is 12345678'
    })
    initList()
  })
}

const initList = (groupNum?: any) => {
  getStudentList({
    groupNum: groupNum
  })
  .then((res)=> {
    stuList.value = res.data
  })
}

initGroup()
initList()
</script>
  
<style scoped lang="scss"></style>