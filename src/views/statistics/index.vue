<template>
  <div class='app-container bgf2'>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class='chart-container chat-pie pt30'>
          <div class="chat"  id="pie1" ></div>
        </div>
      </el-col>
      <el-col :span="12">
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      chart1: null,
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
  },
  methods: {
    initChart() {
      this.userChart1()
    },
    userChart1() {
      this.chart1 = echarts.init(document.getElementById('pie1'))
      this.chart1.setOption({
        title: {
          text: '今日工作统计',
          x: 'center'
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
              { value: 12, name: '上报事件' },
              { value: 13, name: '审核案件' },
              { value: 4, name: '提交案件' }
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