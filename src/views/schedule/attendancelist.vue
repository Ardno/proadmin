<template>
  <div class="app-container">
    <div class="layui-elem-quote">
      <el-select class="filter-item" style="width: 130px" filterable v-model="pageobj.user_id" placeholder="用户">
        <el-option v-for="item in  userArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-date-picker  type="datetime" v-model="start_time" placeholder="选择开始时间"></el-date-picker>
      <span>-</span>
      <el-date-picker  type="datetime" v-model="end_time" placeholder="选择结束时间"></el-date-picker>
      <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">搜索</el-button>
    </div>
    <el-tabs v-model="activeName" >
      <el-tab-pane label="请假" name="first">
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
              <span>{{scope.row.start_time | parseTime('{y}-{m}-{d} {h}:{i}',true)}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180" label="结束时间">
            <template scope="scope">
              <span>{{scope.row.end_time | parseTime('{y}-{m}-{d} {h}:{i}',true)}}</span>
            </template>
          </el-table-column>
          <el-table-column  label="请假理由">
            <template scope="scope">
              <span>{{scope.row.leavecontent}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="工作" name="second">
        <el-table :key='tableKey' :data="workArr" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
          <el-table-column width="180" label="创建时间">
            <template scope="scope">
              <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180" label="所属区域">
            <template scope="scope">
              <span>{{scope.row.regionname}}</span>
            </template>
          </el-table-column>
          <el-table-column label="执行用户" width="180">
            <template scope="scope">
              <span>{{filterName(scope.row.user_id)}}</span>
            </template>
          </el-table-column>
          <el-table-column width="300" label="计划完成时间">
            <template scope="scope">
              {{scope.row.r_start_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}} - {{scope.row.r_end_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}
            </template>
          </el-table-column>
          <el-table-column width="300" label="实际完成时间">
            <template scope="scope">
              <span v-if="scope.row.start_time">{{scope.row.start_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span> -
              <span v-if="scope.row.end_time">{{scope.row.end_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
            </template>
          </el-table-column>
          <el-table-column  label="工作类型" width="100">
            <template scope="scope">
              <el-tag v-if="scope.row.work_type == '1'" type="warning">换班</el-tag>
              <el-tag v-if="scope.row.work_type == '0'" type="success">正常</el-tag>
              <el-tag v-if="scope.row.work_type == '2'" type="warning">代班</el-tag>
            </template>
          </el-table-column>
          <el-table-column  label="值班结果">
            <template scope="scope">
              <el-tag v-if="scope.row.work_type == '0'" type="success">正常</el-tag>
              <el-tag v-if="scope.row.work_type == '1'" type="primary">迟到</el-tag>
              <el-tag v-if="scope.row.work_type == '2'" type="warning">早退</el-tag>
              <el-tag v-if="scope.row.work_type == '3'" type="danger">缺勤</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="临时调派" name="third">

      </el-tab-pane>
    </el-tabs>
    <!-- 分页 -->
    <!-- <div class="block pt20 pb20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageobj.currentPage"
        :page-size="pageobj.pagesize"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageobj.totalPages">
      </el-pagination>
    </div> -->
    <!-- 分页 -->
  </div>
</template>

<script>
import { fetchList } from '@/api/department'
import { getMonthdance } from '@/api/levelshift'
// import { isAccess, isUser } from '@/utils/auth'
import store from '@/store'

export default {
  data() {
    return {
      activeName: 'first',
      pageobj: {
        start_index: 0,
        length: 10,
        pagesize: 10,
        totalPages: 0,
        currentPage: 1,
        user_id: store.getters.useinfo._id,
        start_time: '',
        end_time: ''
      },
      listLoading: false,
      tableKey: 0,
      userArr: [],
      leaveArr: [],
      workArr: [],
      dispatchArr: [],
      monthdanceArr: [],
      start_time: new Date().getTime() - 3600 * 1000 * 24 * 7,
      end_time: new Date().getTime()
    }
  },
  created() {
    this.loadArr()
    this.handleQuery()
  },
  methods: {
    loadArr() { // 获取用户集合和事件类型集合
      fetchList({ start_index: 0, length: 10000 }).then(res => {
        this.userArr = res.info.list.filter(obj => {
          return !obj.status
        })
      })
    },
    handleQuery() {
      // this.pageobj.start_index = 0
      // this.pageobj.length = 9
      this.pageobj.start_time = this.start_time && Math.round(new Date(this.start_time).getTime() / 1000)
      this.pageobj.end_time = this.end_time && Math.round(new Date(this.end_time).getTime() / 1000)
      this.getMonthdance()
    },
    handleSizeChange(val) {
      this.pageobj.pagesize = val
      this.pageobj.currentPage = 1
      this.pageobj.start_index = (this.pageobj.currentPage - 1) * val
      this.pageobj.length = val
      this.getMonthdance()
    },
    handleCurrentChange(val) {
      this.pageobj.currentPage = val
      this.pageobj.start_index = (this.pageobj.currentPage - 1) * this.pageobj.pagesize
      this.pageobj.length = this.pageobj.pagesize
      this.getMonthdance()
    },
    getMonthdance() {
      this.listLoading = true
      getMonthdance(this.pageobj).then(res => {
        this.listLoading = false
        this.leaveArr = res.info.leave
        this.workArr = res.info.work
        this.dispatchArr = res.info.dispatch
        // this.pageobj.totalPages = res.info.count
      }).catch(() => {
        this.listLoading = false
        this.$message({
          message: '查询信息失败，请稍后再试',
          type: 'error',
          duration: 4 * 1000
        })
      })
    }
  },
  computed: {
  }
}
</script>
<style lang="scss">

</style>
