import { type RouteRecordRaw } from 'vue-router'
const LAYOUT = () => import('@/layout/index.vue')
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Index',
    redirect: '/home/index',
    component: LAYOUT,
    children: [{
      path: '/home/index',
      name: 'HomeIndex',
      component: () => import('@/views/home/index.vue'),
      meta: { menuValue: 0 }
    }]
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/home/index',
    component: LAYOUT,
    children: [{
      path: '/home/index',
      name: 'HomeIndex',
      component: () => import('@/views/home/index.vue'),
      meta: { menuValue: 0 }
    }]
  },
  {
    path: '/survey',
    name: 'survey',
    component: () => import('@/views/home/survey.vue'),
    meta: { menuValue: 0 }
  },
  {
    path: '/case',
    name: 'Case',
    redirect: '/Case/index',
    component: LAYOUT,
    children: [{
      path: '/case/index',
      name: 'CaseIndex',
      component: () => import('@/views/case/index.vue'),
      meta: { menuValue: 1 }
    }]
  },
  {
    path: '/cased/:name/:id',
    name: 'CaseDetail',
    component: () => import('@/views/case/detail.vue'),
    meta: { menuValue: 1 }
  },
  {
    path: '/caseq/:name/:id',
    name: 'CaseQuestionnaire',
    component: () => import('@/views/case/questions.vue'),
    meta: { menuValue: 1 }
  },
  {
    path: '/resource',
    name: 'Resource',
    redirect: '/resource/index',
    component: LAYOUT,
    children: [{
      path: '/resource/index',
      name: 'ResourceIndex',
      component: () => import('@/views/resource/index.vue'),
      meta: { menuValue: 2 }
    }]
  },
  {
    path: '/data',
    name: 'Data',
    redirect: '/data/index',
    component: LAYOUT,
    children: [{
      path: '/data/index',
      name: 'DataIndex',
      component: () => import('@/views/data/index.vue'),
      meta: { menuValue: 3 }
    }]
  },
  {
    path: '/notice',
    name: 'Notice',
    redirect: '/notice/index',
    component: LAYOUT,
    children: [{
      path: '/notice/index',
      name: 'NoticeIndex',
      component: () => import('@/views/notice/index.vue'),
      meta: { menuValue: 4 }
    }]
  },
  {
    path: '/user',
    name: 'User',
    redirect: '/user/index',
    component: LAYOUT,
    children: [{
      path: '/user/index',
      name: 'UserIndex',
      component: () => import('@/views/user/index.vue'),
      meta: { menuValue: 5 }
    }]
  },
  {
    path: '/team',
    name: 'Team',
    redirect: '/team/index',
    component: LAYOUT,
    children: [{
      path: '/team/index',
      name: 'TeamIndex',
      component: () => import('@/views/team/index.vue'),
      meta: { menuValue: 6 }
    }]
  }
]
export default routes