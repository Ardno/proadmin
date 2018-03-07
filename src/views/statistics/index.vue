<template>
  <div class='app-container'>
    <div class="layui-elem-quote">
      <el-select v-if="typeDate" v-model="pageobj.user_id" filterable placeholder="请选择用户">
        <el-option v-for="item in userArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-cascader v-else placeholder="试试搜索：部门" :options="mydepArr" v-model="pageobj.department" @change="changeDep" filterable change-on-select></el-cascader>
      <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">查看</el-button>
      <el-button class="filter-item r" type="primary" icon="search" @click="handleChanle">{{typeDate?'查看部门本周统计':'查看用户今日统计'}}</el-button>
    </div>
    <p class="mt20 mb20 g6 f20">{{typeDate?'用户今日统计数据':'部门本周统计数据'}}</p>
    <el-table :key='tableKey' :data="tableData" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column fixed prop="UserName" label="用户名称">
      </el-table-column>
      <el-table-column prop="eventNew" label="填报事件数量" ></el-table-column>
      <el-table-column prop="eventVerify" label="审核事件数量" ></el-table-column>
      <el-table-column prop="eventUp" label="提交事件数量" ></el-table-column>
      <el-table-column prop="name" label="发送消息数量" ></el-table-column>
      <el-table-column prop="imImg" label="发送图片消息数量" ></el-table-column>
      <el-table-column prop="imText" label="发送文字消息数量" ></el-table-column>
      <el-table-column prop="imVideo" label="发送视频消息数量" ></el-table-column>
      <el-table-column prop="imAudio" label="发送音频消息数量" ></el-table-column>
      <el-table-column prop="workLate" label="迟到次数" ></el-table-column>
      <el-table-column prop="workLeave" label="早退次数" ></el-table-column>
      <el-table-column prop="wrokAbsence" label="换班次数" ></el-table-column>
      <el-table-column prop="workSuccess" label="正常上岗次数" ></el-table-column>
      <el-table-column  label="在网格区域总时间" >
        <template slot-scope="scope">
          {{scope.row.regionTime}}分钟
        </template>
      </el-table-column>
      <el-table-column label="在网格区域总里程" >
        <template slot-scope="scope">
          {{scope.row.regionMileage}} km
        </template>
      </el-table-column>
      <el-table-column prop="regionNum" label="巡逻的网格区域数量" ></el-table-column>
      <el-table-column label="所属部门" >
        <template slot-scope="scope">
          {{scope.row.DeptName}}
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看统计</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- <el-dialog title="统计显示" width="1000px" :visible.sync="dialogVisible" >
      <el-row>
        <el-col :span="8">
          <div class='chart-container chat-pie pt30'>
            <div class="chat"  id="pie1" ></div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class='chart-container chat-pie pt30'>
            <div class="chat"  id="pie2" ></div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class='chart-container chat-pie pt30'>
            <div class="chat"  id="pie3" ></div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class='chart-container chat-pie pt30'>
            <div class="chat"  id="pie4" ></div>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
    <div class="can-ct" v-loading="listLoading">
      <div v-if="tableData.length">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class='chart-container chat-pie pt30'>
              <div class="chat"  id="pie1" ></div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class='chart-container chat-pie pt30'>
              <div class="chat"  id="pie2" ></div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class='chart-container chat-pie pt30'>
              <div class="chat"  id="pie3" ></div>
            </div>
          </el-col>
        </el-row>
        <el-row class="mt20" :gutter="20">
          <el-col :span="12">
            <div class='chart-container chat-pie pt30'>
              <div class="chat"  id="pie4" ></div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
    
</template>

<script>
import echarts from 'echarts'
import { getUserStatist } from '@/api/statistics'
import { deepClone, TreeUtil, removeTreeArr } from '@/utils/index'
import { getWeekDate, getDayDate, getDaytimes } from '@/utils/utils'
export default {
  data() {
    return {
      chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      userArr: [],
      depArr: [],
      mydepArr: [],
      typeDate: true,
      tableKey: 0,
      listLoading: false,
      dialogVisible: false,
      pageobj: {
        user_id: '',
        min_time: getDayDate(),
        max_time: getDaytimes(),
        department_id: '',
        department: []
      },
      tableData: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
      window.onresize = () => {
        if (this.chart1) {
          this.chart1.resize()
          this.chart2.resize()
          this.chart3.resize()
        }
      }
    })
  },
  beforeDestroy() {
    if (!this.chart1) {
      return
    }
    // 测试啊
    this.chart1.dispose()
    this.chart1 = null
    this.chart2.dispose()
    this.chart2 = null
    this.chart3.dispose()
    this.chart3 = null
  },
  created() {
    this.pageobj.user_id = this.$store.getters.useinfo._id
    this.userArr = this.$store.getters.commonInfo.userArr
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
    } catch (error) {
      console.log(error)
    }
    this.handleQuery()
  },
  methods: {
    initChart() {
    },
    changeDep(val) { // 部门联动选择数组结果 取最后一个值
      this.pageobj.department_id = val[val.length - 1]
    },
    filterDepRose(department_id) { // 转换部门和集合
      let name = ''
      this.depArr.forEach(function(els) {
        if (Number(department_id) === els._id) {
          name = els.name
        }
      }, this)
      return name
    },
    handleClick(row) { // 查看统计
      // this.dialogVisible = true
      setTimeout(() => {
        this.userChart1(row)
      }, 500)
    },
    userChart1(row) {
      // 工作统计
      this.chart1 = echarts.init(document.getElementById('pie1'))
      this.chart1.setOption({
        title: {
          text: '工作统计',
          x: 'center'
        },
        label: {
          normal: {
            textStyle: {
              fontSize: 14
            },
            formatter: function(param) {
              return param.name + ':\n' + Math.round(param.value) + '件'
            }
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['上报事件', '审核案件', '提交案件']
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: row.eventNew, name: '上报事件' },
              { value: row.eventVerify, name: '审核案件' },
              { value: row.eventUp, name: '提交案件' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      // 考勤统计
      this.chart2 = echarts.init(document.getElementById('pie2'))
      this.chart2.setOption({
        title: {
          text: '考勤统计',
          x: 'center'
        },
        label: {
          normal: {
            textStyle: {
              fontSize: 14
            },
            formatter: function(param) {
              return param.name + ':\n' + Math.round(param.value) + '次'
            }
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['迟到', '早退', '换班', '正常上岗']
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: row.workLate, name: '迟到' },
              { value: row.workLeave, name: '早退' },
              { value: row.wrokAbsence, name: '换班' },
              { value: row.workSuccess, name: '正常上岗' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      // 工作消息统计
      this.chart3 = echarts.init(document.getElementById('pie3'))
      this.chart3.setOption({
        title: {
          text: '工作消息统计',
          x: 'center'
        },
        label: {
          normal: {
            textStyle: {
              fontSize: 14
            },
            formatter: function(param) {
              return param.name + ':\n' + Math.round(param.value) + '条'
            }
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['图片消息', '文字消息', '视频消息', '音频消息']
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: row.imImg, name: '图片消息' },
              { value: row.imText, name: '文字消息' },
              { value: row.imVideo, name: '视频消息' },
              { value: row.imAudio, name: '音频消息' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      // 巡视工作量统计
      let strtip = '今日'
      if (!this.typeDate) {
        strtip = '本周'
      }
      this.chart4 = echarts.init(document.getElementById('pie4'))
      this.chart4.setOption({
        title: {
          text: '巡视工作量统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['网格区域总时间', '网格区域总里程', '网格区域数量'],
          align: 'right',
          right: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: [strtip]
        }],
        yAxis: [{
          type: 'value',
          name: '刻度',
          axisLabel: {
            formatter: '{value}'
          }
        }],
        series: [{
          name: '网格区域总时间',
          type: 'bar',
          data: [row.regionTime]
        }, {
          name: '网格区域总里程',
          type: 'bar',
          data: [row.regionMileage]
        }, {
          name: '网格区域数量',
          type: 'bar',
          data: [row.regionNum]
        }]
      })
    },
    handleQuery() {
      if (!this.typeDate) {
        const obj = getWeekDate()
        this.pageobj.min_time = Math.round(new Date(obj.monday).getTime() / 1000)
        // this.pageobj.min_time = Math.round(new Date('2018-02-28').getTime() / 1000)
        this.pageobj.max_time = Math.round(new Date(obj.sunday).getTime() / 1000)
      } else {
        this.pageobj.min_time = getDayDate()
        this.pageobj.max_time = getDaytimes()
      }
      this.tableData = []
      this.listLoading = true
      getUserStatist(this.pageobj).then(response => {
        this.listLoading = false
        const data = response.info.list
        const obj = {}
        const arrsobj = {}
        data.forEach(element => {
          element.regionTime = Number(parseFloat(element.regionTime / 60).toFixed(2))
          element.regionMileage = Number(parseFloat(element.regionMileage / 100).toFixed(2))
          if (!arrsobj[element.user_id]) { // 统计该用户本周的数据
            arrsobj[element.user_id] = element
          }
          for (const key in element) {
            if (obj[key]) { // 统计所有数据
              if (!isNaN(element[key]) && key !== 'user_id' && key !== 'department_id') {
                obj[key] += element[key]
                console.log(element.user_id)
                arrsobj[element.user_id][key] += element[key]
              }
            } else {
              obj[key] = element[key]
            }
          }
        })
        console.log(arrsobj)
        if (data.length) {
          const arr = []
          for (const key in arrsobj) {
            arr.push(arrsobj[key])
          }
          this.tableData = arr
          this.handleClick(obj)
        } else {
          this.tableData = []
        }
      }).catch(errs => {
        this.listLoading = false
        console.log(errs)
      })
    },
    handleChanle() {
      this.typeDate = !this.typeDate
      if (this.typeDate) {
        this.pageobj.user_id = this.$store.getters.useinfo._id
        this.pageobj.department_id = ''
      } else {
        this.pageobj.user_id = ''
        this.pageobj.department_id = this.$store.getters.useinfo.department_id
      }
      this.handleQuery()
    }
  }
}
</script>
<style lang="scss" scoped>
  .chart-container{
    position: relative;
    width: 100%;
    height: 500px;
    &.chat-pie{
      height: 350px;
    }
    background-color: #fff;
  }
  .chat{
    width: 100%;
    height: 100%;
  }
  .panel{
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 4px 4px 40px rgba(0,0,0,.05);
  }
  .terques{
    background-color: #6ccac9;
  }
  .red{
    background-color: #ff6c60;
  }
  .yellow{
    background-color: #f8d347;
  }
  .blue{
    background-color: #57c8f2;
  }
  .symbol{
    width: 40%;
    padding: 25px 15px;
    border-radius: 4px 0px 0px 4px;
    display: inline-block;
    text-align: center;
  }
  .symbol i{
    color: #fff;
    font-size: 50px;
  }
  .value{
    float: right;
    width: 58%;
    padding-top: 21px;
    text-align: center;
    h1{
      font-size: 36px;
      font-weight: 300;
      margin: 0;
      padding: 0;
      color: #c6cad6;
    }
    p{
      margin: 0;
      padding: 0;
      color: #c6cad6;
    }
  }
  .can-ct{
    background-color: #f2f2f2;
    padding: 10px;
    margin-top: 10px;
  }
</style>