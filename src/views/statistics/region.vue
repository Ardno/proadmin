<template>
  <div class='app-container'>
    <div class="layui-elem-quote">
      <el-select v-model="pageobj.region_id" clearable filterable placeholder="请选择区域">
        <el-option v-for="item in regionArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-button  class="filter-item" type="primary" icon="search" @click="handleQuery">查看</el-button>
      <el-button class="filter-item r" type="primary" icon="search" @click="handleChanle">{{typeDate?'查看网格本周统计':'查看网格今日统计'}}</el-button>
    </div>
    <p class="mt10 mb10 g9 f20">{{typeDate?'今日统计数据':'本周统计数据'}}</p>
    <el-table v-loading="listLoading" :data="tableData" border style="width: 100%">
      <el-table-column prop="regionname" label="网格名称">
      </el-table-column>
      <el-table-column prop="area" label="面积(km²)" ></el-table-column>
      <el-table-column prop="user_num" label="值班人数" ></el-table-column>
      <el-table-column label="事件数量" >
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
      listLoading: false,
      dialogVisible: false,
      pageobj: {
        region_id: '',
        min_time: '',
        max_time: ''
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
      // this.dialogVisible = true
      setTimeout(() => {
        this.userChart1(row)
      }, 500)
    },
    userChart1(row) {
      // 网格事件统计
      this.chart1 = echarts.init(document.getElementById('pie1'))
      this.chart1.setOption({
        title: {
          text: '网格事件数量统计',
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
          data: (() => {
            const arr = []
            row.forEach(element => {
              arr.push(element.regionname)
            })
            return arr
          })()
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: (() => {
              const arr = []
              row.forEach(element => {
                const obj = {}
                obj.value = element.eventNum
                obj.name = element.regionname
                arr.push(obj)
              })
              return arr
            })(),
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
      // 网格值班人员统计
      this.chart2 = echarts.init(document.getElementById('pie2'))
      this.chart2.setOption({
        title: {
          text: '网格值班人员统计',
          x: 'center'
        },
        label: {
          normal: {
            textStyle: {
              fontSize: 14
            },
            formatter: function(param) {
              return param.name + ':\n' + Math.round(param.value) + '人'
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
          data: (() => {
            const arr = []
            row.forEach(element => {
              arr.push(element.regionname)
            })
            console.log(arr)
            return arr
          })()
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: (() => {
              const arr = []
              row.forEach(element => {
                const obj = {}
                obj.value = element.user_num
                obj.name = element.regionname
                arr.push(obj)
              })
              return arr
            })(),
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
      // 网格面积统计
      this.chart3 = echarts.init(document.getElementById('pie3'))
      this.chart3.setOption({
        title: {
          text: '网格面积统计',
          x: 'center'
        },
        label: {
          normal: {
            textStyle: {
              fontSize: 14
            },
            formatter: function(param) {
              return param.name + ':\n' + Math.round(param.value) + 'km²'
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
          data: (() => {
            const arr = []
            row.forEach(element => {
              arr.push(element.regionname)
            })
            console.log(arr)
            return arr
          })()
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: (() => {
              const arr = []
              row.forEach(element => {
                const obj = {}
                obj.value = element.area
                obj.name = element.regionname
                arr.push(obj)
              })
              return arr
            })(),
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
      // 工作情况分析
      this.chart4 = echarts.init(document.getElementById('pie4'))
      this.chart4.setOption({
        title: {
          text: '工作情况分析'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['每平方公里每日值班人员', '每平方公里每日事件', '人均每日事件数量'],
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
          data: (() => {
            const arr = []
            row.forEach(element => {
              arr.push(element.regionname)
            })
            console.log(arr)
            return arr
          })()
        }],
        yAxis: [{
          type: 'value',
          name: '刻度',
          axisLabel: {
            formatter: '{value}'
          }
        }],
        series: (() => {
          const obj1 = {
            name: '每平方公里每日值班人员',
            type: 'bar',
            barMaxWidth: 35,
            data: []
          }
          const obj2 = {
            name: '每平方公里每日事件',
            type: 'bar',
            barMaxWidth: 35,
            data: []
          }
          const obj3 = {
            name: '人均每日事件数量',
            type: 'bar',
            barMaxWidth: 35,
            data: []
          }
          row.forEach(element => {
            obj1.data.push(element.areapera)
            obj2.data.push(element.areaperb)
            obj3.data.push(element.areaperc)
          })
          return [obj1, obj2, obj3]
        })()
      })
    },
    handleQuery() {
      console.log(this.pageobj)
      if (!this.typeDate) {
        const obj = getWeekDate()
        this.pageobj.min_time = Math.round(new Date(obj.monday).getTime() / 1000)
        this.pageobj.max_time = Math.round(new Date(obj.sunday).getTime() / 1000)
        // this.pageobj.min_time = ''
        // this.pageobj.max_time = ''
      } else {
        this.pageobj.min_time = getDayDate()
        this.pageobj.max_time = getDaytimes()
      }
      this.listLoading = true
      this.tableData = []
      getRegionStatist(this.pageobj).then(response => {
        this.listLoading = false
        const data = response.info.list
        this.randomData(data)
      }).catch(errs => {
        this.listLoading = false
        console.log(errs)
      })
    },
    handleChanle() {
      this.typeDate = !this.typeDate
      this.handleQuery()
    },
    randomData(data) {
      const arrsobj = {}
      data.forEach(element => { // 将查询到的数据，同一区域不同时间的合并为一条
        const val = arrsobj[element.region_id]
        if (!val) {
          arrsobj[element.region_id] = element
        } else {
          arrsobj[element.region_id].user_num += element.user_num
          element.typenum_list.forEach(cls => {
            let flg = false
            arrsobj[element.region_id].typenum_list.forEach(els => {
              if (els.event_type === cls.event_type) {
                flg = true
                els.num += cls.num
              }
            })
            if (!flg) {
              arrsobj[element.region_id].typenum_list.push(cls)
            }
          })
        }
      })
      const arr = []
      for (const key in arrsobj) {
        arr.push(arrsobj[key])
      }
      data = arr
      this.regionArr.forEach(element => {
        data.forEach(els => {
          if (els.region_id === element._id) {
            els.area = 0
            els.eventNum = 0
            els.areapera = 0 // 每平方公里每日值班人员
            els.areaperb = 0 // 每平方公里每日事件
            els.areaperc = 0 // 本网格人均每日事件数量
            if (element.latlon_list.length) {
              try {
                // const losdArr = [[109.15660708714857, 18.401102839749022], [109.16225435747671, 18.40750769163901], [109.16263464504094, 18.40714686124571], [109.16670372197774, 18.41481434437171], [109.17491080297232, 18.414290034714423], [109.17476344154134, 18.410678456196393], [109.1650661086546, 18.40455562576992], [109.1619643882092, 18.40140955639704], [109.16021268861661, 18.402581163858503], [109.15660708714857, 18.401102839749022]]
                // els.area = AMap.GeometryUtil.ringArea(losdArr) / 1000000
                els.area = AMap.GeometryUtil.ringArea(element.latlon_list) / 1000000
                els.areapera = els.area / els.user_num // 每平方公里每日值班人员
              } catch (error) {
                console.log(error)
              }
            }
            els.typenum_list.forEach(cls => {
              els.eventNum += cls.num
              this.typeArr.forEach(dls => {
                if (cls.event_type === dls._id) {
                  cls.name = dls.name
                }
              })
            })
            console.log(els.eventNum)
            if (els.area) {
              els.areaperb = els.eventNum / els.area // 每平方公里每日事件
            }
            console.log(els.areaperb)
            els.areaperc = els.eventNum / els.user_num // 本网格人均每日事件数量
            console.log(els.areaperc)
          }
        })
      })
      console.log(data)
      this.tableData = data
      this.handleClick(data)
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