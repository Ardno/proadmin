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
          <el-col :span="12">
            <div class='chart-container chat-pie pt30'>
              <div class="chat"  id="pie3" ></div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class='chart-container chat-pie pt30'>
              <div class="chat"  id="pie4" ></div>
            </div>
          </el-col>
        </el-row>
        <el-row class="mt20" :gutter="20">
          <el-col :span="12">
            <div class='chart-container chat-pie pt30'>
              <div class="chat"  id="pie5" ></div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class='chart-container chat-pie pt30'>
              <div class="chat"  id="pie6" ></div>
            </div>
          </el-col>
        </el-row>
        <el-row class="mt20" :gutter="20">
          <el-col :span="12">
            <div class='chart-container chat-pie pt30'>
              <div class="chat"  id="pie7" ></div>
            </div>
          </el-col>
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
      this.tableData.forEach(item => {
        deptname_list.push(item.department_name)
        deptuser_list.push(item.department_user)
        deptuser_man_list.push(item.department_user_man)
        deptuser_girl_list.push(item.department_user_girl)
      })
      this.chart1 = echarts.init(document.getElementById('pie1'))
      console.log(this.chart1)
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