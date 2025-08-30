import { defineStore } from 'pinia'

export const useSettingStore = defineStore({
  id: 'loading',
  state: () => ({
    allLoading: false,
  }),
  actions: {
    setAllLoading(allLoading: boolean) {
      this.allLoading = allLoading
    }
  },
  // 设置为true，缓存state
  persist: true,
})
