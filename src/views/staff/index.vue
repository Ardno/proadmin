<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-autocomplete class="inline-input vt" v-model="listQuery.department" :fetch-suggestions="querySearch" placeholder="请输入部门" :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.roleid" placeholder="职位">
        <el-option v-for="item in  solerr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">查看</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="65">
        <template scope="scope">
          <span>{{scope.row._id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="时间">
        <template scope="scope">
          <span>{{scope.row.create_date | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="110px" label="姓名">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80px" label="性别">
        <template scope="scope">
          <span>{{scope.row.sex | sexFileter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80px" label="民族">
        <template scope="scope">
          <span>{{scope.row.nation}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="180px" label="手机号码">
        <template scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="110px" label="生日">
        <template scope="scope">
          <span>{{scope.row.birthday | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门">
        <template scope="scope">
          <span>{{scope.row.dept_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="190">
        <template scope="scope">
          <el-button size="small" type="success" @click="handleUpdateDa(scope.row)">修改
          </el-button>
          <el-button :plain="true" size="small" type="success" @click="handlePwd(scope.row)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="修改信息" @close="closeCall" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" :rules="infoRules" ref="infoForm" label-position="left"  label-width="80px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="部门">
          <el-select class="filter-item" v-model="temp.department_id" placeholder="请选择">
            <el-option v-for="item in  restaurants" :key="item._id" :label="item.value" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio class="radio" v-model="temp.sex" :label="0">男</el-radio>
          <el-radio class="radio" v-model="temp.sex" :label="1">女</el-radio>
        </el-form-item>
        <el-form-item label="民族" prop="nation">
          <el-input v-model="temp.nation"></el-input>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker v-model="temp.birthday" type="date" :editable="false" :clearable="false" @change="formatDate" placeholder="出生日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNum">
          <el-input v-model="temp.idNum"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="temp.mobile"></el-input>
        </el-form-item>
        <el-form-item label="当前职位">
          <el-select class="filter-item" v-model="temp.roleid" placeholder="职位">
            <el-option v-for="item in  solerr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前状态">
          <el-input v-model="temp.status"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchDepartments, fetchRoles, updatePeInfo } from '@/api/department'
import { validateMblNo, validateIdNum } from '@/utils/validate'
export default {
  data() {
    const validateUserIdNum = (rule, value, callback) => {
      if (!validateIdNum(value)) {
        callback(new Error('请输入正确的身份证号码'))
      } else {
        callback()
      }
    }
    const validateUsername = (rule, value, callback) => {
      if (!validateMblNo(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      restaurants: [],
      solerr: [],
      listQuery: {
        department: '',
        department_id: '',
        roleid: ''
      },
      dialogFormVisible: false,
      list: null,
      temp: {
        _id: '',
        department_id: '',
        name: '',
        sex: '0',
        nation: '汉',
        birthday: '',
        idNum: '',
        mobile: '',
        roleid: '',
        status: ''
      },
      infoRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        nation: [{ required: true, trigger: 'blur', message: '请输入民族' }],
        idNum: [{ required: true, trigger: 'blur', validator: validateUserIdNum }],
        mobile: [{ required: true, trigger: 'blur', validator: validateUsername }]
      },
      listLoading: true,
      tableKey: 0
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
    },
    sexFileter(status) {
      const statusMap = ['男', '女']
      return statusMap[status]
    }
  },
  created() {
    this.loadRls('')
    this.loadDps()
    this.getList()
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      console.log(restaurants)
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadRls(rq) {
      fetchRoles(rq).then(response => {
        this.solerr = response.info
      })
    },
    loadDps() {
      fetchDepartments('').then(response => {
        if (response.info.length) {
          const array = response.info
          const arrs = []
          array.forEach(function(element) {
            const obj = {
              value: element.name,
              _id: element._id
            }
            arrs.push(obj)
          }, this)
          this.restaurants = arrs
        }
      })
    },
    handleSelect(item) {
      console.log(item)
    },
    handleQuery() {
      this.getList()
    },
    handleUpdateDa(item) { // 修改人员信息
      for (const key in this.temp) {
        this.temp[key] = item[key]
      }
      this.dialogFormVisible = true
    },
    closeCall() {
      this.$refs.infoForm.resetFields()
    },
    handleUpdate() { // 修改人员信息
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.$confirm('确认修改？').then(() => {
            updatePeInfo(this.temp).then(response => {
              this.dialogFormVisible = false
              this.$message({
                message: '信息修改成功！',
                type: 'success',
                duration: 4 * 1000
              })
              this.getList()
            }).catch(() => {
              this.$message({
                message: '修改信息失败，请稍后再试',
                type: 'error',
                duration: 4 * 1000
              })
            })
          }).catch(() => { console.log('取消修改') })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handlePwd(item) {
      this.$prompt('请输入密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[a-zA-Z0-9]{6,}$/,
        inputErrorMessage: '至少输入6位密码'
      }).then(({ value }) => {
        const parm = {
          _id: item['_id'],
          pwd: value
        }
        updatePeInfo(parm).then(response => {
          this.$message({
            message: '重置后密码为：' + value,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {
          this.$message({
            message: '重置密码失败，请稍后再试',
            type: 'error',
            duration: 4 * 1000
          })
        })
      }).catch(() => {
        console.log('取消修改')
      })
    },
    formatDate(te) {
      console.log(te)
      console.log(Date.parse(te))
      console.log(new Date(te).getTime())
    },
    getList() {
      this.listLoading = true
      const array = this.restaurants
      this.listQuery.department_id = this.listQuery.department
      array.forEach(function(element) { // 在已有部门查找是否存在该部门，
        if (this.listQuery.department === element.value) {
          this.listQuery.department_id = element._id
        }
      }, this)
      fetchList(this.listQuery).then(response => {
        this.list = response.info
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
        this.list = []
      })
    }
  }
}
</script>
<style lang="css">
.el-form-item.is-required .el-form-item__label:before {
  content: '';
  color: #fff;
  margin-right: 0;
}
</style>

