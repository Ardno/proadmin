<template>
  <div class="app-container">
    <div class="layui-elem-quote">
      <el-select clearable class="filter-item mr10" style="width: 130px" filterable v-model="pageobj.type_id" placeholder="事件类型">
        <el-option v-for="item in  typeArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-select clearable class="filter-item mr10" style="width: 130px" filterable v-model="pageobj.step_status" placeholder="事件状态">
        <el-option v-for="item in  statusArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-date-picker  type="datetime" v-model="start_time" placeholder="选择开始时间"></el-date-picker>
      <span>-</span>
      <el-date-picker  type="datetime" v-model="end_time" placeholder="选择结束时间"></el-date-picker>
      <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">搜索</el-button>
    </div>
    <el-table :key='tableKey' :data="eventArr" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column width="180" label="创建时间">
        <template slot-scope="scope">
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
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == '0' && scope.row.is_unaudited>0" type="info">
              待审核
          </el-tag>
          <el-tag v-else-if="scope.row.status == '0' && scope.row.is_unfilled > 0 && scope.row.is_unaudited ==0" type="info">
              待填写
          </el-tag>
          <el-tag v-else-if="scope.row.status == '1'" type="primary">完成</el-tag>
          <el-tag v-else-if="scope.row.status == '2'" type="warning">已删除</el-tag>
          <el-tag v-else type="info">
              待关闭
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180" label="发生时间">
        <template slot-scope="scope">
          <span>{{scope.row.happen_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间">
        <template slot-scope="scope">
          <span v-if="scope.row.close_time">{{scope.row.close_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="small" type="primary" v-if="scope.row.status == '0' && (scope.row.is_unfilled > 0 && scope.row.is_unaudited ==0)" @click="goOtherPage(scope.row._id)" >编辑
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
import { mapGetters } from 'vuex'
import { getEventArr, getEventTypeArr, updateEvent } from '@/api/depevent'
import { isAccess, getDepCld } from '@/utils/auth'
import store from '@/store'
export default {
  data() {
    return {
      pageobj: {
        start_index: 0,
        length: 10,
        pagesize: 10,
        totalPages: 0,
        currentPage: 1,
        user_id: store.getters.useinfo._id,
        type_id: '',
        department_ids: '',
        department_id: getDepCld(),
        step_status: '',
        start_time: '',
        end_time: ''
      },
      start_time: '',
      end_time: '',
      listLoading: false,
      tableKey: 0,
      eventArr: [],
      userArr: [],
      statusArr: [
        { name: '待填写', _id: 0 },
        { name: '待审核', _id: 1 },
        { name: '已完成', _id: 2 }
      ],
      typeArr: []
    }
  },
  computed: {
    ...mapGetters({
      commonInfo: 'commonInfo'
    })
  },
  created() {
    this.loadArr()
    this.getEventsArr()
  },
  methods: {
    isAccess: isAccess,
    filterArrDep(val) {
      this.department_id = val.join(',')
    },
    handleQuery() {
      this.pageobj.start_index = 0
      this.pageobj.length = 10
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
      this.listLoading = true
      getEventArr(this.pageobj).then(res => {
        this.listLoading = false
        this.eventArr = res.info.list
        this.pageobj.totalPages = res.info.count
      }).catch(() => {
        this.listLoading = false
        this.$message({
          message: '查询信息失败，请稍后再试',
          type: 'error',
          duration: 4 * 1000
        })
      })
    },
    loadArr() { // 获取用户集合和事件类型集合
      getEventTypeArr({ dept_id: getDepCld() }).then(res => {
        this.typeArr = res.info.filter(obj => {
          return !obj.status
        })
      })
    },
    goOtherPage(val) {
      this.$store.dispatch('setCaseId', val)
      this.$router.push({ path: '/reportcase/editcase' })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>