<template>
  <div class="app-container">
    <div class="layui-elem-quote">
        <span class="f28">{{eventname}}</span>
    </div>
    <div class="box">
      <el-form :model="eventObj" ref="eventForm" label-width="150px" class="demo-eventForm">
        <el-form-item v-for="(item, index) in eventObj.steps" :key="index" :label="item.para_name" v-if="item.para_type != 6">
          <!-- 0:文本控件 
          1:多行文本控件 
          2:时间控件 
          3:图片控件（多图上传）
          4:文件控件（视频，语音均是文件，只做上传） 
          5:人员选择控件（当前人员所在部门下）
          6：法律法规选择控件 
          7：地图选择控件 -->
          <el-input v-if="item.para_type == 0" v-model="item.para_value"></el-input>
          <el-input v-if="item.para_type == 1" type="textarea" autosize :rows="2" v-model="item.para_value"></el-input>
          <el-date-picker v-if="item.para_type == 2" v-model="item.para_value" value-format="yyyy年MM月dd日 HH点mm分" type="datetime" placeholder="选择日期"> </el-date-picker>
          <el-upload v-if="item.para_type == 3"
            class="upload-demo"
            action=""
            :http-request="data => handleFileUpload(data,item)"
            :on-preview="handlePreview"
            :on-remove="(file, fileList) =>handleRemove(file, fileList,item)"
            :file-list="item.fileList"
            :on-exceed="handleExceed" 
            multiple
            list-type="picture" :limit="10" >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">最多只能上传10张图片</div>
          </el-upload>
          <el-upload v-if="item.para_type == 4"
            class="upload-demo"
            action=""
            :http-request="data => handleFileUpload(data,item)"
            :on-preview="handlePreview" :on-remove="(file, fileList) =>handleRemove(file, fileList,item)"  multiple :limit="10" :on-exceed="handleExceed" :file-list="item.fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">最多只能上传10个文件</div>
          </el-upload>
          <el-select v-if="item.para_type == 5" clearable class="filter-item" filterable  v-model="item.para_value" placeholder="人员">
            <el-option v-for="item in  userArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
          <!-- <el-select v-if="item.para_type == 6" clearable class="filter-item" filterable  v-model="item.para_value" placeholder="法律法规">
            <el-option v-for="item in  lawsArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select> -->
          <span v-if="item.para_type == 7" class="mr10">{{item.para_value}}</span>
          <span v-if="item.para_type == 7" class="blue poi" @click="selectLoc(item)"><i class="el-icon-location"></i>选择地点</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(0)">保存</el-button>
          <el-button type="success" @click="submitForm(1)">提交审核</el-button>
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
        <el-button type="primary" @click="comfirmLoc">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueAMap from 'vue-amap'
import { getEventStep, getEvent, getLawsArr, updateCaseStep } from '@/api/depevent'
import { fileReaderBase64 } from '@/utils/utils'
import { imgUpLoad } from '@/api/upload'
// import { getDepCld } from '@/utils/auth'
const amapManager = new VueAMap.AMapManager()
export default {
  data() {
    return {
      eventid: 0,
      eventObj: {
        steps: []
      },
      eventname: '',
      requstParm: {
        step_id: '',
        event_id: '',
        update_user_id: '',
        list: [],
        auto: 0
      },
      lawsArr: [],
      userArr: [],
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
      }],
      item: ''
    }
  },
  created() {
    this.userArr = this.$store.getters.commonInfo.userArr
    this.eventid = this.$store.getters.caseid
    this.requstParm.update_user_id = this.$store.getters.useinfo._id
    if (this.eventid) {
      this.getEvent()
      this.getLawsArr()
    } else {
      this.$router.push({ path: '/' })
    }
  },
  methods: {
    getEvent() {
      getEvent({ _id: this.eventid }).then(res => {
        this.eventname = res.info.name
      })
      getEventStep({ event_id: this.eventid }).then(res => {
        this.requstParm.step_id = res.info.step_id
        this.requstParm.event_id = res.info.event_id
        this.eventObj.steps = res.info.steps
        this.eventObj.steps.forEach(element => {
          if (element.para_type === 3 || element.para_type === 4) { // 图片，文件
            element.fileList = []
            if (element.para_value) {
              const array = element.para_value.split(',')
              array.forEach(els => {
                const obj = {
                  name: els,
                  url: `${process.env.upload_API}images/other/${els}`
                }
                element.fileList.push(obj)
              })
            }
          }
        })
      })
    },
    getLawsArr() {
      getLawsArr({ department_id: '' }).then(response => {
        this.lawsArr = response.info
      })
    },
    selectLoc(item) {
      this.item = item
      this.dialogVisible1 = true
    },
    comfirmLoc() {
      this.dialogVisible1 = false
      this.item.para_value = this.positionObj.address
    },
    checkForm() {
      // let flg = true
      this.requstParm.list = []
      this.eventObj.steps.forEach(element => {
        if (element.para_type === 3 || element.para_type === 4) { // 图片，文件
          if (element.fileList.length) {
            const array = []
            element.fileList.forEach(els => {
              array.push(els.name)
            })
            element.para_value = array.join(',')
          } else {
            element.para_value = ''
          }
        }
        this.requstParm.list.push(element)
        // if (!element.para_value) {
        //   flg = false
        //   if (element.para_type === 3 || element.para_type === 4) { // 图片，文件
        //     if (element.fileList.length) {
        //       const array = []
        //       element.fileList.forEach(els => {
        //         array.push(els.name)
        //       })
        //       element.para_value = array.join(',')
        //       flg = true
        //     } else {
        //       element.para_value = ''
        //     }
        //   }
        //   if (element.para_type === 6) {
        //     flg = true
        //   }
        // } else {
        //   this.requstParm.list.push(element)
        // }
      })
      this.requstParm.list = JSON.stringify(this.requstParm.list)
      // return flg
    },
    submitForm(type) {
      this.requstParm.auto = type
      this.checkForm()
      console.log(this.eventObj.steps)
      if (type) {
        this.$confirm('你确定要提交审核吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateCaseStep(this.requstParm).then(response => {
            this.$message({
              message: '提交成功！',
              type: 'success',
              duration: 4 * 1000
            })
            this.$router.push({ path: '/reportcase/mycase' })
          }).catch(() => {
            this.$message({
              message: '提交失败，请稍后再试',
              type: 'error',
              duration: 4 * 1000
            })
          })
        }).catch(() => {
        })
        // if (this.checkForm()) {
        // } else {
        //   this.$message({
        //     message: '请填写完整信息~',
        //     type: 'warning',
        //     duration: 4 * 1000
        //   })
        // }
      } else {
        updateCaseStep(this.requstParm).then(response => {
          this.$message({
            message: '保存成功！',
            type: 'success',
            duration: 4 * 1000
          })
          this.$router.push({ path: '/reportcase/mycase' })
        }).catch(() => {
          this.$message({
            message: '保存失败，请稍后再试',
            type: 'error',
            duration: 4 * 1000
          })
        })
      }
    },
    handleFileUpload(data, item) {
      fileReaderBase64(data.file).then(obj => {
        imgUpLoad({ FileData: obj.data, filetype: obj.postf, type: 1 }).then(res => {
          if (res.code === 200) {
            const obj = {
              'name': res.info,
              'status': 'success',
              'uid': data.file.uid,
              'url': `${process.env.upload_API}images/other/${res.info}`
            }
            item.fileList.push(obj)
            data.onSuccess()
          } else {
            data.onError()
          }
        })
      })
    },
    handleRemove(file, fileList, item) {
      let cunt = ''
      item.fileList.forEach((element, index) => {
        console.log(index)
        if (file.uid === element.uid) {
          cunt = index
        }
      })
      item.fileList.splice(cunt, 1)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
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
