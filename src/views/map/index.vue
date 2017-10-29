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
    <side-bar :mapobj='mapobj'></side-bar>
  </div>
</template>

<script>
import VueAMap from 'vue-amap'
import SideBar from './sidebar'
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
      polygons: [
        {
          path: [[121.5273285, 31.21515044], [121.5293285, 31.21515044], [121.5293285, 31.21915044], [121.5273285, 31.21515044]],
          events: {
            click: () => {
              console.log(amapManager)
              console.log(this.$refs.map.$$getCenter())
              console.log(this.$refs.polygon_0[0].$$getPath())
            }
          }
        }
      ],
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
      ]
    }
  },
  created() {
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
  },
  mounted() {
    this.$nextTick(function() {

    })
  },
  methods: {
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
