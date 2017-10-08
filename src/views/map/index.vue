<template>
  <el-amap vid="amapDemo" :center="center" :map-manager="AMapManager" :zoom="zoom" :events="events" class="amap-demo">
  </el-amap>
</template>

<script>
import { AMapManager } from 'vue-amap'
export default {
  data() {
    return {
      zoom: 12,
      center: [121.59996, 31.197646],
      AMapManager,
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
      }
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
