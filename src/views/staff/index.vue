<template>
  <div class="app-container calendar-list-container">
    <div class="layui-elem-quote">
      <el-cascader placeholder="试试搜索：部门" :options="mydepArr" v-model="listQuery.department" @change="changeDep" filterable change-on-select></el-cascader>
      <!-- <el-cascader :options="depArr"  change-on-select ></el-cascader> -->
      <!-- <el-select  class="filter-item" filterable v-model="listQuery.department_id" placeholder="请输入部门">
        <el-option v-for="item in  depArr" :key="item._id" :title="item.parentName" :label="item.name" :value="item._id">
        </el-option>
      </el-select> -->
      <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">查看</el-button>
    </div>

    <el-table :key='tableKey' :data="list" :default-sort = "{prop: '_id', order: 'ascending'}" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column  prop="_id" align="center" label="序号" sortable width="100px">
        <template slot-scope="scope">
          <span>{{scope.row._id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" label="加入时间">
        <template slot-scope="scope">
          <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="110" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex | sexFileter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" label="民族">
        <template slot-scope="scope">
          <span>{{scope.row.nation}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="180" label="手机号码">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="110" label="生日">
        <template slot-scope="scope">
          <span>{{scope.row.birthday | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="110" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == '0'" type="primary">正常</el-tag>
          <el-tag v-if="scope.row.status == '1'" type="danger">离职</el-tag>
          <el-tag v-if="scope.row.status == '2'" type="warning">待审核</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门">
        <template slot-scope="scope">
          <span>{{filterDepRose(scope.row.department_roles,true)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="职位">
        <template slot-scope="scope">
          <span>{{filterDepRose(scope.row.department_roles,false)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button size="small" v-if="isAccess('91')&&scope.row.status != '2'" type="primary" @click="handleUpdateDa(scope.row)">修改
          </el-button>
          <el-button size="small" v-if="isAccess('94')&&scope.row.status == '2'" type="primary" @click="approval(scope.row)">审核用户
          </el-button>

          <el-button :plain="true" v-if="isAccess('92')&&scope.row.status != '2'" size="small" type="primary" @click="handlePwd(scope.row)">重置密码</el-button>
          <el-button :plain="true" v-if="isAccess('93')&&scope.row.status != '2'" size="small" type="primary" @click="handleKaoq(scope.row)">设置考勤</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block pt20 pb20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.currentPage"
        :page-size="listQuery.pagesize"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listQuery.totalPages">
      </el-pagination>
    </div>
    <!-- 分页 -->
    <el-dialog title="修改信息" @close="closeCall" :visible.sync="dialogFormVisible" class="customxing">
      <el-form class="small-space" :model="temp" :rules="infoRules" ref="infoForm" label-position="left"  label-width="80px" style='width: 400px; margin-left:50px;'>
        <!-- <el-form-item label="部门">
          <el-select class="filter-item" v-model="temp.department_id" placeholder="请选择">
            <el-option v-for="item in  depArr" :key="item._id" :label="item.value" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item> -->
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
        <!-- <el-form-item label="当前职位">
          <el-select class="filter-item" v-model="temp.role_id" placeholder="职位">
            <el-option v-for="item in  solerr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="当前状态">
          <el-select class="filter-item" v-model="temp.status" placeholder="状态">
            <el-option v-for="item in  statusArr" :key="item.id" :label="item.text" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置考勤规则" width="600px"  :visible.sync="dialogFormVisiblek" class="customxing">
      <el-select  class="filter-item" multiple v-model="reqkaoq.dance_config_arr" placeholder="默认规则">
        <el-option v-for="item in  kaoqingArr"  :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblek = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateKq">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="用户审核" :visible.sync="shenheq.dialogFormVisible" width="600px" >
      <el-form class="small-space" :model="shenheq" :rules="infoFormsq" ref="infoFormsq" label-position="right" label-width="100px">
        <el-form-item label="用户部门" prop="department_id">
          <el-select class="filter-item" filterable v-model="shenheq.department_id" placeholder="请分配" @visible-change="changeDepRule">
            <el-option v-for="item in  depArr" :key="item._id" :title="item.parentName" :label="item.name" :value="item._id+''">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户职务" prop="role_id">
          <el-select class="filter-item" filterable v-model="shenheq.role_id" placeholder="请分配">
            <el-option v-for="item in  fetchArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shenheq.dialogFormVisible= false">取 消</el-button>
        <el-button type="primary" @click="approvalStatus()">审核通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getadcArr } from '@/api/schedule'
import { mapGetters } from 'vuex'
import { fetchList, fetchRoles, updatePeInfo, updateDepRoles } from '@/api/department'
import { validateMblNo, validateIdNum } from '@/utils/validate'
import { isAccess } from '@/utils/auth'
import { deepClone, TreeUtil, removeTreeArr, findParentTop } from '@/utils/index'
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
      depArr: [],
      mydepArr: [],
      statusArr: [
        { id: 0, text: '正常' },
        { id: 1, text: '离职' },
        { id: 2, text: '审核中' }
      ],
      solerr: [],
      listQuery: {
        start_index: 0,
        length: 10,
        pagesize: 10,
        totalPages: 0,
        currentPage: 1,
        department: [],
        department_id: '',
        role_id: ''
      },
      dialogFormVisiblek: false,
      dialogFormVisible: false,
      list: null,
      currentPage1: 5,
      temp: {
        _id: '',
        department_id: '',
        name: '',
        sex: '0',
        nation: '汉',
        birthday: '',
        idNum: '',
        mobile: '',
        role_id: '',
        status: ''
      },
      infoRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        nation: [{ required: true, trigger: 'blur', message: '请输入民族' }],
        idNum: [{ required: true, trigger: 'blur', validator: validateUserIdNum }],
        mobile: [{ required: true, trigger: 'blur', validator: validateUsername }]
      },
      reqkaoq: {
        _id: '',
        dance_config_id: '',
        dance_config_arr: []
      },
      infoFormsq: {
        department_id: [{ required: true, trigger: 'change', message: '请选择部门' }],
        role_id: [{ type: 'number', required: true, trigger: 'change', message: '请选择职务' }]
      },
      shenheq: {
        dialogFormVisible: false,
        user_id: '',
        _id: '',
        department_id: '',
        role_id: '',
        is_enable: '1'
      },
      fetchArr: [],
      kaoqingArr: [],
      listLoading: true,
      tableKey: 0
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = ['正常', '离职', '待审核']
      return statusMap[status]
    },
    sexFileter(status) {
      const statusMap = ['男', '女']
      return statusMap[status]
    }
  },
  computed: {
    ...mapGetters({
      useinfo: 'useinfo'
    })
  },
  created() {
    this.listQuery.department = [this.useinfo.department_id]
    this.listQuery.department_id = this.useinfo.department_id
    this.loadRls('')
    this.depArr = this.$store.getters.commonInfo.depArr
    const array = deepClone(this.$store.getters.commonInfo.depArr)
    // this.depArr = array
    const map = { name: 'label', _id: 'value' }
    array.forEach(element => {
      element.parentid = element.parent
    })
    try {
      const tree1 = new TreeUtil(array, '_id', 'parent', map)
      const mydepArr = tree1.toTree()
      removeTreeArr(mydepArr)
      this.mydepArr = mydepArr
      console.log(this.mydepArr)
    } catch (error) {
      console.log(error)
    }
    this.getList(true)
  },
  methods: {
    isAccess: isAccess,
    changeDepRule(id, flg) {
      const request = {
        start_index: 0,
        length: 10000,
        department_id: id || this.shenheq.department_id
      }
      if (request.department_id) {
        const alldepArr = this.$store.getters.commonInfo.alldepArr
        const arr = alldepArr.filter(obj => {
          return obj._id === Number(this.shenheq.department_id)
        })
        if (arr.length) {
          request.department_id = findParentTop(alldepArr, arr[0])
        }
      }
      fetchRoles(request).then(response => {
        this.fetchArr = response.info
        if (id === false && !flg) {
          this.shenheq.role_id = ''
        }
      })
    },
    filterDepRose(arr, flg) { // 转换部门和集合
      let name = ''
      arr.forEach(function(element) {
        if (element.is_enable === '1') {
          if (flg) {
            this.depArr.forEach(function(els) {
              if (Number(element.department_id) === els._id) {
                name = els.name
              }
            }, this)
          } else {
            this.solerr.forEach(function(els) {
              if (Number(element.role_id) === els._id) {
                name = els.name
              }
            }, this)
          }
        }
      }, this)
      return name
    },
    changeDep(val) {
      this.listQuery.department_id = val[val.length - 1]
      console.log(this.listQuery.department_id)
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
      getadcArr({ start_index: 0, length: 10000 }).then(response => {
        response.info.list.forEach(element => {
          element._id = element._id + ''
        })
        this.kaoqingArr = response.info.list.filter(obj => {
          return !obj.status
        })
      })
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
            this.temp.birthday = Math.round(new Date(this.temp.birthday).getTime() / 1000)
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
    handleUpdateKq() { // 修改人员考勤规则
      this.reqkaoq.dance_config_id = this.reqkaoq.dance_config_arr.join(',')
      updatePeInfo(this.reqkaoq).then(response => {
        this.dialogFormVisiblek = false
        this.$message({
          message: '个人考勤规则修改成功！',
          type: 'success',
          duration: 4 * 1000
        })
        this.getList()
      }).catch(() => {
        this.$message({
          message: '个人考勤规则修改失败，请稍后再试',
          type: 'error',
          duration: 4 * 1000
        })
      })
    },
    handlePwd(item) {
      this.$prompt('请输入密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password',
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
    handleKaoq(item) { // 设置考勤规则
      this.dialogFormVisiblek = true
      console.log(item)
      this.reqkaoq._id = item._id
      this.reqkaoq.dance_config_id = item.dance_config_id
      if (item.dance_config_id) {
        this.reqkaoq.dance_config_arr = (item.dance_config_id + '').split(',')
      }
    },
    approval(item) { // 审核用户
      this.shenheq.dialogFormVisible = true
      this.shenheq._id = item.department_roles[0]._id
      this.shenheq.user_id = item._id
      this.shenheq.role_id = ''
      this.shenheq.department_id = item.department_roles[0].department_id
      this.changeDepRule()
    },
    approvalStatus() { // 审核用户
      this.$refs.infoFormsq.validate(valid => {
        if (valid) {
          updateDepRoles(this.shenheq).then(response => {
            updatePeInfo({ _id: this.shenheq.user_id, status: '0' }).then(response => {
              this.getList()
              this.shenheq.dialogFormVisible = false
              this.$message({
                message: '审核成功~',
                type: 'success',
                duration: 4 * 1000
              })
            }).catch(() => {
            })
          }).catch(() => {
            this.$message({
              message: '审核失败，请稍后重试',
              type: 'error',
              duration: 4 * 1000
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    formatDate(te) {
      // this.temp.birthday = Math.round(new Date(te).getTime() / 1000)
    },
    getList(flg) {
      this.listLoading = true
      // const array = this.depArr
      // if (!flg) {
      //   this.listQuery.department_id = this.listQuery.department
      //   array.forEach(function(element) { // 在已有部门查找是否存在该部门，
      //     if (this.listQuery.department === element.value) {
      //       this.listQuery.department_id = element._id
      //     }
      //   }, this)
      // }
      fetchList(this.listQuery).then(response => {
        this.list = response.info.list
        this.listQuery.totalPages = response.info.count
        this.list.forEach(function(element) {
          element.birthday = element.birthday * 1000
        }, this)
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
        this.list = []
      })
    },
    handleSizeChange(val) {
      this.listQuery.pagesize = val
      this.listQuery.currentPage = 1
      this.listQuery.start_index = (this.listQuery.currentPage - 1) * val
      this.listQuery.length = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.currentPage = val
      this.listQuery.start_index = (this.listQuery.currentPage - 1) * this.listQuery.pagesize
      this.listQuery.length = this.listQuery.pagesize
      this.getList()
    }
  }
}
</script>
<style lang="css">
.customxing .el-form-item.is-required .el-form-item__label:before {
  content: '';
  color: #fff;
  margin-right: 0;
}
</style>

