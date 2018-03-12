<template>
  <div class='app-container'>
    <div class="layui-elem-quote">
      <el-select v-model="pageobj.region_id" filterable placeholder="请选择区域">
        <el-option v-for="item in regionArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">查看</el-button>
      <!-- <el-button class="filter-item r" type="primary" icon="search" @click="handleChanle">{{typeDate?'查看用户本周统计':'查看用户今日统计'}}</el-button> -->
    </div>
    <p class="mt10 mb10 g9 f14">{{typeDate?'今日统计数据':'本周统计数据'}}</p>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="regionname" label="网格名称">
      </el-table-column>
      <el-table-column prop="area" label="面积(km²)" ></el-table-column>
      <el-table-column label="本日事件数量" >
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p v-for="(item,index) in scope.row.typenum_list" :key="index">{{item.name}}事件数量: {{item.num}}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.eventNum }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="areapera" label="每平方公里每日值班人员" ></el-table-column>
      <el-table-column prop="areaperb" label="每平方公里每日事件" ></el-table-column>
      <el-table-column prop="areaperc" label="本网格人均每日事件数量" ></el-table-column>
    </el-table>
    <el-dialog title="统计显示" width="1000px" :visible.sync="dialogVisible" >
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
    </el-dialog>
  </div>
    
</template>

<script>
import echarts from 'echarts'
import { getRegionArr } from '@/api/grid'
import { getEventTypeArr } from '@/api/depevent'
import { getRegionStatist } from '@/api/statistics'
import { getWeekDate, getDayDate, getDaytimes } from '@/utils/utils'
export default {
  data() {
    return {
      chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      regionArr: [],
      typeArr: [],
      depArr: [],
      typeDate: true,
      dialogVisible: false,
      pageobj: {
        region_id: '',
        min_time: getDayDate(),
        max_time: getDaytimes()
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
    getRegionArr({ start_index: 0, length: 10000, status: 0 }).then(response => { // 获取网格区域
      const arr = response.info.list.filter(function(element) {
        return element.status === 0
      }, this)
      this.regionArr = arr
      this.handleQuery()
    })
    getEventTypeArr({ dept_id: '' }).then(res => { // 获取网格区域
      this.typeArr = res.info.filter(obj => {
        return !obj.status
      })
    })
    this.depArr = this.$store.getters.commonInfo.depArr
  },
  methods: {
    initChart() {
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
      this.dialogVisible = true
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
      console.log(this.pageobj)
      if (!this.typeDate) {
        const obj = getWeekDate()
        this.pageobj.min_time = Math.round(new Date(obj.monday).getTime() / 1000)
        this.pageobj.max_time = Math.round(new Date(obj.sunday).getTime() / 1000)
      } else {
        this.pageobj.min_time = getDayDate()
        this.pageobj.max_time = getDaytimes()
      }
      this.tableData = []
      getRegionStatist(this.pageobj).then(response => {
        this.listLoading = false
        const data = response.info.list
        this.randomData(data)
      }).catch(errs => {
        console.log(errs)
      })
    },
    handleChanle() {
      this.typeDate = !this.typeDate
      this.handleQuery()
    },
    randomData(data) {
      this.regionArr.forEach(element => {
        data.forEach(els => {
          if (els.region_id === element._id) {
            els.area = 0
            els.eventNum = 0
            els.areapera = 0 // 每平方公里每日值班人员
            els.areaperb = 0 // 每平方公里每日事件
            els.areaperc = 0 // 本网格人均每日事件数量
            // if (element.latlon_list.length) {
            try {
              const losdArr = [[109.15660708714857, 18.401102839749022], [109.16225435747671, 18.40750769163901], [109.16263464504094, 18.40714686124571], [109.16670372197774, 18.41481434437171], [109.17491080297232, 18.414290034714423], [109.17476344154134, 18.410678456196393], [109.1650661086546, 18.40455562576992], [109.1619643882092, 18.40140955639704], [109.16021268861661, 18.402581163858503], [109.15660708714857, 18.401102839749022]]
              els.area = AMap.GeometryUtil.ringArea(losdArr) / 1000000
              // els.area = AMap.GeometryUtil.ringArea(element.latlon_list)
              els.areapera = els.user_num / els.area // 每平方公里每日值班人员
              console.log(els.area)
            } catch (error) {
              console.log(error)
            }
            // }
            els.typenum_list.forEach(cls => {
              els.eventNum += cls.num
              this.typeArr.forEach(dls => {
                if (cls.event_type === dls._id) {
                  cls.name = dls.name
                }
              })
            })
            if (els.area) {
              els.areaperb = els.eventNum / els.area // 每平方公里每日事件
            }
            els.areaperc = els.eventNum / els.user_num // 本网格人均每日事件数量
          }
        })
      })
      this.tableData = data
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
</style>