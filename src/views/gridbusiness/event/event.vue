<template>
  <div class="app-container">
    <div class="titles">
      <p class="mb10">
        <!-- <el-select clearable class="filter-item"  filterable v-model="pageobj.department_ids" @change="filterArrDep" placeholder="试试搜索：部门">
          <el-option v-for="item in  commonInfo.depArr" :key="item._id" :title="item.parentName" :label="item.name" :value="item._id">
          </el-option>
        </el-select> -->
        <el-cascader placeholder="试试搜索：部门" :options="mydepArr" v-model="pageobj.department_ids" @change="filterArrDep" filterable change-on-select></el-cascader>
        <el-select clearable class="filter-item mr10" style="width: 130px" filterable v-model="pageobj.type_id" placeholder="事件类型">
          <el-option v-for="item in  typeArr" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
        <el-select clearable class="filter-item mr10" style="width: 130px" filterable @change="handleQuery" v-model="pageobj.step_status" placeholder="事件状态">
          <el-option v-for="item in  statusArr" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
        <el-select clearable class="filter-item mr10" style="width: 130px" filterable @change="handleQuery" v-model="pageobj.user_id" placeholder="创建人">
          <el-option v-for="item in  commonInfo.userArr" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
      </p>
      <p>
        <el-date-picker
          v-model="start_time"
          align="right"
          type="date"
          placeholder="选择开始时间"
          :picker-options="pickerOptions1">
        </el-date-picker>
        <span>-</span>
        <el-date-picker
          v-model="end_time"
          align="right"
          type="date"
          placeholder="选择结束时间"
          :picker-options="pickerOptions1">
        </el-date-picker>
        <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">搜索</el-button>
      </p>
    </div>
    <el-table :key='tableKey' :data="eventArr" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column width="180" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deptname" label="所属部门" >
      </el-table-column>
      <el-table-column prop="username" label="创建人" >
      </el-table-column>
      <el-table-column prop="typename" label="事件类型">
      </el-table-column>
      <el-table-column prop="name" label="事件名称">
      </el-table-column>
      <el-table-column width="120" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == '0' && scope.row.is_unaudited>0" type="info">
              待审核
          </el-tag>
          <el-tag v-else-if="scope.row.status == '0' && scope.row.is_unfilled > 0 && scope.row.is_unaudited ==0" type="info">
              待填写
          </el-tag>
          <el-tag v-else-if="scope.row.status == '1'" type="primary">完成</el-tag>
          <el-tag v-else-if="scope.row.status == '2'" type="warning">已删除</el-tag>
          <el-tag v-else type="info">
              待关闭
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180" label="当前步骤">
        <template slot-scope="scope">
          <span>{{scope.row.dangqname}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" label="发生时间">
        <template slot-scope="scope">
          <span>{{scope.row.happen_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="结束时间">
        <template slot-scope="scope">
          <span v-if="scope.row.close_time">{{scope.row.close_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <span v-else>无</span>
        </template>
      </el-table-column> -->
      <el-table-column label="最后更新时间">
        <template slot-scope="scope">
          <span v-if="scope.row.update_time">{{scope.row.update_time | parseTime('{y}-{m}-{d} {h}:{i}',true)}}</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small" type="primary" v-if="scope.row.status == '0' && isAccess('51') && (scope.row.is_unfilled > 0 && scope.row.is_unaudited ==0)" icon="el-icon-edit" title="填写事件"  @click="goOtherPage(scope.row._id)" >
          </el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" v-if="scope.row.status == '0' && isAccess('52')" @click="closeEvent(scope.row)" title="删除" >
          </el-button>
          <el-button size="small" type="primary" v-if="scope.row.status == '0' && isAccess('53') && scope.row.is_unaudited>0"  icon="el-icon-search"  @click="showStepInfo(scope.row)" title="查看/审核" >
          </el-button>
          <el-button size="small" type="success"  @click="markComplete(scope.row)" v-if="scope.row.status == '0' && isAccess('54') && (scope.row.is_unfilled == 0 && scope.row.is_unaudited ==0)" >标记完成
          </el-button>
          <!-- <el-button size="small" type="primary" v-if="scope.row.status == '0' && isAccess('91') && (scope.row.is_unfilled > 0 && scope.row.is_unaudited ==0)">步骤填写</el-button> -->
          <!-- <el-button size="small" type="primary" v-if="scope.row.status == '0' && isAccess('95') && scope.row.is_unaudited>0" icon="el-icon-document"  @click="showVerifyEvent(scope.row)" title="步骤审核" ></el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block pt20 pb20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageobj.currentPage"
        :page-size="pageobj.pagesize"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageobj.totalPages">
      </el-pagination>
    </div>
    <!-- 分页 -->
    <el-dialog
      title="事件审核"
      :visible.sync="dialogVisible"
      width="400px">
      <span>请填写理由</span>
      <el-input type="textarea" autosize :rows="4" v-model="verifyitem.user_msg"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="verifyEvent(0)">驳回</el-button>
        <el-button type="primary" @click="verifyEvent(2)">通过</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="步骤信息"
      :visible.sync="caseStepInfo.dialogVisible"
      width="1200px">
      <div class="infoct" v-loading="caseStepInfo.loading">
        <tinymce id="tinymce" :height='500' v-model="caseStepInfo.content"></tinymce>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button v-if="caseStepInfo.content" @click="createPdf(caseStepInfo.content)">打印</el-button> -->
        <el-button v-if="caseStepInfo.isAudit" type="primary" @click="showVerifyEvent">审核</el-button>
        <el-button v-else  type="primary" @click="caseStepInfo.dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { mapGetters } from 'vuex'
import { getEventStep } from '@/api/depevent'
import { verifypassword } from '@/api/platform'
import store from '@/store/index'
import { getEventArr, getEventTypeArr, updateEvent, auditEventStep, getSteps, getCaseStepinfo, getStepsArr } from '@/api/depevent'
import { isAccess, getDepCld } from '@/utils/auth'
import { deepClone, TreeUtil, removeTreeArr } from '@/utils/index'

export default {
  components: { Tinymce },
  data() {
    return {
      pageobj: {
        start_index: 0,
        length: 10,
        pagesize: 10,
        totalPages: 0,
        currentPage: 1,
        user_id: '',
        type_id: '',
        name: '',
        department_ids: [],
        department_id: getDepCld(),
        step_status: '',
        start_time: '',
        end_time: ''
      },
      dialogVisible: false,
      start_time: '',
      end_time: '',
      listLoading: false,
      tableKey: 0,
      eventArr: [],
      userArr: [],
      statusArr: [
        { name: '待填写', _id: 0 },
        { name: '待审核', _id: 1 },
        { name: '已完成', _id: 2 }
      ],
      typeArr: [],
      caseStepInfo: {
        dialogVisible: false,
        loading: false,
        content: '',
        isAudit: false
      },
      allStepsArr: [],
      activeitem: null,
      verifyitem: {
        user_msg: '',
        id: ''
      },
      mydepArr: [],
      depArr: [],
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  computed: {
    ...mapGetters({
      commonInfo: 'commonInfo',
      userInfo: 'useinfo'
    })
  },
  created() {
    const array = deepClone(this.commonInfo.depArr)
    this.depArr = array
    const map = { name: 'label', _id: 'value' }
    array.forEach(element => {
      element.parentid = element.parent
    })
    try {
      const tree1 = new TreeUtil(array, '_id', 'parent', map)
      const mydepArr = tree1.toTree()
      removeTreeArr(mydepArr)
      this.mydepArr = mydepArr
    } catch (error) {
      console.log(error)
    }
    this.pageobj.department_ids.push(this.userInfo.department_id)
    this.pageobj.department_id = this.userInfo.department_id
    this.loadArr()
    this.getEventsArr()
  },
  methods: {
    isAccess: isAccess,
    filterArrDep(val) {
      if (val.length) {
        this.pageobj.department_id = val[val.length - 1]
      } else {
        this.pageobj.departmvalent_id = this.userInfo.department_id
      }
      // this.pageobj.department_id = val
    },
    filterArrbuzou(item) {
      if (item.status !== 0) {
        item.dangqname = ''
      } else {
        getEventStep({ event_id: item._id }).then(res => {
          const resl = res.info
          if (resl.step_id) {
            this.allStepsArr.forEach(element => {
              if (element._id === Number(resl.step_id)) {
                item.dangqname = element.name
              }
            })
          }
        })
      }
    },
    handleQuery() {
      this.pageobj.start_index = 0
      this.pageobj.length = 10
      this.pageobj.start_time = this.start_time && Math.round(new Date(this.start_time).getTime() / 1000)
      this.pageobj.end_time = this.end_time && Math.round(new Date(this.end_time).getTime() / 1000)
      this.getEventsArr()
    },
    handleSizeChange(val) {
      this.pageobj.pagesize = val
      this.pageobj.currentPage = 1
      this.pageobj.start_index = (this.pageobj.currentPage - 1) * val
      this.pageobj.length = val
      this.getEventsArr()
    },
    handleCurrentChange(val) {
      this.pageobj.currentPage = val
      this.pageobj.start_index = (this.pageobj.currentPage - 1) * this.pageobj.pagesize
      this.pageobj.length = this.pageobj.pagesize
      this.getEventsArr()
    },
    closeEvent(item) {
      this.$confirm('你确定要将当前事件直接关闭吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateEvent({ _id: item._id, status: 2 }).then(response => {
          item.status = 2
          this.$message({
            message: '关闭成功',
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {
          this.$message({
            message: '关闭失败，请稍后再试',
            type: 'error',
            duration: 4 * 1000
          })
        })
      }).catch(() => {
      })
    },
    showVerifyEvent() {
      this.dialogVisible = true
      this.verifyitem.id = this.activeitem._id
    },
    verifyEvent(type) { // 步骤审核
      if (!this.verifyitem.user_msg) {
        this.$message({
          message: '请填写理由',
          type: 'info',
          duration: 4 * 1000
        })
        return
      }
      this.$prompt('请输入密码验证你的身份', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password',
        inputPattern: /^[a-zA-Z0-9]{6,}$/,
        inputErrorMessage: '输入你的登录密码'
      }).then(({ value }) => {
        const parm = {
          _id: store.getters.useinfo._id,
          pwd: value
        }
        verifypassword(parm).then(response => {
          getEventStep({ event_id: this.verifyitem.id }).then(res => {
            const requst = {
              step_id: res.info.step_id,
              event_id: res.info.event_id,
              user_id: this.userInfo._id,
              role_id: this.userInfo.role_id,
              status: type,
              user_msg: this.verifyitem.user_msg
            }
            auditEventStep(requst).then(res => {
              this.dialogVisible = false
              this.caseStepInfo.dialogVisible = false
              this.getEventsArr()
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 4 * 1000
              })
            })
          }).catch(errs => {
            this.dialogVisible = false
            this.$message({
              message: '操作失败，请稍后再试',
              type: 'error',
              duration: 4 * 1000
            })
          })
        }).catch(() => {
          this.$message({
            message: '密码验证失败，请重新再试',
            type: 'error',
            duration: 4 * 1000
          })
        })
      }).catch(() => {
        console.log('取消修改')
      })
    },
    showStepInfo(item) { //  显示步骤信息
      this.activeitem = item
      this.caseStepInfo.dialogVisible = true
      this.caseStepInfo.loading = true
      getEventStep({ event_id: item._id }).then(res => {
        const resl = res.info
        getSteps({ _id: resl.step_id }).then(data => {
          this.caseStepInfo.loading = false
          let content = data.info.content
          getCaseStepinfo({ event_id: resl.event_id, step_id: resl.step_id }).then(lse => {
            let reg = ''
            lse.info.steps.forEach(element => { // 替换步骤文档中的参数
              if (element.para_type === 6) {
                reg = new RegExp(element.para_name, 'g')
              } else {
                reg = new RegExp('\\{\\{' + element.para_name + '\\}\\}', 'g')
              }
              let val = element.para_value || ''
              if (element.para_type === 3) {
                if (val) {
                  const arr = val.split(',')
                  val = ''
                  arr.forEach(els => {
                    val += `<img style="max-width:200px; margin-right: 10px;" src="${process.env.upload_API}images/other/${els}">`
                  })
                }
              }
              content = content.replace(reg, val)
            })
            if (lse.info.access.length) {
              const arr = lse.info.access
              arr.forEach(element => {
                const reg1 = new RegExp('\\{\\{' + element.role_id + '\\}\\}', 'g')
                const txt = element.user_msg || ''
                content = content.replace(reg1, txt)
              })
            }
            this.caseStepInfo.content = content
            this.caseStepInfo.isAudit = false
            if (lse.info.role_id === this.userInfo.role_id) {
              this.caseStepInfo.isAudit = true
            }
          })
        })
      }).catch(errs => {
        this.caseStepInfo.loading = false
        this.$message({
          message: '查询信息失败',
          type: 'error',
          duration: 4 * 1000
        })
      })
    },
    createPdf(html) { // 打印
      var iframe = document.createElement('IFRAME')
      var doc = null
      iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
      document.body.appendChild(iframe)
      doc = iframe.contentWindow.document
      // 引入打印的专有CSS样式，www.111Cn.net根据实际修改
      doc.write(html)
      doc.close()
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
      if (navigator.userAgent.indexOf('MSIE') > 0) {
        document.body.removeChild(iframe)
      }
      return true
    },
    getEventsArr() {
      this.listLoading = true
      console.log(this.pageobj)
      getEventArr(this.pageobj).then(res => {
        console.log(res.info)
        res.info.list.forEach(element => {
          element.dangqname = ''
        })
        this.eventArr = res.info.list
        this.pageobj.totalPages = res.info.count
        this.listLoading = false
        this.eventArr.forEach(element => {
          this.filterArrbuzou(element)
        })
      }).catch(() => {
        this.listLoading = false
        this.$message({
          message: '查询信息失败，请稍后再试',
          type: 'error',
          duration: 4 * 1000
        })
      })
    },
    loadArr() { // 获取用户集合和事件类型集合
      getEventTypeArr({ dept_id: getDepCld() }).then(res => {
        this.typeArr = res.info.filter(obj => {
          return !obj.status
        })
      })
      getStepsArr({// 获取所有步骤
        start_index: 0,
        length: 10000 }).then(res => {
        this.allStepsArr = res.info.list
      })
    },
    markComplete(item) { // 标记完成
      this.$confirm('你确定要标记事件已完成吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateEvent({ _id: item._id, status: 1 }).then(response => {
          item.status = 1
          this.$message({
            message: '标记成功',
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {
          this.$message({
            message: '标记失败，请稍后再试',
            type: 'error',
            duration: 4 * 1000
          })
        })
      })
    },
    goOtherPage(val) {
      this.$store.dispatch('setCaseId', val)
      this.$router.push({ path: '/reportcase/editcase' })
    },
    computed: {
      ...mapGetters({
        userInfo: 'useinfo'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .infoct{
    min-height:400px;
  }
  .titles{
    margin-bottom: 10px;
    padding: 15px;
    border-radius: 0 2px 2px 0;
    background-color: #f2f2f2;
  }
</style>
