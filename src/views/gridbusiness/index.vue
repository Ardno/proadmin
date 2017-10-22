<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="事件类型" name="first">
        <!-- 头部 -->
        <div class="layui-elem-quote">
          <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.dept_id" placeholder="请选择部门">
            <el-option v-for="item in  depArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
          <el-button class="filter-item" type="primary" icon="plus">添加类型</el-button>
        </div>
        <!-- table -->
                <el-table :key='tableKey' :data="eventArr" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="序号" width="65">
            <template scope="scope">
              <span>{{scope.row._id}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="180px" label="类型名称">
            <template scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="center" label="创建时间">
            <template scope="scope">
              <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
            </template>
          </el-table-column>
            <el-table-column align="center" label="部门">
              <template scope="scope">
                <span>{{scope.row.deptname}}</span>
              </template>
            </el-table-column>
          <el-table-column align="center" label="操作" width="190">
            <template scope="scope">
              <el-button size="small" type="success">修改
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { fetchDepartments } from '@/api/department'
import { getEventTypeArr } from '@/api/depevent'

export default {
  data() {
    return {
      activeName: 'first',
      depArr: [],
      eventArr: [],
      listLoading: false,
      tableKey: 0,
      listQuery: {
        dept_id: ''
      }
    }
  },
  created() {
    this.getEventTypeArr()
    this.getDepArr()
  },
  methods: {
    handleClick(tab, event) { // tab切换
      console.log(tab, event)
    },
    getEventTypeArr() {
      getEventTypeArr().then(res => {
        this.eventArr = res.info
      })
    },
    getDepArr() {
      fetchDepartments('').then(res => {
        this.depArr = res.info
      })
    }
  }
}
</script>
<style lang="scss">

</style>