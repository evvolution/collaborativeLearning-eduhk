import { defineStore } from 'pinia'

export const useRouterStore = defineStore({
  id: 'currentMenu',
  state: () => ({
    currentMenu: 0,
  }),
  actions: {
    setCurrentRouter(currentMenu: number) {
      this.currentMenu = currentMenu
    }
  },
  // 设置为true，缓存state
  persist: true,
})
