<template>
  <div class="app-container bgf2">
    <el-row :gutter="20" class="white">
      <el-col :span="6" class="pl15 pr15">
        <div class="panel fix">
          <div class="symbol terques">
            <i class="fa"><svg-icon icon-class="inx-02" /></i>
          </div>
          <div class="value">
            <h1 class="count">{{dataInfo.today}}</h1>
            <p>新增事件</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="panel fix">
          <div class="symbol red">
            <i class="fa "><svg-icon icon-class="inx-04" /></i>
          </div>
          <div class="value">
            <h1 class="count">{{dataInfo.treatment_day}}</h1>
            <p>待处理事件</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="panel fix">
          <div class="symbol yellow">
            <i class="fa "><svg-icon icon-class="addressbook" /></i>
          </div>
          <div class="value">
            <h1 class="count">{{dataInfo.implement_user}}</h1>
            <p>执行用户</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="panel fix">
          <div class="symbol blue">
            <i class="fa "><svg-icon icon-class="inx-03" /></i>
          </div>
          <div class="value">
            <h1 class="count">{{dataInfo.all_user}}</h1>
            <p>在线用户</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class='chart-container pt30'>
          <div class="chat"  id="linechat1" ></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class='chart-container pt30'>
          <div class="chat"  id="linechat2" ></div>
        </div>
      </el-col>
    </el-row>
    <el-row class="mt20" :gutter="20">
      <el-col :span="24">
        <div class='chart-container chat-pie pt30'>
          <div class="chat"  id="linechat3" ></div>
        </div>
      </el-col>
    </el-row>
    <el-row class="mt20" :gutter="20">
      <el-col :span="12">
        <div class='chart-container chat-pie pt30'>
          <div class="chat"  id="pie1" ></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class='chart-container chat-pie pt30'>
          <div class="chat"  id="pie2" ></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import { mapGetters } from 'vuex'
import { fetchList } from '@/api/department'
import { indexInfo } from '@/api/platform'
import { getdepMonthdance } from '@/api/levelshift'
import { getAges } from '@/utils/index'
export default {
  data() {
    return {
      chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      chart5: null,
      dataInfo: {
        all_event: 0,
        all_region: 0,
        all_user: 0,
        implement_user: 0,
        today: 0,
        treatment_day: 0
      }
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
          this.chart4.resize()
          this.chart5.resize()
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
  methods: {
    // 图标1
    initChart() {
      this.chart1 = echarts.init(document.getElementById('linechat1'))
      this.chart1.setOption({
        title: {
          text: '区域人统计分析'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['指派巡逻人数'],
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
          axisLabel: {
            interval: 0,
            rotate: 45,
            show: true,
            splitNumber: 15,
            textStyle: {
              fontFamily: '微软雅黑',
              fontSize: 12
            }
          },
          data: ['测试区域1', '测试区域2', '测试区域3', '测试区域4', '测试区域5', '测试区域6']
        }],
        yAxis: [{
          type: 'value',
          name: '巡逻人数(个)',
          axisLabel: {
            formatter: '{value}'
          }
        }],
        series: [{
          name: '指派巡逻人数',
          type: 'bar',
          barMaxWidth: 35,
          data: [20, 12, 31, 34, 31, 12]
        }]
      })
      // 图表2
      this.chart2 = echarts.init(document.getElementById('linechat2'))
      this.chart2.setOption({
        title: {
          text: '案件数量统计分析'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          }
        },
        legend: {
          left: 'right',
          data: ['已上报', '待审核', '已处理', '驳回待修改']
        },
        xAxis: {
          type: 'category',
          name: '月份',
          splitLine: { show: false },
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        },
        grid: {
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          name: '数量（件）'
        },
        series: [
          {
            name: '已上报',
            type: 'line',
            data: [12, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
          },
          {
            name: '待审核',
            type: 'line',
            data: [2, 11, 23, 14, 35, 16, 27, 28, 49, 10, 11, 12]
          },
          {
            name: '已处理',
            type: 'line',
            data: [22, 11, 31, 41, 15, 26, 17, 18, 29, 10, 21, 12]
          },
          {
            name: '驳回待修改',
            type: 'line',
            data: [32, 31, 23, 14, 25, 36, 17, 28, 19, 10, 11, 12]
          }
        ]
      })
      // 图表3
      this.chart3 = echarts.init(document.getElementById('pie1'))
      this.chart3.setOption({
        title: {
          text: '部门人员数',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['青年', '中年', '老年']
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 0, name: '青年' },
              { value: 0, name: '中年' },
              { value: 0, name: '老年' }
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
      this.getDepUserInfo()
      //  图表4
      this.chart4 = echarts.init(document.getElementById('pie2'))
      this.chart4.setOption({
        title: {
          text: '上月部门考勤分析',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['缺勤', '早退', '迟到', '正常', '调派', '请假']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 0, name: '缺勤' },
              { value: 0, name: '早退' },
              { value: 0, name: '迟到' },
              { value: 0, name: '正常' },
              { value: 0, name: '调派' },
              { value: 0, name: '请假' }
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
      this.getKaoqingArr()
      // 图表5
      this.chart5 = echarts.init(document.getElementById('linechat3'))
      this.chart5.setOption({
        title: {
          text: '案件类型统计分析'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          }
        },
        legend: {
          width: 600,
          type: 'scroll',
          left: 'right',
          data: ['生猪屠宰', '无事生非', '有理有据', '无故抢道']
        },
        xAxis: {
          type: 'category',
          name: '月份',
          splitLine: { show: false },
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        },
        grid: {
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          name: '数量（件）'
        },
        series: [
          {
            name: '生猪屠宰',
            type: 'line',
            data: [12, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
          },
          {
            name: '无事生非',
            type: 'line',
            data: [2, 11, 23, 14, 35, 16, 27, 28, 49, 10, 11, 12]
          },
          {
            name: '有理有据',
            type: 'line',
            data: [22, 11, 31, 41, 15, 26, 17, 18, 29, 10, 21, 12]
          },
          {
            name: '无故抢道',
            type: 'line',
            data: [32, 31, 23, 14, 25, 36, 17, 28, 19, 10, 11, 12]
          }
        ]
      })
    },
    // end
    getDepUserInfo() { // 获取部门人员比例
      fetchList({ start_index: 0, length: 10000, department_id: this.useinfo.department_id }).then(res => {
        const arr = res.info.list
        const a1 = arr.filter(obj => { // 青年集合
          const age = getAges(obj.birthday)
          return age <= 44
        }).length
        const a2 = arr.filter(obj => { // 中年年集合
          const age = getAges(obj.birthday)
          return age < 60 && age > 45
        }).length
        const a3 = arr.filter(obj => { // 老年集合
          const age = getAges(obj.birthday)
          return age >= 60
        }).length
        this.chart3.setOption({
          series: [
            {
              data: [
                { value: a1, name: '青年' },
                { value: a2, name: '中年' },
                { value: a3, name: '老年' }
              ]
            }
          ]
        })
      })
    },
    getKaoqingArr() {
      var nowdays = new Date()
      var year = nowdays.getFullYear()
      var month = nowdays.getMonth()
      if (month === 0) {
        month = 12
        year = year - 1
      }
      if (month < 10) {
        month = '0' + month
      }
      var firstDay = year + '-' + month + '-' + '01' // 上个月的第一天
      var myDate = new Date(year, month, 0)
      var lastDay = year + '-' + month + '-' + myDate.getDate() // 上个月的最后一天
      const request = {
        start_time: new Date(firstDay).getTime() / 1000,
        end_time: new Date(lastDay).getTime() / 1000,
        department_id: this.useinfo.department_id
      }
      getdepMonthdance(request).then(res => {
        // 1:正常；2：迟到 3：早退；4：缺勤 5：调派
        const arrlen1 = res.info.work.filter(obj => {
          return obj.work_state === 1
        }).length
        const arrlen2 = res.info.work.filter(obj => {
          return obj.work_state === 2
        }).length
        const arrlen3 = res.info.work.filter(obj => {
          return obj.work_state === 3
        }).length
        const arrlen4 = res.info.work.filter(obj => {
          return obj.work_state === 4
        }).length
        const arrlen5 = res.info.work.filter(obj => {
          return obj.work_state === 5
        }).length
        const arrlen6 = res.info.leave.length //  '请假'
        this.chart4.setOption({
          series: [
            {
              data: [
                { value: arrlen4, name: '缺勤' },
                { value: arrlen3, name: '早退' },
                { value: arrlen2, name: '迟到' },
                { value: arrlen1, name: '正常' },
                { value: arrlen5, name: '调派' },
                { value: arrlen6, name: '请假' }
              ]
            }
          ]
        })
      })
    },
    indexInfo() {
      indexInfo().then(res => {
        this.dataInfo = res.info[0]
      })
    }
  },
  created() {
    this.indexInfo()
  },
  computed: {
    ...mapGetters({
      useinfo: 'useinfo'
    })
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
    display: inline-block;
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
</style>