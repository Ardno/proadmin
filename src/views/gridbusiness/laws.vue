<template>
  <div class="app-container">
      <div class="layui-elem-quote">
        <!-- <el-select clearable class="filter-item" filterable style="width: 130px" v-model="listQuery.department_id" placeholder="部门">
          <el-option v-for="item in  depArr" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
        <el-select clearable class="filter-item" filterable style="width: 130px" v-model="listQuery.regu_id" placeholder="上级法规">
          <el-option v-for="item in  reguArr" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select> -->
        <span class="mr10 ">
          法律法规
        </span>
        <!-- <el-button class="filter-item" type="primary" icon="search" @click="getList">搜索</el-button> -->
        <el-button class="filter-item" v-if="isAccess('141')" type="primary" icon="plus" @click="addRegu"> 添加</el-button>
      </div>
      <el-container>
        <el-aside width="410px">
          <el-tree :data="regutree" :props="defaultProps" node-key="id" @node-click="nodeClick" :expand-on-click-node="true"  :render-content="renderContent">
          </el-tree>
        </el-aside>
        <el-main>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>法律法规详情</span>
              <el-button v-if="updateduty.name" style="float: right; padding: 3px 0" @click="updateRegu" type="text">修改</el-button>
            </div>
            <el-form :model="updateduty" label-position="right" label-width="80px" class="demo-form-inline" v-loading="listLoading">
              <el-form-item label="名称">
                <span>{{updateduty.name || '无'}}</span>
              </el-form-item>
              <el-form-item label="添加时间">
                <span v-if="updateduty.create_time">{{updateduty.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
                <span v-else>无</span>
              </el-form-item>
              <el-form-item label="所属部门">
                <span>{{filterDepRegu(updateduty.department_id,true) || '无'}}</span>
              </el-form-item>
              <!-- <el-form-item label="上级法规">
                <span>{{filterDepRegu(duty.regu_id,false)}}</span>
              </el-form-item> -->
              <el-form-item label="等级">
                <span v-if="updateduty.name">
                  <el-tag v-if="updateduty.regu_type === 0" type="info">临时法规</el-tag>
                  <el-tag v-if="updateduty.regu_type === 1" type="info">国家</el-tag>
                  <el-tag v-if="updateduty.regu_type === 2" type="info">省/直辖市</el-tag>
                  <el-tag v-if="updateduty.regu_type === 3" type="info">地级市</el-tag>
                </span>
                <span v-else>无</span>
              </el-form-item>
              <el-form-item label="有效时间">
                <span v-if="updateduty.effective_time">{{updateduty.effective_time | parseTime('{y}-{m}-{d}')}}</span>
                <span v-else>无</span>
              </el-form-item>
              <el-form-item label="内容">
                <p style="max-height:250px;overflow:auto">{{updateduty.content || '无'}}</p>
              </el-form-item>
            </el-form>
          </el-card>
        </el-main>
      </el-container>
      <!-- <el-table :key='tableKey' :data="dataList" :default-sort = "{prop: '_id', order: 'ascending'}" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
        <el-table-column  prop="_id" align="center" label="序号" sortable width="100px">
          <template slot-scope="scope">
            <span>{{scope.row._id}}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="center" label="添加时间">
          <template slot-scope="scope">
            <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120px" label="名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120px" label="所属部门">
          <template slot-scope="scope">
            <span>{{filterDepRegu(scope.row.department_id,true)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="120px" label="上级法规">
          <template slot-scope="scope">
            <span>{{filterDepRegu(scope.row.regu_id,false)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"  label="内容">
          <template slot-scope="scope">
            <div class="cts">{{scope.row.content}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100" v-if="isAccess('142')">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="updateRegu(scope.row)">修改
            </el-button>
          </template>
        </el-table-column>
      </el-table> -->
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
      <el-dialog :title="titlea" width="600px"  @close="closeCall" :visible.sync="dialogFormVisible">
        <el-form label-position="right" label-width="80px" :rules="infoRules" ref="infoForm" :model="duty">
          <el-form-item label="上级法规" >
            <el-select class="filter-item" :clearable="true" filterable style="width: 130px" v-model="duty.regu_id" placeholder="请选择">
              <el-option v-for="item in  creguArr" :key="item._id" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="法规等级">
            <el-select class="filter-item" filterable style="width: 130px" v-model="duty.regu_type" placeholder="请选择">
              <el-option v-for="item in  regutypeArr" :key="item._id" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有效日期">
            <el-date-picker
              v-model="duty.effective_time"
              type="date"
              placeholder="法规有效日期">
            </el-date-picker>
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
          <el-form-item label="内容">
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
import { TreeUtil } from '@/utils/index'
import { addLaws, updateLaws, getLawsArr } from '@/api/depevent'
import { isAccess } from '@/utils/auth'
export default {
  data() {
    const regutypeArr = [
      { name: '临时法规', _id: 0 },
      { name: '国家', _id: 1 },
      { name: '省/直辖市', _id: 2 },
      { name: '地级市', _id: 3 }
    ]
    return {
      regutypeArr: regutypeArr,
      tableKey: 0,
      dialogFormVisible: false,
      dataList: null,
      titlea: '',
      listQuery: {
        start_index: 0,
        length: 10,
        pagesize: 10,
        totalPages: 0,
        currentPage: 1,
        department_id: '',
        regu_id: ''
      },
      duty: {
        name: '',
        regu_id: '',
        regu_type: 1,
        effective_time: '',
        department_id: '',
        content: ''
      },
      updateduty: {
        name: '',
        regu_id: '',
        regu_type: 1,
        effective_time: '',
        department_id: '',
        content: ''
      },
      dutybak: null,
      depArr: [],
      reguArr: [],
      creguArr: [],
      regutree: null,
      listLoading: false,
      infoRules: {
        department_id: [{ required: true, type: 'number', message: '请输入职务名', trigger: 'change' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      defaultProps: {
        children: 'children',
        label: 'label'
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
        regu_type: 1,
        effective_time: '',
        department_id: '',
        content: ''
      }
      this.creguArr = this.reguArr
      this.dialogFormVisible = true
    },
    updateRegu(item) {
      this.titlea = '修改法律法规'
      this.dialogFormVisible = true
      this.duty = Object.assign({}, this.dutybak)
      this.duty._id = this.duty.id
      if (!this.duty.effective_time) {
        this.duty.effective_time = ''
      } else {
        this.duty.effective_time = this.duty.effective_time * 1000
      }
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
          if (this.duty.effective_time) {
            this.duty.effective_time = Math.round(new Date(this.duty.effective_time).getTime() / 1000)
          }
          if (this.titlea === '添加法律法规') {
            this.$confirm('确认创建该法律法规？').then(() => {
              if (!this.duty.regu_id) {
                this.duty.regu_id = '0'
              }
              addLaws(this.duty).then(response => {
                this.dialogFormVisible = false
                this.getLawsArr()
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
                this.getLawsArr()
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
    getLawsArr() {
      this.updateduty = {
        name: '',
        regu_id: '',
        regu_type: 1,
        effective_time: '',
        department_id: '',
        content: ''
      }
      getLawsArr('').then(response => {
        const array = response.info
        this.reguArr.push(...response.info)
        const map = { name: 'label', _id: 'id' }
        array.forEach(element => {
          element.parentid = element.regu_id
        })
        try {
          const tree1 = new TreeUtil(array, '_id', 'regu_id', map)
          this.regutree = tree1.toTree()
        } catch (error) {
          console.log(error)
        }
      })
    },
    loadDps() {
      fetchDepartments('').then(response => {
        const array = response.info
        const arrs = array.filter(function(element) {
          return element.status !== 1
        }, this)
        this.depArr = arrs
      })
      this.getLawsArr()
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
    },
    append(data) {
      event.cancelBubble = true
      this.titlea = '添加法律法规'
      this.duty = {
        name: '',
        regu_id: data.id ? data.id : '',
        regu_type: data.regu_type,
        effective_time: data.effective_time ? data.effective_time * 1000 : '',
        department_id: data.department_id,
        content: ''
      }
      this.creguArr = this.reguArr
      this.dialogFormVisible = true
    },
    toview(store, data) {
      this.listLoading = true
      this.dutybak = Object.assign({}, data, { name: data.label, regu_id: data.parentid })
      this.updateduty = Object.assign({}, this.dutybak)
      this.updateduty.effective_time = this.updateduty.effective_time * 1000
      setTimeout(() => {
        this.listLoading = false
      }, 400)
    },
    nodeClick(data, node, store) {
      // console.log(data, node, store)
      this.toview(store, data)
    },
    renderContent(h, { node, data, store }) {
      return (
        <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <el-button style='font-size: 12px;' type='text' on-click={ () => this.append(data) }>添加</el-button>
          </span>
        </span>)
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
  .box-card{
    width: 600px;
    margin: 0 auto;
  }
</style>