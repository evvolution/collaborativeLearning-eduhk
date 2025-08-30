// src/api/types.ts
// export interface ChatItem {
//   id: number
//   caseId: number
//   content: string
//   createTime: string
//   updateTime: string
//   userId: number
//   childList?: ChatItem[]
// }

export interface ChatMessage {
  caseId: number
  content: string
}

// 示例类型定义
export interface ChatItem {
  id: number
  content: string
  createTime: string
  updateTime: string
  memberName: string
  memberHead?: string
  childList?: ChatItem[]
  loveCount: number
  isLove: number
  shareToNote: number
  shareToFactor: number
}