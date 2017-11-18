<template>
  <div>
    <ul class="rightbar">
      <li @click="reloadMap">
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
      <li @click="seeting.dialogFormVisible=true">
        <el-tooltip class="item" effect="dark" content="地图显示设置" placement="left">
          <span class="oico"><icon-svg icon-class="setup" /></span>
        </el-tooltip>
      </li>
      <li v-if="isAccess('130')"  @click="addPolygon">
        <el-tooltip class="item" effect="dark" content="添加区域" placement="left">
          <span class="oico"><icon-svg icon-class="editor" /></span>
        </el-tooltip>
      </li>
      <li v-if="isAccess('130')" @click="completePolygon">
        <el-tooltip class="item" effect="dark" content="完成区域编辑" placement="left">
          <span class="oico"><icon-svg icon-class="success" /></span>
        </el-tooltip>
      </li>
    </ul>
    <!-- 新增区域 -->
    <el-dialog :title="regionobj.title" @close="closeCall" :visible.sync="regionobj.dialogFormVisible" :close-on-click-modal="false" >
      <el-form class="small-space" :model="requestAdd" :rules="regionobj.infoRules" ref="infoForm" label-position="right" label-width="120px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="区域负责人" prop="user_id">
          <el-select v-model="requestAdd.user_id" filterable placeholder="请选择">
            <el-option v-for="item in userArr" :key="item._id" :label="item.name" :value="item._id">
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
    <el-dialog title="显示配置信息" size="tiny" @close="stcloseCall" :visible.sync="seeting.dialogFormVisible"  >
      <div>
        <p class="mb10">
          <span class="mr5">人员显示</span><el-switch on-text="" off-text="" v-model="seeting.person"></el-switch>
          <span class="ml40 mr5">事件显示</span><el-switch on-text="" off-text="" v-model="seeting.event"></el-switch>
        </p>
        <p>
          <span class="mr5">区域显示</span><el-switch on-text="" off-text="" v-model="seeting.region"></el-switch>
          <span class="ml40 mr5">摄像显示</span><el-switch on-text="" off-text="" v-model="seeting.raido"></el-switch>
        </p>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { addRegion } from '@/api/grid'
import Cookies from 'js-cookie'
import { fetchList } from '@/api/department'
import { isAccess } from '@/utils/auth'
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
      _polygon: null,
      requestAdd: {
        user_id: '',
        name: '',
        list: []
      },
      userArr: [],
      regionobj: {
        title: '添加网格区域',
        dialogFormVisible: false,
        infoRules: {
          user_id: [{ type: 'number', required: true, message: '请区域负责人', trigger: 'blur' }],
          name: [{ required: true, message: '请输入区域名称', trigger: 'blur' }]
        }
      },
      seeting: {
        dialogFormVisible: false,
        person: true,
        raido: true,
        region: true,
        event: true
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
    },
    stcloseCall() {
      this.$emit('seeting', this.seeting)
      Cookies.set('seeting', this.seeting)
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
        this._polygonEditor.close()
        this.regionobj.dialogFormVisible = true
        const path = this._polygon.getPath()
        const arr = []
        path.forEach(function(element) {
          arr.push([element.lng, element.lat])
        }, this)
        this.requestAdd.list = JSON.stringify(arr)
      }
    },
    loadUser() { // 获取用户集合
      fetchList({ start_index: 0, length: 10000 }).then(response => {
        if (response.info.list.length) {
          this.userArr = response.info.list
        }
      })
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
