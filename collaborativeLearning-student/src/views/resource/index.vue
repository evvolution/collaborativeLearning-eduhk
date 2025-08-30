<template>
  <div class="res-view commonView">
    <div class="res-list common-scroll">
      <t-list-item 
        v-for="(item, index) in caseList"
        :class="{ active : currentIndex == index}"
        @click="selectCase(index, item.id, item.name)"
      >{{item.name}}
      </t-list-item>
    </div>
    <div class="res-panel" v-if="caseValue">
      <t-tabs v-model="resType" theme="card" @change="handleResTypeChange">
        <t-tab-panel :value="2" label="My NoteBook">
          <!-- <template #label>
            <t-space align="center">
              My NoteBook
              <t-button v-if="resType == 3" theme="danger" @click="addNewNote = true">Add</t-button>
            </t-space>
          </template> -->
          <myNotebook :id-high="idHigh_note" :case-id="caseValue" :res-type="resType" ref="notebook" @switch-tabs-to-factor="handle_switchToFactor"/>
        </t-tab-panel>
        <t-tab-panel :value="1" label="Group Notebook">
          <studentFactors :id-high="idHigh_factor" :case-id="caseValue" :res-type="resType" ref="factorList" @copy-to-notebook="handle_copy" @switch-tabs-to-notebook="handle_switchToNotebook"/>
        </t-tab-panel>
        <t-tab-panel :value="3" label="Teacher's Notebook">
          <teachingFactors :case-id="caseValue" :res-type="resType" @copy-to-notebook="handle_copy"/>
        </t-tab-panel>
        <t-tab-panel :value="4" :disabled="true" v-if="caseValue">
          <template #label>
            <router-link :to="{ name: 'CaseDetail', params: { id: caseValue, name: caseName } }">
              <t-link theme="primary" content='Go to Current Case'></t-link>
            </router-link>
          </template>
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
    :destroyOnClose="true"
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

  <!-- 最好的办法就是复制一个一样的 -->
  <t-dialog 
    :visible="copyNote"
    header="Copy to My NoteBook"
    :closeBtn="false"
    @confirm="handle_copy_confrim"
    @cancel="copyNote = false"
    :destroyOnClose="true"
  >
    <t-form label-align="top">
      <t-form-item label="Note Content" requiredMark>
        <t-textarea 
          v-model="copyNoteContent.text"
          :autosize="{ minRows: 15, maxRows: 30 }"
          :maxcharacter="1500"
        />
      </t-form-item>
      <t-form-item label="Note Attachment">
        <template v-if="copyNoteContent.file">
          <t-space align="center">
            <t-link :href="copyNoteContent.file.url" :content="copyNoteContent.file.name" theme="primary" />
            <t-icon name="delete" @click="removeCopyContentFile"/>
          </t-space>
        </template>
        <template v-else>
          <t-upload
            :size-limit="{ size: 10, unit: 'MB' }"
            :request-method="handle_file"
            :autoUpload="true"
            tips="less than 10MB"
            accept="*"
            @remove="handle_remove"
          />
        </template>
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
import { useRouter, useRoute } from 'vue-router'
const userStore = useUserStore()

import studentFactors from './components/studentFactors.vue'
import teachingFactors from './components/teachingFactors.vue'
import myNotebook from './components/myNotebook.vue'

import { uploadFileCom } from '@/api/modules/common'

const router = useRouter()
const route = useRoute()

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
    if (!!route.query.id) {
      for (let i = 0; i < res.data.length; i++) {
        if (route.query.id == res.data[i].id) {
          selectCase(i, res.data[i].id, res.data[i].name)
        }
      }
    }
  })
  .catch((err)=> {
    console.error(err)
  })
}

const caseValue = ref<any>(null)
const caseName = ref<any>('')
const currentIndex = ref()
const selectCase = (index: any, value: any, name: any) => {
  currentIndex.value = index
  caseValue.value = value
  caseName.value = name
  resType.value = 2
  if (notebook.value) {
    notebook.value.clearList()
    setTimeout(()=> {
      notebook.value.initList()
    }, 50)
  }
}

const resType = ref<any>(2)
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

// =================================================================================================
// 新增的
const copyNote = ref(false)
const copyNoteContent = ref<any>({})
const handle_copy = (val: any) => {
  copyNote.value = true // 唤起笔记添加窗口 copy
  handleResTypeChange(2) // 直接打开笔记页tab
  copyNoteContent.value = JSON.parse(val.content)
}
const removeCopyContentFile = () => {
  if(copyNoteContent.value.file) {
    copyNoteContent.value.file = null
  }
}

const handle_copy_confrim = () => {
  let preJson: any = {}
  if (!copyNoteContent.value.file) {
    preJson = {
      text: copyNoteContent.value.text,
      file: noteAttachmentList.value[0],
      creator: copyNoteContent.value.creator
    }
    copyNoteContent.value = {
      caseId: caseValue.value,
      type: 3,
      content: JSON.stringify(preJson)
    }
  } else {
    copyNoteContent.value = {
      caseId: caseValue.value,
      type: 3,
      content: JSON.stringify(copyNoteContent.value)
    }
  }
  console.log(copyNoteContent.value)

  // return
  addResources(copyNoteContent.value)
  .then((res: any)=> {
    if (res.code == 200) {
      if (notebook.value) {
        notebook.value.initList()
      }
      copyNoteContent.value = {}
      copyNote.value = false
      return MessagePlugin.success('Copied Successfully')
    }
  })
  .catch((err)=> {
    console.error(err)
  })
}

const factorList = ref<any>(null)
const idHigh_note = ref<any>()
const idHigh_factor = ref<any>()
// 处理刚发过来的高亮-从要素到笔记
const handle_switchToNotebook = (val: any) => {
  resType.value = 3
  idHigh_note.value = val
  if (notebook.value) {
    notebook.value.initList()
  }
}

// 处理刚发过来的高亮-从笔记到要素
const handle_switchToFactor = (val: any) => {
  resType.value = 1
  idHigh_factor.value = val
  if (factorList.value) {
    factorList.value.initList()
  }
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