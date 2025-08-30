import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { DialogPlugin, LoadingPlugin, MessagePlugin } from 'tdesign-vue-next'
import { useUserStore } from '@/store/user'
import router from '@/router'
import { useSettingStore } from '@/store/setting'
// axios.defaults.baseURL = 'https://vote.apkhubs.cn/u/student'
axios.defaults.baseURL = 'http://47.76.37.174:8088/api/'

// request拦截器
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    const token = userStore.token
    // LoadingPlugin(true)
 
    if (userStore.userInfo.username == 'test4everyone') {
      MessagePlugin.warning('This is A Test Account')
      return Promise.reject()
    } else {
      useSettingStore().allLoading = true
      if (token) {
        config.headers.token = token
      } 
      return config
    }
  },
  (error) => {
    // 请求错误处理
    Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // 统一处理状态
    const userStore = useUserStore()
    const res = response.data
    if (res.ret === 0) {
      // 登录状态失效及其它
      const errDialog = DialogPlugin.alert({
        header: res.msg,
        body: 'Token is expired, please login again',
        style: 'z-index: 5000',
        closeBtn: false,
        closeOnOverlayClick: false,
        confirmBtn: 'Confirm',
        onConfirm: async ()=> {
          errDialog.hide()
          await userStore.Logout()
          router.push({ path: '/login'})
        }
      })
      return Promise.reject({
        message: res.message || res.msg
      })
    }
    if (response.status === 200 || res.code === 200 || res.ret === 1) {
      // LoadingPlugin(false)
      useSettingStore().allLoading = false
      return res
    } else {
      useSettingStore().allLoading = false
      return Promise.reject({
        message: res.message || res.msg
      })
    }
  },
  // 处理
  (error) => {
    useSettingStore().allLoading = false
    return Promise.reject(error)
  }
)
