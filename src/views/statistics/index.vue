<template>
  <div class='app-container'>
    <div class="layui-elem-quote">
      <el-select v-model="pageobj.user_id" filterable placeholder="请选择用户">
        <el-option v-for="item in userArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">查看</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="UserName" label="用户名称"width="150">
      </el-table-column>
      <el-table-column prop="name" label="里程" width="120"></el-table-column>
      <el-table-column prop="name" label="填报事件数量" width="120"></el-table-column>
      <el-table-column prop="name" label="审核事件数量" width="120"></el-table-column>
      <el-table-column prop="name" label="发送消息数量" width="120"></el-table-column>
      <el-table-column prop="name" label="发送图片消息数量" width="120"></el-table-column>
      <el-table-column prop="name" label="发送文字消息数量" width="120"></el-table-column>
      <el-table-column prop="name" label="发送视频消息数量" width="120"></el-table-column>
      <el-table-column prop="name" label="发送音频消息数量" width="120"></el-table-column>
      <el-table-column prop="name" label="迟到次数" width="120"></el-table-column>
      <el-table-column prop="name" label="早退次数" width="120"></el-table-column>
      <el-table-column prop="name" label="换班次数" width="120"></el-table-column>
      <el-table-column prop="name" label="正常上岗次数" width="120"></el-table-column>
      <el-table-column prop="name" label="在网格区域总时间" width="120"></el-table-column>
      <el-table-column prop="name" label="在网格区域总里程" width="120"></el-table-column>
      <el-table-column prop="name" label="总里程" width="120"></el-table-column>
      <el-table-column prop="name" label="巡逻的网格区域数量" width="120"></el-table-column>
      <el-table-column prop="name" label="所属部门" width="120"></el-table-column>
      <el-table-column prop="name" label="上级领导" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作"width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
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
export default {
  data() {
    return {
      chart1: null,
      userArr: [],
      pageobj: {
        user_id: '',
        min_time: Math.round(new Date().getTime() / 1000),
        max_time: Math.round(new Date().getTime() / 1000)
      },
      tableData: [{
        user_id: 2,
        eventUp: 0,
        eventNew: 0,
        eventSave: 0,
        eventVerify: 0,
        imText: 0,
        imImg: 0,
        imVideo: 0,
        imAudio: 0,
        workLate: 0,
        workLeave: 0,
        wrokAbsence: 0,
        workShift: 0,
        workSuccess: 0,
        regionTime: 0,
        regionMileage: 0,
        regionNum: 0,
        department_id: 1,
        create_time: 0,
        sex: 0,
        birthday: 0,
        UserName: '',
        DeptName: ''
      }]
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
    },
    handleQuery() {
      console.log(this.pageobj)
      getUserStatist(this.pageobj).then(response => {
        this.tableData = response.info.list
      }).catch(errs => {
        console.log('errs')
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