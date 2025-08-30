import { defineStore } from 'pinia'
import { getStuInfo, logoutSys } from '@/api/modules/login'
import type { UserState, UserInfo } from './model/userModel'

import { RESEETSTORE } from '@/utils/reset'
export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: '',
    userInfo: <UserInfo>{},
  }),
  actions: {
    // setToken
    setToken(token: string) {
      this.token = token
    },
    // setUserInfo
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },
    async GetInfoAction() {
      const { data } = await getStuInfo()
      // 存储用户信息
      this.setUserInfo(data)
    },
    async Logout() {
      await logoutSys()
      RESEETSTORE()
    },
  },
  // 设置为true，缓存state
  persist: true,
})
