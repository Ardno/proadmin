<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-autocomplete class="inline-input vt" v-model="listQuery.department_id" :fetch-suggestions="querySearch" placeholder="请输入部门" :trigger-on-focus="false" @select="handleSelect"></el-autocomplete>
      <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.roleid" placeholder="职位">
        <el-option v-for="item in  solerr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="search" @click="handleQuery">查看</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="65">
        <template scope="scope">
          <span>{{scope.row._id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="时间">
        <template scope="scope">
          <span>{{scope.row.create_date | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="110px" label="姓名">
        <template scope="scope">
            <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80px" label="性别">
        <template scope="scope">
            <span>{{scope.row.sex | sexFileter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80px" label="民族">
        <template scope="scope">
            <span>{{scope.row.nation}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="180px" label="手机号码">
        <template scope="scope">
            <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="110px" label="生日">
        <template scope="scope">
            <span>{{scope.row.birthday | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门">
        <template scope="scope">
            <span>{{scope.row.dept_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template scope="scope">
          <el-button v-if="scope.row.status!='published'" size="small" type="success" @click="handleModifyStatus(scope.row,'published')">发布
          </el-button>
          <el-button v-if="scope.row.status!='deleted'" size="small" type="danger" @click="handleModifyStatus(scope.row,'deleted')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchList, fetchDepartments, fetchRoles } from '@/api/department'
import { parseTime } from '@/utils'

export default {
  data() {
    return {
      restaurants: [],
      solerr: [],
      listQuery: {
        department_id: '',
        roleid: ''
      },
      list: null,
      listLoading: true,
      tableKey: 0
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    sexFileter(status) {
      const statusMap = ['男', '女']
      return statusMap[status]
    }
  },
  created() {
    this.loadRls('')
    this.loadDps()
    this.getList()
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      console.log(restaurants)
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
      };
    },
    loadRls(rq) {
      fetchRoles(rq).then(response => {
        this.solerr = response.info
      })
    },
    loadDps() {
      fetchDepartments('').then(response => {
        if(response.info.length){
          let array= response.info
          let arrs=[]
          array.forEach(function(element) {
            let obj={
              value:element.name
            }
            arrs.push(obj)
          }, this);
          this.restaurants = arrs
        }
      })
    },
    handleSelect(item) {
      console.log(item)
    },
    handleQuery() {
      this.getList()
    },
    handleCreate() {
      console.log(2)
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.info
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
        this.list = []
      })
    },
  },
}
</script>
