<template>
  <div class="app-container">
    <div class="layui-elem-quote">
        <span class="f28">立案</span>
    </div>
    <div class="box">
      <el-form :model="eventObj" ref="eventForm" label-width="100px" class="demo-eventForm">
        <el-form-item v-for="(item, index) in eventObj.steps" :key="index" :label="item.para_name">
          <!-- 0:文本控件 
          1:多行文本控件 
          2:时间控件 
          3:图片控件（多图上传）
          4:文件控件（视频，语音均是文件，只做上传） 
          5:人员选择控件（当前人员所在部门下）
          6：法律法规选择控件 
          7：地图选择控件 -->
          <el-input v-if="item.para_type == 0" v-model="item.para_value"></el-input>
          <el-input v-if="item.para_type == 1" type="textarea" autosize resize="none" :rows="2" v-model="item.para_value"></el-input>
          <el-input v-if="item.para_type == 2" type="datetime" v-model="item.para_value"></el-input>
          <el-upload v-if="item.para_type == 3"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-upload v-if="item.para_type == 4"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview" :on-remove="handleRemove"  multiple :limit="10" :on-exceed="handleExceed" :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          <el-select v-if="item.para_type == 5" clearable class="filter-item" filterable  v-model="item.para_value" placeholder="人员">
            <el-option v-for="item in  userArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
          <el-select v-if="item.para_type == 6" clearable class="filter-item" filterable  v-model="item.para_value" placeholder="法律法规">
            <el-option v-for="item in  lawsArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
          <span v-if="item.para_type == 7" class="mr10">{{item.para_value}}</span>
          <span v-if="item.para_type == 7" class="blue poi" @click="dialogVisible1=true"><i class="el-icon-location"></i>选择地点</span>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" @click="submitForm('eventForm')">立即创建</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="选择地点" :visible.sync="dialogVisible1" width="800px">
      <div class="mb5">
        <p class="mb5">经纬度: {{positionObj.lnglat}}</p> 
        <p class="mb5">地址: {{positionObj.address}}</p>
      </div>
      <div class="bdf" style="height:400px;">
        <el-amap vid="amapDemo" ref="map" :center="center" :map-manager="amapManager" :zoom="zoom" :plugin="plugin" :events="events" class="amap-demo">
        </el-amap>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图片放大 -->
    <el-dialog :visible.sync="dialogVisible2" width="960px">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import VueAMap from 'vue-amap'
import { getEvent, getEventStep, getLawsArr } from '@/api/depevent'
const amapManager = new VueAMap.AMapManager()
export default {
  data() {
    return {
      eventid: 0,
      eventObj: {
        steps: [
          { para_type: 1, para_value: '' },
          { para_type: 2, para_value: '' },
          { para_type: 3, para_value: '' },
          { para_type: 4, para_value: '' },
          { para_type: 5, para_value: '' },
          { para_type: 6, para_value: '' },
          { para_type: 7, para_value: '' },
          { para_type: 1, para_value: '' }
        ]
      },
      lawsArr: [],
      userArr: [],
      fileList: '',
      dialogImageUrl: '',
      dialogVisible1: false,
      dialogVisible2: false,
      positionObj: {
        lnglat: '',
        address: ''
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
              // this.eventForm.address = positionResult.address
              // this.eventForm.lon = positionResult.position.lng
              // this.eventForm.lat = positionResult.position.lat
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
    this.userArr = this.$store.getters.commonInfo.userArr
    if (this.$route.params.id) {
      this.eventid = this.$route.params.id
      this.getEvent()
      this.getLawsArr()
    } else {
      this.$router.push({ path: '/' })
    }
  },
  methods: {
    getEvent() {
      getEvent({ _id: this.eventid }).then(res => {
        console.log(res)
      })
      getEventStep({ event_id: this.eventid }).then(res => {
        console.log(res)
      })
    },
    getLawsArr() {
      getLawsArr().then(response => {
        this.lawsArr = response.info
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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
