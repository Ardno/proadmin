import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    role: ['admin','editor']     will control the page role (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [{
      path: 'index',
      component: _import('idx/index'),
      name: '首页',
      meta: { title: '首页', icon: 'dashboard', noCache: true }
    }]
  },
  {
    path: '/map',
    component: Layout,
    redirect: 'map/index',
    noDropdown: true,
    children: [{ path: 'index', component: _import('map/index'), name: '网格地图', meta: { title: '网格地图', icon: 'zujian' }}]
  },
  {
    path: '/msg',
    component: Layout,
    redirect: 'msg/index',
    noDropdown: true,
    children: [{ path: 'index', component: _import('message/index'), name: '我的消息', meta: { title: '我的消息', icon: 'icon-laba' }}]
  },
  {
    path: '/myattendance',
    component: Layout,
    redirect: 'schedule/myattendance',
    noDropdown: true,
    children: [{ path: 'myattendance', component: _import('schedule/myattendance'), name: '我的考勤', meta: { title: '我的考勤', icon: 'documentation' }}]
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
    redirect: 'operationlog/index',
    name: '操作日志',
    meta: { icon: 'lock', title: '操作日志' },
    children: [{ path: 'index', component: _import('operationlog/index'), name: '操作记录', meta: { role: ['110'], icon: 'lock', title: '操作记录' }}]
  },
  {
    path: '/gridbusiness',
    component: Layout,
    redirect: 'noredirect',
    name: '网格业务',
    meta: { icon: 'wanggeyuan', title: '网格业务' },
    children: [
      { path: 'event', component: _import('gridbusiness/event/event'), name: '事件列表', meta: { role: ['90'], title: '事件列表' }},
      { path: 'attendance', component: _import('schedule/attendance'), name: '考勤配置', meta: { role: ['40'], title: '考勤配置' }},
      { path: 'laws', component: _import('gridbusiness/laws'), name: '法律法规', meta: { role: ['140'], title: '法律法规' }}
      // { path: 'treatment', component: _import('gridbusiness/treatment'), name: '业务处理' }
    ]
  },
  {
    path: '/event',
    component: Layout,
    redirect: 'noredirect',
    name: '事件管理',
    meta: { icon: 'createtask_fill', title: '事件管理' },
    children: [
      { path: 'eventtype', component: _import('gridbusiness/event/eventtype'), name: '事件类型', meta: { role: ['80'], title: '事件类型' }},
      { path: 'eventstep', component: _import('gridbusiness/event/eventstep'), name: '事件步骤', meta: { role: ['150'], title: '事件步骤' }},
      { path: 'editeventstep/:id', component: _import('gridbusiness/event/editeventstep'), name: '编辑步骤', meta: { role: ['151', '152'], title: '编辑步骤' }}
    ]
  },
  {
    path: '/schedule',
    component: Layout,
    redirect: '/schedule/index',
    name: '工作日程',
    meta: { icon: 'chart', title: '工作日程' },
    children: [
      { path: 'index', component: _import('schedule/index'), name: '工作记录', meta: { title: '工作记录' }},
      { path: 'attendancelist', component: _import('schedule/attendancelist'), name: '考勤记录', meta: { title: '考勤记录' }},
      { path: 'leave', component: _import('schedule/leave'), name: '请假', meta: { role: ['70'], title: '请假' }},
      { path: 'shift', component: _import('schedule/shift'), name: '换班', meta: { role: ['60'], title: '换班' }}
    ]
  },
  {
    path: '/staff',
    component: Layout,
    redirect: '/staff/index',
    name: '部门管理',
    meta: { icon: 'dep', title: '部门管理' },
    children: [
      { path: 'index', component: _import('staff/index'), name: '人员列表', meta: { role: ['10'], title: '人员列表' }},
      { path: 'depment', component: _import('staff/depment'), name: '部门树形架构', meta: { role: ['20'], title: '部门树形架构' }},
      { path: 'duty', component: _import('staff/duty'), name: '职位列表', meta: { role: ['120'], title: '职位列表' }}
    ]
  },
  {
    path: '/seal',
    component: Layout,
    redirect: '/seal/index',
    name: '电子印章',
    meta: { icon: 'people_fill', title: '电子印章' },
    children: [
      { path: 'index', component: _import('seal/index'), name: '电子印章', meta: { title: '电子印章' }}
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
