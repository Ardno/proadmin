<template>
  <div class="app-container bgf2">
    <el-row :gutter="20" class="white">
      <el-col :span="6" class="pl15 pr15">
        <div class="panel fix">
          <div class="symbol terques">
            <i class="fa fa-user"><svg-icon icon-class="inx-02" /></i>
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
            <i class="fa fa-user"><svg-icon icon-class="inx-04" /></i>
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
            <i class="fa fa-user"><svg-icon icon-class="addressbook" /></i>
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
            <i class="fa fa-user"><svg-icon icon-class="inx-03" /></i>
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
  </div>
</template>

<script>
import echarts from 'echarts'
import { mapGetters } from 'vuex'
import { fetchList } from '@/api/department'
import { indexInfo } from '@/api/platform'
import { getdepMonthdance } from '@/api/levelshift'
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
          text: '案件统计分析'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['新增', '待处理', '已处理'],
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
          data: ['8月', '9月', '10月', '11月', '12月']
        }],
        yAxis: [{
          type: 'value',
          name: '总数(件)',
          axisLabel: {
            formatter: '{value}'
          }
        }],
        series: [{
          name: '新增',
          type: 'bar',
          data: [20, 12, 31, 34, 31]
        }, {
          name: '待处理',
          type: 'bar',
          data: [10, 20, 5, 9, 3]
        }, {
          name: '已处理',
          type: 'bar',
          data: [1, 1, 2, 3, 1]
        }]
      })
      // 图表2
      this.chart2 = echarts.init(document.getElementById('linechat2'))
      this.chart2.setOption({
        title: {
          text: '案件数量统计分析'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}'
        },
        // legend: {
        //   left: 'right',
        //   data: ['2的指数', '3的指数']
        // },
        xAxis: {
          type: 'category',
          name: '月份',
          splitLine: { show: false },
          data: ['8', '9', '10', '11', '12']
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
            name: '案件数',
            type: 'line',
            data: [12, 24, 34, 12, 34]
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
          data: ['男', '女']
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 0, name: '男' },
              { value: 0, name: '女' }
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
      this.chart5 = echarts.init(document.getElementById('pie3'))
      this.chart5.setOption({
        title: {
          text: '当月工作分析',
          x: 'center'
        },
        series: [{
          type: 'pie',
          radius: [30, '55%'],
          center: ['50%', '50%'],
          roseType: 'radius',
          color: ['#f2c955', '#00a69d', '#46d185', '#ec5845'],
          data: [{
            value: 7,
            name: '待处理'
          }, {
            value: 4,
            name: '进行中'
          }, {
            value: 35,
            name: '已完成'
          }, {
            value: 53,
            name: '其他'
          }],
          label: {
            normal: {
              textStyle: {
                fontSize: 14
              },
              formatter: function(param) {
                return param.name + ':\n' + Math.round(param.percent) + '%'
              }
            }
          },
          labelLine: {
            normal: {
              smooth: true,
              lineStyle: {
                width: 2
              }
            }
          },
          itemStyle: {
            normal: {
              shadowBlur: 30,
              shadowColor: 'rgba(0, 0, 0, 0.4)'
            }
          },
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function(idx) {
            return Math.random() * 200
          }
        }]
      })
    },
    // end
    getDepUserInfo() { // 获取部门人员比例
      fetchList({ start_index: 0, length: 10000, department_id: this.useinfo.department_id }).then(res => {
        const arr = res.info.list
        const nan_arr = arr.filter(obj => { // 性别男集合
          return !obj.sex
        })
        const nv_arr = arr.filter(obj => { // 性别女集合
          return obj.sex
        })
        this.chart3.setOption({
          series: [
            {
              data: [
                { value: nan_arr.length, name: '男' },
                { value: nv_arr.length, name: '女' }
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