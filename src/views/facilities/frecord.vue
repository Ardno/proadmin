<template>
  <div class="app-container">
    <div class="layui-elem-quote">
      <span class="f28">{{userName}}记录</span>
    </div>
    <!-- 主要内容 -->
    <el-table :key='tableKey' :data="adclist" v-loading="listLoading" element-loading-text="给我一点时间" border fit
              highlight-current-row>
      <el-table-column align="center" label="编号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row._id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          <!--<span>{{scope.row.name}}</span>-->
          <el-tooltip placement="bottom" effect="light">
            <div slot="content" effect="light">
              <img v-bind:src="'http://120.76.228.172:83/images/other/'+scope.row.areaperson_img"
                   style="max-width:200px;max-height:200px;"/></div>
            <el-button>{{scope.row.name}}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == '1'" type="primary">正常</el-tag>
          <el-tag v-if="scope.row.status == '2'" type="danger">完全损坏</el-tag>
          <el-tag v-if="scope.row.status == '3'" type="info">部分损坏</el-tag>
          <el-tag v-if="scope.row.status == '4'" type="warning">丢失</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="登记人">
        <template slot-scope="scope">
          <span>{{scope.row.recordername}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新日期">
        <template slot-scope="scope">
          <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="290">
        <template slot-scope="scope">
          <el-button size="small" type="danger" v-show="scope.row.status">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
  import { GetfacilitieslogsList } from '@/api/areaperson'
  // import { getDepCld } from '@/utils/auth'
  export default {
    data() {
      return {
        totalPages: 0,
        currentPage: 1,
        adclist: null,
        tableKey: 0,
        userName: null,
        listLoading: false
      }
    },
    created() {
      this.userArr = this.$store.getters.commonInfo.userArr
      this.record_id = this.$store.getters.caseid // 路由跳转 传过来的值
      if (this.record_id) {
        this.getEvent({ user_id: this.record_id })
      } else {
        this.$router.push({ path: '/' })
      }
    },
    methods: {
      getEvent(agu) {
        GetfacilitieslogsList(agu).then(res => {
          res.info.list.forEach(list => { // 遍历所有用户，把录入人员的id改为中文名
            this.userArr.forEach(usera => {
              this.userName = list.name
              if (usera._id === list.recorder_id) {
                list.recordername = usera.name
                return
              }
            })
          })
          this.adclist = res.info.list
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .box {
    width: 800px;
    padding: 20px;
    border: 1px solid #ebebeb;
    border-radius: 3px;
  }

</style>
