import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { DialogPlugin, LoadingPlugin } from 'tdesign-vue-next'
import { useUserStore } from '@/store/user'
import router from '@/router'
import { useSettingStore } from '@/store/setting'
axios.defaults.baseURL = 'http://47.76.37.174:8088/api/'
// axios.defaults.baseURL = 'http://vote.apkhubs.cn/u/'

// request拦截器
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    const te_token = userStore.te_token
    // LoadingPlugin(true)
    useSettingStore().allLoading = true
    if (te_token) {
      config.headers.te_token = te_token
    } 
    return config
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
      return Promise.reject({
        message: res.message || res.msg
      })
    }
  },
  // 处理
  (error) => {
    return Promise.reject(error)
  }
)
