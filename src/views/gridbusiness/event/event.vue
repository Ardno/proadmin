<template>
  <div class="app-container">
    <div class="layui-elem-quote">
      <p class="mb10">
        <el-select clearable class="filter-item" style="width:453px" filterable multiple v-model="pageobj.department_ids" @change="filterArrDep" placeholder="所属部门">
          <el-option v-for="item in  commonInfo.depArr" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
      </p>
      <p class="mb10">
        <el-select clearable class="filter-item mr10" style="width: 130px" filterable v-model="pageobj.type_id" placeholder="事件类型">
          <el-option v-for="item in  typeArr" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
        <el-select clearable class="filter-item mr10" style="width: 130px" filterable v-model="pageobj.step_status" placeholder="事件状态">
          <el-option v-for="item in  statusArr" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
        <el-select clearable class="filter-item mr10" style="width: 130px" filterable v-model="pageobj.user_id" placeholder="用户">
          <el-option v-for="item in  commonInfo.userArr" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
      </p>
      <p>
        <el-date-picker  type="datetime" v-model="start_time" placeholder="选择开始时间"></el-date-picker>
        <span>-</span>
        <el-date-picker  type="datetime" v-model="end_time" placeholder="选择结束时间"></el-date-picker>
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
      <el-table-column width="180" label="发生时间">
        <template slot-scope="scope">
          <span>{{scope.row.happen_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间">
        <template slot-scope="scope">
          <span v-if="scope.row.close_time">{{scope.row.close_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" width="200">
        <template slot-scope="scope">
          <!-- <el-button size="small" type="primary" v-if="scope.row.status == '0' && isAccess('92')" @click="goOtherPage(scope.row._id)" >编辑
          </el-button> -->
          <el-button size="small" type="danger" icon="el-icon-delete" v-if="scope.row.status == '0' && isAccess('93')" @click="closeEvent(scope.row)" title="删除" >
          </el-button>
          <el-button size="small" type="primary" v-if="scope.row.status == '0' && isAccess('95') && scope.row.is_unaudited>0"  icon="el-icon-search"  @click="showStepInfo(scope.row)" title="查看/打印" >
          </el-button>
          <el-button size="small" type="success"  @click="markComplete(scope.row)" v-if="scope.row.status == '0' && isAccess('94') && (scope.row.is_unfilled == 0 && scope.row.is_unaudited ==0)" >标记完成
          </el-button>
          <!-- <el-button size="small" type="primary" v-if="scope.row.status == '0' && isAccess('91') && (scope.row.is_unfilled > 0 && scope.row.is_unaudited ==0)">步骤填写</el-button> -->
          <el-button size="small" type="primary" v-if="scope.row.status == '0' && isAccess('95') && scope.row.is_unaudited>0" icon="el-icon-document"  @click="showVerifyEvent(scope.row)" title="步骤审核" ></el-button>
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
      width="800px">
      <div class="infoct" v-html="caseStepInfo.content" v-loading="caseStepInfo.loading">
      </div>
      <!-- <iframe style="height:400px;width: 100%;" :srcdoc="caseStepInfo.content" frameborder="0"></iframe> -->
      <span slot="footer" class="dialog-footer">
        <el-button v-if="caseStepInfo.content" @click="createPdf(caseStepInfo.content)">打印</el-button>
        <el-button type="primary" @click="caseStepInfo.dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getEventStep } from '@/api/depevent'
import { getEventArr, getEventTypeArr, updateEvent, auditEventStep, getSteps, getCaseStepinfo } from '@/api/depevent'
import { isAccess } from '@/utils/auth'
export default {
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
        department_ids: '',
        department_id: '',
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
        content: ''
      },
      activeitem: null,
      verifyitem: {
        user_msg: '',
        id: ''
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
    this.loadArr()
    this.getEventsArr()
  },
  methods: {
    isAccess: isAccess,
    filterArrDep(val) {
      this.department_id = val.join(',')
    },
    handleQuery() {
      this.pageobj.start_index = 0
      this.pageobj.length = 9
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
    showVerifyEvent(item) {
      this.dialogVisible = true
      this.verifyitem.id = item._id
      this.activeitem = item
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
    },
    showStepInfo(item) { //  显示步骤信息
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
              if (element.para_type === '6') {
                reg = new RegExp(element.para_name, 'g')
              } else {
                reg = new RegExp('\\{\\{' + element.para_name + '\\}\\}', 'g')
              }
              const val = element.para_value || ''
              content = content.replace(reg, val)
            })
            if (data.info.role_id_access !== '0') {
              const arr = data.info.role_id_access.split(',')
              arr.forEach(element => {
                const reg1 = new RegExp('\\{\\{' + element + '\\}\\}', 'g')
                content = content.replace(reg1, '')
              })
            }
            this.caseStepInfo.content = content
          })
        })
      }).catch(errs => {
        console.log(errs)
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
      getEventArr(this.pageobj).then(res => {
        this.eventArr = res.info.list
        this.pageobj.totalPages = res.info.count
        this.listLoading = false
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
      getEventTypeArr('').then(res => {
        this.typeArr = res.info.filter(obj => {
          return !obj.status
        })
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .infoct{
    min-height:400px;
  }
</style>