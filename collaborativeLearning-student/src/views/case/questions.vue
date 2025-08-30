<template>
  <div class="questions-view commonView">
    <t-card hover-shadow class="display">
      <template #title>
        <t-tag theme="primary" variant="outline">
          <template #content>Questionnaire ID: {{currentQuestionnaire.id}}</template>
        </t-tag>
      </template>
      <template #content>
        <h2 style="text-align: center;">{{currentQuestionnaire.name}}</h2><br/>
        <div class="preview-q">
          <div v-for="item in currentList" class="q-item">
            <template v-if="item.type != 3">
              <div class="q-content">
                <div class="q-title">{{item.title}}</div>
                <div class="q-subtitle">{{item.subTitle}}</div>
                <div class="q-body">
                  <t-input v-if='item.type == 0' placeholder="please input your answer..." v-model="item.answer"></t-input>
                  <t-radio-group default-value="1" v-else-if='item.type == 1' v-model="item.answer">
                    <t-radio :value="true">True</t-radio>
                    <t-radio :value="false">False</t-radio>
                  </t-radio-group>
                  <t-radio-group default-value="1" v-else-if='item.type == 2' v-model="item.answer">
                    <t-radio v-for="ritem in item.items.split('##')" :value="ritem">{{ritem}}</t-radio>
                  </t-radio-group>
                </div>
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
      </template>
    </t-card>
    <t-card title="Questionnaire List" :bordered="false" hover-shadow class="plugins" v-if="!isPlugin">
      <template #actions>
        <t-space align="center">
          <t-button theme="primary" content="Commit" @click="commitQuestions"></t-button>
          <t-button theme="primary" content="Back" variant="outline" @click="back2List"></t-button>
        </t-space>
      </template>
      <template #content>
        <div class="qChoice"
          v-for="item in questionnaireList" 
          :data-qid="item.id"
          :class="{ 'activeItem' : currentQId == item.id }"
          @click="handleQChange(item.id)"
        >
          {{item.name}}
        </div>
      </template>
    </t-card>
    
  </div>
</template>

<script setup lang="ts">
import { getQuestionnaireList, getQuestionnaireDetail, answerQuestionnaire } from '@/api/modules/question'
import router from '@/router'
import { onMounted, ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { timeStamp2time } from '@/utils/common'

const props = defineProps({
  isPlugin: {
    default: false,
    type: Boolean
  },
  surveyId: {
    default: null,
    type: String
  }
})

const url = window.location.href
const currentCaseId = Number(url.split('/')[url.split('/').length - 1])

const goUrl = (url: any) => {
  window.open(url, '_blank')
}

const back2List = () => {
  router.push({ name: 'Case'})
}

const questionnaireList = ref<any>([])
const handle_initQuestionnaireList = () => {
  getQuestionnaireList(currentCaseId)
  .then((res: { data: string | any[] })=> {
    if ( res.data.length === 0 ) {
      MessagePlugin.warning('No Questionnaire')
      back2List()
    } else {
      // 用于筛选
      questionnaireList.value = res.data
    }
  })
  .catch((err: any)=> {
    console.error(err)
  })
}

const currentQId = ref()
const currentQuestionnaire = ref<any>({})
const currentList = ref<any>([])
const handleQChange = (id: any) => {
  currentQId.value = id
  getQuestionnaireDetail(id)
  .then((res: any)=> {
    currentQuestionnaire.value = res.data
    currentList.value = JSON.parse(res.data.content).question
  })
}

const commitQuestions = () => {
  let preJson = {
    question: JSON.stringify(currentList.value)
  }

  let param = {
    content: JSON.stringify(preJson),
    questionnaireId: currentQuestionnaire.value.id,
  }
  answerQuestionnaire(param)
  .then((res: any)=> {
    console.log(res)
    if (res.code == 200) {
      MessagePlugin.success('You have commit your answers')
    } else {
      MessagePlugin.warning(res.msg)
    }
  })
}

onMounted(()=> {
  if (props.isPlugin) {
    setTimeout(()=> {
      handleQChange(props.surveyId)
    }, 100)
  } else {
    handle_initQuestionnaireList()
  }
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
    flex: 3;
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

.qChoice {
  margin-bottom: 12px;
  cursor: pointer;
  padding: 16px;
  border-radius: 4px;
  background-color: transparent;
}
.activeItem {
  background-color: #003cab;
  color: #fff;
}
</style>