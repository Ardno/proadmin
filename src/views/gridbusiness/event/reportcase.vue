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
          <el-select v-model="eventForm.type_id" filterable  placeholder="请选择事件类型">
            <el-option v-for="(item, index) in eventTypeArr" :key="index" :label="item.name" :value="item._id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发生时间" prop="happen_time_t">
          <el-date-picker v-model="eventForm.happen_time_t" type="datetime" placeholder="请选择发生时间" @change="changetime"></el-date-picker>
        </el-form-item>
        <el-form-item label="发生地点" prop="happen_time_t">
          <span class=""></span>
          <span class="blue poi" @click="dialogVisible=true"><i class="el-icon-location"></i>选择地点</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('eventForm')">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>
          <el-amap vid="amapDemo" ref="map" :center="center" :map-manager="amapManager" :zoom="zoom" :plugin="plugin" :events="events" class="amap-demo">
          </el-amap>
        </el-main>
      </el-container>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueAMap from 'vue-amap'
import { getEventTypeArr } from '@/api/depevent'
const amapManager = new VueAMap.AMapManager()
export default {
  data() {
    return {
      eventTypeArr: [],
      dialogVisible: false,
      eventForm: {
        type_id: '',
        name: '',
        happen_time_t: '',
        happen_time: '',
        address: ''
      },
      rules: {
        name: [{ required: true, message: '请输入事件名称', trigger: 'blur' }],
        type_id: [{ type: 'number', required: true, message: '请选择事件类型', trigger: 'change' }],
        happen_time_t: [{ type: 'date', required: true, message: '请选择发生时间', trigger: 'change' }]
      },
      amapManager,
      mapobj: null,
      zoom: 13,
      center: [114.085947, 22.54702],
      events: {
        init: (map) => {
          this.mapobj = this.$refs.map
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB'
          })
          this.mapobj.addControl(geolocation)
          geolocation.getCurrentPosition()
          AMap.event.addListener(geolocation, 'complete', (data) => { console.log(data) })
          AMap.event.addListener(geolocation, 'error', (data) => {})
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
  },
  methods: {
    getEventTypeArr() { // 获取事件类型集合
      getEventTypeArr({ dept_id: '' }).then(res => {
        this.eventTypeArr = res.info
      })
    },
    changetime(val) {
      this.eventForm.happen_time = new Date(val).getTime() / 1000
    },
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          console.log(123)
        }
      })
    }
  },
  computed: {

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
