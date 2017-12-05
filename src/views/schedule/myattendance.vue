<template>
  <div class="app-container">
    <div class="layui-elem-quote">
      我的考勤
    </div>
    <el-card class="box-card">
      <el-table v-loading="listLoading" element-loading-text="给我一点时间"  :data="tableData" border >
        <el-table-column align="center"  label="周日">
          <template slot-scope="scope">
            <div class="p10">
              <p class="mb10 tr">{{scope.row.day0.time}}</p>
              <el-tag v-if="scope.row.day0.time" :type="scope.row.day0.type">{{scope.row.day0.name}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="周一">
          <template slot-scope="scope">
            <div class="p10">
              <p class="mb10 tr">{{scope.row.day1.time}}</p>
              <el-tag v-if="scope.row.day1.time" :type="scope.row.day1.type">{{scope.row.day1.name}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="周二">
          <template slot-scope="scope">
            <div class="p10">
              <p class="mb10 tr">{{scope.row.day2.time}}</p>
              <el-tag v-if="scope.row.day2.time" :type="scope.row.day2.type">{{scope.row.day2.name}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="周三">
          <template slot-scope="scope">
            <div class="p10">
              <p class="mb10 tr">{{scope.row.day3.time}}</p>
              <el-tag v-if="scope.row.day3.time" :type="scope.row.day3.type">{{scope.row.day3.name}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="周四">
          <template slot-scope="scope">
            <div class="p10">
              <p class="mb10 tr">{{scope.row.day4.time}}</p>
              <el-tag v-if="scope.row.day4.time" :type="scope.row.day4.type">{{scope.row.day4.name}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="周五">
          <template slot-scope="scope">
            <div class="p10">
              <p class="mb10 tr">{{scope.row.day5.time}}</p>
              <el-tag v-if="scope.row.day5.time" :type="scope.row.day5.type">{{scope.row.day5.name}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="周六">
          <template slot-scope="scope">
            <div class="p10">
              <p class="mb10 tr">{{scope.row.day6.time}}</p>
              <el-tag v-if="scope.row.day6.time" :type="scope.row.day6.type">{{scope.row.day6.name}}</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import { getMonthdance } from '@/api/levelshift'
  import store from '@/store'
  export default {
    data() {
      return {
        listLoading: false,
        tableData: [],
        pageobj: {
          start_index: 0,
          length: 10000,
          user_id: store.getters.useinfo._id,
          start_time: '',
          end_time: ''
        },
        dataObj: {
          nstr: new Date(),
          ynow: new Date().getFullYear(),
          mnow: new Date().getMonth(),
          dnow: new Date().getDate()
        }
      }
    },
    created() {
      const d = this.dataObj
      const m_days = [31, 28 + this.is_leap(d.ynow), 31, 30, 31, 31, 30, 31, 30, 31, 30, 31] // 每个月的天数
      this.pageobj.start_time = new Date(d.ynow, d.mnow, 1)
      this.pageobj.end_time = new Date(d.ynow, d.mnow, m_days[d.mnow])
      getMonthdance(this.pageobj).then(res => {
        const arr = {}
        if (res.leave) { // 循环请假对象
          res.leave.forEach(element => {
            if (element.approval_state === 1) {
              const idx = new Date(element.start_time * 1000).getDate() || 0
              arr[idx] = '请假'
            }
          })
        }
        if (res.work) {
          res.work.forEach(element => {
            const text = this.filterARR(element.work_state)
            const idx = new Date(element.r_start_time * 1000).getDate() || 0
            arr[idx] = text
          })
        }
        this.randerCalendar(arr)
      }).catch((errs) => {
      })
    },
    methods: {
      filterARR(index) {
        const arr = ['无记录', '正常', '迟到', '早退', '缺勤', '调派']
        return arr[index]
      },
      is_leap(year) { // 判断是否为闰年
        var cond1 = year % 4 === 0 // 条件1：年份必须要能被4整除
        var cond2 = year % 100 !== 0 // 条件2：年份不能是整百数
        var cond3 = year % 400 === 0 // 条件3：年份是400的倍数
        // 当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
        // 如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
        // 所以得出判断闰年的表达式：
        var cond = cond1 && cond2 || cond3
        if (cond) {
          return true
        } else {
          return false
        }
      },
      chooseDate() {
        // 获取上一个月时，到1月份需注意；获取下一个月时，到12月份时要注意。
        if (this.dataObj.mnow <= 0) {
          this.dataObj.mnow = 11
          this.dataObj.ynow = this.dataObj.ynow - 1
        } else {
          this.dataObj.mnow--
        }
        if (this.dataObj.mnow >= 11) {
          this.dataObj.mnow = 0
          this.dataObj.ynow = this.dataObj.ynow + 1
        } else {
          this.dataObj.mnow++
        }
      },
      randerCalendar(data) {
        const d = this.dataObj
        const ynow = d.ynow
        const mnow = d.mnow
        const nlstr = new Date(ynow, mnow, 1) // 当月第一天
        const firstday = nlstr.getDay() // 第一天星期几
        const m_days = [31, 28 + this.is_leap(ynow), 31, 30, 31, 31, 30, 31, 30, 31, 30, 31] // 每个月的天数
        const new_days = m_days[mnow] // 当前月天数
        const tr_str = Math.ceil((m_days[mnow] + firstday) / 7) // 当前月天数+第一天是星期几的数值   获得 表格行数
        let tiem = ''
        for (let index = 0; index < tr_str; index++) {
          const obj = {}
          for (let fs = 0; fs < 7; fs++) {
            if (tiem) {
              if (tiem < new_days) { // 必须小于当月天数
                tiem++
              } else {
                tiem = ''
              }
            }
            if (index === 0 && fs === firstday && !tiem) { // 判断第一天为周几时开始记为1
              tiem = 1
            }
            let type = 'success'
            if (tiem && data[tiem] === '缺勤') {
              type = 'danger'
            }
            if (tiem && (data[tiem] === '迟到' || data[tiem] === '早退')) {
              type = 'warning'
            }
            const cobj = {
              time: tiem,
              name: data[tiem] || '--',
              type: type
            }
            obj['day' + fs] = cobj
          }
          this.tableData.push(obj)
        }
      }
    },
    computed: {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .box-card{
    width: 800px;
    margin: 30px auto;
  }
</style>
