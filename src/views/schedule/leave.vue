<template>
  <div class="app-container">
    <div class="layui-elem-quote">
      <span class="f16">请假记录</span>
      <el-button class="filter-item" type="primary"  @click="addLeave" >请假</el-button>
    </div>
    <div class="mb10">
      <el-select clearable class="filter-item" filterable style="width: 130px" v-model="pageobj.user_id" placeholder="申请用户">
        <el-option v-for="item in  userArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">搜索</el-button>
    </div>
    <el-table :key='tableKey' :data="leaveArr" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column width="180" label="申请时间">
        <template scope="scope">
          <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column width="120" label="审核结果">
        <template scope="scope">
          <el-tag v-if="scope.row.approval_state == '1'" type="success">同意</el-tag>
          <el-tag v-if="scope.row.approval_state == '0'" type="info">待审核</el-tag>
          <el-tag v-if="scope.row.approval_state == '2'" type="warning">拒绝</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审批人" width="100">
        <template scope="scope">
          <span>{{scope.row.approval_username || '无'}}</span>
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
      <el-table-column  label="请假理由">
        <template scope="scope">
          <span>{{scope.row.leavecontent}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template scope="scope">
          <el-button size="small" type="success" v-if="scope.row.approval_state == '0' && isUser(scope.row.user_id)"  @click="updateLeave(scope.row)">修改
          </el-button>
          <el-button size="small" type="info" v-if="scope.row.approval_state == '0' && !isUser(scope.row.user_id) && isAccess('71')"  @click="updateStatus(scope.row,true)">同意
          </el-button>
          <el-button size="small" type="warning" v-if="scope.row.approval_state == '0' && !isUser(scope.row.user_id) && isAccess('71')"  @click="updateStatus(scope.row,false)">拒绝
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
    <!-- 新增请假 -->
    <el-dialog :title="leaveobj.title" @close="closeCall" :visible.sync="leaveobj.dialogFormVisible">
      <el-form class="small-space" :model="leaveobj.data" :rules="leaveobj.infoRules" ref="infoForm" label-position="right" label-width="120px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="开始时间" required>
          <el-date-picker :editable="false" :clearable="false"  v-model="leaveobj.data.start_time" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions"> </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-date-picker :editable="false" :clearable="false" v-model="leaveobj.data.end_time" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions"> </el-date-picker>
        </el-form-item>
        <el-form-item label="请假原因" prop="leavecontent">
          <el-input type="textarea" v-model="leaveobj.data.leavecontent"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="leaveobj.dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchList, fetchDepartments } from '@/api/department'
import { getLeavesArr, updateLeaves, addLeaves } from '@/api/levelshift'
import { isAccess, isUser } from '@/utils/auth'
export default {
  data() {
    return {
      totalPages: 0,
      currentPage: 1,
      pageobj: {
        start_index: 0,
        length: 10,
        pagesize: 10,
        user_id: ''
      },
      listLoading: false,
      tableKey: 0,
      leaveobj: {
        title: '申请请假',
        dialogFormVisible: false,
        data: {
          start_time: '',
          end_time: '',
          leavecontent: ''
        },
        infoRules: {
          start_time: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
          end_time: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
          leavecontent: [{ required: true, message: '请输入请假原因', trigger: 'blur' }]
        }
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      leaveArr: [],
      depArr: [],
      userArr: []
    }
  },
  filters: {
    shenheFilter(status) {
      const statusMap = ['待审批', '同意', '拒绝']
      return statusMap[status]
    }
  },
  methods: {
    isUser: isUser,
    isAccess: isAccess,
    updateLeave(item) { // 修改弹框
      this.leaveobj = Object.assign(this.leaveobj, {
        title: '修改请假信息',
        dialogFormVisible: true,
        data: item
      })
    },
    addLeave() { // 请假弹框
      this.leaveobj = Object.assign(this.leaveobj, {
        title: '申请请假',
        dialogFormVisible: true,
        data: {
          start_time: new Date(),
          end_time: new Date(),
          leavecontent: ''
        }
      })
    },
    updateStatus(item, flg) { // 请假审核
      let tipStr = ''
      let status = 0
      if (flg) { // 同意
        tipStr = '你将同意该用户的请假！'
        status = 1
      } else { // 拒绝
        tipStr = '你确定拒绝该用户的请假？'
        status = 2
      }
      this.$confirm(tipStr, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateLeaves({ _id: item._id, approval_user_id: this.userInfo._id, approval_state: status }).then(response => {
          item.approval_state = status
          item.approval_user_id = this.userInfo._id
          item.approval_username = this.userInfo.name
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
    closeCall() {
      this.$refs.infoForm.resetFields()
    },
    loadDep() { // 获取用户部门和用户
      fetchDepartments().then(response => {
        this.depArr = response.info
      })
      fetchList({ start_index: 0, length: 10000 }).then(response => {
        if (response.info.list.length) {
          const array = response.info.list
          const arrs = []
          array.forEach(function(element) {
            if (!element.status) {
              arrs.push(element)
            }
          }, this)
          this.userArr = arrs
        }
      })
    },
    handleQuery() {
      this.pageobj.start_index = 0
      this.pageobj.length = 9
      this.loadLeavesArr()
    },
    loadLeavesArr() { // 获取请假列表
      getLeavesArr(this.pageobj).then(response => {
        const lsArr = response.info.list
        lsArr.forEach(function(element) {
          element.start_time = Number(element.start_time) * 1000
          element.end_time = Number(element.end_time) * 1000
        }, this)
        this.leaveArr = lsArr
        this.totalPages = response.info.count
      })
    },
    handleSizeChange(val) {
      this.pageobj.pagesize = val
      this.currentPage = 1
      this.pageobj.start_index = (this.currentPage - 1) * val
      this.pageobj.length = val
      this.loadLeavesArr()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.pageobj.start_index = (this.currentPage - 1) * this.pageobj.pagesize
      this.pageobj.length = this.pageobj.pagesize
      this.loadLeavesArr()
    },
    handleAddUpdate() { // 请假修改删除
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.leaveobj.data.start_time = Math.round(new Date(this.leaveobj.data.start_time).getTime() / 1000)
          this.leaveobj.data.end_time = Math.round(new Date(this.leaveobj.data.end_time).getTime() / 1000)
          if (this.leaveobj.title === '申请请假') {
            addLeaves(this.leaveobj.data).then(response => {
              this.leaveobj.dialogFormVisible = false
              this.$message({
                message: '申请成功！',
                type: 'success',
                duration: 4 * 1000
              })
              this.loadLeavesArr()
            }).catch(() => {
              this.$message({
                message: '申请失败，请稍后再试',
                type: 'error',
                duration: 4 * 1000
              })
            })
          } else {
            this.$confirm('确认修改？').then(() => {
              updateLeaves(this.leaveobj.data).then(response => {
                this.leaveobj.dialogFormVisible = false
                this.$message({
                  message: '修改信息成功！',
                  type: 'success',
                  duration: 4 * 1000
                })
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
    this.loadLeavesArr()
  },
  computed: {
    ...mapGetters({
      userInfo: 'useinfo'
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>


</style>
