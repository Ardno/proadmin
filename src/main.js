import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import VueAMap from 'vue-amap'
import * as filters from './filters' // 全局filter
import './icons' // icon
import './errorLog'// error log
import './permission' // 权限
Vue.use(VueAMap)
Vue.use(ElementUI)
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
VueAMap.initAMapApiLoader({
  key: '94b913821c7541316bbcc7653a96c19e',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType',
    'AMap.CustomLayer', 'AMap.DistrictSearch', 'AMap.Geolocation', 'AMap.MouseTool',
    'AMap.AdvancedInfoWindow', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geocoder'],
  uiVersion: '1.0' // 版本号
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
