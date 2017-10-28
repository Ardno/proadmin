<template>
  <el-amap vid="amapDemo" ref="map" :center="center" :map-manager="amapManager" :zoom="zoom" :events="events" class="amap-demo">
    <el-amap-polygon v-for="(polygon, index) in polygons" :key="index" :vid="index" :ref="`polygon_${index}`" :path="polygon.path" :events="polygon.events">
    </el-amap-polygon>
  </el-amap>
</template>

<script>
import VueAMap from 'vue-amap'
const amapManager = new VueAMap.AMapManager()
export default {
  data() {
    return {
      zoom: 13,
      center: [121.59996, 31.197646],
      amapManager,
      events: {
        init(map) {
          // AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
          //   const marker = new SimpleMarker({
          //     iconLabel: 'A',
          //     iconStyle: 'red',
          //     map: map,
          //     position: map.getCenter()
          //   })
          // })
        }
      },
      polygons: [
        {
          path: [[121.5273285, 31.21515044], [121.5293285, 31.21515044], [121.5293285, 31.21915044], [121.5273285, 31.21515044]],
          events: {
            click: () => {
              this.add()
              console.log(amapManager)
              console.log(this.$refs.map.$$getCenter())
              console.log(this.$refs.polygon_0[0].$$getPath())
            }
          }
        }
      ]
    }
  },
  methods: {
    add() {
      const map = this.$refs.map
      const o = map.$$getInstance()
      const center = o.getCenter()
      const _polygon = function(lat, lon) {
        const arr = [ // 构建多边形经纬度坐标数组
            [lat - 0.008, lon + 0.005],
            [lat - 0.008, lon - 0.005],
            [lat + 0.008, lon - 0.005],
            [lat + 0.008, lon + 0.005]
        ]
        return new AMap.Polygon({
          map: o,
          path: arr,
          strokeColor: '#0000ff',
          strokeOpacity: 1,
          strokeWeight: 3,
          fillColor: '#f5deb3',
          fillOpacity: 0.35
        })
      }
      const _polygonEditor = new AMap.PolyEditor(o, _polygon(center.lng, center.lat))
      _polygonEditor.open()
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
</style>
