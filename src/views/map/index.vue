<template>
  <div class="pht100 rel">
    <el-amap vid="amapDemo" ref="map" :center="center" :map-manager="amapManager" :zoom="zoom" :plugin="plugin" :events="events" class="amap-demo">
      <!-- 区域 -->
      <el-amap-polygon v-for="(polygon, index) in polygons" :key="index" :vid="index" :ref="`polygon_${index}`" :path="polygon.path" :events="polygon.events">
      </el-amap-polygon>
      <!-- 点坐标 -->
      <el-amap-marker v-for="(marker, index) in markerArr" :ref="`marker_${index}`" :key="index" :position="marker.position" :icon="marker.icon" :title="marker.title" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable">
      </el-amap-marker>
      <!-- 信息窗体 -->
      <el-amap-info-window v-for="(window, index) in windows" :ref="`window_${index}`" :key="index" :position="window.position" :content="window.content" :visible="window.visible" :events="window.events">
      </el-amap-info-window>
    </el-amap>
    <div class="pottoolbar" >
        <!-- 经纬度: [{{ lng }}, {{ lat }}]  -->
        地址: {{ address }}
    </div>
    <side-bar :mapobj="mapobj" :PathSimplifier='PathSimplifier' @seeting="getSetting"  @reloadMap="loadInit" @addRegion="getRegion"></side-bar>
    <!-- 区域信息 -->
    <el-dialog title="区域信息" size="tiny" :visible.sync="regionobj.dialogFormVisible"  >
      <el-form class="small-space"  label-position="top">
        <el-form-item label="所属部门" >
          <span  class="ml20">{{regionobj.department_name}}</span>
        </el-form-item>
        <el-form-item label="区域名称" >
          <span v-if="!regionobj.update" class="ml20">{{regionobj.name}}</span>
          <el-input v-else v-model="regionobj.name"></el-input>
        </el-form-item>
        <el-form-item label="区域人员">
          <span v-if="!regionobj.update" class="ml20">{{regionobj.username || '无'}}</span>
          <el-select class="pct100" v-else v-model="regionobj.userArr" multiple filterable placeholder="请选择">
            <el-option v-for="item in userArr" :key="item._id" :label="item.name" :value="item._id+''">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="isAccess('131')">
        <el-button v-show="!regionobj.update && isAccess('131')" class="ml20" @click="regionobj.update=true" type="text">修改</el-button>
        <el-button v-show="regionobj.update" class="ml20" @click="updateRegion" type="text">保存</el-button>
        <el-button v-show="regionobj.update" class="ml20" @click="regionobj.update=false" type="text">取消</el-button>
        <el-button v-show="!regionobj.update && isAccess('131')" type="text" @click="deteleRegion">删除当前区域</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueAMap from 'vue-amap'
import SideBar from './sidebar'
import { mapGetters } from 'vuex'
import { getRegionArr, updateRegion, getLatlonArr } from '@/api/grid'
import { parseTime } from '@/utils/index'
import { fetchList, fetchDepartments } from '@/api/department'
import { getEventArr } from '@/api/depevent'
import { isAccess } from '@/utils/auth'
import personicon from '@/assets/icon/personicon.png'
import eventicon from '@/assets/icon/zuob2.png'

const amapManager = new VueAMap.AMapManager()
export default {
  components: {
    SideBar
  },
  data() {
    return {
      zoom: 13,
      center: [114.085947, 22.54702],
      amapManager,
      lng: 0,
      lat: 0,
      address: '',
      locMark: '',
      PathSimplifier: '',
      geocoder: '',
      mapobj: null,
      events: {
        init: (map) => {
          this.mapobj = this.$refs.map
          this.geocoder.getAddress([map.getCenter().lng, map.getCenter().lat], (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                this.address = result.regeocode.formattedAddress
                this.$nextTick()
              }
            }
          })
        },
        click: (e) => {
          const { lng, lat } = e.lnglat
          this.lng = lng
          this.lat = lat
          // 这里通过高德 SDK 完成。
          this.locMark.setPosition([lng, lat])
          this.geocoder.getAddress([lng, lat], (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                this.address = result.regeocode.formattedAddress
                this.$nextTick()
              }
            }
          })
        }
      },
      plugin: ['ToolBar', {
        pName: 'MapType',
        defaultType: 0,
        events: {
          init(o) {
          }
        }
      }],
      polygons: [],
      windows: [
        {
          position: [121.5273285, 31.21515044],
          content: 'Hi! I am here!',
          visible: false,
          events: {
            close: () => {
              this.windows[0].visible = false
            }
          }
        }
      ],
      userArr: [],
      depArr: [],
      markerArr: [],
      personArr: [],
      eventArr: [],
      polygonsArr: [],
      regionobj: {
        name: '',
        department_id: '',
        department_name: '',
        username: '',
        status: '',
        _id: '',
        user_ids: '',
        userArr: [],
        update: false,
        dialogFormVisible: false
      }
    }
  },
  created() {
    // 获取当前中心坐标位置并设置图标
    this.geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: 'all'
    })
    const loadAMapUI = () => {
      if (window.AMapUI) {
        AMapUI.loadUI(['overlay/AwesomeMarker'], (AwesomeMarker) => {
          const map = this.$refs.map.$$getInstance()
          this.locMark = new AwesomeMarker({
            awesomeIcon: 'eercast',
            iconLabel: {
              style: {
                color: '#fff', // 字体颜色
                fontSize: '16px' // 字号
              }
            },
            iconStyle: 'black',
            map: map,
            position: map.getCenter()
          })
        })
        AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => {
          if (!PathSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！')
            return
          }
          this.PathSimplifier = PathSimplifier
        })
      } else {
        setTimeout(() => {
          loadAMapUI()
        }, 1000)
      }
    }
    fetchDepartments().then(res => {
      this.depArr = res.info.filter(obj => {
        return !obj.status
      })
      this.loadInit()
    })
    loadAMapUI()
  },
  mounted() {
    this.$nextTick(function() {

    })
  },
  methods: {
    isAccess: isAccess,
    loadInit() { // 初始化加载
      this.markerArr = []
      this.getRegion()
      this.getUserArr()
      this.getLatlon()
      this.getEventArr()
    },
    getSetting(obj) {
      this.markerArr = []
      this.polygons = []
      if (obj.person) {
        this.markerArr.push(...this.personArr)
      }
      if (obj.event) {
        this.markerArr.push(...this.eventArr)
      }
      if (obj.region) {
        this.polygons.push(...this.polygonsArr)
      }
      // if (obj.raido){
      // }
    },
    getUserArr() {
      fetchList({ start_index: 0, length: 10000 }).then(response => {
        this.userArr = response.info.list
      })
    },
    getRegion() { // 获取区域
      getRegionArr({ start_index: 0, length: 10000 }).then(response => {
        const polygons = response.info.list
        this.polygons = []
        this.polygonsArr = []
        polygons.forEach(function(element) {
          if (!element.status) {
            const obj = {
              path: element.latlon_list,
              editable: false,
              extData: element,
              events: {
                click: () => {
                  const obj = element
                  this.regionobj.dialogFormVisible = true
                  this.regionobj.name = obj.name
                  this.regionobj.department_id = obj.department_id
                  this.regionobj.department_name = this.filterDepRose(obj.department_id)
                  this.regionobj.status = obj.status
                  this.regionobj._id = obj._id
                  this.regionobj.user_ids = obj.user_ids
                  const str = obj.user_ids || ''
                  this.regionobj.userArr = str ? str.split(',') : []
                  this.regionobj.username = this.filterUser(this.regionobj.userArr)
                }
              }
            }
            this.polygons.push(obj)
            this.polygonsArr.push(obj)
          }
        }, this)
      })
    },
    getLatlon() { // 获取部门人员位置
      const dep = this.useinfo.department_roles.filter(function(obj) {
        return obj.is_enable
      })
      this.personArr = []
      getLatlonArr({ department_id: dep[0].department_id }).then(res => {
        res.info.forEach((element, index) => {
          const obj = {
            position: [element.location.lat, element.location.lon],
            icon: personicon,
            events: {
              init: (marker) => {
                marker.setLabel({ // label默认蓝框白底左上角显示，样式className为：amap-marker-label
                  offset: new AMap.Pixel(25, 22), // 修改label相对于maker的位置
                  content: element.name
                })
              },
              click: (e) => {
                const obj = element
                const uploadtime = parseTime(obj.location.uploadtime, '{y}-{m}-{d} {h}:{i}:{s}', true)
                this.windows[0].position = [e.lnglat.lng, e.lnglat.lat]
                this.windows[0].visible = true
                const ctstr = `<div class="info">
                 <div class="info-top">${obj.name}<span style="font-size:11px;color:blue;">在线</span></div>
                 <div class="info-middle" style="background-color: white;">
                 <img src="http://gridmap-file.xiaoketech.com/images/user/${obj.location.user_id}.png">
                 地址：${obj.location.address}<br>更新时间：${uploadtime}<br>
                 </div></div>`
                this.windows[0].content = ctstr
              },
              dragend: (e) => {
                this.markers[0].position = [e.lnglat.lng, e.lnglat.lat]
              }
            },
            title: element.name,
            visible: true,
            draggable: false
          }
          this.markerArr.push(obj)
          this.personArr.push(obj)
        })
      })
    },
    getEventArr() { // 获取事件位置
      const dep = this.useinfo.department_roles.filter(function(obj) {
        return obj.is_enable
      })
      this.eventArr = []
      getEventArr({ start_index: 0, length: 1000, department_id: dep[0].department_id }).then(res => {
        res.info.list.forEach((element, index) => {
          const obj = {
            position: [element.lat, element.lon],
            icon: eventicon,
            events: {
              init: (marker) => {
                marker.setLabel({ // label默认蓝框白底左上角显示，样式className为：amap-marker-label
                  offset: new AMap.Pixel(25, 22), // 修改label相对于maker的位置
                  content: element.name
                })
              },
              click: (e) => {
                const obj = element
                const happen_time = parseTime(obj.happen_time, '{y}-{m}-{d} {h}:{i}:{s}', true)
                this.windows[0].position = [e.lnglat.lng, e.lnglat.lat]
                this.windows[0].visible = true
                const ctstr = `<div class="info">
                 <div class="info-top">${obj.name}</div>
                 <div class="info-middle" style="background-color: white;">
                 时间：${happen_time}<br>
                 地址：${obj.address}<br>
                 <a href="#" style="color:blue">点击查看事件</a>
                 </div></div>`
                this.windows[0].content = ctstr
              },
              dragend: (e) => {
                this.markers[0].position = [e.lnglat.lng, e.lnglat.lat]
              }
            },
            title: element.name,
            visible: true,
            draggable: false
          }
          this.markerArr.push(obj)
          this.eventArr.push(obj)
        })
      })
    },
    updateRegion() { // 修改区域用户
      this.regionobj.user_ids = this.regionobj.userArr.join(',')
      updateRegion(this.regionobj).then(response => {
        this.regionobj.update = false
        this.regionobj.dialogFormVisible = false
        this.$message({
          message: '修改成功！',
          type: 'success',
          duration: 4 * 1000
        })
        this.getRegion()
      }).catch(() => {
        this.$message({
          message: '修改失败，请稍后再试',
          type: 'error',
          duration: 4 * 1000
        })
      })
    },
    deteleRegion() { // 删除区域
      this.$confirm('确认删除当前区域？').then(() => {
        this.regionobj.status = 1
        updateRegion(this.regionobj).then(response => {
          this.regionobj.dialogFormVisible = false
          this.$message({
            message: '删除成功！',
            type: 'success',
            duration: 4 * 1000
          })
          this.getRegion()
        }).catch(() => {
          this.$message({
            message: '删除失败，请稍后再试',
            type: 'error',
            duration: 4 * 1000
          })
        })
      }).catch(() => { console.log('取消修改') })
    },
    filterDepRose(id) { // 转换部门和集合
      let name = '无'
      this.depArr.forEach(function(els) {
        if (Number(id) === els._id) {
          name = els.name
        }
      }, this)
      return name
    },
    filterUser(arr) { // 转换用户
      let name = '无'
      arr.forEach(element => {
        this.userArr.forEach(function(els) {
          if (Number(element) === els._id) {
            name += els.name + '，'
          }
        }, this)
      })
      return name
    }
  },
  computed: {
    ...mapGetters({
      useinfo: 'useinfo'
    })
  }
}
</script>
<style lang="scss">
.pottoolbar{
  position: fixed;
  top: 64px;
  right: 102px;
  display: inline-block;
  color: #34495e;
  font-size: 12px;
  line-height: 20px;
  background-color: #fff;
  white-space: nowrap;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.amap-maptype-list p{
  font-size: 0;
}
.pht100{
  height: 100%;
}
// .amap-marker{
//   .amap-icon{
//     img{
//       width: 27px;
//       height: 36px;
//     }
//   }
// }
.amap-marker-label{
  border-radius: 2px;
  border-color: #ddd;
}
.info {
  .info-top {
    position: relative;
    border-bottom: 1px solid #CCC;
  }
  .info-top div {
      display: inline-block;
      color: #333333;
      font-size: 14px;
      font-weight: bold;
      line-height: 31px;
      padding: 0 10px;
  }
  .info-middle {
      font-size: 12px;
      padding: 6px;
      line-height: 20px;
      min-width: 300px;
  }
  span {
      margin-left: 5px;
      font-size: 11px;
  }
  .info-middle img {
      float: left;
      margin-right: 6px;
  }
}     
</style>
