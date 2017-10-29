<template>
    <ul class="rightbar">
      <li>
        <el-tooltip class="item" effect="dark" content="刷新地图" placement="left">
          <span class="oico"><icon-svg icon-class="refresh" /></span>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip class="item" effect="dark" content="历史轨迹" placement="left">
          <span class="oico"><icon-svg icon-class="time" /></span>
        </el-tooltip>
      </li>
      <li>
        <el-tooltip class="item" effect="dark" content="地图人员状态" placement="left">
          <span class="oico"><icon-svg icon-class="addressbook" /></span>
        </el-tooltip>
      </li>
      <li  @click="addPolygon">
        <el-tooltip class="item" effect="dark" content="添加区域" placement="left">
          <span class="oico"><icon-svg icon-class="editor" /></span>
        </el-tooltip>
      </li>
      <li @click="completePolygon">
        <el-tooltip class="item" effect="dark" content="完成区域编辑" placement="left">
          <span class="oico"><icon-svg icon-class="success" /></span>
        </el-tooltip>
      </li>
    </ul>
</template>


<script>
export default {
  name: 'SideBar',
  props: {
    mapobj: {
      type: Object
    }
  },
  data() {
    return {
      _polygonEditor: null,
      _polygon: null
    }
  },
  methods: {
    addPolygon() {
      const o = this.mapobj.$$getInstance()
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
      if (this._polygon) {
        this.$confirm('你当前还有区域尚未完成编辑，是否重新编辑？').then(() => {
          this._polygonEditor.close()
          o.remove(this._polygon)
          this._polygon = _polygon(center.lng, center.lat)
          this._polygonEditor = new AMap.PolyEditor(o, this._polygon)
          this._polygonEditor.open()
        }).catch(() => { console.log('取消修改') })
        return
      }
      this._polygon = _polygon(center.lng, center.lat)
      this._polygonEditor = new AMap.PolyEditor(o, this._polygon)
      this._polygonEditor.open()
    },
    completePolygon() {
      if (this._polygonEditor) {
        // const o = this.mapobj.$$getInstance()
        this._polygonEditor.close()
        console.log(this._polygon.getPath())
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .rightbar{
    position: absolute;
    top: 30%;
    right: 10px;
    z-index: 200;
    border-radius: 2px;
    background-color: #686868;
    li{
      list-style: none;
      margin: 10px 0;
      font-size: 22px;
      cursor: pointer;
      &:hover{
          background: #1f2d3d;
      }
    }
  }
  .oico{
    position: relative;
    display: block;
    width: 34px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    color: #fff;
  }
</style>
