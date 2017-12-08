<template>
  <div class="app-container">
    <div class="layui-elem-quote">
      <el-select clearable v-if="isAccess('152')" v-model="pageobj.user_id" filterable placeholder="请选择用户">
        <el-option v-for="item in userArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-select class="filter-item" clearable   v-model="pageobj.isHandle" placeholder="状态">
        <el-option v-for="item in  stateArr" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">搜索</el-button>
      <el-button class="filter-item" v-if="isAccess('151')" type="primary" @click="deployment.dialogFormVisible = true" >创建临时任务</el-button>
    </div>
    <el-table :key='tableKey' :data="workArr" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column width="180" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" label="所属区域">
        <template slot-scope="scope">
          <span>{{scope.row.regionname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行用户" width="180">
        <template slot-scope="scope">
          <span>{{filterName(scope.row.user_id)}}</span>
        </template>
      </el-table-column>
      <el-table-column width="300" label="计划完成时间">
        <template slot-scope="scope">
          {{scope.row.r_start_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}} - {{scope.row.r_end_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}
        </template>
      </el-table-column>
      <el-table-column width="300" label="实际完成时间">
        <template slot-scope="scope">
          <span v-if="scope.row.start_time">{{scope.row.start_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span> -
          <span v-if="scope.row.end_time">{{scope.row.end_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
        </template>
      </el-table-column>
      <el-table-column  label="工作类型" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.work_type == '1'" type="warning">换班</el-tag>
          <el-tag v-if="scope.row.work_type == '0'" type="primary">正常</el-tag>
          <el-tag v-if="scope.row.work_type == '2'" type="warning">代班</el-tag>
        </template>
      </el-table-column>
      <el-table-column  label="值班结果">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.work_state == '0'" type="primary">待处理</el-tag>
          <el-tag v-if="scope.row.work_state == '1'" type="primary">正常</el-tag>
          <el-tag v-if="scope.row.work_state == '2'" type="warning">迟到</el-tag>
          <el-tag v-if="scope.row.work_state == '3'" type="danger">早退</el-tag>
          <el-tag v-if="scope.row.work_state == '4'" type="warning">缺勤</el-tag>
          <el-tag v-if="scope.row.work_state == '5'" type="warning">调派</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block pt20 pb20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageobj.currentPage"
        :page-size="pageobj.pagesize"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageobj.totalPages">
      </el-pagination>
    </div>
    <!-- 分页 -->
    <el-dialog title="临时调派" :visible.sync="deployment.dialogFormVisible" width="600px" >
      <el-form class="small-space" :model="deployment" :rules="infoRules" ref="infoForm" label-position="right" label-width="100px">
        <el-form-item label="区域" prop="region_id">
          <el-select class="filter-item" v-model="deployment.region_id" placeholder="请选择区域">
            <el-option v-for="item in  polygons" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员" prop="user_id">
          <el-select class="filter-item" v-model="deployment.user_id" placeholder="请选择人员">
            <el-option v-for="item in  userArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="r_start_time">
          <el-date-picker :editable="false" :clearable="false"  v-model="deployment.r_start_time" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions"> </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="r_end_time">
          <el-date-picker :editable="false" :clearable="false" v-model="deployment.r_end_time" type="datetime" placeholder="选择日期时间" :picker-options="pickerOptions"> </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deployment.dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createDeploy">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList } from '@/api/department'
import { getWorksArr, addWorks } from '@/api/levelshift'
import { getRegionArr } from '@/api/grid'
import { isAccess, isUser } from '@/utils/auth'
import { deepClone } from '@/utils/index'
import store from '@/store'

export default {
  data() {
    return {
      pageobj: {
        start_index: 0,
        length: 10,
        pagesize: 10,
        user_id: '',
        isHandle: '',
        totalPages: 0,
        currentPage: 1
      },
      tableKey: 0,
      listLoading: false,
      workArr: [],
      userArr: [],
      polygons: [],
      stateArr: [
        {
          id: 0,
          name: '未执行'
        }, {
          id: 1,
          name: '执行中'
        }, {
          id: 2,
          name: '执行完毕'
        }
      ],
      deployment: {
        dialogFormVisible: false,
        region_id: '',
        user_id: '',
        r_start_time: '',
        r_end_time: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      infoRules: {
        region_id: [{ type: 'number', required: true, message: '请选择区域', trigger: 'change' }],
        user_id: [{ type: 'number', required: true, message: '请选择人员', trigger: 'change' }],
        r_start_time: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        r_end_time: [{ required: true, message: '请选择结束时间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    isUser: isUser,
    isAccess: isAccess,
    filterName(id) {
      const arr = this.userArr.filter(obj => {
        return obj._id === id
      })
      return arr[0].name
    },
    handleQuery() { // 查询工作集合
      this.pageobj.start_index = 0
      this.pageobj.length = 10
      this.loadWorkArr()
    },
    handleSizeChange(val) {
      this.pageobj.pagesize = val
      this.pageobj.currentPage = 1
      this.pageobj.start_index = (this.pageobj.currentPage - 1) * val
      this.pageobj.length = val
      this.loadWorkArr()
    },
    handleCurrentChange(val) {
      this.pageobj.currentPage = val
      this.pageobj.start_index = (this.pageobj.currentPage - 1) * this.pageobj.pagesize
      this.pageobj.length = this.pageobj.pagesize
      this.loadWorkArr()
    },
    loadWorkArr() {
      if (!this.isAccess('152')) {
        this.pageobj.user_id = this.userInfo._id
      }
      this.listLoading = true
      getWorksArr(this.pageobj).then(response => {
        this.listLoading = false
        this.workArr = response.info.list
        this.pageobj.totalPages = response.info.count
      }).catch(errs => {
        this.listLoading = false
      })
    },
    createDeploy() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          const requst = deepClone(this.deployment)
          requst.r_start_time = Math.round(new Date(requst.r_start_time).getTime() / 1000)
          requst.r_end_time = Math.round(new Date(requst.r_end_time).getTime() / 1000)
          addWorks(requst).then(response => {
            this.deployment.dialogFormVisible = false
            this.$message({
              message: '操作成功！',
              type: 'success',
              duration: 4 * 1000
            })
            this.loadWorkArr()
          }).catch(() => {
            this.$message({
              message: '操作失败，请稍后再试',
              type: 'error',
              duration: 4 * 1000
            })
          })
        }
      })
    }
  },
  created() {
    fetchList({ start_index: 0, length: 10000 }).then(response => {
      this.userArr = response.info.list.filter(obj => {
        return !obj.status
      })
      this.loadWorkArr()
    })
    getRegionArr({ start_index: 0, length: 10000 }).then(response => {
      this.polygons = response.info.list.filter(obj => {
        return !obj.status
      })
    })
    this.pageobj.user_id = store.getters.useinfo._id
  },
  computed: {
  }
}
</script>
<style lang="css">

</style>
