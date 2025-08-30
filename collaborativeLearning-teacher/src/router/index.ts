import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/store/user'
import { notFoundRouter } from './const'
import routes from './routes'
import { constRoutes } from './const'

const ROUTER_WHITE_LIST = ['/404', '/login']

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [...routes, ...constRoutes]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  // 1.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由并放行到登陆页
  if (to.path === '/login') {
    if (userStore.te_token) return next(from.fullPath)
    return next()
  }

  // 2.判断访问页面是否在路由白名单(不需要登陆)地址中，如果存在直接放行
  if (ROUTER_WHITE_LIST.includes(to.path)) return next()

  // 3.判断是否有 Token，没有token跳转到登陆页面并且携带原目标路径
  if (!userStore.te_token) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }
  // 4.如果没有菜单列表，就重新请求菜单列表并添加动态路由
  // const authStore = useAuthStore()
  // authStore.setRouteName(to.name as string)
  // if (!authStore.authRouterList.length) {
  //   await initDynamicRouter()
  //   return next({ ...to, replace: true })
  // }
  router.addRoute(notFoundRouter)
  // 5.上述条件都不满足，直接放行
  return next()
})

// 全局后置钩子
router.afterEach((to, from) => {

})

export default router
