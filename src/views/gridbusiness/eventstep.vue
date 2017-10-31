<template>
  <div class="app-container">
    <div class="layui-elem-quote">
        <el-select clearable class="filter-item" style="width: 130px" filterable v-model="pageobj.dept_id" placeholder="请选择部门">
        <el-option v-for="item in  depArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
        </el-select>
        <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">搜索</el-button>
    </div>
  </div>
</template>

<script>
import { fetchDepartments } from '@/api/department'
export default {
  data() {
    return {
      pageobj: {
        start_index: 0,
        length: 9,
        pagesize: 10,
        dept_id: ''
      },
      depArr: []
    }
  },
  created() {
    this.getDepArr()
  },
  methods: {
    handleQuery() {

    },
    getDepArr() { // 获取部门集合
      fetchDepartments('').then(res => {
        this.depArr = res.info
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>