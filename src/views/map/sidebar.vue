<template>
  <div>
    <div class="pottoolbar" style="margin-top: 45px" v-if="trajectory.showcontroller">
      运动动画控制：
      <el-radio-group v-model="radio4" size="small" @change="clearcontroller">
        <el-radio-button label="开始"></el-radio-button>
        <el-radio-button label="暂停"></el-radio-button>
        <el-radio-button label="继续"></el-radio-button>
        <el-radio-button label="加速"></el-radio-button>
        <el-radio-button label="减速"></el-radio-button>
        <el-radio-button label="关闭"></el-radio-button>
      </el-radio-group>
    </div>
    <ul class="rightbar">
      <li @click="reloadMap">
        <el-tooltip class="item" effect="dark" content="刷新地图" placement="left">
          <span class="oico"><svg-icon icon-class="refresh" /></span>
        </el-tooltip>
      </li>
      <!-- <li @click="mouseToolPolygon">
        <el-tooltip class="item" effect="dark" content="框选人员" placement="left">
          <span class="oico"><svg-icon icon-class="addressbook" /></span>
        </el-tooltip>
      </li> -->
      <li v-if="isAccess('14')"  @click="trajectory.dialogFormVisible = true">
        <el-tooltip class="item" effect="dark" content="历史轨迹" placement="left">
          <span class="oico"><svg-icon icon-class="time" /></span>
        </el-tooltip>
      </li>
      <!-- <li>
        <el-tooltip class="item" effect="dark" content="地图人员状态" placement="left">
          <span class="oico"><svg-icon icon-class="addressbook" /></span>
        </el-tooltip>
      </li> -->
      <li @click="seeting.dialogFormVisible=true">
        <el-tooltip class="item" effect="dark" content="地图显示设置" placement="left">
          <span class="oico"><svg-icon icon-class="setup" /></span>
        </el-tooltip>
      </li>
      <li v-if="isAccess('11')&&!inedit"   @click="addPolygon">
        <el-tooltip class="item" effect="dark" content="添加区域" placement="left">
          <span class="oico"><svg-icon icon-class="editor" /></span>
        </el-tooltip>
      </li>
      <li v-if="isAccess('11')&&inedit" @click="completePolygon">
        <el-tooltip class="item" effect="dark" content="完成区域编辑" placement="left">
          <span class="oico"><svg-icon icon-class="success" /></span>
        </el-tooltip>
      </li>
    </ul>
    <!-- 新增区域 -->
    <el-dialog :title="regionobj.title" @close="closeCall" :visible.sync="regionobj.dialogFormVisible" :close-on-click-modal="false" >
      <el-form class="small-space" :model="requestAdd" :rules="regionobj.infoRules" ref="infoForm" label-position="right" label-width="120px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="区域负责人">
          <el-select v-model="requestAdd.userid" multiple  filterable placeholder="请选择">
            <el-option v-for="item in userArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域所属部门" prop="department_id">
          <el-select v-model="requestAdd.department_id" filterable placeholder="请选择">
            <el-option v-for="item in depArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域名称" prop="name">
          <el-input type="text" v-model="requestAdd.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="regionobj.dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 地图显示设置 -->
    <el-dialog title="显示配置信息" width="600px"  @close="stcloseCall" :visible.sync="seeting.dialogFormVisible"  >
      <div>
        <p class="mb10">
          <span class="mr5">人员显示</span><el-switch on-text="" off-text="" v-model="seeting.person"></el-switch>
          <span class="ml40 mr5">显示离线</span><el-switch on-text="" off-text="" v-model="seeting.allperson"></el-switch>
          <span class="ml40 mr5">区域人员管理</span><el-switch on-text="" off-text="" v-model="seeting.areaperson"></el-switch>
        </p>
        <p class="mt10">
          <span class="mr5">区域显示</span><el-switch on-text="" off-text="" v-model="seeting.region"></el-switch>
          <span class="ml40 mr5">摄像显示</span><el-switch on-text="" off-text="" v-model="seeting.raido"></el-switch>
          <span class="ml40 mr5">区域设施管理</span><el-switch on-text="" off-text="" v-model="seeting.construct"></el-switch>
        </p>
        <p class="mt10"><span class="mr5">事件显示</span><el-switch on-text="" off-text="" v-model="seeting.event"></el-switch></p>
      </div>
    </el-dialog>
    <!-- 人员轨迹查询 -->
    <el-dialog title="人员轨迹" width="600px"   :visible.sync="trajectory.dialogFormVisible"  >
      <el-form class="small-space" :model="trajectory" ref="trajectoryForm" :rules="trajectory.infoRules" label-position="right" label-width="120px">
        <el-form-item label="人员姓名" prop="bind_id">
          <el-select v-model="trajectory.bind_id"  filterable placeholder="请选择">
            <el-option v-for="item in userArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围" prop="daterange">
          <el-date-picker
            v-model="trajectory.daterange"
            type="daterange"
            start-placeholder="开始日期"
            :picker-options="pickerOptions1"
            end-placeholder="结束日期" @change="formatDaterange">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="trajectory.dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handelQuerloc">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { addRegion, getLocationsArr } from '@/api/grid'
import Cookies from 'js-cookie'
import { isAccess } from '@/utils/auth'
import { pickerOptions } from '@/utils/index'
export default {
  name: 'SideBar',
  props: {
    mapobj: {
      type: Object
    },
    PathSimplifier: {
      type: null
    }
  },
  data() {
    return {
      _polygonEditor: null,
      _polygon: null,
      mouseTool: null,
      inedit: false,
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: pickerOptions
      },
      requestAdd: {
        userid: [],
        user_ids: '',
        department_id: '',
        name: '',
        list: []
      },
      radio4: '暂停',
      depArr: [],
      userArr: [],
      regionobj: {
        title: '添加网格区域',
        dialogFormVisible: false,
        infoRules: {
          department_id: [{ type: 'number', required: true, message: '请选择区域所属部门', trigger: 'change' }],
          name: [{ required: true, message: '请输入区域名称', trigger: 'blur' }]
        }
      },
      seeting: {
        dialogFormVisible: false,
        person: true,
        allperson: true,
        raido: true,
        region: true,
        event: true,
        areaperson: true,
        construct: true
      },
      trajectory: {
        dialogFormVisible: false,
        bind_id: '',
        daterange: [new Date(), new Date().getTime() - 3600 * 1000 * 24 * 3],
        bind_type: '0',
        start_time: '',
        end_time: '',
        num: '',
        showcontroller: false,
        infoRules: {
          bind_id: [{ type: 'number', required: true, message: '请选择用户', trigger: 'blur' }],
          daterange: [{ required: true, message: '请选择时间范围', trigger: 'change' }]
        }
      }
    }
  },
  created() {
    const obj = Cookies.get('seeting')
    if (obj) {
      this.seeting = JSON.parse(obj)
    }
    this.loadUser()
  },
  methods: {
    isAccess: isAccess,
    reloadMap() {
      this.$emit('reloadMap', true)
      this.$message({
        message: '刷新成功~',
        type: 'success',
        duration: 4 * 1000
      })
    },
    stcloseCall() {
      Cookies.set('seeting', this.seeting)
      this.$emit('seeting', this.seeting)
      // console.log(123)
    },
    closeCall() {
      const o = this.mapobj.$$getInstance()
      o.remove(this._polygon)
      this._polygon = null
      this.$refs.infoForm.resetFields()
    },
    handleAdd() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.requestAdd.user_ids = this.requestAdd.userid.join(',')
          addRegion(this.requestAdd).then(response => {
            this.regionobj.dialogFormVisible = false
            this.$emit('addRegion', true)
            this.$message({
              message: '添加成功！',
              type: 'success',
              duration: 4 * 1000
            })
          }).catch((e) => {
            this.$message({
              message: '添加失败，请稍后再试',
              type: 'error',
              duration: 4 * 1000
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addPolygon() {
      this.inedit = true
      const o = this.mapobj.$$getInstance()
      const center = o.getCenter()
      const _polygon = function(lat, lon) {
        const arr = [ // 构建多边形经纬度坐标数组
          [lat - 0.002, lon + 0.001],
          [lat - 0.002, lon - 0.001],
          [lat + 0.002, lon - 0.001],
          [lat + 0.002, lon + 0.001]
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
      this.inedit = false
      if (this._polygonEditor && this._polygon) {
        this._polygonEditor.close()
        this.regionobj.dialogFormVisible = true
        this.regionobj.userid = []
        const path = this._polygon.getPath()
        const arr = []
        path.forEach(function(element) {
          arr.push([element.lng, element.lat])
        }, this)
        this.requestAdd.list = JSON.stringify(arr)
      }
    },
    loadUser() { // 获取用户集合
      setTimeout(() => {
        this.userArr = this.$store.getters.commonInfo.userArr // 获取正常状态的用户
        this.depArr = this.$store.getters.commonInfo.depArr // 获取正常状态的部门
      }, 500)
    },
    mouseToolPolygon() { // 框选人员
      if (!this.mouseTool) {
        this.mouseTool = new AMap.MouseTool(this.mapobj.$$getInstance())
      }
      this.mouseTool.polygon()
      //  alert('点是否在多边形内：' + polygon.contains(myMarker.getPosition()));
      AMap.event.addListener(this.mouseTool, 'draw', (e) => { // 添加事件
        console.log(e.obj.getPath()) // 获取路径/范围
        // this.mouseTool.close(false) //关闭框选
      })
    },
    showHistoryguij(path) {
      if (this.PathSimplifier) {
        const PathSimplifier = this.PathSimplifier
        // 创建组件实例
        const pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          map: this.mapobj.$$getInstance(), // 所属的地图实例
          getPath: function(pathData, pathIndex) {
            return pathData.path
          },
          getHoverTitle: function(pathData, pathIndex, pointIndex) {
            // 返回鼠标悬停时显示的信息
            if (pointIndex >= 0) {
              // 鼠标悬停在某个轨迹节点上
              return pathData.name + '，点:' + pointIndex + '/' + pathData.path.length
            }
            // 鼠标悬停在节点之间的连线上
            return pathData.name + '，点数量' + pathData.path.length
          },
          renderOptions: {
            // 轨迹线的样式
            pathLineStyle: {
              strokeStyle: 'blue',
              lineWidth: 3,
              dirArrowStyle: true
            }
          }
        })
        // 这里构建两条简单的轨迹，仅作示例
        pathSimplifierIns.setData([{
          name: '轨迹0',
          path: path
          // path: [
          //   [114.085947, 22.54702],
          //   [114.085003, 22.5492],
          //   [114.081999, 22.550389],
          //   [114.085604, 22.556175],
          //   [114.09129, 22.566816]
          // ]
        }])
        // 创建一个巡航器
        const navg0 = pathSimplifierIns.createPathNavigator(0, // 关联第1条轨迹
          {
            loop: false, // 循环播放
            speed: 1000
          })
        navg0.start()
        this.trajectory.dialogFormVisible = false
      }
    },
    handelQuerloc() {
      this.$refs.trajectoryForm.validate(valid => {
        if (valid) {
          getLocationsArr(this.trajectory).then(response => {
            console.log(response.info)
            if (!response.info.length) {
              this.$message({
                message: '当前时间段没有轨迹',
                type: 'info',
                duration: 4 * 1000
              })
            } else {
              const path = []
              response.info.forEach(element => {
                const arr = [element.lon, element.lat]
                path.push(arr)
              })
              this.showHistoryguij(path)
            }
            this.trajectory.showcontroller = true
          })
        }
      })
    },
    clearcontroller() {
      switch (this.radio4) {
        case '关闭':
          this.trajectory.showcontroller = false
          break
        default:
          console.log(this.radio4)
      }
    },
    formatDaterange(val) {
      this.trajectory.start_time = new Date(val[0]).getTime() / 1000
      this.trajectory.end_time = new Date(val[1]).getTime() / 1000
      console.log(this.trajectory)
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
