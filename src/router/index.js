import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router)

/* layout */
import Layout from '../views/layout/Layout'

/**
* icon : the icon show in the sidebar
* hidden : if `hidden:true` will not show in the sidebar
* redirect : if `redirect:noredirect` will no redirct in the levelbar
* noDropdown : if `noDropdown:true` will has no submenu
* meta : { role: ['admin'] }  will control the page role
**/
export const constantRouterMap = [
    { path: '/login', component: _import('login/index'), hidden: true },
    { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
    { path: '/404', component: _import('errorPage/404'), hidden: true },
    { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/map/index',
    name: '首页',
    hidden: true,
    children: [{ path: 'dashboard', component: _import('map/index') }]
  },
  {
    path: '/introduction',
    component: Layout,
    redirect: '/introduction/index',
    icon: 'people',
    noDropdown: true,
    children: [{ path: 'index', component: _import('introduction/index'), name: '个人信息' }]
  },
  {
    path: '/map',
    component: Layout,
    redirect: '/map/index',
    icon: 'zujian',
    noDropdown: true,
    children: [{ path: 'index', component: _import('map/index'), name: '网格地图' }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/operationlog',
    component: Layout,
    redirect: '/operationlog/index',
    name: '操作日志',
    icon: 'lock',
    meta: { role: ['admin'] },
    noDropdown: true,
    children: [{ path: 'index', component: _import('operationlog/index'), name: '操作记录', meta: { role: ['admin'] }}]
  },
  {
    path: '/gridbusiness',
    component: Layout,
    redirect: '/gridbusiness/index',
    name: '网格业务',
    icon: 'wanggeyuan',
    children: [
      { path: 'index', component: _import('gridbusiness/index'), name: '业务配置' },
      { path: 'laws', component: _import('gridbusiness/laws'), name: '法律法规' },
      { path: 'treatment', component: _import('gridbusiness/treatment'), name: '业务处理' }
    ]
  },
  {
    path: '/schedule',
    component: Layout,
    redirect: '/schedule/index',
    name: '工作日程',
    icon: 'chart',
    children: [
      { path: 'index', component: _import('schedule/index'), name: '考勤配置', meta: { role: ['40'] }},
      { path: 'leave', component: _import('schedule/leave'), name: '请假', meta: { role: ['70'] }},
      { path: 'shift', component: _import('schedule/shift'), name: '换班', meta: { role: ['60'] }}
    ]
  },
  {
    path: '/staff',
    component: Layout,
    redirect: '/staff/index',
    name: '部门管理',
    icon: 'dep',
    children: [
      { path: 'index', component: _import('staff/index'), name: '人员信息', meta: { role: ['10'] }},
      { path: 'depment', component: _import('staff/depment'), name: '部门信息', meta: { role: ['20'] }},
      { path: 'duty', component: _import('staff/duty'), name: '职位信息', meta: { role: ['120'] }}
    ]
  },
  { path: '*', redirect: '/401', hidden: true }
]
