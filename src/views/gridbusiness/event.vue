<template>
  <div class="app-container">
    <div class="layui-elem-quote">
        <el-select clearable class="filter-item" style="width: 130px" filterable v-model="pageobj.user_id" placeholder="用户">
          <el-option v-for="item in  userArr" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
        <el-select clearable class="filter-item" style="width: 130px" filterable v-model="pageobj.type_id" placeholder="事件类型">
          <el-option v-for="item in  typeArr" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
        <el-date-picker  type="datetime" placeholder="选择日期时间"></el-date-picker>
        <span>-</span>
        <el-date-picker  type="datetime" placeholder="选择日期时间"></el-date-picker>
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
      <el-table-column align="center" label="操作" width="100">
        <template scope="scope">
          <el-button size="small" type="success" v-if="scope.row.approval_state == '0'"  @click="updateLeave(scope.row)">修改
          </el-button>
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
  </div>
</template>

<script>
import { fetchList } from '@/api/department'
import { getEventArr, getEventTypeArr } from '@/api/depevent'
export default {
  data() {
    return {
      pageobj: {
        start_index: 0,
        length: 9,
        pagesize: 10,
        totalPages: 0,
        currentPage: 1,
        user_id: '',
        type_id: '',
        start_time: '',
        end_time: ''
      },
      userArr: [],
      typeArr: []
    }
  },
  created() {
    this.loadArr()
  },
  methods: {
    handleQuery() {
      this.pageobj.start_index = 0
      this.pageobj.length = 9
      this.getEventsArr()
    },
    handleSizeChange(val) {
      this.pageobj.pagesize = val
      this.pageobj.currentPage = 1
      this.pageobj.start_index = (this.currentPage - 1) * val
      this.pageobj.length = val
      this.getEventsArr()
    },
    handleCurrentChange(val) {
      this.pageobj.currentPage = val
      this.pageobj.start_index = (this.currentPage - 1) * this.pageobj.pagesize
      this.pageobj.length = this.pageobj.pagesize
      this.getEventsArr()
    },
    getEventsArr() {
      getEventArr(this.pageobj).then(res => {
        this.userArr = res.info.list
        this.totalPages = res.info.count
      }).catch(() => {
        this.$message({
          message: '查询信息失败，请稍后再试',
          type: 'error',
          duration: 4 * 1000
        })
      })
    },
    loadArr() { // 获取用户集合和事件类型集合
      fetchList('').then(res => {
        this.userArr = res.info
      })
      getEventTypeArr('').then(res => {
        this.typeArr = res.info
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>