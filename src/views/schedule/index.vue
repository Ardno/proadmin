<template>
  <div class="app-container">
    <div class="layui-elem-quote">
      <el-select clearable  v-model="pageobj.user_id" filterable placeholder="请选择用户">
        <el-option v-for="item in userArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-select class="filter-item" clearable   v-model="pageobj.isHandle" placeholder="状态">
        <el-option v-for="item in  stateArr" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">搜索</el-button>
      <el-button class="filter-item" type="primary" @click="createReuns" >创建临时任务</el-button>
      
    </div>
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
          <el-tag v-if="scope.row.work_state == '0'" type="primary">待处理</el-tag>
          <el-tag v-if="scope.row.work_state == '1'" type="success">正常</el-tag>
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
  </div>
</template>

<script>
import { fetchList } from '@/api/department'
import { getWorksArr } from '@/api/levelshift'
import { isAccess, isUser } from '@/utils/auth'
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
      ]
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
      this.listLoading = true
      getWorksArr(this.pageobj).then(response => {
        this.listLoading = false
        this.workArr = response.info.list
        this.pageobj.totalPages = response.info.count
      }).catch(errs => {
        this.listLoading = false
      })
    },
    createReuns() {
      this.$message({
        message: '开发中...',
        type: 'info',
        duration: 4 * 1000
      })
    }
  },
  created() {
    fetchList({ start_index: 0, length: 10000 }).then(response => {
      this.userArr = response.info.list.filter(obj => {
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
