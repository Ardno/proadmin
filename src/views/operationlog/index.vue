<template>
  <div class="app-container">
    <div class="layui-elem-quote">
        <el-select clearable class="filter-item" style="width: 130px" filterable v-model="pageobj.user_id" placeholder="请选择用户">
        <el-option v-for="item in  userArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
        </el-select>
        <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">搜索</el-button>
    </div>
    <el-table :key='tableKey' :data="logArr" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column width="180" label="操作时间">
        <template scope="scope">
          <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" prop="user_name" label="操作用户" >
      </el-table-column>
      <el-table-column label="操作内容" >
        <template scope="scope">
          <span>{{scope.row.content | contFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template scope="scope">
          <el-button size="small" type="success"  @click="handleSee(scope.row)">查看
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
import { getLogArr } from '@/api/platform'
export default {
  data() {
    return {
      pageobj: {
        start_index: 0,
        length: 10,
        pagesize: 10,
        totalPages: 0,
        currentPage: 1,
        user_id: ''
      },
      listLoading: false,
      tableKey: 0,
      userArr: [],
      logArr: []
    }
  },
  filters: {
    contFilter(str) {
      const arr = str.split('=>')
      return arr[0]
    }
  },
  created() {
    this.getLogArr()
    this.getuserArr()
  },
  methods: {
    handleQuery() {
      this.pageobj.start_index = 0
      this.pageobj.length = 9
      this.getLogArr()
    },
    getuserArr() { // 获取部门集合
      fetchList({ start_index: 0, length: 10000 }).then(res => {
        this.userArr = res.info.list
      })
    },
    handleSizeChange(val) {
      this.pageobj.pagesize = val
      this.pageobj.currentPage = 1
      this.pageobj.start_index = (this.pageobj.currentPage - 1) * val
      this.pageobj.length = val
      this.getLogArr()
    },
    handleCurrentChange(val) {
      this.pageobj.currentPage = val
      this.pageobj.start_index = (this.pageobj.currentPage - 1) * this.pageobj.pagesize
      this.pageobj.length = this.pageobj.pagesize
      this.getLogArr()
    },
    getLogArr() {
      getLogArr(this.pageobj).then(res => {
        if (res.info.count) {
          this.logArr = res.info.list
          this.pageobj.totalPages = res.info.count
        } else {
          this.logArr = []
          this.pageobj.totalPages = 0
        }
      }).catch(() => {
        this.$message({
          message: '查询信息失败，请稍后再试',
          type: 'error',
          duration: 4 * 1000
        })
      })
    },
    handleSee(res) {
      this.$alert(res.content, '操作详情', {
        showConfirmButton: false,
        showCancelButton: false,
        callback: action => {
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>