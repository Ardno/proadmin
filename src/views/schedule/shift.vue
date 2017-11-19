<template>
  <div class="app-container">
    <div class="layui-elem-quote">
      <span class="f16">换班记录</span>
      <el-button class="filter-item" type="primary"  @click="addShift" >换班</el-button>
    </div>
    <div class="mb10">
      <el-select clearable  v-model="pageobj.user_id" filterable placeholder="请选择用户">
        <el-option v-for="item in userArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-select class="filter-item" clearable   v-model="pageobj.change_state" placeholder="状态">
        <el-option v-for="item in  stateArr" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-select class="filter-item" clearable  filterable v-model="pageobj.to_user_id" placeholder="换班人">
        <el-option v-for="item in  userArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">搜索</el-button>
    </div>
    <el-table :key='tableKey' :data="shiftArr" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column width="180" label="申请时间">
        <template scope="scope">
          <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="申请用户" width="180">
      </el-table-column>
      <el-table-column width="120" label="申请结果">
        <template scope="scope">
          <el-tag v-if="scope.row.change_state == '1'" type="success">同意</el-tag>
          <el-tag v-if="scope.row.change_state == '0'" type="info">待确认</el-tag>
          <el-tag v-if="scope.row.change_state == '2'" type="warning">拒绝</el-tag>
        </template>
      </el-table-column>
      <el-table-column  label="换班用户" width="100">
        <template scope="scope">
          <span>{{scope.row.tousername || '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" label="开始时间">
        <template scope="scope">
          <span>{{scope.row.start_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" label="结束时间">
        <template scope="scope">
          <span>{{scope.row.end_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" label="换班区域">
        <template scope="scope">
          <span>{{scope.row.regionname }}</span>
        </template>
      </el-table-column>
      <el-table-column  min-width="180" label="申请理由">
        <template scope="scope">
          <span>{{scope.row.change_content}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template scope="scope">
          <!-- <el-button size="small" type="success" v-if="scope.row.change_state == '0'"  @click="updateshift(scope.row)">修改
          </el-button> -->
          <el-button size="small" type="info" v-if="scope.row.change_state == '0' && isUser(scope.row.to_user_id)"  @click="updateStatus(scope.row,true)">同意
          </el-button>
          <el-button size="small" type="warning" v-if="scope.row.change_state == '0' && isUser(scope.row.to_user_id)"  @click="updateStatus(scope.row,false)">拒绝
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block pt20 pb20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageobj.pagesize"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPages">
      </el-pagination>
    </div>
    <!-- 分页 -->
    <!-- 新增换班 -->
    <el-dialog :title="shiftobj.title" @close="closeCall" :visible.sync="shiftobj.dialogFormVisible">
      <el-form class="small-space" :model="requset" :rules="shiftobj.infoRules" ref="infoForm" label-position="right" label-width="120px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="工作名称" prop="work_id">
          <el-select class="pct100" v-model="requset.work_id" filterable placeholder="请选择" @change="handleWorkClick">
            <el-option v-for="item in workArr" :key="item._id" :label="item.regionname+' '+parseTime(item.start_time,'{m}-{d} {h}:{i}', true)+'~'+parseTime(item.end_time,'{m}-{d} {h}:{i}', true)" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="换班用户" prop="to_user_id">
          <el-select class="pct100" v-model="requset.to_user_id" filterable placeholder="请选择">
            <el-option v-for="item in userArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="换班原因" prop="change_content">
          <el-input type="textarea" v-model="requset._id"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shiftobj.dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchDepartments } from '@/api/department'
import { getShiftsArr, updateShifts, addShifts, getWorksArr } from '@/api/levelshift'
import { getRegionArr } from '@/api/grid'
import { isAccess, isUser } from '@/utils/auth'
import store from '@/store'
import { parseTime } from '@/utils/index'
export default {
  data() {
    return {
      totalPages: 0,
      currentPage: 1,
      pageobj: {
        user_id: '',
        to_user_id: '',
        change_state: '',
        start_index: 0,
        length: 10,
        pagesize: 10
      },
      listLoading: false,
      tableKey: 0,
      stateArr: [
        {
          id: 0,
          name: '待确认'
        }, {
          id: 1,
          name: '同意'
        }, {
          id: 2,
          name: '拒绝'
        }
      ],
      requset: {
        work_id: '',
        region_id: '',
        to_user_id: '',
        change_content: ''
      },
      shiftobj: {
        title: '申请换班',
        dialogFormVisible: false,
        infoRules: {
          work_id: [{ type: 'number', required: true, message: '请选择工作', trigger: 'blur' }],
          region_id: [{ type: 'number', required: true, message: '请选择区域', trigger: 'blur' }],
          to_user_id: [{ type: 'number', required: true, message: '请选择换班人', trigger: 'blur' }],
          change_content: [{ required: true, message: '请输入换班原因', trigger: 'blur' }]
        }
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      requesetUser: {
        start_index: 0,
        length: 10000,
        user_id: store.getters.useinfo._id,
        isHandle: 0
      },
      shiftArr: [],
      depArr: [],
      userArr: [],
      workArr: [],
      regionArr: []
    }
  },
  methods: {
    isUser: isUser,
    isAccess: isAccess,
    parseTime: parseTime,
    updateshift(item) { // 修改弹框
      this.shiftobj = Object.assign(this.shiftobj, {
        title: '修改换班信息',
        dialogFormVisible: true
      })
      this.requset = item
    },
    addShift() { // 换班弹框
      this.shiftobj = Object.assign(this.shiftobj, {
        title: '申请换班',
        dialogFormVisible: true
      })
      this.requset = {
        work_id: '',
        region_id: '',
        to_user_id: '',
        change_content: ''
      }
    },
    handleWorkClick() { // 选择工作
      this.workArr.forEach(element => {
        if (this.requset.work_id === element._id) {
          this.requset.region_id = element.region_id
        }
      })
    },
    updateStatus(item, flg) { // 换班审核
      let tipStr = ''
      let status = 0
      if (flg) { // 同意
        tipStr = '你将同意该用户的换班！'
        status = 1
      } else { // 拒绝
        tipStr = '你确定拒绝该用户的换班？'
        status = 2
      }
      this.$confirm(tipStr, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateShifts({ _id: item._id, change_state: status }).then(response => {
          item.change_state = status
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {
          this.$message({
            message: '操作失败，请稍后再试',
            type: 'error',
            duration: 4 * 1000
          })
        })
      }).catch(() => {
      })
    },
    handleQuery() { // 查询换班集合
      this.pageobj.start_index = 0
      this.pageobj.length = 10
      this.loadshiftsArr()
    },
    closeCall() {
      this.$refs.infoForm.resetFields()
    },
    loadDep() { // 获取用户部门和用户 区域
      fetchDepartments().then(response => {
        this.depArr = response.info.filter(obj => {
          return !obj.status
        })
      })
      fetchList({ start_index: 0, length: 10000 }).then(response => {
        this.userArr = response.info.list.filter(obj => {
          return !obj.status
        })
      })
      getRegionArr(this.requesetUser).then(response => {
        this.regionArr = response.info.list.filter(obj => {
          return !obj.status
        })
      })
      getWorksArr(this.requesetUser).then(response => {
        this.workArr = response.info.list.filter(obj => {
          return !obj.status
        })
      })
    },
    loadshiftsArr() { // 获取换班列表
      getShiftsArr(this.pageobj).then(response => {
        const lsArr = response.info.list
        lsArr.forEach(function(element) {
          element.start_time = Number(element.start_time) * 1000
          element.end_time = Number(element.end_time) * 1000
        }, this)
        this.shiftArr = lsArr
        this.totalPages = response.info.count
      })
    },
    handleSizeChange(val) {
      this.pageobj.pagesize = val
      this.currentPage = 1
      this.pageobj.start_index = (this.currentPage - 1) * val
      this.pageobj.length = val
      this.loadshiftsArr()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.pageobj.start_index = (this.currentPage - 1) * this.pageobj.pagesize
      this.pageobj.length = this.pageobj.pagesize
      this.loadshiftsArr()
    },
    handleAddUpdate() { // 换班修改删除
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          if (this.shiftobj.title === '申请换班') {
            addShifts(this.requset).then(response => {
              this.shiftobj.dialogFormVisible = false
              this.$message({
                message: '申请成功！',
                type: 'success',
                duration: 4 * 1000
              })
              this.loadshiftsArr()
            }).catch(() => {
              this.$message({
                message: '申请失败，请稍后再试',
                type: 'error',
                duration: 4 * 1000
              })
            })
          } else {
            this.$confirm('确认修改？').then(() => {
              updateShifts(this.requset).then(response => {
                this.shiftobj.dialogFormVisible = false
                this.$message({
                  message: '修改信息成功！',
                  type: 'success',
                  duration: 4 * 1000
                })
                this.loadshiftsArr()
              }).catch(() => {
                this.$message({
                  message: '修改信息失败，请稍后再试',
                  type: 'error',
                  duration: 4 * 1000
                })
              })
            }).catch(() => { console.log('取消修改') })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  created() {
    this.loadDep()
    this.loadshiftsArr()
  },
  computed: {

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>


</style>
