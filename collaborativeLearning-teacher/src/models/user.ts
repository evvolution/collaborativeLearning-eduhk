/**
 * @description: Login interface parameters
 */

export interface UserInfo {
  name: string
  id: number
  username: string
  email: string
  introduction: string
  avatar: string
  groupName: string
  head: string
}

export interface UserState {
  userInfo: UserInfo
  te_token?: string
}
