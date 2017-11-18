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
        <el-date-picker  type="datetime" v-model="start_time" placeholder="选择开始时间"></el-date-picker>
        <span>-</span>
        <el-date-picker  type="datetime" v-model="end_time" placeholder="选择结束时间"></el-date-picker>
        <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">搜索</el-button>
    </div>
    <el-table :key='tableKey' :data="eventArr" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column width="180" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deptname" label="所属部门" >
      </el-table-column>
      <el-table-column prop="username" label="创建人" >
      </el-table-column>
      <el-table-column prop="typename" label="事件类型">
      </el-table-column>
      <el-table-column prop="name" label="事件名称">
      </el-table-column>
      <el-table-column width="120" label="状态">
        <template scope="scope">
          <el-tag v-if="scope.row.status == '0'" type="info">进行中</el-tag>
          <el-tag v-if="scope.row.status == '1'" type="success">完成</el-tag>
          <el-tag v-if="scope.row.status == '2'" type="warning">已关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180" label="发生时间">
        <template scope="scope">
          <span>{{scope.row.happen_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间">
        <template scope="scope">
          <span v-if="scope.row.close_time">{{scope.row.close_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template scope="scope">
          <el-button size="small" type="danger" v-if="scope.row.status == '0' && isAccess('93')" @click="closeEvent(scope.row)" >直接关闭
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
import { getEventArr, getEventTypeArr, updateEvent } from '@/api/depevent'
import { isAccess } from '@/utils/auth'
export default {
  data() {
    return {
      pageobj: {
        start_index: 0,
        length: 10,
        pagesize: 10,
        totalPages: 0,
        currentPage: 1,
        user_id: '',
        type_id: '',
        start_time: '',
        end_time: ''
      },
      start_time: '',
      end_time: '',
      listLoading: false,
      tableKey: 0,
      eventArr: [],
      userArr: [],
      typeArr: []
    }
  },
  created() {
    this.loadArr()
    this.getEventsArr()
  },
  methods: {
    isAccess: isAccess,
    handleQuery() {
      this.pageobj.start_index = 0
      this.pageobj.length = 9
      this.pageobj.start_time = this.start_time && Math.round(new Date(this.start_time).getTime() / 1000)
      this.pageobj.end_time = this.end_time && Math.round(new Date(this.end_time).getTime() / 1000)
      this.getEventsArr()
    },
    handleSizeChange(val) {
      this.pageobj.pagesize = val
      this.pageobj.currentPage = 1
      this.pageobj.start_index = (this.pageobj.currentPage - 1) * val
      this.pageobj.length = val
      this.getEventsArr()
    },
    handleCurrentChange(val) {
      this.pageobj.currentPage = val
      this.pageobj.start_index = (this.pageobj.currentPage - 1) * this.pageobj.pagesize
      this.pageobj.length = this.pageobj.pagesize
      this.getEventsArr()
    },
    closeEvent(item) {
      this.$confirm('你确定要将当前事件直接关闭吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateEvent({ _id: item._id, status: 2 }).then(response => {
          item.status = 2
          this.$message({
            message: '关闭成功',
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {
          this.$message({
            message: '关闭失败，请稍后再试',
            type: 'error',
            duration: 4 * 1000
          })
        })
      }).catch(() => {
      })
    },
    getEventsArr() {
      getEventArr(this.pageobj).then(res => {
        this.eventArr = res.info.list
        this.pageobj.totalPages = res.info.count
      }).catch(() => {
        this.$message({
          message: '查询信息失败，请稍后再试',
          type: 'error',
          duration: 4 * 1000
        })
      })
    },
    loadArr() { // 获取用户集合和事件类型集合
      fetchList({ start_index: 0, length: 10000 }).then(res => {
        this.userArr = res.info.list
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