<template>
  <div class="notice-view commonView">
    <t-tabs :default-value="1" @change="initList">
      <t-tab-panel :value="1" label="Notice">
        <t-list :split="true" size="large" id="noticeList">
          <t-list-item v-for="item in noticeList" @click="showDetail(item, 0)" :style="{'background': item.readed == 1 ? '#00000010' : ''}">
            <t-badge :count="item.readed == 1 ? '' : 'new'" color="#0052D9">
              <t-list-item-meta image="" :title="item.title" :description="`${item.createTime}, from:${item.teacherId}`" />
            </t-badge>
            <template #action>
              <t-link theme="primary" hover="color">Got it</t-link>
            </template>
          </t-list-item>
        </t-list>
        <t-row align="middle" style="padding: 0 12px;">
          <t-col :span="8"><t-button @click="readAllNoticeDouble">Read all</t-button></t-col>
          <t-col :span="4">
            <div class="pageNum">
              <t-pagination :total="noticeListTotal" :pageSizeOptions='[10, 20, 50]' @change="handleChangeNotice" />
            </div>
          </t-col>
        </t-row>
        <t-back-top
          container="#noticeList"
          :visible-height="0"
          style="position: absolute"
          theme="primary"
          :offset="['100px', '80px']"
        ></t-back-top>
      </t-tab-panel>
      <t-tab-panel :value="2" label="System Infomation">
        <t-list :split="true" size="large" id="noticeSysList">
          <t-list-item v-for="item in noticeSysList" @click="showDetail(item, 1)">
            <t-badge :count="item.readed == 1 ? '' : 'new'" color="#0052D9">
              <t-list-item-meta image="" :title="item.content" :description="`${item.createTime}, from: System`"  />
            </t-badge>
            <template #action>
              <t-link theme="primary" hover="color">Got it</t-link>
            </template>
          </t-list-item>
        </t-list>
        <t-row align="middle" style="padding: 0 12px;">
          <t-col :span="8"><t-button @click="readAllNoticeDouble">Read all</t-button></t-col>
          <t-col :span="4">
            <div class="pageNum">
              <t-pagination :total="noticeSysListTotal" :pageSizeOptions='[10, 20, 50]' @change="handleChangeNoticeSys" />
            </div>
          </t-col>
        </t-row>
        <t-back-top
          container="#noticeSysList"
          :visible-height="0"
          style="position: absolute"
          theme="primary"
          :offset="['100px', '80px']"
        ></t-back-top>
      </t-tab-panel>
    </t-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next'
import { getNotices, readNotice, readAllNotice, getSysNotices, readSysNotice, readAllSysNotice } from '@/api/modules/notice'

import { useRouterStore } from '@/store/router'
const routerStore = useRouterStore()
// routerStore.currentMenu = 5

// const noticeLoading = ref(true)
const noticeList = ref()
const noticeListTotal = ref()
const getNoticeList = (current: number, pageSize: number) => {
  getNotices(current, pageSize)
  .then((res: any)=> {
    noticeList.value = res.data
    noticeListTotal.value = res.pageData.total
    // noticeLoading.value = false
  })
  .catch((err)=> {
    console.error(err)
  })
}
const handleChangeNotice = (pageInfo: any) => {
  getNoticeList(pageInfo.current, pageInfo.pageSize)
}

// const noticeSysLoading = ref(true)
const noticeSysList = ref()
const noticeSysListTotal = ref()
const getSysNoticeList = (current: number, pageSize: number) => {
  getSysNotices(current, pageSize)
  .then((res: any)=> {
    noticeSysList.value = res.data
    noticeSysListTotal.value = res.pageData.total
    // noticeSysLoading.value = false
  })
  .catch((err)=> {
    console.error(err)
  })
}
const handleChangeNoticeSys = (pageInfo: any) => {
  getSysNoticeList(pageInfo.current, pageInfo.pageSize)
}

const showDetail = (item: any, type: number) => {
  const noticeDialog = DialogPlugin({
    header: `${item.title}`,
    body: `[from: ${item.teacherId ?? 'System'}] ${item.content}`,
    cancelBtn: null,
    closeBtn: false,
    confirmBtn: 'Got it',
    onConfirm: () => {
      if ( type === 0 ) {
        readNotice(item.id)
        .then((res: any)=>{
          MessagePlugin.success('Ok')
          noticeDialog.hide()
        })
        .catch((err)=>{
          console.error(err)
        })
      } else if (type === 1) {
        readSysNotice(item.id)
        .then((res)=>{
          MessagePlugin.success('Ok')
          noticeDialog.hide()
        })
        .catch((err)=>{
          console.error(err)
        })
      }
    },
  })
}

const readAllNoticeDouble = () => {
  const readAllNoticeDoubleModal = DialogPlugin.confirm({
    header: `Read ALL ${currentType.value == 1 ? '' : 'System'} Notice`,
    body: `Are you sure to set all ${currentType.value == 1 ? '' : 'system'} notice read?`,
    confirmBtn: 'ok',
    cancelBtn: 'cancel',
    onConfirm: () => {
      setAllNotice(currentType.value)
      readAllNoticeDoubleModal.hide()
    },
    onClose: () => {
      readAllNoticeDoubleModal.hide()
    },
  })
}

const setAllNotice = (type: number) => {
  if (type == 1) {
    readAllNotice()
    .then(()=> {
      getNoticeList(1, 10)
      MessagePlugin.success('You Have Read All Notice')
    })
    .catch((err)=>{
      console.error(err)
    })
  } else if (type == 2) {
    readAllSysNotice()
    .then(()=> {
      getSysNoticeList(1, 10)
      MessagePlugin.success('You Have Read All System Notice')
    })
    .catch((err)=>{
      console.error(err)
    })
  }
}

const currentType = ref(1)
const initList = (value: number) => {
  if( value == 1 ) {
    currentType.value = 1
    getNoticeList(1, 10)
  } else if ( value == 2 ) {
    currentType.value = 2
    getSysNoticeList(1, 10)
  }
}

onMounted(()=> {
  getNoticeList(1, 10)
})

</script>

<style scoped>
.t-tabs {
  border-radius: 12px;
}

.notice-view {
  padding: 12px;
}

#noticeList, #noticeSysList {
  position: relative;
  min-height: calc(100vh - 186px);
  max-height: calc(100vh - 186px);
  overflow-y: auto;
  padding-bottom: 12px
}
</style>