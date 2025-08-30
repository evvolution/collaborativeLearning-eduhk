import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // 菜单项的值
    menuValue?: number
  }
}