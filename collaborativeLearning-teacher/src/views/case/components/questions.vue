<template>
  <div class="questions-view commonView">
    <t-card title="Questionnaire Preview" hover-shadow class="display">
      <div class="preview-title">
        {{saveParam.name}}
      </div>
      <div class="preview-q">
        <VueDraggable v-model="qlist">
          <div v-for="(item, index) in qlist" class="q-item">
            <!-- <div class="q-tag">
              <t-tag theme="primary">{{index}}</t-tag>
            </div> -->
            <div class="q-content">
              <template v-if="item.type != 3">
                <div class="q-title">{{item.title}}</div>
                <div class="q-subtitle">{{item.subTitle}}</div>
                <div class="q-body">

                  <t-input v-if='item.type == 0' placeholder="please input your answer..."></t-input>
                  
                  <t-radio-group default-value="1" v-else-if='item.type == 1'>
                    <t-radio :value="true">True</t-radio>
                    <t-radio :value="false">False</t-radio>
                  </t-radio-group>

                  <t-radio-group default-value="1" v-else-if='item.type == 2'>
                    <t-radio v-for="ritem in item.items.split('##')" :value="ritem">{{ritem}}</t-radio>
                  </t-radio-group>
                </div>
              </template>
              
              <template v-else>
                <t-card @click="goUrl(item.url)" style="cursor: pointer;">
                  <div class="q-title">
                    <t-space align="center"><t-icon name="link" />{{item.title}}</t-space>
                  </div>
                  <div class="q-subtitle">{{item.subTitle}}</div>
                </t-card>
              </template>
            </div>
          </div>
        </VueDraggable>
      </div>
    </t-card>
    <t-card :bordered="false" hover-shadow class="plugins">
      <template #title>
        <t-space align="center">
          <t-select 
            placeholder="please choose..."
            @change="setCurrentCaseQId"
          >
            <t-option
              v-for="options in qTitleList"
              :label="options.name" 
              :value="options.id"
              :disabled="options.state == 0"
            />
          </t-select>
          <t-button theme="success" @click="showList = true" content="Settings and Results"> 
            <template #icon> <t-icon name="list" /> </template>
          </t-button>
        </t-space>
      </template>
      <template #actions>
        <t-space>
          <t-dropdown :options="saveOptions" @click="saveClickHandler">
            <t-button theme="primary"> Save </t-button>
          </t-dropdown>

          <t-button theme="primary" variant="outline" @click="back2List"> Back </t-button>
        </t-space>
      </template>
      <t-list >
        <template #header> 
          <t-tag theme="warning" shape="round" variant="outline" size="large">
            Plugins List
          </t-tag>
        </template>
        <t-list-item>
          Simple Question
          <template #action>
            <t-button theme="warning" @click="add(0)"> + ADD </t-button>
          </template>
        </t-list-item>
        <t-list-item>
          True Or False Question
          <template #action>
            <t-button theme="warning" @click="add(1)"> + ADD </t-button>
          </template>
        </t-list-item>
        <t-list-item>
          Single Choice Question
          <template #action>
            <t-button theme="warning" @click="add(2)"> + ADD </t-button>
          </template>
        </t-list-item>
        <t-list-item>
          Link
          <template #action>
            <t-button theme="warning" @click="add(3)"> + ADD </t-button>
          </template>
        </t-list-item>
      </t-list>
      <t-divider />
      <t-list >
        <template #header> 
          <t-tag theme="danger" shape="round" variant="outline" size="large">
            Basic Settings
          </t-tag>
        </template>
        <t-list-item>
          <t-form label-align="top" style="width: 100%;">
            <t-form-item label="Questionnaire Title">
              <t-input v-model="saveParam.name" placeholder="please input the title"></t-input>
            </t-form-item>
            <!-- <t-form-item label="Time Period Available">
              <t-date-range-picker clearable @pick="onPick" v-model="qTimePreiodRange"/>
            </t-form-item>
            <t-form-item label="Filling Limit">
              <t-input-number placeholder="limit" v-model="saveParam.limit"/>
            </t-form-item> -->
          </t-form>
        </t-list-item>
      </t-list>
    </t-card>

    <!-- ======================== -->
    <t-dialog 
      v-model:visible="simpleVisible"
      @confirm="addQuestion"
      @cancel="cancelQuestion"
      confirmBtn="add"
      :closeBtn="false"
      header="Add New Simply Question"
    >
      <t-badge dot count="*" ><h4>Title</h4></t-badge><br/>
      <t-input v-model="addData.title" placeholder="title..."></t-input><br/>
      <h4>SubTitle</h4>
      <t-input v-model="addData.subTitle" placeholder="subTitle..."></t-input>
    </t-dialog>

    <!-- ======================== -->
    <t-dialog
      v-model:visible="ynVisible"
      @confirm="addQuestion"
      @cancel="cancelQuestion"
      confirmBtn="add"
      :closeBtn="false"
      header="Add True Or False Question"
    >
      <t-badge dot count="*" ><h4>Title</h4></t-badge><br/>
      <t-input v-model="addData.title" placeholder="title..."></t-input><br/>
      <h4>SubTitle</h4>
      <t-input v-model="addData.subTitle" placeholder="subTitle..."></t-input>
    </t-dialog>

    <!-- ======================== -->
    <t-dialog
      v-model:visible="choiceVisible"
      @confirm="addQuestion"
      @cancel="cancelQuestion"
      confirmBtn="add"
      :closeBtn="false"
      header="Add Single Choice Question"
    >
      <t-badge dot count="*" ><h4>Title</h4></t-badge><br/>
      <t-input v-model="addData.title" placeholder="title..."></t-input><br/>
      <h4>SubTitle</h4>
      <t-input v-model="addData.subTitle" placeholder="subTitle..."></t-input><br/>
      <t-badge dot count="*" ><h4>Items</h4></t-badge><br/>
      <t-input v-model="addData.items" placeholder="please use '##' as the divider"></t-input><br/>
      <t-alert message="FOR EXAMPLE: apple##banana##orange##watermelon" />
    </t-dialog>

    <!-- ======================== -->
    <t-dialog
      v-model:visible="showList"
      :footer="false"
      header="Questionnaires Settings and Results"
      width="40%"
    >
      <t-table
        :data="qTitleList" 
        :columns="qTitleColumns"
        :hover="true"
        maxHeight="450"    
      >
        <template #state="{ row }">
          <t-switch v-model="row.state" :customValue="[1, 0]" :label="['ENABLE','DISABLED']" @change="updateState(row)"></t-switch>
        </template>
        <template #result="{ row }">
          <t-button content="Show Result" variant="text" theme="primary" @click="showQResult(row)"></t-button>
        </template>
      </t-table>
    </t-dialog>
    
    <!-- ======================== -->
    <t-dialog
      v-model:visible="qResult"
      :footer="false"
      :header='`${currentQResult} Collected Result`'
      width="80%"
      @opened="showQResultList"
    >
      <t-space style="overflow-x: auto;" :size="1">

        <t-list class="standardList-y">
          <template #header>
            <div class="standardHeader">Questions\Names</div>
          </template>
          <t-list-item v-for="item in questionArr_yAxis" class="standardCell-y">
            {{item}}
          </t-list-item>
        </t-list>
        <t-space
          direction="vertical" 
          v-for="item in questionArr_xAxis" class="standardList-x"
          :size="0"
        >
          <t-list>
            <template #header>
              <div class="standardHeader">{{item.name}}</div>
            </template>
            <t-list-item v-for="item2 in item.answers" class="standardCell-x">
              {{item2}}
            </t-list-item>
          </t-list>
        </t-space>
      </t-space>
    </t-dialog>

    <!-- ======================== -->
    <t-dialog
      v-model:visible="LinkVisible"
      @confirm="addQuestion"
      @cancel="cancelQuestion"
      confirmBtn="add"
      :closeBtn="false"
      header="Add New Link"
    >
      <t-badge dot count="*" ><h4>Title</h4></t-badge><br/>
      <t-input v-model="addData.title" placeholder="title..."></t-input><br/>
      <h4>SubTitle</h4>
      <t-input v-model="addData.subTitle" placeholder="subTitle..."></t-input><br/>
      <h4>URL</h4>
      <t-input v-model="addData.url" placeholder="url..."></t-input>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { addQuestionnaire, getQuestionnaireAnswer, getQuestionnaireDetail, getQuestionnaireList, updateQuestionnaire } from '@/api/modules/question'
import router from '@/router'
import { onMounted, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { MessagePlugin } from 'tdesign-vue-next'
// import { timeStamp2time } from '@/utils/common'

const goUrl = (url: any) => {
  window.open(url, '_blank')
}

const simpleVisible = ref(false)
const ynVisible = ref(false)
const choiceVisible = ref(false)
const LinkVisible = ref(false)

const url = window.location.href
const currentCaseId = Number(url.split('/')[url.split('/').length - 1])

const back2List = () => {
  // router.push({ name: 'Case'})
  router.go(-1)
}

const saveOptions = [
  { content: 'Create', value: 1 },
  { content: 'Update', value: 2 },
]
const saveAsNew = ref(false)
const saveClickHandler = (data: any) => {
  // console.log(data)
  if (data.value == 1) {
  // 新建
    saveAsNew.value = true
  } else if (data.value == 2){
  // 更新
    saveAsNew.value = false
  }
  saveCurrentQuestionnaire()
}

const currentType = ref()
const add = (type: number) => {
  currentType.value = type
  if (currentType.value == 0) {
    simpleVisible.value = true
  } else if (currentType.value == 1) {
    ynVisible.value = true
  } else if (currentType.value == 2) {
    choiceVisible.value = true
  } else if (currentType.value == 3) {
    LinkVisible.value = true
  }
}

const cancelQuestion = () => {
  if (currentType.value == 0) {
    simpleVisible.value = false
  } else if (currentType.value == 1) {
    ynVisible.value = false
  } else if (currentType.value == 2) {
    choiceVisible.value = false
  } else if (currentType.value == 3) {
    LinkVisible.value = false
  }
}

const addData = ref({
  type: 0,
  title: '',
  subTitle: '',
  items: '',
  answer: '',
  url: ''
})

const addQuestion = () => {
  addData.value.type = Number(currentType.value)
  if (currentType.value == 0 || 1) {
    if (addData.value.title) {
      qlist.value.unshift(addData.value)
    }
  } else if (currentType.value == 2) {
    if (addData.value.title && addData.value.items) {
      qlist.value.unshift(addData.value)
    }
  }
  addData.value = {
    type: 0,
    title: '',
    subTitle: '',
    items: '',
    answer: '',
    url: ''
  }
  cancelQuestion()
}

const qlist = ref<any>([])
const saveParam = ref<any>({
  caseId: currentCaseId,
  content: '',
  name: '',
  // startTime: '',
  // endTime: '',
  state: 1,
  id: '',
  // limit: 1
})

// const qTimePreiodRange = ref([timeStamp2time(saveParam.value.startTime), timeStamp2time(saveParam.value.endTime)])
// const onPick = (value: any, context: { partial: string }) => {
//   if (context.partial == 'start') {
//     saveParam.value.startTime = value.getTime()
//   }
//   if (context.partial == 'end') {
//     saveParam.value.endTime = value.getTime()
//   }
// }

const saveCurrentQuestionnaire = () => {
  let contentJson: any = {
    question: []
  }
  for (let i = 0; i < qlist.value.length; i++) {
    contentJson.question[i] = qlist.value[i]
  }
  saveParam.value.content = JSON.stringify(contentJson)

  // console.log('saveParam', saveParam.value)
  if (saveParam.value.name == '') {
    return MessagePlugin.warning('Please input Questionnaire Name')
  } 
  if (contentJson.question.length == 0) {
    return MessagePlugin.warning('At least one item')
  }
  // if (saveParam.value.startTime == '') {
  //   return MessagePlugin.warning('StartTime is blank')
  // }
  // if (saveParam.value.endTime == '') {
  //   return MessagePlugin.warning('EndTime is blank')
  // }

  if (qCurrentCaseQId.value == '' || saveAsNew.value) {
    // console.log('create')
    // 新建
    addQuestionnaire(saveParam.value)
    .then((res)=> {
      // console.log(res)
      MessagePlugin.success('Created successfully')
      getQuestionnaireList(currentCaseId)
    })
    .catch((err) => {
      console.error(err)
    })
  } else if (qCurrentCaseQId.value != '' && !saveAsNew.value){
    // console.log('update')
    // 更新
    saveParam.value.id = qCurrentCaseQId.value
    updateQuestionnaire(saveParam.value)
    .then((res)=> {
      // console.log(res)
      MessagePlugin.success('Updated successfully')
      getQuestionnaireList(currentCaseId)
    })
    .catch((err) => {
      console.error(err)
    })
  }
}

const qCurrentCaseQId = ref('')
const setCurrentCaseQId = (value: any) => {
  qCurrentCaseQId.value = value
  getQuestionnaireDetail(value)
  .then((res)=> {
    // console.log(res.data)
    qlist.value = JSON.parse(res.data.content).question
    // qTimePreiodRange.value = [timeStamp2time(res.data.startTime), timeStamp2time(res.data.endTime)]
    saveParam.value = {
      content: JSON.parse(res.data.content).question,
      name: res.data.name,
      // startTime: res.data.startTime,
      // endTime: res.data.endTime,
      state: 1,
      // limit: res.data.limit
    }
  })
  .catch((err)=> {
    console.error(err)
  })
}

const qTitleList = ref()
const handle_initQuestionnaireLists = () => {
  let param = {
    caseId: currentCaseId,
    current: 1,
    size: 1000
  }
  getQuestionnaireList(param)
  .then((res)=> {
    if ( res.data.length === 0 ) {
      MessagePlugin.warning('No Data, you can create a new questionnaire')
    } else {
      // 用于筛选
      qTitleList.value = res.data
    }
  })
  .catch((err)=> {
    console.error(err)
  })
}

const showList = ref(false)
const qTitleColumns = [
  { colKey: 'id', title: 'Id' },
  { colKey: 'name', title: 'Title' },
  { colKey: 'state', title: 'State' },
  { colKey: 'result', title: 'Result' },
]
const updateState = (item: any) => {
  item.state = item.state
  updateQuestionnaire(item)
  .then((res: any)=> {
    if (res.msg == 'success') {
      handle_initQuestionnaireLists()
      return MessagePlugin.warning('Updated')
    }
  })
  .catch((err: any) => {
    console.error(err)
  })
}

const qResult = ref<any>(false)
const currentQResult = ref<any>()
const currentQId = ref<any>()
const questionArr_yAxis = ref<any>([])
const showQResult = (item: any) => {
  questionArr_yAxis.value = []
  qResult.value = true
  currentQResult.value = item.name
  currentQId.value = item.id
  for (let i = 0; i < JSON.parse(item.content).question.length; i++) {
    questionArr_yAxis.value.push(JSON.parse(item.content).question[i].title)
  }
  console.log(questionArr_yAxis.value)
}
const questionArr_xAxis = ref<any>([])
const showQResultList = () => {
  getQuestionnaireAnswer(currentQId.value)
  .then((res: any)=> {
    questionArr_xAxis.value = []
    for (let i = 0; i < res.data.length; i++) {
      let tmp: any = []
      for (let j = 0; j < JSON.parse(JSON.parse(res.data[i].content).question).length; j++) {
        tmp.push(JSON.parse(JSON.parse(res.data[i].content).question)[j].answer)
      }
      questionArr_xAxis.value.push({
        name: res.data[i].memberName,
        answers: tmp
      })
    }
    console.log('sss', questionArr_xAxis.value)
  })
}

onMounted(()=> {
  handle_initQuestionnaireLists()
})

</script>
<style scoped lang="scss">
.questions-view {
  position: relative;
  display: flex;
  column-gap: 12px;
  padding: 12px;
  box-sizing: border-box;
  height: 100vh;
  .display {
    flex: 2;
    .preview-title {
      position: relative;
      width: 50%;
      margin: 2vh auto 3vh;
      font-size: 1.2vw;
      font-weight: 600;
      text-align: center;
    }
    .preview-q {
      position: relative;
      width: 40%;
      height: 80vh;
      margin: 0 auto;
      margin-bottom: .5vh;
      overflow-y: auto;
    }
    .q-item {
      margin-bottom: 2vh;
      // display: flex;
      column-gap: 1vw;
      border-bottom: 1px solid #eee;
      padding-bottom: 12px;
      .q-title {
        font-size: .8vw;
        margin-bottom: .5vh;
      }
      .q-subtitle {
        font-size: .6vw;
        margin-bottom: .3vh;
        color: #333
      }
      .q-body {
        width: 100%;
      }
    }
  }
  .plugins {
    flex: 1;
  }
}


.standardCell-y {
  height: 36px;
  border: 1px solid #0052d9;
  border-bottom: none;
}

.standardList-y:last-child {
  border-bottom: 1px solid #0052d9;
}

.standardCell-x {
  height: 36px;
  border: 1px solid #0052d9;
  border-bottom: none;
}

.standardList-x.standardList-x:last-child {
  border-bottom: 1px solid #0052d9;
  // border-right: 1px solid #0052d9;
}

.standardHeader {
  color: #0052d9;
}
</style>