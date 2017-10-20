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
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    name: '权限测试',
    icon: 'lock',
    meta: { role: ['admin'] },
    noDropdown: true,
    children: [{ path: 'index', component: _import('permission/index'), name: '权限测试页', meta: { role: ['admin'] }}]
  },
  // {
  //   path: '/icon',
  //   component: Layout,
  //   icon: 'icon',
  //   noDropdown: true,
  //   children: [{ path: 'index', component: _import('svg-icons/index'), name: 'icons' }]
  // },
  // {
  //   path: '/components',
  //   component: Layout,
  //   redirect: '/components/index',
  //   name: '组件',
  //   icon: 'component',
  //   children: [
  //     { path: 'index', component: _import('components/index'), name: '介绍 ' },
  //     { path: 'tinymce', component: _import('components/tinymce'), name: '富文本编辑器' },
  //     { path: 'markdown', component: _import('components/markdown'), name: 'Markdown' },
  //     { path: 'jsoneditor', component: _import('components/jsonEditor'), name: 'JSON编辑器' },
  //     { path: 'dndlist', component: _import('components/dndList'), name: '列表拖拽' },
  //     { path: 'splitpane', component: _import('components/splitpane'), name: 'SplitPane' },
  //     { path: 'avatarupload', component: _import('components/avatarUpload'), name: '头像上传' },
  //     { path: 'dropzone', component: _import('components/dropzone'), name: 'Dropzone' },
  //     { path: 'sticky', component: _import('components/sticky'), name: 'Sticky' },
  //     { path: 'countto', component: _import('components/countTo'), name: 'CountTo' },
  //     { path: 'mixin', component: _import('components/mixin'), name: '小组件' },
  //     { path: 'backtotop', component: _import('components/backToTop'), name: '返回顶部' }
  //   ]
  // },
  {
    path: '/schedule',
    component: Layout,
    redirect: '/schedule/index',
    name: '工作日程',
    icon: 'chart',
    children: [
      { path: 'index', component: _import('schedule/index'), name: '考勤配置', meta: { role: ['40'] }}
    ]
  },
  {
    path: '/staff',
    component: Layout,
    redirect: '/staff/index',
    name: '部门管理',
    icon: 'example',
    children: [
      { path: 'index', component: _import('staff/index'), name: '人员信息', meta: { role: ['10'] }},
      { path: 'depment', component: _import('staff/depment'), name: '部门信息', meta: { role: ['20'] }},
      { path: 'duty', component: _import('staff/duty'), name: '职位信息', meta: { role: ['120'] }}
    ]
  },
  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: '错误页面',
  //   icon: '404',
  //   children: [
  //     { path: '401', component: _import('errorPage/401'), name: '401' },
  //     { path: '404', component: _import('errorPage/404'), name: '404' }
  //   ]
  // },
  // {
  //   path: '/errlog',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'errlog',
  //   icon: 'bug',
  //   noDropdown: true,
  //   children: [{ path: 'log', component: _import('errlog/index'), name: '错误日志' }]
  // },
  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/download',
  //   name: 'excel',
  //   icon: 'excel',
  //   children: [
  //     { path: 'download', component: _import('excel/index'), name: 'export excel' },
  //     { path: 'download2', component: _import('excel/selectExcel'), name: 'export selected' },
  //     { path: 'upload', component: _import('excel/uploadExcel'), name: 'upload excel' }
  //   ]
  // },
  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   name: 'zip',
  //   icon: 'zip',
  //   children: [
  //     { path: 'download', component: _import('zip/index'), name: 'export zip' }
  //   ]
  // },
  // {
  //   path: '/theme',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'theme',
  //   icon: 'theme',
  //   noDropdown: true,
  //   children: [{ path: 'index', component: _import('theme/index'), name: '换肤' }]
  // },
  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   icon: 'clipboard',
  //   noDropdown: true,
  //   children: [{ path: 'index', component: _import('clipboard/index'), name: 'clipboard' }]
  // },

  { path: '*', redirect: '/404', hidden: true }
]
