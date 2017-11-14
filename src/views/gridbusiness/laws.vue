<template>
  <div class="app-container">
      <div class="layui-elem-quote">
        <el-select clearable class="filter-item" filterable style="width: 130px" v-model="listQuery.department_id" placeholder="部门">
          <el-option v-for="item in  depArr" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
        <el-select clearable class="filter-item" filterable style="width: 130px" v-model="listQuery.regu_id" placeholder="上级法规">
          <el-option v-for="item in  reguArr" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
        <el-button class="filter-item" type="primary" icon="search" @click="getList">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="plus" @click="addRegu"> 添加</el-button>
      </div>
      <el-table :key='tableKey' :data="dataList" :default-sort = "{prop: '_id', order: 'ascending'}" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
        <el-table-column  prop="_id" align="center" label="序号" sortable width="100px">
          <template scope="scope">
            <span>{{scope.row._id}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="center" label="添加时间">
          <template scope="scope">
            <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120px" label="名称">
          <template scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120px" label="所属部门">
          <template scope="scope">
            <span>{{filterDepRegu(scope.row.department_id,true)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120px" label="上级法规">
          <template scope="scope">
            <span>{{filterDepRegu(scope.row.regu_id,false)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"  label="内容">
          <template scope="scope">
            <div class="cts">{{scope.row.content}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template scope="scope">
            <el-button size="small" type="success" @click="updateRegu(scope.row)">修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div v-if="false" class="block pt20 pb20">
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
      <el-dialog :title="titlea" size="tiny" @close="closeCall" :visible.sync="dialogFormVisible">
        <el-form label-position="right" label-width="80px" :rules="infoRules" ref="infoForm" :model="duty">
          <el-form-item label="上级法规" >
            <el-select class="filter-item" filterable style="width: 130px" v-model="duty.regu_id" placeholder="请选择">
              <el-option v-for="item in  creguArr" :key="item._id" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门" prop="department_id">
            <el-select clearable class="filter-item" filterable style="width: 130px" v-model="duty.department_id" placeholder="请选择">
              <el-option v-for="item in  depArr" :key="item._id" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="duty.name"></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input type="textarea"  :rows="4" v-model="duty.content"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddUpdate">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
// addLaws, updateLaws, getLaws,
import { fetchDepartments } from '@/api/department'
import { addLaws, updateLaws, getLawsArr } from '@/api/depevent'
import { isAccess } from '@/utils/auth'

export default {
  data() {
    return {
      tableKey: 0,
      dialogFormVisible: false,
      dataList: null,
      titlea: '',
      listQuery: {
        start_index: 0,
        length: 9,
        pagesize: 10,
        totalPages: 0,
        currentPage: 1,
        department_id: '',
        regu_id: ''
      },
      duty: {
        name: '',
        regu_id: '',
        department_id: '',
        content: ''
      },
      depArr: [],
      reguArr: [],
      creguArr: [],
      listLoading: false,
      infoRules: {
        department_id: [{ required: true, type: 'number', message: '请输入职务名', trigger: 'change' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        content: [{ required: true, message: '请输入法律法规内容', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.loadDps()
    this.getList()
  },
  methods: {
    isAccess: isAccess,
    addRegu() {
      this.titlea = '添加法律法规'
      this.duty = {
        name: '',
        regu_id: '',
        department_id: '',
        content: ''
      }
      this.creguArr = this.reguArr
      this.dialogFormVisible = true
    },
    updateRegu(item) {
      this.titlea = '修改法律法规'
      this.dialogFormVisible = true
      this.duty = Object.assign({}, item)
      if (!this.duty.regu_id) {
        this.duty.regu_id = ''
        this.creguArr = this.reguArr
      } else {
        this.creguArr = this.reguArr.filter((obj) => {
          return obj.regu_id !== this.duty.regu_id
        })
      }
    },
    handleAddUpdate() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          if (this.titlea === '添加法律法规') {
            console.log(this.duty)
            this.$confirm('确认创建该法律法规？').then(() => {
              if (!this.duty.regu_id) {
                this.duty.regu_id = '0'
              }
              addLaws(this.duty).then(response => {
                this.dialogFormVisible = false
                this.getList()
                this.$message({
                  message: '创建成功！',
                  type: 'success',
                  duration: 4 * 1000
                })
              }).catch(() => {
                this.$message({
                  message: '创建失败，请稍后再试',
                  type: 'error',
                  duration: 4 * 1000
                })
              })
            }).catch(() => { console.log('取消创建') })
          } else {
            this.$confirm('确认修改当前法律法规？').then(() => {
              updateLaws(this.duty).then(response => {
                this.dialogFormVisible = false
                this.getList()
                this.$message({
                  message: '修改成功！',
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
            }).catch(() => { console.log('取消修改') })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeCall() {
      this.$refs.infoForm.resetFields()
    },
    loadDps() {
      fetchDepartments('').then(response => {
        const array = response.info
        const arrs = array.filter(function(element) {
          return element.status !== 1
        }, this)
        this.depArr = arrs
      })
      getLawsArr('').then(response => {
        const array = response.info
        const arrs = array.filter(function(element) {
          return element.status !== 1
        }, this)
        this.reguArr = arrs
      })
    },
    filterDepRegu(id, flg) { // 转换部门和法律
      let name = '无'
      if (flg) {
        this.depArr.forEach(function(els) {
          if (Number(id) === els._id) {
            name = els.name
            return name
          }
        }, this)
      } else {
        this.reguArr.forEach(function(els) {
          if (Number(id) === els._id) {
            name = els.name
            return name
          }
        }, this)
      }
      return name
    },
    getList() {
      this.listLoading = true
      getLawsArr(this.listQuery).then(response => {
        this.dataList = response.info
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
        this.dataList = []
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
  },
  computed: {
  }
}
</script>
<style lang="scss" scoped>
  .cts{
    max-height: 70px;
    overflow: hidden;
  }
</style>