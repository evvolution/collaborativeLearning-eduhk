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
      <t-tabs v-model="resType" theme="card" @change="handleResTypeChange" >

        <t-tab-panel :value="2" label="Teaching NoteBook">
          <teachingFactors :case-id="caseValue" :res-type="resType"/>
        </t-tab-panel>
        <t-tab-panel :value="3" label="My NoteBook">
          <!-- <template #label>
            <t-space align="center">
              My NoteBook
              <t-button v-if="resType == 3" theme="danger" @click="addNewNote = true">Add</t-button>
            </t-space>
          </template> -->
          <!-- <myNotebook :case-id="caseValue" :res-type="resType" ref="notebook"/> -->
          <myNotebook :case-id="caseValue" :res-type="resType" ref="notebook" />
        </t-tab-panel>
        <t-tab-panel :value="1" label="Group Notebook">
          <studentFactors :case-id="caseValue" :res-type="resType" />
        </t-tab-panel>
      </t-tabs>
    </div>              
  </div>
  <t-dialog 
    :visible="addNewNote"
    header="Add New Note"
    :closeBtn="false"
    @confirm="handle_add"
    @cancel="addNewNote = false"
  >
    <t-form label-align="top">
      <t-form-item label="Note Content" requiredMark>
        <t-textarea 
          v-model="noteContent"
          :autosize="{ minRows: 15, maxRows: 30 }"
          :maxcharacter="1500"
        />
      </t-form-item>
      <t-form-item label="Note Attachment">
        <t-upload
          :size-limit="{ size: 10, unit: 'MB' }"
          :request-method="handle_file"
          :autoUpload="true"
          tips="less than 10MB"
          accept="*"
          @remove="handle_remove"
        />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCaseList } from '@/api/modules/case'
import { addResources } from '@/api/modules/resource'
import { MessagePlugin } from 'tdesign-vue-next'
import { useUserStore } from '@/store/user'
const userStore = useUserStore()

import studentFactors from './components/studentFactors.vue'
import teachingFactors from './components/teachingFactors.vue'
import myNotebook from './components/myNotebook.vue'

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
  resType.value = 3
  if (notebook.value) {
    notebook.value.initList()
  }
}

const resType = ref<any>(3)
const handleResTypeChange = (value: any) => {
  resType.value = value
}

const addNewNote = ref(false)
const addNewNoteData = ref<any>({})
const notebook = ref<any>(null)
const handle_add = () => {
  let contentJson = {
    text: noteContent.value,
    file: noteAttachmentList.value[0],
    creator: userStore.userInfo.name
  }
  addNewNoteData.value = {
    caseId: caseValue.value,
    type: 3,
    content: JSON.stringify(contentJson)
  }
  addResources(addNewNoteData.value)
  .then((res: any)=> {
    if (res.msg == 'success') {
      addNewNoteData.value = {}
      addNewNote.value = false
      if (notebook.value) {
        notebook.value.initList()
      }
      return MessagePlugin.success('Added Successfully')
    }
  })
  .catch((err)=> {
    console.error(err)
  })
}

const noteContent = ref()
const noteAttachmentList = ref<any>([])
const handle_file = (e: any) => {
  noteAttachmentList.value = []
  let tempFileParam = new FormData()
  tempFileParam.append('file', e.raw)
  return new Promise((resolve) => {
    uploadFileCom(tempFileParam)
    .then((res: any)=> {
      if (res.msg === 'success') {
        noteAttachmentList.value.push({
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

const handle_remove = () => {
  noteAttachmentList.value = []
} 

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