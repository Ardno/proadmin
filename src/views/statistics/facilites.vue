<template>
  <div class='app-container'>
    <p class="mt20 mb20 g6 f20">人员设施统计数据</p>
    <div class="can-ct" v-loading="listLoading">
      <div>
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
              <div class="chat"  id="pie6" ></div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class='chart-container chat-pie pt30'>
              <div class="chat"  id="pie7" ></div>
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
  import { getPeopleStatist, getMongoareaStatist } from '@/api/statistics'
  export default {
    data() {
      return {
        chart1: null,
        chart2: null,
        chart6: null,
        chart7: null,
        listLoading: false,
        tableKey: 0,
        regionArr: [],
        peopleMonage: { class: [], a1: [], a2: [], a3: [], a4: [], aa: ['正常', '脱贫', '外出', '生病'] },
        facilitesMonage: { class: [], a1: [], a2: [], a3: [], a4: [], aa: ['正常', '完全损坏', '部分损坏', '丢失'] }
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
        getPeopleStatist({}).then(res => { // 获取人员统计数据
          var data = res.info.list
          data.forEach(item => {
            if (item.fortab === 0) {
              this.peopleMonage.class.push(item.class)
              this.peopleMonage.a1.push(item.status1)
              this.peopleMonage.a2.push(item.status2)
              this.peopleMonage.a3.push(item.status3)
              this.peopleMonage.a4.push(item.status4)
            } else {
              this.facilitesMonage.class.push(item.class)
              this.facilitesMonage.a1.push(item.status1)
              this.facilitesMonage.a2.push(item.status2)
              this.facilitesMonage.a3.push(item.status3)
              this.facilitesMonage.a4.push(item.status4)
            }
          })
          this.$nextTick(() => {
            this.chart_gj()
          })
        })
        getMongoareaStatist({}).then(res => {
          console.log('获取人员设施区域的tongji')
          console.log(res)
          if (res.code === 200) {
            var data = res.info.list
            this.chart_chart2(data[0])
            this.chart_chart7(data[1])
          }
        })
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
        this.chart1 = echarts.init(document.getElementById('pie1'))
        console.log(this.peopleMonage)
        this.chart1.setOption({
          title: {
            text: '人员统计'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: this.peopleMonage.class,
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
            data: this.peopleMonage.class
          }],
          yAxis: [{
            type: 'value',
            name: '人数',
            axisLabel: {
              formatter: '{value}'
            }
          }],
          series: [{
            name: '正常',
            type: 'bar',
            stack: '人数',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: this.peopleMonage.a1
          }, {
            name: '贫困',
            type: 'bar',
            stack: '人数',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: this.peopleMonage.a2
          }, {
            name: '外出',
            type: 'bar',
            stack: '人数',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: this.peopleMonage.a3
          }, {
            name: '生病',
            type: 'bar',
            stack: '人数',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: this.peopleMonage.a4
          }]
        })
        this.chart6 = echarts.init(document.getElementById('pie6'))
        this.chart6.setOption({
          title: {
            text: '设施统计'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: this.facilitesMonage.class,
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
            data: this.facilitesMonage.class
          }],
          yAxis: [{
            type: 'value',
            name: '数量',
            axisLabel: {
              formatter: '{value}'
            }
          }],
          series: [{
            name: '正常',
            type: 'bar',
            stack: '数量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: this.facilitesMonage.a1
          }, {
            name: '完全损坏',
            type: 'bar',
            stack: '数量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: this.facilitesMonage.a2
          }, {
            name: '部分损坏',
            type: 'bar',
            stack: '数量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: this.facilitesMonage.a3
          }, {
            name: '丢失',
            type: 'bar',
            stack: '数量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: this.facilitesMonage.a4
          }]
        })
      },
      chart_chart2(data) {
        var cc = [] // 类别 例如["测试1按时啊", "梅东村_3", "凤岭村_2", "三公里村_1", "雅安村_2"]
        var dd = []
        data.forEach(res => {
          cc.push(res.name)
          dd.push({ name: res.name, value: res.lenth })
        })
        this.chart2 = echarts.init(document.getElementById('pie2'))
        this.chart2.setOption({
          title: {
            text: '网格中人员数量统计',
            x: 'center'
          },
          label: {
            normal: {
              textStyle: {
                fontSize: 14
              },
              formatter: function(param) {
                return param.name + ':\n' + param.value + '人'
              }
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}人 ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'right',
            data: cc
          }, // ['网格1', '网格2', '网格3', '网格4']
          series: [
            {
              name: '人数',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: dd,
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
      chart_chart7(data) {
        this.chart7 = echarts.init(document.getElementById('pie7'))
        var cc = [] // 类别 例如["测试1按时啊", "梅东村_3", "凤岭村_2", "三公里村_1", "雅安村_2"]
        var dd = []
        data.forEach(res => {
          cc.push(res.name)
          dd.push({ name: res.name, value: res.lenth })
        })
        this.chart7.setOption({
          title: {
            text: '网格中设施数量统计',
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
            formatter: '{a} <br/>{b} : {c}个 ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'right',
            data: cc
          },
          series: [
            {
              name: '数量',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: dd,
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
