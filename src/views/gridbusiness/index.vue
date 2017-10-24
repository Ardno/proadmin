<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="事件类型" name="first">
        <!-- 头部 -->
        <div class="layui-elem-quote">
          <el-select clearable class="filter-item" style="width: 130px" @change="setDepid(id)" v-model="listQuery.dept_id" placeholder="请选择部门">
            <el-option v-for="item in  depArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
          <el-button class="filter-item" @click="dialogFormVisible=true;titles='添加事件类型'" type="primary" icon="plus">添加类型</el-button>
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
              <el-button size="small" type="success" @click="updateshow(scope.row)">修改
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    </el-tabs>
    <!-- 添加修改事件类型 -->
    <el-dialog :title="titles" :visible.sync="dialogFormVisible" size="tiny">
      <el-form class="small-space" :model="eventInfo" :rules="infoRules" ref="infoForm" label-position="right" label-width="120px">
        <el-form-item label="部门">
          <el-select clearable v-model="eventInfo.dept_id" placeholder="请选择部门">
            <el-option v-for="item in  depArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件类型名称" prop="name">
          <el-input v-model="eventInfo.name" :maxlength="30"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateCreate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import { fetchDepartments } from '@/api/department'
import { getEventTypeArr, addEventType, updateEventType } from '@/api/depevent'

export default {
  data() {
    return {
      dialogFormVisible: false,
      eventInfo: {
        _id: '',
        dept_id: '',
        name: ''
      },
      titles: '添加事件类型',
      infoRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入名称' }]
      },
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
    this.listQuery.dept_id = store.getters.useinfo
    this.getEventTypeArr()
    this.getDepArr()
  },
  methods: {
    setDepid(id) {
      this.dept_id = id
      console.log(id)
    },
    updateshow(item) {
      this.titles = '修改事件类型'
      this.dialogFormVisible = true
      this.eventInfo._id = item._id
    },
    handleUpdateCreate() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          if (this.titles === '添加事件类型') {
            this.eventInfo._id = null
            addEventType(this.eventInfo).then(response => {
              this.getEventTypeArr()
              this.$message({
                message: '添加成功',
                type: 'success',
                duration: 4 * 1000
              })
            }).catch(() => {
              this.$message({
                message: '添加失败，请稍后再试',
                type: 'error',
                duration: 4 * 1000
              })
            })
          } else {
            updateEventType(this.eventInfo).then(response => {
              this.getEventTypeArr()
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: 4 * 1000
              })
            }).catch(() => {
              this.$message({
                message: '修改失败，请稍后再试',
                type: 'error',
                duration: 4 * 1000
              })
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleClick(tab, event) {
      // tab切换
      console.log(tab, event)
    },
    getEventTypeArr() {
      getEventTypeArr(this.listQuery).then(res => {
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