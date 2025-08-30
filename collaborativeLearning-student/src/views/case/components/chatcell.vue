<template>
  <div 
    class="chat-cell"
    :class="[`chat-cell-${userStore.userInfo.name == chatItem?.memberName ? 'mine' : 'others'}`]"
    v-if="chatItem"
    :id="`chat-${chatItem.id}`"
  >
    <t-comment
      :avatar="userStore.userInfo.name == chatItem?.memberName ? userStore.userInfo?.head : chatItem?.memberHead"
      :author="chatItem?.memberName"
      :datetime="chatItem?.createTime"
      class="cell-content"
    >
      <template #content>
        <t-typography-text copyable>{{ chatItem?.content }}</t-typography-text>
      </template> 

      <template #actions>
        <t-space align="center" :size="1">
          <t-icon v-if="!chatItem.isLove" name="thumb-up" @click="like(chatItem)" />
          <t-icon v-else name="thumb-up" color="#ad352f" />
          {{chatItem?.loveCount}}
        </t-space>

        <t-popup v-if="!chatItem.shareToNote" trigger="hover" placement="bottom" content="Add To My Notebook">
          <t-icon name="folder-add-1" @click="addToResource(chatItem, 3)"/>
        </t-popup>
        <t-popup v-else trigger="hover" placement="bottom" content="Remove note">
          <t-icon name="folder-add-1" color="#ad352f" @click="removeRes(chatItem, 3)"/>
        </t-popup>

        <t-space align="center" :size="1">
          <t-icon name="chat" />
          <t-button variant="text" theme="base" size="small" @click="showReply(chatItem, '')" content="Reply"></t-button>
        </t-space>
      </template>

      <template #reply>
        <t-comment
          v-if="chatItem?.childList.length != 0"
          v-for="replyItem in chatItem?.childList"
          :avatar="replyItem?.memberHead"
          :datetime="replyItem?.createTime"
          :id="`chat-${replyItem.id}`"
        >
          <template #author>
            <t-space :size="1">
              <div class="reply-tagAt" @click="showReply(replyItem, replyItem?.id)">
                @{{replyItem?.memberName}} 
              </div>&nbsp;
              <h4>{{replyItem?.atMemberName ? 'To ' + replyItem?.atMemberName : ''}}</h4>
            </t-space>
          </template>

          <template #content>
            <t-typography-text copyable>{{ replyItem?.content }}</t-typography-text>
          </template>

          <template #actions>
            <t-space v-if="replyItem">
              <t-space align="center" :size="1">
                <t-icon v-if="!replyItem.isLove" name="thumb-up" @click="like(replyItem)" />
                <t-icon v-else name="thumb-up" color="#ad352f" />
                {{replyItem?.loveCount}}
              </t-space>

              <t-popup v-if="!replyItem.shareToNote" trigger="hover" placement="bottom" content="Add To My Notebook">
                <t-icon name="folder-add-1" @click="addToResource(replyItem, 3)"/>
              </t-popup>
              <t-popup v-else trigger="hover" placement="bottom" content="Remove note">
                <t-icon name="folder-add-1" color="#ad352f" @click="removeRes(replyItem, 3)"/>
              </t-popup>
            </t-space>

          </template>
        </t-comment>
      </template>
    </t-comment>
  </div>

  <t-dialog 
    v-model:visible="replyVisible"
    :body="replyParam.content"
    @confirm="replyMsg"
    @cancel="cancelReplyMsg"
    :closeBtn="false"
    attach="body"
  >
    <template #header>
      <t-alert theme="info" :message="replyType == 0 ? chatItem?.content : ''">
        <template #title>
          Reply To {{replyType == 1 && currentChatItem ? currentChatItem.memberName : chatItem?.memberName}}
        </template>
      </t-alert>
    </template>
    <t-textarea 
      v-model="replyParam.content" 
      placeholder="please input your reply" 
      :autosize="{ minRows: 5, maxRows: 5 }"
    />
  </t-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import { addNewChat, loveChat } from '@/api/modules/case'
import { MessagePlugin } from 'tdesign-vue-next'
import { addResources, cancelResourcesFromChat } from '@/api/modules/resource'
const userStore = useUserStore()
const props = defineProps({
  chatItem: Object,
  currentCaseId: {
    type: Number,
    default: 0
  }
})

const replyType = ref<any>(null)
const replyVisible = ref(false)
const replyParam = ref<any>({})
const currentChatItem = ref<any>({})
const showReply = (item: any, atId: any) => {
  replyType.value = atId ? 1 : 0
  currentChatItem.value = item
  replyVisible.value = true
  
  // 修复 at 功能的 pid 设置
  // 对于 at 功能，我们需要确保 pid 是正确的父消息 ID
  const parentId = atId ? (item.pid || item.id) : item.id
  
  replyParam.value = {
    caseId: props?.currentCaseId,
    content: '',
    pid: parentId,
    atChatId: atId,
    // 保存被回复人的名字，用于后续显示
    atMemberName: item.memberName
  }
  
  console.log('Reply params:', replyType.value, replyParam.value, 'Current item:', item)
}

const replyMsg = () => {
  if (replyParam.value.content == '') {
    return MessagePlugin.warning('Please input your message')
  }
  
  console.log('Sending reply:', replyParam.value)
  
  addNewChat(replyParam.value)
  .then((res: any)=> {
    console.log('Reply response:', res)
    
    if (res.code == 200) {
      replyParam.value.content = ''
      replyVisible.value = false
      
      // 只做前端加！确保与后端数据一致
      const newReplyItem = {
        createTime: res.data.createTime,
        content: res.data.content,
        memberHead: res.data.memberHead,
        memberName: res.data.memberName,
        id: res.data.id,
        pid: replyParam.value.pid,
        loveCount: 0,
        isLove: 0,
        shareToNote: 0,
        // 使用保存在 replyParam 中的 atMemberName
        atMemberName: replyType.value === 1 ? replyParam.value.atMemberName : ''
      }
      
      // 找到正确的父消息来添加回复
      // 对于 at 功能，我们需要找到真正的父消息
      let targetChatItem = currentChatItem.value
      
      // 如果是 at 功能且当前项不是父消息，需要找到父消息
      if (replyType.value === 1 && targetChatItem.pid) {
        // 尝试从 props.chatItem 中找到父消息
        if (props.chatItem && props.chatItem.id === replyParam.value.pid) {
          targetChatItem = props.chatItem
        }
        // 如果找不到，可能需要通过事件通知父组件来处理
        else {
          console.log('Need to find parent chat item with id:', replyParam.value.pid)
          // 发送特殊事件，让父组件处理添加回复到正确的父消息
          emit('addReplyToParent', {
            parentId: replyParam.value.pid,
            reply: newReplyItem
          })
          emit('isReply', replyParam.value.pid)
          return
        }
      }
      
      // 确保 childList 存在
      if (!targetChatItem.childList) {
        targetChatItem.childList = []
      }
      
      console.log('Adding reply to chat item:', targetChatItem.id)
      
      // 添加到目标聊天项的子列表中
      targetChatItem.childList.push(newReplyItem)
      
      // 通知父组件已回复，传递被回复消息的ID，用于滚动到该位置
      emit('isReply', targetChatItem.id)
    } else {
      MessagePlugin.warning(res.msg)
    }
  })
  .catch((err)=> {
    console.error(err)
  })
}
const cancelReplyMsg = () => {
  replyParam.value.content = ''
  replyVisible.value = false
}

const emit = defineEmits(['isReply', 'addReplyToParent'])

const like = (item: any) => {
  let param = {
    id: item.id,
    love: 1
  } 
  loveChat(param)
  .then((res: any)=> {
    if (res.code == 200) {
      item.isLove = 1
      item.loveCount ++
    } 
  })
}

// add
const addToResource = (item: any, type: number) => {
  let preJson = {
    text: item.content,
    url: null,
    creator: item.memberName
  }
  let param = {
    caseId: props.currentCaseId,
    type: type,
    opened: 1,
    content: JSON.stringify(preJson),
    chatId: item.id
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
    chatId: item.id,
    type: type
  }
  cancelResourcesFromChat(param)
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

</script>

<style lang="scss" scoped>

.chat-cell {
  margin-bottom: 12px;
  width: 60%;
  padding: 12px;
  border-radius: 6px;
}

.chat-cell-mine {
  float: right;
  background-color: #2DC252;
  color: aliceblue;
}

.chat-cell-others {
  background-color: #ededed;
  float: left;
}

.reply-tagAt {
  font-size: 16px;
}
.reply-tagAt:hover {
  color: #0052d9; /* 这里使用了一个蓝色示例，你可以根据需要修改为其他颜色 */
}
</style>