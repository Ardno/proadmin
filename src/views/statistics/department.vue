<template>
  <div class='app-container'>
    <p class="mt20 mb20 g6 f20">部门统计数据</p>
    <el-table :key='tableKey' :data="tableData" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">
      <el-table-column fixed prop="department_name" label="部门名称"></el-table-column>
      <el-table-column prop="department_user" label="人员总数" ></el-table-column>
      <el-table-column prop="department_user_man" label="男性" ></el-table-column>
      <el-table-column prop="department_user_girl" label="女性" ></el-table-column>
      <el-table-column prop="department_user_youth" label="青年（18-35）" ></el-table-column>
      <el-table-column prop="department_user_middle" label="中年（36-50）" ></el-table-column>
      <el-table-column prop="department_user_old" label="中老年（51-60）" ></el-table-column>
      <el-table-column prop="department_user_work" label="正常上岗" ></el-table-column>
      <el-table-column prop="department_vacation" label="请假" ></el-table-column>
      <el-table-column prop="department_job" label="职务数量" ></el-table-column>
      <el-table-column prop="department_job_1" label="1级职务数量" ></el-table-column>
      <el-table-column prop="department_job_2" label="2级职务数量" ></el-table-column>
      <el-table-column prop="department_job_3" label="3级职务数量" ></el-table-column>
      <el-table-column prop="department_job_4" label="4级职务数量" ></el-table-column>
      <el-table-column prop="department_job_5" label="5级职务数量" ></el-table-column>
      <el-table-column prop="department_job_6" label="6级职务数量" ></el-table-column>
      <el-table-column prop="department_job_7" label="7级职务数量" ></el-table-column>
      <el-table-column prop="department_job_8" label="8级职务数量" ></el-table-column>
      <el-table-column prop="department_job_9" label="9级职务数量" ></el-table-column>
      <el-table-column prop="department_job_10" label="10级职务数量" ></el-table-column>
      <el-table-column prop="regin_num" label="负责网格数量" ></el-table-column>
      <el-table-column prop="area" label="负责网格面积" ></el-table-column>
      <el-table-column prop="ren_regin" label="人均负责网格数量" ></el-table-column>
      <el-table-column prop="ren_area" label="人均负责网格面积" ></el-table-column>
    </el-table>
    <div class="can-ct" v-loading="listLoading">
      <div v-if="tableData.length">
        <el-row :gutter="20">
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
        <el-row class="mt20" :gutter="20">
          <el-col :span="24">
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
          <el-col :span="12">
            <div class='chart-container chat-pie pt30'>
              <div class="chat"  id="pie5" ></div>
            </div>
          </el-col>
        </el-row>
        <el-row class="mt20" :gutter="20">
          <el-col :span="12">
            <div class='chart-container chat-pie pt30'>
              <div class="chat"  id="pie6" ></div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class='chart-container chat-pie pt30'>
              <div class="chat"  id="pie7" ></div>
            </div>
          </el-col>
        </el-row>
        <el-row class="mt20" :gutter="20">
          <el-col :span="12">
            <div class='chart-container chat-pie pt30'>
              <div class="chat"  id="pie8" ></div>
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
import { getDepartmentStatist } from '@/api/statistics'
export default {
  data() {
    return {
      chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
      chart5: null,
      chart6: null,
      chart7: null,
      chart8: null,
      listLoading: false,
      tableKey: 0,
      tableData: [],
      regionArr: []
    }
  },
  created() {},
  mounted() {
    getRegionArr({ start_index: 0, length: 10000, status: 0 }).then(response => { // 获取网格区域
      const arr = response.info.list.filter(function(element) {
        return element.status === 0
      }, this)
      this.regionArr = arr
      this.regionArr.forEach(element => {
        element.area = AMap.GeometryUtil.ringArea(element.latlon_list) / 1000000
      })
      getDepartmentStatist({}).then(res => {
        this.tableData = res.info.list
        this.tableData.forEach(item => {
          if (item.department_region) {
            item.regin_num = item.department_region.split(',').length
            item.area = parseFloat(this.area_mj(item.department_region.split(','))).toFixed(4)
            item.ren_regin = parseFloat(item.department_user / item.regin_num).toFixed(4)
            item.ren_area = parseFloat(item.department_user / item.area).toFixed(4)
          } else {
            item.regin_num = 0
            item.area = 0
            item.ren_regin = 0
            item.ren_area = 0
          }
        })
        this.$nextTick(() => {
          this.chart_gj()
        })
      }).catch(errs => {})
    })
  },
  methods: {
    area_mj(region_list) {
      var mianji = 0
      region_list.forEach(_id => {
        this.regionArr.forEach(element => {
          if (element._id === parseInt(_id)) {
            mianji += element.area
          }
        })
      })
      return mianji
    },
    chart_gj() {
      var deptname_list = []
      var deptuser_list = []
      var deptuser_man_list = []
      var deptuser_girl_list = []
      var department_user_work_list = []
      var department_vacation_list = []
      var department_job_list = []
      var department_job_1_list = []
      var department_job_2_list = []
      var department_job_3_list = []
      var department_job_4_list = []
      var department_job_5_list = []
      var department_job_6_list = []
      var department_job_7_list = []
      var department_job_8_list = []
      var department_job_9_list = []
      var department_job_10_list = []
      var mianji_dept_list = []
      var ren_mianji_dept_list = []
      var num_dept_list = []
      var ren_num_dept_list = []
      var zhiwu_dept_list = []
      this.tableData.forEach(item => {
        deptname_list.push(item.department_name)
        deptuser_list.push(item.department_user)
        deptuser_man_list.push(item.department_user_man)
        deptuser_girl_list.push(item.department_user_girl)
        department_user_work_list.push(item.department_user_work)
        department_vacation_list.push(item.department_vacation)
        department_job_list.push(item.department_job)
        department_job_1_list.push(item.department_job_1)
        department_job_2_list.push(item.department_job_2)
        department_job_3_list.push(item.department_job_3)
        department_job_4_list.push(item.department_job_4)
        department_job_5_list.push(item.department_job_5)
        department_job_6_list.push(item.department_job_6)
        department_job_7_list.push(item.department_job_7)
        department_job_8_list.push(item.department_job_8)
        department_job_9_list.push(item.department_job_9)
        department_job_10_list.push(item.department_job_10)
        mianji_dept_list.push({ value: item.area, name: item.department_name })
        ren_mianji_dept_list.push({ value: item.ren_area, name: item.department_name })
        num_dept_list.push({ value: item.regin_num, name: item.department_name })
        ren_num_dept_list.push({ value: item.ren_regin, name: item.department_name })
        zhiwu_dept_list.push({ value: item.department_job, name: item.department_name })
      })
      this.chart1 = echarts.init(document.getElementById('pie1'))
      this.chart1.setOption({
        title: {
          text: '人员性别统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['人员总数', '男性', '女性'],
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
          data: deptname_list
        }],
        yAxis: [{
          type: 'value',
          name: '人数',
          axisLabel: {
            formatter: '{value}'
          }
        }],
        series: [{
          name: '人员总数',
          type: 'bar',
          data: deptuser_list
        }, {
          name: '男性',
          type: 'bar',
          data: deptuser_man_list
        }, {
          name: '女性',
          type: 'bar',
          data: deptuser_girl_list
        }]
      })
      this.chart2 = echarts.init(document.getElementById('pie2'))
      this.chart2.setOption({
        title: {
          text: '人员工作状态'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['正常上班', '请假'],
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
          data: deptname_list
        }],
        yAxis: [{
          type: 'value',
          name: '次数',
          axisLabel: {
            formatter: '{value}'
          }
        }],
        series: [{
          name: '正常上班',
          type: 'bar',
          data: department_user_work_list
        }, {
          name: '请假',
          type: 'bar',
          data: department_vacation_list
        }]
      })
      this.chart3 = echarts.init(document.getElementById('pie3'))
      this.chart3.setOption({
        title: {
          text: '职位级别统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['职务总数', '1级职务', '2级职务', '3级职务', '4级职务', '5级职务', '6级职务', '7级职务', '8级职务', '9级职务', '10级职务'],
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
          data: deptname_list
        }],
        yAxis: [{
          type: 'value',
          name: '次数',
          axisLabel: {
            formatter: '{value}'
          }
        }],
        series: [{
          name: '职务总数',
          type: 'bar',
          data: department_job_list
        }, {
          name: '1级职务',
          type: 'bar',
          data: department_job_1_list
        }, {
          name: '2级职务',
          type: 'bar',
          data: department_job_2_list
        }, {
          name: '3级职务',
          type: 'bar',
          data: department_job_3_list
        }, {
          name: '4级职务',
          type: 'bar',
          data: department_job_4_list
        }, {
          name: '5级职务',
          type: 'bar',
          data: department_job_5_list
        }, {
          name: '6级职务',
          type: 'bar',
          data: department_job_6_list
        }, {
          name: '7级职务',
          type: 'bar',
          data: department_job_7_list
        }, {
          name: '8级职务',
          type: 'bar',
          data: department_job_8_list
        }, {
          name: '9级职务',
          type: 'bar',
          data: department_job_9_list
        }, {
          name: '10级职务',
          type: 'bar',
          data: department_job_10_list
        }]
      })
      this.chart4 = echarts.init(document.getElementById('pie4'))
      this.chart4.setOption({
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
              return param.name + ':\n' + param.value + '平方米'
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
          data: deptname_list
        },
        series: [
          {
            name: '面积',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: mianji_dept_list,
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
      this.chart5 = echarts.init(document.getElementById('pie5'))
      this.chart5.setOption({
        title: {
          text: '人均网格面积统计',
          x: 'center'
        },
        label: {
          normal: {
            textStyle: {
              fontSize: 14
            },
            formatter: function(param) {
              return param.name + ':\n' + param.value + '平方米'
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
          data: deptname_list
        },
        series: [
          {
            name: '面积',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: ren_mianji_dept_list,
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
      this.chart6 = echarts.init(document.getElementById('pie6'))
      this.chart6.setOption({
        title: {
          text: '网格数量统计',
          x: 'center'
        },
        label: {
          normal: {
            textStyle: {
              fontSize: 14
            },
            formatter: function(param) {
              return param.name + ':\n' + param.value + '个'
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
          data: deptname_list
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: num_dept_list,
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
      this.chart7 = echarts.init(document.getElementById('pie7'))
      this.chart7.setOption({
        title: {
          text: '人均网格数量统计',
          x: 'center'
        },
        label: {
          normal: {
            textStyle: {
              fontSize: 14
            },
            formatter: function(param) {
              return param.name + ':\n' + param.value + '个'
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
          data: deptname_list
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: ren_num_dept_list,
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
      this.chart8 = echarts.init(document.getElementById('pie8'))
      this.chart8.setOption({
        title: {
          text: '职务数量统计',
          x: 'center'
        },
        label: {
          normal: {
            textStyle: {
              fontSize: 14
            },
            formatter: function(param) {
              return param.name + ':\n' + param.value + '个'
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
          data: deptname_list
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: zhiwu_dept_list,
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
</style>