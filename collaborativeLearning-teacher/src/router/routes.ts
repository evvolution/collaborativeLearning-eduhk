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
      component: () => import('@/views/home/index.vue')
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
      component: () => import('@/views/home/index.vue')
    }]
  },
  {
    path: '/case',
    name: 'Case',
    redirect: '/case/index',
    component: LAYOUT,
    children: [{
      path: '/case/index',
      name: 'CaseIndex',
      component: () => import('@/views/case/index.vue')
    }]
  },
  {
    path: '/case/:name/:id',
    name: 'CaseDetail',
    component: () => import('@/views/case/detail.vue')
  },
  {
    path: '/caseq/:id',
    name: 'CaseQuestions',
    component: () => import('@/views/case/components/questions.vue')
  },
  {
    path: '/cased/:id',
    name: 'CaseDashboard',
    component: () => import('@/views/case/components/dashboard.vue')
  },
  {
    path: '/group',
    name: 'Group',
    redirect: '/group/index',
    component: LAYOUT,
    children: [{
      path: '/group/index',
      name: 'GroupIndex',
      component: () => import('@/views/group/index.vue')
    }]
  },
  {
    path: '/resource',
    name: 'Resource',
    redirect: '/resource/index',
    component: LAYOUT,
    children: [{
      path: '/resource/index',
      name: 'ResourceIndex',
      component: () => import('@/views/resource/index.vue')
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
      component: () => import('@/views/data/index.vue')
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
      component: () => import('@/views/notice/index.vue')
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
      component: () => import('@/views/user/index.vue')
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
      component: () => import('@/views/team/index.vue')
    }]
  },
  {
    path: '/survey',
    name: 'Survey',
    redirect: '/survey/index',
    component: LAYOUT,
    children: [{
      path: '/survey/index',
      name: 'SurveyIndex',
      component: () => import('@/views/survey/index.vue')
    }]
  }
]
export default routes