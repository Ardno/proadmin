<template>
  <div class="app-container">
    <div class="layui-elem-quote">
        <span class="f28">请填写以下信息</span>
    </div>
    <div class="box">
      <el-form :model="eventForm" :rules="rules" ref="eventForm" label-width="100px" class="demo-eventForm">
        <el-form-item label="事件名称" prop="name">
          <el-input v-model="eventForm.name"></el-input>
        </el-form-item>
        <el-form-item label="事件类型" prop="type_id">
          <el-select v-model="eventForm.type_id" filterable  placeholder="请选择事件类型" @change="changType">
            <el-option v-for="(item, index) in eventTypeArr" :key="index" :label="item.name" :value="item._id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发生时间" prop="happen_time_t">
          <el-date-picker v-model="eventForm.happen_time_t" type="datetime" placeholder="请选择发生时间" @change="changetime"></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="预计完成时间" prop="expected_time">
          <el-date-picker v-model="eventForm.expected_time" type="datetime" placeholder="请预估完成时间" @change="changetime"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="发生地点">
          <span class="mr10">{{eventForm.address}}</span>
          <span class="blue poi" @click="dialogVisible=true"><i class="el-icon-location"></i>选择地点</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('eventForm')">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="选择地点" :visible.sync="dialogVisible" width="800px">
      <div class="mb5">
        <p class="mb5">经纬度: {{positionObj.lnglat}}</p> 
        <p class="mb5">地址: {{positionObj.address}}</p>
      </div>
      <div class="bdf" style="height:400px;">
        <el-amap vid="amapDemo" ref="map" :center="center" :map-manager="amapManager" :zoom="zoom" :plugin="plugin" :events="events" class="amap-demo">
        </el-amap>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueAMap from 'vue-amap'
import { getEventTypeArr, addEvent } from '@/api/depevent'
import { findParent, deepClone } from '@/utils/index'
const amapManager = new VueAMap.AMapManager()
export default {
  data() {
    return {
      eventTypeArr: [],
      dialogVisible: false,
      eventForm: {
        type_id: '',
        name: '',
        lat: '',
        lon: '',
        step_ids: '',
        happen_time_t: '',
        happen_time: '',
        address: ''
      },
      positionObj: {
        lnglat: '',
        address: ''
      },
      rules: {
        name: [{ required: true, message: '请输入事件名称', trigger: 'blur' }],
        type_id: [{ type: 'number', required: true, message: '请选择事件类型', trigger: 'change' }],
        happen_time_t: [{ type: 'date', required: true, message: '请选择发生时间', trigger: 'change' }]
      },
      amapManager,
      zoom: 13,
      center: [114.085947, 22.54702],
      events: {
        init: (map) => {
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB'
          })
          map.addControl(geolocation)
          geolocation.getCurrentPosition()
          AMap.event.addListener(geolocation, 'complete', (data) => { console.log(data) })
          AMap.event.addListener(geolocation, 'error', (data) => {})
          AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
            const positionPicker = new PositionPicker({
              mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
              map: map // 依赖地图对象
            })
            positionPicker.start()
            positionPicker.on('success', (positionResult) => {
              this.positionObj = {
                lnglat: [positionResult.position.lng, positionResult.position.lat],
                address: positionResult.address
              }
              this.eventForm.address = positionResult.address
              this.eventForm.lon = positionResult.position.lng
              this.eventForm.lat = positionResult.position.lat
            })
            positionPicker.on('fail', (positionResult) => {
              this.positionObj = {
                lnglat: '',
                address: ''
              }
            })
          })
        },
        click: (e) => {
        }
      },
      plugin: ['ToolBar', {
        pName: 'MapType',
        defaultType: 0,
        events: {
          init(o) {
          }
        }
      }]
    }
  },
  created() {
    this.getEventTypeArr()
    this.eventForm = {
      type_id: '',
      name: '',
      lat: '',
      lon: '',
      step_ids: '',
      happen_time_t: '',
      happen_time: '',
      address: ''
    }
  },
  methods: {
    getEventTypeArr() { // 获取事件类型集合
      const alldepArr = deepClone(this.$store.getters.commonInfo.alldepArr)
      const arr = alldepArr.filter(obj => {
        return obj._id === this.$store.getters.useinfo.department_id
      })
      let delarr = findParent(alldepArr, arr[0])
      let dept_id = ''
      if (!delarr) {
        delarr = []
      }
      delarr.push(this.$store.getters.useinfo.department_id)
      dept_id = delarr.join(',')
      getEventTypeArr({ dept_id: dept_id }).then(res => {
        this.eventTypeArr = res.info.filter(obj => {
          return !obj.status
        })
      })
    },
    changType(val) {
      const arr = this.eventTypeArr.filter((obj) => {
        return obj._id === val
      })
      this.eventForm.step_ids = arr[0].step_ids
    },
    changetime(val) {
      this.eventForm.happen_time = new Date(val).getTime() / 1000
    },
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.eventForm.address) {
            addEvent(this.eventForm).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 4 * 1000
              })
              this.$router.push({ path: '/reportcase/mycase' })
            }).catch(() => {
              this.$message({
                message: '操作失败，请稍后再试',
                type: 'error',
                duration: 4 * 1000
              })
            })
          } else {
            this.$message({
              message: '请选择地址',
              type: 'error',
              duration: 4 * 1000
            })
          }
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.box{
  width: 800px;
  padding: 20px;
  border: 1px solid #ebebeb;
  border-radius: 3px;
}

</style>
