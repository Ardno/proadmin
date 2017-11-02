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
  </div>
</template>


<script>
import { addRegion } from '@/api/grid'
import { fetchList } from '@/api/department'
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
      }
    }
  },
  methods: {
    reloadMap() {
      this.$router.go(0)
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
            this._polygon = null
            this.$message({
              message: '添加成功！',
              type: 'success',
              duration: 4 * 1000
            })
            this.loadshiftsArr()
          }).catch(() => {
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
        // const o = this.mapobj.$$getInstance()
        this._polygonEditor.close()
        this.regionobj.dialogFormVisible = true
        const path = this._polygon.getPath()
        const arr = []
        path.forEach(function(element) {
          // arr.push({ lat: element.lat, lon: element.lng })
          arr.push([element.lng, element.lat])
        }, this)
        this.requestAdd.list = arr
        console.log(arr)
      }
    },
    loadUser() { // 获取用户集合
      fetchList().then(response => {
        if (response.info.length) {
          this.userArr = response.info
        }
      })
    }
  },
  created() {
    this.loadUser()
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
