<template>
  <div class="app-container">
    <div class="layui-elem-quote">
      <el-select clearable class="filter-item" filterable style="width: 130px" v-model="pageobj.department_id" placeholder="部门">
        <el-option v-for="item in  depArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">搜索</el-button>
      <el-button class="filter-item" v-if="isAccess('121')" type="primary" icon="plus" @click="addAccess"> 添加</el-button>
    </div>
    <el-table :key='tableKey' :data="dataAccess" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row._id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" label="部门">
        <template slot-scope="scope">
          <span>{{getDepName(scope.row.department_id)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="职务名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="职务权限">
        <template slot-scope="scope">
          <span>{{statusFilter(scope.row.access)}}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="操作" width="190">
        <template slot-scope="scope">
          <el-button size="small" v-if="isAccess('122')" type="primary" @click="handleUpdate(scope.row)">修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="titlea" @close="closeCall" :visible.sync="dialogFormVisible">
      <el-form label-position="right" label-width="80px" :rules="infoRules" ref="infoForm" :model="duty">
        <el-form-item label="所属部门">
          <el-select clearable class="filter-item" filterable style="width: 130px" v-model="duty.department_id" placeholder="请选择">
            <el-option v-for="item in  depArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="duty.name"></el-input>
        </el-form-item>
        <el-form-item label="职位级别" prop="level">
          <el-select class="filter-item" v-model="duty.level" placeholder="请选择">
            <el-option v-for="item in  levelArr" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <span class="f12 g9">级别越高数字越大</span>
        </el-form-item>
        <el-form-item label="平台权限">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox><br>
          <el-checkbox-group v-model="duty.accessarr" @change="handleCheckedCitiesChange">
            <el-checkbox class="ml30" v-for="obj in accessArr" :label="obj.value+''" :key="obj.value">{{obj.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
  </div>
</template>

<script>
import { getAccess, createRoles, fetchRoles, updateRoles } from '@/api/department'
import { deepClone } from '@/utils/index'
import { isAccess } from '@/utils/auth'
export default {
  data() {
    return {
      checkAll: true,
      isIndeterminate: true,
      accessArr: [],
      levelArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      tableKey: 0,
      dialogFormVisible: false,
      dataAccess: null,
      titlea: '',
      pageobj: {
        start_index: 0,
        length: 10,
        pagesize: 10,
        department_id: ''
      },
      duty: {
        department_id: '',
        name: '',
        accessarr: [],
        access: '',
        level: '1'
      },
      depArr: [],
      listLoading: false,
      infoRules: {
        name: [{ required: true, message: '请输入职务名', trigger: 'blur' }]
      }
    }
  },
  methods: {
    isAccess: isAccess,
    getDepName(id) { // 通过id转换部门名称
      let name = '无'
      this.depArr.forEach(function(element) {
        if (element._id === id) {
          name = element.name
        }
      }, this)
      return name
    },
    getAccessArr() { // 获取权限集合
      getAccess().then(data => {
        const object = data.info
        Object.keys(object).forEach(item => {
          Object.keys(object[item]).forEach(access => {
            if (access !== 'name') {
              Object.keys(object[item][access]).forEach(accessmodel => {
                if (accessmodel !== 'name') {
                  const obj = object[item][access][accessmodel]
                  obj['name'] = object[item][access]['name'] + obj['name']
                  this.accessArr.push(obj)
                }
              })
            }
          })
        })
      })
    },
    closeCall() {
      this.$refs.infoForm.resetFields()
    },
    addAccess() {
      this.dialogFormVisible = true
      this.titlea = '添加职务'
      this.duty = {
        department_id: '',
        name: '',
        accessarr: [],
        access: '',
        level: '1'
      }
      const checkedCount = this.duty.accessarr.length
      this.checkAll = checkedCount === this.accessArr.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.accessArr.length
    },
    handleUpdate(item) { // 修改职务
      this.titlea = '修改职务'
      const obj = deepClone(item)
      obj.accessarr = obj.access.split(',')
      if (obj.access === '0') {
        obj.accessarr = []
        this.accessArr.forEach(element => {
          obj.accessarr.push(element.value + '')
        })
      }
      if (!obj.department_id) {
        obj.department_id = ''
      }
      const checkedCount = obj.accessarr.length
      this.checkAll = checkedCount === this.accessArr.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.accessArr.length
      this.duty = obj
      this.dialogFormVisible = true
    },
    handleQuery() { // 查询职务
      this.getaccArray()
    },
    getaccArray() { // 获取职务集合
      this.listLoading = true
      fetchRoles(this.pageobj).then(response => {
        this.dataAccess = response.info
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    handleAddUpdate() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          if (this.titlea === '添加职务') {
            console.log(this.duty)
            this.$confirm('确认创建当前职务？').then(() => {
              if (!this.duty.access) {
                this.duty.access = '0'
              }
              createRoles(this.duty).then(response => {
                this.dialogFormVisible = false
                this.getaccArray()
                this.$message({
                  message: '职务创建成功！',
                  type: 'success',
                  duration: 4 * 1000
                })
              }).catch(() => {
                this.$message({
                  message: '职务创建失败，请稍后再试',
                  type: 'error',
                  duration: 4 * 1000
                })
              })
            }).catch(() => { console.log('取消创建') })
          } else {
            this.$confirm('确认修改当前职务？').then(() => {
              updateRoles(this.duty).then(response => {
                this.dialogFormVisible = false
                this.getaccArray()
                this.$message({
                  message: '职务修改成功！',
                  type: 'success',
                  duration: 4 * 1000
                })
              }).catch(() => {
                this.$message({
                  message: '职务修改失败，请稍后再试',
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
    resetForm() {
      this.$refs.infoForm.resetFields()
    },
    statusFilter(status) {
      const statusMap = this.accessArr
      const arra = status.split(',')
      const arrb = []
      arra.forEach(function(element) {
        const els = element
        for (const key in statusMap) {
          if (statusMap[key].value + '' === els) {
            arrb.push(statusMap[key].name)
          }
        }
      }, this)
      // console.log(arrb)
      if (arrb.length) {
        return arrb.join(',')
      } else {
        return '全部权限'
      }
    },
    loadDep() { // 获取用户部门和用户
      this.depArr = deepClone(this.$store.getters.commonInfo.depArr)
    },
    handleCheckAllChange(val) {
      if (val) {
        this.accessArr.forEach(function(element) {
          this.duty.accessarr.push(element.value + '')
        }, this)
      } else {
        this.duty.accessarr = []
      }
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.accessArr.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.accessArr.length
      this.duty.access = value.join(',')
    }
  },
  created() {
    this.loadDep()
    this.getAccessArr()
    this.getaccArray()
  }
}
</script>
<style lang="sass">


</style>