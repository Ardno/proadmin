<template>
  <div class='app-container'>
    <div class="layui-elem-quote">
      <el-select v-model="pageobj.user_id" filterable placeholder="请选择用户">
        <el-option v-for="item in userArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">查看</el-button>
      <el-button class="filter-item r" type="primary" icon="search" @click="handleChanle">{{typeDate?'查看用户本周统计':'查看用户今日统计'}}</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
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
      <el-table-column prop="regionTime" label="在网格区域总时间" ></el-table-column>
      <el-table-column prop="regionMileage" label="在网格区域总里程" ></el-table-column>
      <el-table-column prop="regionNum" label="巡逻的网格区域数量" ></el-table-column>
      <el-table-column label="所属部门" >
        <template slot-scope="scope">
          {{filterDepRose(scope.row.department_id)}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看统计</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
    <!-- <div class='chart-container chat-pie pt30'>
    <div class="chat"  id="pie1" ></div>
  </div> -->
</template>

<script>
import echarts from 'echarts'
import { getUserStatist } from '@/api/statistics'
import { getWeekDate } from '@/utils/utils'
export default {
  data() {
    return {
      chart1: null,
      userArr: [],
      depArr: [],
      typeDate: true,
      pageobj: {
        user_id: '',
        min_time: Math.round(new Date().getTime() / 1000),
        max_time: Math.round(new Date().getTime() / 1000)
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
  created() {
    this.pageobj.user_id = this.$store.getters.useinfo._id
    this.userArr = this.$store.getters.commonInfo.userArr
    this.depArr = this.$store.getters.commonInfo.depArr
  },
  methods: {
    initChart() {
      // this.userChart1()
      this.handleQuery()
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
    },
    handleQuery() {
      console.log(this.pageobj)
      if (!this.typeDate) {
        const obj = getWeekDate()
        // this.pageobj.min_time = Math.round(new Date(obj.monday).getTime() / 1000)
        this.pageobj.min_time = Math.round(new Date('2018-02-28').getTime() / 1000)
        this.pageobj.max_time = Math.round(new Date(obj.sunday).getTime() / 1000)
        console.log(obj)
      } else {
        this.pageobj.min_time = Math.round(new Date().getTime() / 1000)
        this.pageobj.max_time = Math.round(new Date().getTime() / 1000)
      }
      getUserStatist(this.pageobj).then(response => {
        this.tableData = [response.info.list]
      }).catch(errs => {
        console.log('errs')
      })
    },
    handleChanle() {
      this.typeDate = !this.typeDate
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