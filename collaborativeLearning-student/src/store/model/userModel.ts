export interface UserInfo {
  name: string
  id: number
  username: string
  email: string
  introduction: string
  avatar: string
  groupName: string
  head: string
  password: string
}

export interface UserState {
  userInfo: UserInfo
  token?: string
}