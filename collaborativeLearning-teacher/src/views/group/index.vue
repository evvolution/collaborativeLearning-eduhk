<template>
  <div class="commonView">
    <t-tabs :value="groupValue" placement="left" @change="handlerGroupChange">
      <t-tab-panel 
        class="group-view" 
        :value="index" 
        :label="item.name" 
        v-for="(item, index) in caseList"
      >
        <div class="case-res">
          <div class="title">Group Memos</div>
          <t-list :split="true" class="case-list">
            <t-list-item v-for="(item, index) in memoData" :key="index">
              <template #content>
                <t-comment 
                  :avatar="item.avatar" 
                  :author="item.author" 
                  :datetime="item.datetime" 
                  :content="item.content"
                >
                </t-comment>
              </template>
            </t-list-item>
          </t-list>
          <div class="pageNum">
            <t-pagination :total="10" :pageSizeOptions='[10, 20, 50]' @change="handlerChangeMemo" />
          </div>
        </div>
        <div class="group-res">
          <div class="title">Group Members' PaperWork</div>
          <t-list :split="true">
            <t-list-item v-for="(item, index) in paperWorkData" :key="index">
              <template #content>
                <t-comment 
                  :avatar="item.avatar" 
                  :author="item.author" 
                  :datetime="item.datetime" 
                  :content="item.content"
                >
                  <template #actions>
                    <t-space :size="6">
                      <t-icon name="download" />
                      <span>Download</span>
                    </t-space>
                  </template>
                </t-comment>
              </template>
            </t-list-item>
            <template #footer>
              <t-button @click="uploadVisible = true"> Upload My PaperWork </t-button>
            </template>
          </t-list>
        </div>
      </t-tab-panel>
    </t-tabs>
  </div>
  <t-dialog 
    v-model:visible="uploadVisible"
    header="Upload your paperwork"
  >
    <t-textarea 
      placeholder="Paperwork Introductions" 
      :autosize="{ minRows: 4, maxRows: 4 }"
      :maxcharacter="150"
    />
    <t-upload 
      theme="custom"
    >
      <t-button theme="primary"><template #icon> <t-icon name="upload" /> </template> Upload</t-button>
    </t-upload>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCaseList } from '@/api/modules/case'

const groupValue = ref(0)
const handlerGroupChange = (newValue: number) => {
  groupValue.value = newValue
}

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

const handleChangeCase = (pageInfo: any) => {
  initCaseList(pageInfo.current, pageInfo.pageSize)
}


// 小组笔记部分
const memoData = ref([
  {
    id: 'A',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'GroupMember1',
    datetime: '今天16:38',
    content: 'Memo Title',
  },
  {
    id: 'B',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'GroupMember2',
    datetime: '今天16:38',
    content: 'text2',
  },
  {
    id: 'C',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'GroupMember3',
    datetime: '今天16:38',
    content: 'text3',
  },
  {
    id: 'D',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'Me',
    datetime: '今天16:38',
    content: 'text4',
  },
  {
    id: 'B',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'GroupMember2',
    datetime: '今天16:38',
    content: 'text2',
  },
  {
    id: 'C',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'GroupMember3',
    datetime: '今天16:38',
    content: 'text3',
  },
  {
    id: 'D',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'Me',
    datetime: '今天16:38',
    content: 'text4',
  },
  {
    id: 'B',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'GroupMember2',
    datetime: '今天16:38',
    content: 'text2',
  },
  {
    id: 'C',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'GroupMember3',
    datetime: '今天16:38',
    content: 'text3',
  },
  {
    id: 'D',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'Me',
    datetime: '今天16:38',
    content: 'text4',
  },{
    id: 'D',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'Me',
    datetime: '今天16:38',
    content: 'text4',
  },
  {
    id: 'B',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'GroupMember2',
    datetime: '今天16:38',
    content: 'text2',
  },
  {
    id: 'C',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'GroupMember3',
    datetime: '今天16:38',
    content: 'text3',
  },
  {
    id: 'D',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'Me',
    datetime: '今天16:38',
    content: 'text4',
  }
])

const handlerChangeMemo = () => {
  // todo 小组列表分页
}

const initGroupMemo = () => {
  // todo 获取小组某一课题笔记、注解列表
  // memoData
}

/* ================================================================================================== */

// 作业部分
const paperWorkData = ref([
  {
    id: 'A',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'GroupMember1',
    datetime: '今天16:38',
    content: 'paper memos',
  },
  {
    id: 'B',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'GroupMember2',
    datetime: '今天16:38',
    content: 'paper memos',
  },
  {
    id: 'C',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'GroupMember3',
    datetime: '今天16:38',
    content: 'paper memos',
  },
  {
    id: 'D',
    avatar: 'https://tdesign.gtimg.com/site/avatar.jpg',
    author: 'Me',
    datetime: '今天16:38',
    content: 'paper memos',
  },
])

const initGroupPapers = () => {
  // todo 获取小组某一课题小组作业
  // paperWorkData
}


// 上传文件
const uploadVisible = ref(false)

onMounted(()=> {
  initCaseList(1, 100)
})
</script>

<style scoped lang="scss">
.group-view {
  position: relative;
  display: flex;
  column-gap: 12px;
  min-height: calc(100vh - 86px);
  max-height: calc(100vh - 86px);
  .title {
    height: 30px;
    line-height: 30px;
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 12px;
  }
}
.case-res {
  flex: 1;
  position: relative;
  padding: 12px;
  background-color: #e1e1e1e1;
  .case-list {
    position: relative;
    height: calc(100% - 80px);
    overflow-y: scroll;
  }
  .pageNum {
    position: relative;
    height: 50px;
  }
}
.group-res {
  flex: 1;
  position: relative;
  padding: 12px;
}
</style>