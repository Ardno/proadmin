<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="考勤规则" name="first">
        <div class="filter-container">
          <span class="f16">考勤规则记录表</span>
          <el-button class="filter-item" type="primary" icon="plus" @click="addruleadc">添加</el-button>
        </div>
        <el-table :key='tableKey' :data="adclist" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="序号" width="65">
            <template scope="scope">
              <span>{{scope.row._id}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="考勤规则名称">
            <template scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="center" label="创建时间">
            <template scope="scope">
              <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="上午">
            <el-table-column align="center" label="上班时间">
              <template scope="scope">
                <span>{{scope.row.work_morning}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="下班时间">
              <template scope="scope">
                <span>{{scope.row.offwork_morning}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="下午">
            <el-table-column align="center" label="上班时间">
              <template scope="scope">
                <span>{{scope.row.work_afternoon}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="下班时间">
              <template scope="scope">
                <span>{{scope.row.ofwork_afternoon}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="操作" width="190">
            <template scope="scope">
              <el-button size="small" type="success" @click="handleUpdateDa(scope.row)">修改
              </el-button>
              <span v-if="scope.row._id===1" class="f12 g9 ml15">默认规则</span>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog :title="titlea" @close="closeCalla" :visible.sync="dialogFormVisiblea">
          <el-form class="small-space" :model="dataa" :rules="infoRulesa" ref="infoForma" label-position="left" label-width="120px" style='width: 400px; margin-left:50px;'>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="dataa.name"></el-input>
            </el-form-item>
            <el-form-item label="上午上班时间" prop="work_morning">
              <el-time-select placeholder="开始时间" :editable="false" :clearable="false" v-model="dataa.work_morning" :picker-options="{start: '06:00',step: '00:15',end: '18:00'}">
              </el-time-select>
            </el-form-item>
            <el-form-item label="上午下班时间" prop="offwork_morning">
              <el-time-select placeholder="结束时间" :editable="false" :clearable="false" v-model="dataa.offwork_morning" :picker-options="{start: dataa.work_morning,step: '00:15',end: '18:00',minTime: dataa.work_morning}">
              </el-time-select>
            </el-form-item>
            <el-form-item label="下午上班时间" prop="work_afternoon">
              <el-time-select placeholder="开始时间" :editable="false" :clearable="false" v-model="dataa.work_afternoon" :picker-options="{start: dataa.offwork_morning,step: '00:15',end: '23:00',minTime: dataa.offwork_morning}">
              </el-time-select>
            </el-form-item>
            <el-form-item label="下午下班时间" prop="ofwork_afternoon">
              <el-time-select placeholder="结束时间" :editable="false" :clearable="false" v-model="dataa.ofwork_afternoon" :picker-options="{start: dataa.work_afternoon,step: '00:15',end: '24:00',minTime: dataa.work_afternoon}">
              </el-time-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisiblea = false">取 消</el-button>
            <el-button type="primary" @click="handleAddUpdate">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { getadcArr, addAdc, updateAdc } from '@/api/schedule'
import { deepClone } from '@/utils/index'
export default {
  data() {
    return {
      activeName: 'first',
      adclist: null,
      listLoading: false,
      tableKey: 0,
      titlea: '',
      value2: new Date(2016, 9, 10, 18, 40),
      dialogFormVisiblea: false,
      infoRulesa: {
        name: [{ required: true, message: '请输入规则名', trigger: 'blur' }],
        work_morning: [{ required: true, message: '请选择上午上班时间', trigger: 'blur' }],
        offwork_morning: [{ required: true, message: '请选择上午下班时间', trigger: 'blur' }],
        work_afternoon: [{ required: true, message: '请选择下午上班时间', trigger: 'blur' }],
        ofwork_afternoon: [{ required: true, message: '请选择下午下班时间', trigger: 'blur' }]
      },
      dataa: {
        name: '',
        work_morning: '',
        offwork_morning: '',
        work_afternoon: '',
        ofwork_afternoon: ''
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getadcArray()
  },
  methods: {
    addruleadc() {
      this.dialogFormVisiblea = true
      this.titlea = '添加规则'
      this.dataa = {
        name: '',
        work_morning: '',
        offwork_morning: '',
        work_afternoon: '',
        ofwork_afternoon: ''
      }
    },
    handleClick(tab, event) { // tab切换
      console.log(tab, event)
    },
    handleUpdateDa(item) { // 修改考勤规则
      this.titlea = '修改考勤规则'
      this.dataa = deepClone(item)
      this.dialogFormVisiblea = true
    },
    handleAddUpdate() { // 添加修改考勤规则
      this.$refs.infoForma.validate(valid => {
        if (valid) {
          if (this.titlea === '添加规则') {
            addAdc(this.dataa).then(response => {
              this.dialogFormVisiblea = false
              this.$message({
                message: '添加规则成功！',
                type: 'success',
                duration: 4 * 1000
              })
              this.getadcArray()
            }).catch(() => {
              this.$message({
                message: '添加规则失败，请稍后再试',
                type: 'error',
                duration: 4 * 1000
              })
            })
          } else {
            this.$confirm('确认修改？').then(() => {
              updateAdc(this.dataa).then(response => {
                this.dialogFormVisiblea = false
                this.$message({
                  message: '修改规则成功！',
                  type: 'success',
                  duration: 4 * 1000
                })
                this.getadcArray()
              }).catch(() => {
                this.$message({
                  message: '修改规则失败，请稍后再试',
                  type: 'error',
                  duration: 4 * 1000
                })
              })
            }).catch(() => { console.log('取消修改') })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSet() { // 设置默认考勤规则

    },
    closeCalla() {
      this.$refs.infoForma.resetFields()
    }, //
    getadcArray() { // 获取考勤规则集合
      this.listLoading = true
      getadcArr().then(response => {
        this.adclist = response.info
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    }
  }
}
</script>
