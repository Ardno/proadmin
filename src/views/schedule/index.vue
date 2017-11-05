<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="考勤规则" name="first">
        <div class="layui-elem-quote">
          <span class="f16">考勤规则记录</span>
          <el-button class="filter-item" type="primary" icon="plus" @click="addruleadc" v-if="isAccess('41')">添加</el-button>
        </div>
        <el-table :key='tableKey' :data="adclist" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="序号" width="65">
            <template scope="scope">
              <span>{{scope.row._id}}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="center" label="创建时间">
            <template scope="scope">
              <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="考勤规则名称">
            <template scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="区域名称">
            <template scope="scope">
              <span>{{scope.row.regionname}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="执行日期">
            <template scope="scope">
              <span>{{scope.row.atte_type | statusFilter(scope.row.day_time)}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="开始时间">
            <template scope="scope">
              <span>{{scope.row.start_time}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="结束时间">
            <template scope="scope">
              <span>{{scope.row.end_time}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="190">
            <template scope="scope">
              <el-button size="small" type="success" v-if="isAccess('41')"  @click="handleUpdateDa(scope.row)">修改
              </el-button>
              <span v-if="scope.row._id===1" class="f12 g9 ml15">默认规则</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block pt20 pb20">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageobj.pagesize"
            :page-sizes="[10, 15, 20, 25]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPages">
          </el-pagination>
        </div>
        <!-- 分页 -->
        <el-dialog :title="titlea" @close="closeCalla" :visible.sync="dialogFormVisiblea">
          <el-form class="small-space" :model="dataa" :rules="infoRulesa" ref="infoForma" label-position="right" label-width="120px" style='width: 400px; margin-left:50px;'>
            <el-form-item label="规则名称" prop="name">
              <el-input v-model="dataa.name"></el-input>
            </el-form-item>
            
            <el-form-item label="开始时间" prop="start_time">
              <el-time-select v-model="dataa.start_time" :picker-options="{start: '00:00',step: '00:15',end: '23:45'}" placeholder="开始时间">
              </el-time-select>
            </el-form-item>
            <el-form-item label="结束时间" prop="end_time">
              <el-time-select v-model="dataa.end_time" :picker-options="{start: '00:00',step: '00:15',end: '23:45'}" placeholder="结束时间">
              </el-time-select>
            </el-form-item>
            <el-form-item label="所在区域" >
              <el-select  v-model="dataa.region_id" placeholder="请选择">
                <el-option v-for="item in regionArr" :key="item._id" :label="item.name" :value="item._id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="执行类型" >
              <el-select  v-model="dataa.atte_type" placeholder="请选择">
                <el-option v-for="item in statusArr" :key="item.id" :label="item.text" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="执行日期" v-if="dataa.atte_type === 3">
              <el-date-picker v-model="dataa.day_time" type="date" :editable="false" :clearable="false" placeholder="请选择">
              </el-date-picker>
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
import { isAccess } from '@/utils/auth'
import { parseTime } from '@/utils/index'
import { getRegionArr } from '@/api/grid'
export default {
  data() {
    return {
      totalPages: 0,
      currentPage: 1,
      regionArr: [],
      pageobj: {
        start_index: 0,
        length: 9,
        pagesize: 10
      },
      activeName: 'first',
      adclist: null,
      listLoading: false,
      tableKey: 0,
      titlea: '',
      dialogFormVisiblea: false,
      infoRulesa: {
        name: [{ required: true, message: '请输入规则名', trigger: 'blur' }],
        start_time: [{ required: true, message: '请选择上班时间', trigger: 'blur' }],
        end_time: [{ required: true, message: '请选择下班时间', trigger: 'blur' }]
      },
      statusArr: [{ id: 1, text: '每天' }, { id: 2, text: '工作日' }, { id: 3, text: '指定日期' }],
      dataa: {
        name: '',
        start_time: '',
        end_time: '',
        region_id: 1,
        atte_type: 2,
        day_time: ''
      }
    }
  },
  filters: {
    statusFilter(status, time) {
      const statusMap = ['', '每天', '工作日', '指定日期']
      if (status === 3) {
        const timearr = time.split(',')
        const arr = []
        timearr.forEach(function(element) {
          element = parseTime(Number(element), '{y}-{m}-{d}', true)
          arr.push(element)
        }, this)
        return arr.join(',')
      }
      return statusMap[status]
    }
  },
  created() {
    this.getadcArray()
    getRegionArr({ start_index: 0, length: 10000, status: 0 }).then(response => {
      const arr = response.info.list.filter(function(element) {
        return element.status === 0
      }, this)
      this.regionArr = arr
    })
  },
  methods: {
    isAccess: isAccess,
    addruleadc() {
      this.dialogFormVisiblea = true
      this.titlea = '添加规则'
      this.dataa = {
        name: '',
        start_time: '',
        end_time: '',
        region_id: 1,
        atte_type: 2,
        day_time: ''
      }
    },
    handleClick(tab, event) { // tab切换
      console.log(tab, event)
    },
    handleUpdateDa(item) { // 修改考勤规则
      this.titlea = '修改考勤规则'
      this.dataa = deepClone(item)
      this.dataa.day_time = Number(this.dataa.day_time) * 1000
      this.dialogFormVisiblea = true
    },
    handleAddUpdate() { // 添加修改考勤规则
      this.$refs.infoForma.validate(valid => {
        if (valid) {
          if (this.dataa.day_time) {
            this.dataa.day_time = Math.round(new Date(this.dataa.day_time).getTime() / 1000)
          }
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
      getadcArr(this.pageobj).then(response => {
        this.adclist = response.info.list
        this.totalPages = response.info.count
        // this.adclist.reverse()
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    handleSizeChange(val) {
      this.pageobj.pagesize = val
      this.currentPage = 1
      this.pageobj.start_index = (this.currentPage - 1) * val
      this.pageobj.length = val
      this.getadcArray()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.pageobj.start_index = (this.currentPage - 1) * this.pageobj.pagesize
      this.pageobj.length = this.pageobj.pagesize
      this.getadcArray()
    }
  }
}
</script>
