<template>
  <div class="chat-room">
    <transition>
      <div 
        class="list"
        id="listchat"
        ref="listchat"
        @scroll="scrollHandler"
        v-cloak
      > 
        <t-loading v-if="chatLoading"/>
        <chatcell v-for="(item, index) in chatList" :key="item.id" :chat-Item="item" :currentCaseId="props.currentCaseId" @is-reply="handle_isReply" @add-reply-to-parent="handleAddReplyToParent"/>
      </div>
    </transition>

    <div class="input">
      <t-comment :avatar="userStore.userInfo?.head">
        <template #content>
          <t-textarea 
            v-model="chat_message.content" 
            placeholder="please input your mesaage" 
            :autosize="{ minRows: 5, maxRows: 5 }"
          />
          <div class="input-send">
            <t-row>
              <t-col :span="6">
                <t-space size="small" align="center">
                  <t-button shape="square" variant="text" @click="handle_chat_emoji('😀')">😀</t-button>
                  <t-button shape="square" variant="text" @click="handle_chat_emoji('🤨')">🤨</t-button>
                  <t-button shape="square" variant="text" @click="handle_chat_emoji('🙁')">🙁</t-button>
                </t-space>
              </t-col>
              <t-col :span="6" style="text-align: right;">
                <t-button theme="primary" @click="handle_chat_send">Send</t-button>
              </t-col>
            </t-row>
          </div>
        </template>
      </t-comment>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick, watch } from 'vue'
import { useUserStore } from '@/store/user'
const userStore = useUserStore()

import chatcell from './chatcell.vue'
import { addNewChat, getChatList } from '@/api/modules/case'
import { MessagePlugin } from 'tdesign-vue-next'
import emitter from '@/utils/mitt'

import throttle from 'lodash/throttle'
const isScrolling = ref(false)
const scrollTimeout = ref<any>(null)
const handleScroll = (event: any) => {
  if (scrollLock.value) return // 滚动锁定期间不处理滚动事件
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
  isScrolling.value = true
  isReply.value = false
  scrollTimeout.value = setTimeout(() => {
    isScrolling.value = false
  }, 2000);
  if (event.target.scrollTop === 0) {
    if (isMore.value) {
      getScrollMoreChatList()
    } else {
      MessagePlugin.warning('No more message')
    }
  }
}
const scrollHandler = throttle(handleScroll, 500)

const isReply = ref(false)
const handle_isReply = (chatId: number) => {
  isReply.value = true
  console.log('Scrolling to chat ID:', chatId)
  
  // 延迟执行，确保DOM已更新
  nextTick(() => {
    // 查找被回复的消息元素
    const replyElement = document.getElementById(`chat-${chatId}`)
    if (replyElement) {
      console.log('Found element, scrolling to:', `chat-${chatId}`)
      
      // 计算元素底部位置
      const elementRect = replyElement.getBoundingClientRect()
      const elementBottom = elementRect.bottom
      
      // 获取聊天列表容器
      const chatContainer = document.getElementById("listchat")
      if (chatContainer) {
        // 计算需要滚动的位置，使消息底部可见
        const containerRect = chatContainer.getBoundingClientRect()
        const scrollOffset = elementBottom - containerRect.bottom + 50 // 额外50px确保完全可见
        
        // 滚动到计算出的位置
        chatContainer.scrollBy({
          top: scrollOffset,
          behavior: 'smooth'
        })
      } else {
        // 如果找不到容器，退回到默认行为
        replyElement.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
    } else {
      console.error('Element not found:', `chat-${chatId}`)
    }
  })
}

// 处理添加回复到父消息的事件
const handleAddReplyToParent = (data: any) => {
  console.log('Adding reply to parent:', data)
  // 在 chatList 中查找父消息
  const parentChat = chatList.value.find((chat: { id: any }) => chat.id === data.parentId)
  
  if (parentChat) {
    // 确保 childList 存在
    if (!parentChat.childList) {
      parentChat.childList = []
    }
    
    // 添加回复到父消息
    parentChat.childList.push(data.reply)
    console.log('Reply added to parent chat:', parentChat.id)
    
    // 设置 isReply 为 true，并滚动到父消息位置
    isReply.value = true
    console.log('Adding reply to parent, scrolling to:', data.parentId)
    
    // 延迟执行，确保DOM已更新
    nextTick(() => {
      const replyElement = document.getElementById(`chat-${data.parentId}`)
      if (replyElement) {
        console.log('Found parent element, scrolling to:', `chat-${data.parentId}`)
        
        // 计算元素底部位置
        const elementRect = replyElement.getBoundingClientRect()
        const elementBottom = elementRect.bottom
        
        // 获取聊天列表容器
        const chatContainer = document.getElementById("listchat")
        if (chatContainer) {
          // 计算需要滚动的位置，使消息底部可见
          const containerRect = chatContainer.getBoundingClientRect()
          const scrollOffset = elementBottom - containerRect.bottom + 50 // 额外50px确保完全可见
          
          // 滚动到计算出的位置
          chatContainer.scrollBy({
            top: scrollOffset,
            behavior: 'smooth'
          })
        } else {
          // 如果找不到容器，退回到默认行为
          replyElement.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
      } else {
        console.error('Parent element not found:', `chat-${data.parentId}`)
      }
    })
  } else {
    console.error('Parent chat not found:', data.parentId)
  }
}

const props = defineProps({
  currentCaseId: {
    type: Number,
    default: 0
  }
})

const chatList = ref<any>([])
const chatCurrent = ref<any>(1)
const chatLoading = ref(false)
const isMore = ref(true)
const chatStartId = ref<any>()

const getInitChatList = () => {
  let param = {
    caseId: props.currentCaseId,
    current: 1,
    size: 10,
    latest: true,
    startId: null
  }
  chatLoading.value = true
  chatList.value = []
  getChatList(param)
  .then((res: any)=> {
    chatLoading.value = false
    chatList.value = res.data
    chatStartId.value = res.data[res.data.length - 1]?.id
    if (chatList.value.length < res.pageData.total) {
      isMore.value = true
      chatCurrent.value++
    } else {
      isMore.value = false
    }
    nextTick(() => {
      scrollToBottom()
    })
  })
}

// 新增滚动锁定相关逻辑
const scrollLock = ref(false)
const prevScrollInfo = ref({ height: 0, top: 0 })

const getAutoMoreChatList = async () => {
  try {
    scrollLock.value = true // 开始加载时锁定滚动
    const listElement = document.getElementById("listchat")
    if (listElement) {
      prevScrollInfo.value = {
        height: listElement.scrollHeight,
        top: listElement.scrollTop
      }
    }

    const param = {
      caseId: props.currentCaseId,
      current: 1,
      size: 10,
      latest: true,
      startId: chatStartId.value
    }
    
    chatLoading.value = true
    const res = await getChatList(param)
    
    if (res.data.length > 0) {
      // 创建一个已存在消息ID的集合，用于去重
      const existingIds = new Set()
      chatList.value.forEach((chat: { id: unknown; childList: any[] }) => {
        existingIds.add(chat.id)
        // 也添加子回复的ID
        if (chat.childList && chat.childList.length > 0) {
          chat.childList.forEach(reply => existingIds.add(reply.id))
        }
      })
      
      // 过滤掉已经存在的消息
      const filteredNewMessages = res.data.filter((msg: { id: unknown }) => !existingIds.has(msg.id))
      
      // 如果有新消息，才更新列表
      if (filteredNewMessages.length > 0) {
        // 使用冻结对象避免临时更新导致的DOM变化
        const newMessages = Object.freeze([...filteredNewMessages])
        
        // 使用requestAnimationFrame保证DOM更新和滚动同步
        requestAnimationFrame(() => {
          chatList.value = Object.freeze([...chatList.value, ...newMessages])
          chatStartId.value = res.data[res.data.length - 1].id // 使用原始数据的最后一个ID
          
          nextTick(() => {
            const listElement = document.getElementById("listchat")
            if (listElement) {
              // 精确计算高度差并保持滚动位置
              const heightDiff = listElement.scrollHeight - prevScrollInfo.value.height
              listElement.scrollTop = prevScrollInfo.value.top + heightDiff
              
              // 智能滚动判断（增加更大的缓冲区域）
              const isNearBottom = listElement.scrollHeight - listElement.scrollTop <= listElement.clientHeight + 300
              if (isNearBottom) {
                scrollToBottom()
              }
            }
            scrollLock.value = false
          })
        })
      } else {
        // 没有新消息，只更新最后一个ID
        chatStartId.value = res.data[res.data.length - 1].id
        scrollLock.value = false
      }
    } else {
      scrollLock.value = false
    }
  } catch (error) {
    console.error(error)
    scrollLock.value = false
  } finally {
    chatLoading.value = false
  }
}

const getScrollMoreChatList = () => {
  const listElement = document.getElementById("listchat")
  const prevScrollHeight = listElement?.scrollHeight || 0
  const prevScrollTop = listElement?.scrollTop || 0

  let param = {
    caseId: props.currentCaseId,
    current: chatCurrent.value,
    size: 10,
    latest: true,
    startId: null
  }
  getChatList(param)
  .then((res: any)=> {
    chatLoading.value = false
    if (res.data.length !== 0) {
      chatList.value = [...res.data, ...chatList.value]
      chatCurrent.value++
      isMore.value = true
      nextTick(() => {
        if (listElement) {
          const newScrollHeight = listElement.scrollHeight
          listElement.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight)
        }
      })
    } else {
      isMore.value = false
    }
  })
}

// ================================================ 发送部分
interface chatmessage {
  caseId: any,
  content: String
}

const chat_message = ref<chatmessage>({
  caseId: props.currentCaseId,
  content: ''
})

const handle_chat_emoji = (emoji: any) => {
  chat_message.value.content += emoji
}

const handle_chat_send = () => {
  if (chat_message.value.content === '') {
    return MessagePlugin.warning('Please input your message')
  }
  addNewChat(chat_message.value)
  .then((res: any)=> {
    if (res.code === 200) {
      isReply.value = false
      chat_message.value.content = ''
      chatCurrent.value = 1
      res.data.childList = []
      chatList.value.push(res.data)
      chatStartId.value = res.data.id
      // 发送新消息时，确保滚动到底部
      console.log('New message sent, scrolling to bottom')
      // 使用多重延迟确保DOM完全更新后再滚动
      nextTick(() => {
        // 第一次滚动
        scrollToBottom()
        
        // 再次延迟滚动，确保新消息完全渲染
        setTimeout(() => {
          scrollToBottom()
        }, 100)
      })
    } else {
      MessagePlugin.warning(res.msg)
    }
  })
  .catch((err)=> {
    console.error(err)
  })
}

const scrollToBottom = () => {
  const element = document.getElementById("listchat")
  if (element) {
    // 使用 setTimeout 确保在所有 DOM 更新后执行滚动
    setTimeout(() => {
      // 计算额外的滚动偏移量，确保新消息完全可见
      const extraOffset = 50 // 额外偏移量，确保新消息完全可见
      
      // 使用平滑滚动效果，并添加额外偏移量
      element.scrollTo({
        top: element.scrollHeight + extraOffset,
        behavior: 'smooth'
      })
      
      // 双重保险：再次检查滚动位置
      setTimeout(() => {
        if (element.scrollTop + element.clientHeight < element.scrollHeight - 10) {
          console.log('Scroll position check failed, forcing scroll to bottom with extra offset')
          element.scrollTop = element.scrollHeight + extraOffset
        }
      }, 100)
    }, 0)
  }
}

// 监听事件
emitter.on('preSendData', (data: any) => {
  chat_message.value.content = data
})

// 监听聊天列表变化
watch(chatList, () => {
  if (scrollLock.value) return // 滚动锁定期间不处理自动滚动
  
  const element = document.getElementById("listchat")
  if (!element) return

  // 使用更精确的滚动位置判断
  const threshold = 50 // 增加缓冲阈值
  const isNearBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + threshold
  
  // 只有在不是回复模式且用户在底部附近时，才自动滚动到底部
  // 这样可以确保只有在发送新消息时才滚动到底部
  if (!isScrolling.value && !isReply.value && isNearBottom) {
    console.log('Chat list changed, scrolling to bottom (not in reply mode)')
    requestAnimationFrame(() => {
      scrollToBottom()
    })
  } else if (isReply.value) {
    console.log('In reply mode, not scrolling to bottom')
  }
}, { deep: true, flush: 'post' })

// 专门监听 isReply 变化，不再自动滚动到底部
watch(isReply, (newVal) => {
  if (newVal) {
    // 只重置 isReply 状态，不再自动滚动
    setTimeout(() => {
      isReply.value = false
    }, 500)
  }
})

const freshTimer = ref<any>(null)
const autoFresh = () => {
  freshTimer.value = setInterval(()=> {
    getAutoMoreChatList()
  }, 10000)
}

onMounted(()=> {
  getInitChatList()
  autoFresh()
})

onUnmounted(() => {
  clearInterval(freshTimer.value)
})
</script>

<style lang="scss" scoped>
/* 保持原有样式不变 */
.chat-room {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  height: 100%;
}

.list {
  position: relative;
  overflow-y: scroll;
  height: 500vh;
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
  overflow-anchor: none; /* 禁用浏览器自动滚动锚定 */
}

.list::-webkit-scrollbar {
  display: none;
}
 
.list {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.input {
  flex: 1;
  .input-send {
    margin-top: 6px;
  }
}

[v-cloak] {
  display: none;
}
</style>