import { defineStore } from 'pinia'
import { getStuInfo, logoutSys } from '@/api/modules/login'
import type { UserState } from '../models/user'
import type { UserInfo } from '@/models/user'

import { RESEETSTORE } from '@/utils/reset'
export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    te_token: '',
    userInfo: <UserInfo>{},
  }),
  actions: {
    // setToken
    setToken(	te_token: string) {
      this.te_token = te_token
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
