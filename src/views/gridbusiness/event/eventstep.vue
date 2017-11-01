<template>
  <div class="app-container">
    <div class="layui-elem-quote">
        <el-select clearable class="filter-item" style="width: 130px" filterable v-model="pageobj.department_id" placeholder="请选择部门">
          <el-option v-for="item in  depArr" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
        <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="plus">新建</el-button>
    </div>
    <el-table :key='tableKey' :data="eventStepArr" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column width="180" label="创建时间">
        <template scope="scope">
          <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deptname" width="180" label="所属部门" >
      </el-table-column>
      <el-table-column prop="name" label="步骤名称" >
      </el-table-column>
      <el-table-column prop="name" width="180" label="审核人" >
        <template scope="scope">
            <span>{{filetUser(scope.row.role_id_access)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="190">
        <template scope="scope">
            <el-button size="small" type="success" icon="edit" @click="updateshow(scope.row)">编辑
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
    <router-link to="editeventstep/123">  
        显示  
    </router-link>  
  </div>
</template>

<script>
import { fetchDepartments, fetchList } from '@/api/department'
import { getStepsArr } from '@/api/depevent'
export default {
  data() {
    return {
      pageobj: {
        start_index: 0,
        length: 9,
        pagesize: 10,
        totalPages: 0,
        currentPage: 1,
        department_id: ''
      },
      listLoading: false,
      tableKey: 0,
      depArr: [],
      userArr: [],
      eventStepArr: []
    }
  },
  created() {
    this.getEventsArr()
    this.getDepArr()
  },
  methods: {
    filetUser(arrstr) {
      const sll = []
      const arr = arrstr.split(',')
      if (arrstr.length) {
        this.userArr.forEach(function(element) {
          arr.forEach(function(id) {
            if (Number(id) === element._id) {
              sll.push(element.name)
            }
          }, this)
        }, this)
        return sll.join(',')
      }
      return '暂无审核人'
    },
    handleQuery() {
      this.pageobj.start_index = 0
      this.pageobj.length = 9
      this.getEventsArr()
    },
    getDepArr() { // 获取部门集合
      fetchDepartments('').then(res => {
        this.depArr = res.info
      })
      fetchList('').then(res => {
        this.userArr = res.info
      })
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
    getEventsArr() {
      getStepsArr(this.pageobj).then(res => {
        if (res.info.count) {
          this.eventStepArr = res.info.list
          this.pageobj.totalPages = res.info.count
        } else {
          this.eventStepArr = []
          this.pageobj.totalPages = 0
        }
      }).catch(() => {
        this.$message({
          message: '查询信息失败，请稍后再试',
          type: 'error',
          duration: 4 * 1000
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>