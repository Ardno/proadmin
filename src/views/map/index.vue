<template>
  <div class="pht100 rel">
    <el-amap vid="amapDemo" ref="map" :center="center" :map-manager="amapManager" :zoom="zoom" :plugin="plugin" :events="events" class="amap-demo">
      <!-- 区域 -->
      <el-amap-polygon v-for="(polygon, index) in polygons" :key="index" :vid="index" :ref="`polygon_${index}`" :path="polygon.path" :events="polygon.events">
      </el-amap-polygon>
      <!-- 点坐标 -->
      <el-amap-marker v-for="(marker, index) in markers" :ref="`marker_${index}`" :key="index" :position="marker.position"  :title="marker.title" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable">
      </el-amap-marker>
      <!-- 信息窗体 -->
      <el-amap-info-window v-for="(window, index) in windows" :ref="`window_${index}`" :key="index" :position="window.position" :content="window.content" :visible="window.visible" :events="window.events">
      </el-amap-info-window>
    </el-amap>
    <div class="pottoolbar" >
        <!-- 经纬度: [{{ lng }}, {{ lat }}]  -->
        地址: {{ address }}
    </div>
    <side-bar :mapobj="mapobj" @reloadMap="loadInit" @addRegion="getRegion"></side-bar>
    <!-- 区域信息 -->
    <el-dialog title="区域信息" size="tiny" :visible.sync="regionobj.dialogFormVisible"  >
      <el-form class="small-space"  label-position="top">
        <el-form-item label="区域名称" >
          <span class="ml20">{{regionobj.name}}</span>
        </el-form-item>
        <el-form-item label="区域人员">
          <span v-if="!regionobj.update" class="ml20">{{regionobj.username}}</span>
          <el-select v-else v-model="regionobj.user_id" filterable placeholder="请选择">
            <el-option v-for="item in userArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
          <el-button v-show="!regionobj.update" class="ml20" @click="regionobj.update=true" type="text">更换</el-button>
          <el-button v-show="regionobj.update" class="ml20" @click="updateRegion" type="text">保存</el-button>
          <el-button v-show="regionobj.update" class="ml20" @click="regionobj.update=false" type="text">取消</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="deteleRegion">删除当前区域</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueAMap from 'vue-amap'
import SideBar from './sidebar'
import { getRegionArr, updateRegion } from '@/api/grid'
import { fetchList } from '@/api/department'

const amapManager = new VueAMap.AMapManager()
export default {
  components: {
    SideBar
  },
  data() {
    return {
      zoom: 13,
      center: [121.59996, 31.197646],
      amapManager,
      lng: 0,
      lat: 0,
      address: '',
      locMark: '',
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
      markers: [
        {
          position: [121.5273285, 31.21515044],
          events: {
            init: (marker) => {
              marker.setLabel({ // label默认蓝框白底左上角显示，样式className为：amap-marker-label
                offset: new AMap.Pixel(20, 20), // 修改label相对于maker的位置
                content: '我是marker的label标签'
              })
            },
            click: (e) => {
              console.log(e)
              this.windows[0].position = [e.lnglat.lng, e.lnglat.lat]
              this.windows[0].visible = true
              this.windows[0].content = '<a  href="#/introduction/index" class="router-link-active">个人信息</a>'
            },
            dragend: (e) => {
              this.markers[0].position = [e.lnglat.lng, e.lnglat.lat]
            }
          },
          title: '你是不是傻呢',
          visible: true,
          draggable: false
        }
      ],
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
      regionobj: {
        name: '',
        username: '',
        status: '',
        _id: '',
        user_id: '',
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
      } else {
        setTimeout(() => {
          loadAMapUI()
        }, 1000)
      }
    }
    loadAMapUI()
    this.loadInit()
  },
  mounted() {
    this.$nextTick(function() {

    })
  },
  methods: {
    loadInit() { // 初始化加载
      this.getRegion()
      this.getUserArr()
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
                  this.regionobj.username = obj.username
                  this.regionobj.status = obj.status
                  this.regionobj._id = obj._id
                  this.regionobj.user_id = obj.user_id
                }
              }
            }
            this.polygons.push(obj)
          }
        }, this)
      })
    },
    updateRegion() { // 修改区域用户
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
    }
  }
}
</script>
<style lang="scss">
html,
body,
#app,
.main-container,
.app-container {
  height: 100%;
}

.app-main {
  min-height: auto !important;
  height: calc(100% - 50px);
}
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
</style>
