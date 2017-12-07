<template>
  <div class="app-container">
    <div class="layui-elem-quote">
        <el-select clearable class="filter-item" style="width: 130px" filterable v-model="listQuery.dept_id" placeholder="请选择部门">
        <el-option v-for="item in  depArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
        </el-select>
        <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">搜索</el-button>
        <el-button class="filter-item" v-if="isAccess('81')" @click="addShij" type="primary" icon="plus">添加类型</el-button>
    </div>
    <el-table :key='tableKey' :data="eventArr" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="65">
      <template slot-scope="scope">
          <span>{{scope.row._id}}</span>
      </template>
      </el-table-column>
      <el-table-column align="center" width="180px" label="类型名称">
      <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
      </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="创建时间">
      <template slot-scope="scope">
          <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
      </template>
      </el-table-column>
      <el-table-column width="80" label="状态">
      <template slot-scope="scope">
          <el-tag v-if="scope.row.status == '0'" type="primary">正常</el-tag>
          <el-tag v-if="scope.row.status == '1'" type="danger">已失效</el-tag>
      </template>
      </el-table-column>
      <el-table-column align="center" label="部门">
      <template slot-scope="scope">
          <span>{{scope.row.deptname}}</span>
      </template>
      </el-table-column>
      <el-table-column align="center" label="步骤">
      <template slot-scope="scope">
          <span>{{conversionSteps(scope.row.step_ids)}}</span>
      </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="190">
      <template slot-scope="scope">
          <el-button size="small" type="primary" v-if="isAccess('82')" @click="updateshow(scope.row)">修改
          </el-button>
          <el-button size="small" type="danger" v-if="isAccess('82')" v-show="!scope.row.status" @click="updateStaus(scope.row)">失效
          </el-button>
          <el-button size="small" type="info" v-if="isAccess('82')" v-show="scope.row.status" @click="updateStaus(scope.row)">恢复
          </el-button>
      </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="titles" :visible.sync="dialogFormVisible" size="small">
      <el-form class="small-space" :model="eventInfo" :rules="infoRules" ref="infoForm" label-position="right" label-width="120px">
        <el-form-item label="部门" prop="dept_id">
          <el-select filterable v-model="eventInfo.dept_id" @change="changeStep" placeholder="请选择部门">
            <el-option v-for="item in  depArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件步骤">
          <el-select filterable v-model="eventInfo.steparr" @change="changeSteptype" multiple placeholder="请选择步骤">
            <el-option v-for="item in  StepsArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件状态">
          <el-select v-model="eventInfo.status">
            <el-option v-for="item in  statusArr" :key="item.id" :label="item.name" :value="item.id">
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
import { getEventTypeArr, addEventType, updateEventType, getStepsArr } from '@/api/depevent'
import { isAccess } from '@/utils/auth'
export default {
  data() {
    return {
      dialogFormVisible: false,
      eventInfo: {
        _id: '',
        dept_id: '',
        steparr: [],
        step_ids: '',
        status: 0,
        name: ''
      },
      titles: '添加事件类型',
      infoRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
        dept_id: [{ type: 'number', required: true, trigger: 'blur', message: '请输入名称' }]
      },
      // activeName: 'first',
      depArr: [],
      eventArr: [],
      listLoading: false,
      tableKey: 0,
      listQuery: {
        dept_id: ''
      },
      StepsArr: [],
      allStepsArr: [],
      statusArr: [
        {
          id: 0,
          name: '正常'
        }, {
          id: 1,
          name: '隐藏'
        }
      ]
    }
  },
  created() {
    this.getEventTypeArr()
    this.getDepArr()
  },
  methods: {
    isAccess: isAccess,
    addShij() {
      this.dialogFormVisible = true
      this.titles = '添加事件类型'
      this.eventInfo = {
        _id: '',
        dept_id: '',
        steparr: [],
        step_ids: '',
        status: 0,
        name: ''
      }
    },
    updateshow(item) {
      this.titles = '修改事件类型'
      this.dialogFormVisible = true
      this.eventInfo = Object.assign({ steparr: [] }, item)
      if (this.eventInfo.step_ids) {
        this.eventInfo.steparr = this.eventInfo.step_ids.split(',')
        for (var key in this.eventInfo.steparr) {
          this.eventInfo.steparr[key] = Number(this.eventInfo.steparr[key])
        }
        console.log(this.eventInfo.steparr)
      } else {
        this.eventInfo.steparr = []
      }
      this.changeStep(this.eventInfo.dept_id)
    },
    updateStaus(item) { // 修改事件类型状态
      let tipStr = ''
      let status = 0
      if (item.status) { // 恢复
        tipStr = '你确定要恢复当前事件类型？'
      } else { // 设置失效
        tipStr = '你确定要将当前事件类型设置失效？'
        status = 1
      }
      this.$confirm(tipStr, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateEventType({ _id: item._id, status: status }).then(response => {
          item.status = status
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
      }).catch(() => {
      })
    },
    handleUpdateCreate() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          if (this.titles === '添加事件类型') {
            addEventType(this.eventInfo).then(response => {
              this.dialogFormVisible = false
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
              this.dialogFormVisible = false
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
    handleQuery() { // 查询步骤
      this.getEventTypeArr()
    },
    getEventTypeArr() { // 获取步骤类型集合
      getEventTypeArr(this.listQuery).then(res => {
        this.eventArr = res.info
      })
    },
    getDepArr() { // 获取部门集合
      this.depArr = this.$store.getters.commonInfo.depArr
      getStepsArr({
        start_index: 0,
        length: 10000 }).then(res => {
        this.allStepsArr = res.info.list
      })
    },
    changeStep(id) { //  获取部门下面的步骤集合
      getStepsArr({
        start_index: 0,
        length: 10000,
        department_id: id }).then(res => {
        this.StepsArr = res.info.list
      })
    },
    changeSteptype(arr) {
      this.eventInfo.step_ids = arr.join(',')
    },
    conversionSteps(str) {
      const rets = []
      if (str.length) {
        const arr = str.split(',')
        arr.forEach(function(id) {
          const saf = this.allStepsArr.filter(obj => {
            return obj._id === Number(id)
          })
          if (saf.length) {
            rets.push(saf[0].name)
          }
        }, this)
        console.log(rets)
        return rets.join(',')
      }
      return '暂无步骤'
    }
  }
}
</script>
<style lang="scss" scoped>
.el-select{
  width: 70%;
}
</style>