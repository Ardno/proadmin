<template>
  <div class="app-container">
    <div class="lr-ct">
      <div class="layui-elem-quote">
        <span class="mr10 ">
          单位部门结构
        </span>
        <el-button type="primary" v-if="isAccess('21')" size="mini"  @click="dialogFormVisible = true">添加部门</el-button>
      </div>
      <div class="left-side">
        <div class="grid-content bg-purple">
          <el-tree :data="depList" :props="defaultProps" node-key="id" :expand-on-click-node="false"  :render-content="renderContent">
          </el-tree>
        </div>
      </div>
      <div class="rt-ct">
        <div class="grid-content bg-purple-light">
          <el-card class="box-card auto">
            <div slot="header" class="clearfix">
              <h4 v-show="infotype" class="n g3 pt10 pb10">单位或机构信息</h4>
              <h4 v-show="!infotype" class="n g3 pt10 pb10">单位人员信息 </h4>
            </div>
            <el-form v-if="infotype" :key="'1'" label-position="top" label-width="80px" :rules="infodepRules" ref="depUpateFrom" :model="depInfo" v-loading="fromloading" class=" pl10 cusfom">
              <el-form-item label="部门名称" prop="name">
                <span v-if="infoupdate" class="g6">{{depInfo.name}}</span>
                <el-input v-else v-model="depInfo.name"></el-input>
              </el-form-item>
              <el-form-item label="上级部门">
                <span v-if="infoupdate" class="g6">{{depFilter(depInfo.parent)}}</span>
                <el-select v-else class="filter-item" v-model="depInfo.parent" placeholder="请选择">
                  <el-option v-for="item in  depmenArr" :key="item._id" :label="item.name" :value="item._id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述信息">
                <span v-if="infoupdate" class="g6">{{depInfo.info ? depInfo.info:'暂无描述信息'}}</span>
                <el-input v-else v-model="depInfo.info"></el-input>
              </el-form-item>
              <el-form-item label="部门链接">
                <span v-if="infoupdate" class="g6">{{depInfo.infoLink ? depInfo.infoLink:'暂无链接'}}</span>
                <el-input v-else v-model="depInfo.infoLink"></el-input>
              </el-form-item>
              <el-form-item label="部门人数">
                <span class="g6">{{depInfo.count ? depInfo.count:'暂无人员'}}</span>
                <el-button v-show="firstflg && infoupdate && depInfo.count" class="r" type="text" @click="getDepPepArr(depInfo._id)">查看人员结构</el-button>
              </el-form-item>
              <el-form-item label="部门状态">
                <span class="g6">{{depInfo.status ? '解散':'正常'}}</span>
                <el-tooltip class="item" effect="dark" content="修改部门的状态" placement="right">
                  <el-button  v-show="firstflg && infoupdate&&isAccess('22')" class="r" type="text" @click="updateDtpsate">{{depInfo.status ? '恢复':'解散'}}</el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="录入时间">
                <span class="g6">{{depInfo.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
              </el-form-item>
              <el-form-item style="border:none" v-if="isAccess('22')">
                <el-button type="primary" v-show="firstflg" @click="updateInfo">{{infoupdate?'修改':'保存'}}</el-button>
                <el-button v-show="firstflg && infoupdate" @click="updateKaoqing">设置考勤规则</el-button>
                <el-button v-show="!infoupdate" @click="resetForm">取消</el-button>
              </el-form-item>
            </el-form>
            <el-form v-else label-position="left" label-width="80px" :model="depInfo" v-loading="fromloading" class=" pl10 cusfom">
              <el-form-item label="姓名">
                <span class="g6">{{depInfo.name}}</span>
              </el-form-item>
              <el-form-item label="姓别">
                <span class="g6">{{depInfo.sex ? '女':'男'}}</span>
              </el-form-item>
              <el-form-item label="民族">
                <span class="g6">{{depInfo.nation}}</span>
              </el-form-item>
              <el-form-item label="手机号码">
                <span class="g6">{{depInfo.mobile}}</span>
              </el-form-item>
              <el-form-item label="生日">
                <span class="g6">{{depInfo.birthday | parseTime('{y}-{m}-{d}')}}</span>
              </el-form-item>
              <el-form-item label="部门">
                <span v-if="depInfodep.depFlg" class="g6">{{depInfo.dept_name ? depInfo.dept_name:'暂无部门'}}</span>
                <el-select v-else class="filter-item" v-model="depInfodep.department_id" placeholder="请选择">
                  <el-option v-for="item in  depmenArr" :key="item._id" :label="item.name" :value="item._id">
                  </el-option>
                </el-select>
                <el-button v-show="!depInfodep.depFlg" class="r ml10" type="text" @click="depInfodep.depFlg=true">取消</el-button>
                <el-tooltip class="item" effect="dark" content="修改用户所在的部门" placement="right">
                  <el-button v-show="isAccess('12')" class="r" type="text" @click="handleUpdatePeInfo">{{depInfodep.depFlg ? '修改' : '保存'}}</el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="加入时间">
                <span class="g6">{{depInfo.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
    </div>
    <el-dialog title="添加部门" :visible.sync="dialogFormVisible" size="tiny">
      <el-form class="small-space" :model="depmentinfo" :rules="infoRules" ref="infoForm" label-position="right" label-width="80px">
        <el-form-item label="上级部门">
          <el-select class="filter-item" v-model="depmentinfo.parent" placeholder="请选择">
            <el-option v-for="item in  restaurants" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="depmentinfo.name"></el-input>
        </el-form-item>
        <el-form-item label="部门信息">
          <el-input v-model="depmentinfo.info"></el-input>
        </el-form-item>
        <el-form-item label="部门链接">
          <el-input v-model="depmentinfo.infoLink"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCreate">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置部门考勤规则" :visible.sync="dialogFormVisiblec" size="tiny">
      <el-select class="filter-item" v-model="dementrule.dance_config_id" placeholder="请选择">
        <el-option v-for="item in  kaoqingArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblec = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateKaq">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看部门人员结构" :visible.sync="dialogFormVisibled" size="tiny">
      <el-tree :data="depPepoleList" :props="defaultProps" node-key="id" accordion :render-content="renderContentP">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisibled = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchDepartments, createDep, fetchList, updateDep, updatePeInfo, fetchRoles } from '@/api/department'
import { TreeUtil, deepClone, sortBy } from '@/utils/index'
import { isAccess } from '@/utils/auth'
import { getadcArr } from '@/api/schedule'

import axios from 'axios'

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      const arr = this.restaurants
      if (!value) {
        callback(new Error('请输入部门名称'))
        return
      }
      arr.forEach(function(element) {
        if (element.name === value) {
          callback(new Error('部门名字已存在'))
          return
        }
      }, this)
      callback()
    }
    const validatedepname = (rule, value, callback) => {
      const arr = this.depmenArr
      if (!value) {
        callback(new Error('请输入部门名称'))
        return
      }
      arr.forEach(function(element) {
        if (element.name === value) {
          callback(new Error('部门名字已存在'))
          return
        }
      }, this)
      callback()
    }
    return {
      dialogFormVisible: false,
      dialogFormVisiblec: false,
      dialogFormVisibled: false,
      depmentinfo: {
        parent: '',
        name: '',
        info: '',
        infoLink: ''
      },
      dementrule: {
        _id: '',
        dance_config_id: ''
      },
      kaoqingArr: [],
      firstflg: false,
      infoupdate: true,
      infotype: true,
      fromloading: false,
      restaurants: [],
      depmenArr: [],
      infoRules: {
        name: [{ required: true, trigger: 'blur', validator: validateUsername }]
      },
      infodepRules: {
        name: [{ required: true, trigger: 'blur', validator: validatedepname }]
      },
      depInfoclone: null,
      depInfo: {
        test: '',
        parent: '',
        name: '',
        info: '',
        infoLink: '',
        create_time: '',
        count: 0
      },
      depInfodep: {
        depFlg: true,
        _id: '',
        department_id: ''
      },
      depList: [],
      depPepoleList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    isAccess: isAccess,
    handleUpdatePeInfo() { // 修改人员部门
      if (this.depInfodep.depFlg) {
        this.depInfodep._id = this.depInfo.cid
        this.depInfodep.department_id = this.depInfo.department_id
        this.depInfodep.depFlg = false
        return
      }
      this.$confirm('确定要移动当前人员到该部门？', '修改部门', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        updatePeInfo(this.depInfodep).then(response => {
          this.loadDps()
          this.depInfodep.depFlg = true
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {
          this.$message({
            message: '修改失败，请稍后再试',
            type: 'error',
            duration: 4 * 1000
          })
        })
      })
    },
    getadcArray() { // 获取考勤规则集合
      getadcArr().then(response => {
        this.kaoqingArr = response.info
      }).catch(() => { })
    },
    updateKaoqing() {
      this.dementrule._id = this.depInfo._id
      this.dementrule.dance_config_id = this.depInfo.dance_config_id
      this.dialogFormVisiblec = true
      console.log(this.dementrule)
    },
    handleUpdateKaq() {
      updateDep(this.dementrule).then(response => {
        this.dialogFormVisiblec = false
        this.loadDps()
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 4 * 1000
        })
      }).catch(() => {
        this.$message({
          message: '修改失败，请稍后再试',
          type: 'error',
          duration: 4 * 1000
        })
      })
    },
    updateDtpsate() {
      if (this.depInfo.children.length) { // 存在子元素不能解散
        this.$message({
          message: '该部门不是一个空部门，无法解散',
          type: 'warning'
        })
        return
      }
      const data = {
        _id: this.depInfo._id,
        status: 1
      }
      let str = '是否解散当前部门？'
      if (this.depInfo.status) {
        data.status = 0
        str = '是否恢复当前部门'
      }
      this.$confirm(str, '修改部门状态', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        updateDep(data).then(response => {
          this.loadDps()
          if (this.depInfo.status) {
            this.depInfo.status = 0
          } else {
            this.depInfo.status = 1
          }
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {
          this.$message({
            message: '修改失败，请稍后再试',
            type: 'error',
            duration: 4 * 1000
          })
        })
      })
    },
    depFilter(val) {
      for (const key in this.restaurants) {
        const obj = this.restaurants[key]
        for (const j in obj) {
          if (j === '_id') {
            if (obj[j] === val) {
              return obj['name']
            }
          }
        }
      }
      return '无上级部门'
    },
    resetForm() { // 取消恢复修改前的数据
      this.$refs.depUpateFrom.resetFields()
      this.depInfo = deepClone(this.depInfoclone)
      this.infoupdate = true
    },
    updateInfo() {
      if (this.infoupdate) { // 保留修改前的数据
        this.depInfoclone = deepClone(this.depInfo)
        this.infoupdate = !this.infoupdate
      } else {
        this.$refs.depUpateFrom.validate(valid => {
          if (valid) {
            updateDep(this.depInfo).then(response => {
              this.infoupdate = !this.infoupdate
              this.loadDps()
              this.$message({
                message: '修改部门成功',
                type: 'success',
                duration: 4 * 1000
              })
            }).catch(() => {
              this.$message({
                message: '修改部门失败，请稍后再试',
                type: 'error',
                duration: 4 * 1000
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    toview(store, data) {
      this.fromloading = true
      this.firstflg = true
      this.infoupdate = true
      this.depInfodep.depFlg = true
      this.depInfo = {
        test: '',
        parent: '',
        name: '',
        info: '',
        infoLink: '',
        create_time: '',
        count: 0
      }
      for (var key in data) {
        if (key === 'label') {
          this.depInfo['name'] = data[key]
        } else if (key === 'id') {
          this.depInfo['_id'] = data[key]
        } else if (key === 'parentid') {
          this.depInfo['parent'] = data[key] ? data[key] : ''
        } else {
          this.depInfo[key] = data[key]
        }
      }
      const array = this.depInfo.children
      this.depInfo.count = 0
      array.forEach(function(element) {
        if (element.cid) {
          this.depInfo.count++
        }
      }, this)
      if (this.depInfo.cid) {
        this.infotype = false
      } else {
        if (this.$refs.depUpateFrom) {
          this.$refs.depUpateFrom.resetFields()
        }
        this.infotype = true
      }
      this.depmenArr = deepClone(this.restaurants)
      for (const i in this.depmenArr) { // 在修改上级部门的时候剔除自己
        const obj = this.depmenArr[i]
        if (obj['_id'] === this.depInfo['_id']) {
          this.depmenArr.splice(i, 1)
        }
      }
      console.log(this.depInfo)
      setTimeout(() => {
        this.fromloading = false
      }, 400)
      return false
    },
    renderContent(h, { node, data, store }) {
      if (data.cid) {
        return (
          <span>
            <span>
              <icon-svg class='g6 f14' icon-class='yonghuming' />
              <span class='f12 maroon'>{node.label}</span>
            </span>
            <span style='float: right; margin-right: 20px'>
              <el-button size='mini' on-click={() => this.toview(store, data)}>查看</el-button>
            </span>
          </span>)
      } else {
        let cls = 'g6'
        if (data.status) {
          cls = 'g9'
        }
        return (
          <span>
            <span class={cls}>
              <span>{node.label}</span>
            </span>
            <span style='float: right; margin-right: 20px'>
              <el-button size='mini' on-click={() => this.toview(store, data)}>查看</el-button>
            </span>
          </span>)
      }
    },
    loadDps() { // 获取部门集合
      axios.all([fetchDepartments(''), fetchList('')])
        .then(axios.spread((acct, perms) => {
          var data = perms.info
          this.restaurants = []
          acct.info.forEach(function(element) {
            if (!element.status) {
              this.restaurants.push(element)
            }
          }, this)
          data.forEach(function(element) { // 将用户对象修改成带parent的对象以便和部门对象数组合并
            for (const key in element) {
              if (key === '_id') {
                element.cid = element[key]
                delete element[key]
              }
              if (key === 'department_id') {
                element.parent = element[key]
              }
            }
          }, this)
          const map = { name: 'label', _id: 'id' }
          const list = deepClone(acct.info)
          console.log(list)
          list.forEach(function(element) { // 保留父元素id，以便查询信息时用到
            for (const key in element) {
              if (key === 'parent') {
                element.parentid = element[key]
              }
            }
          }, this)
          list.push(...data)
          const tree1 = new TreeUtil(list, '_id', 'parent', map)
          this.depList = tree1.toTree()
        })).catch(() => {
          this.$message({
            message: '获取部门结构失败，请稍后再试',
            type: 'error',
            duration: 4 * 1000
          })
        })
    },
    renderContentP(h, { node, data, store }) {
      return (
        <span>
          <span>
            <span >{node.label}</span>
            <span class='f12 maroon ml10'>({data.role_name})</span>
          </span>
        </span>)
    },
    getDepPepArr(id) {
      axios.all([fetchRoles(''), fetchList({ department_id: id })])
      .then(axios.spread((acct, perms) => {
        var data = perms.info
        acct.info.forEach(function(element) { // 赋值职位级别到对象
          data.forEach(function(els) {
            if (element['_id'] === els['roleid']) {
              els['level'] = element['level']
            }
          }, this)
        }, this)
        data.sort(sortBy('level'))
        const datacopy = deepClone(data)
        for (let a = 0; a < datacopy.length; a++) {
          datacopy[a]['parent'] = 0
          for (let b = 0; b < data.length; b++) {
            if (datacopy[a]['level'] < data[b]['level']) {
              datacopy[a]['parent'] = data[b]['level']
              console.log(datacopy[a]['parent'])
              break
            }
          }
        }
        const map = { name: 'label', level: 'id' }
        var tree1 = new TreeUtil(datacopy, 'level', 'parent', map)
        this.depPepoleList = tree1.toTree()
      }))
      this.dialogFormVisibled = true
    },
    handleCreate() { // 创建部门
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          createDep(this.depmentinfo).then(response => {
            this.dialogFormVisible = false
            this.loadDps()
            this.$message({
              message: '创建部门成功',
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.$message({
              message: '创建部门失败，请稍后再试',
              type: 'error',
              duration: 4 * 1000
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  created() {
    this.loadDps()
    this.getadcArray()
  }
}
</script>
<style lang="scss" scoped>
html,
body,
#app,
.main-container,
.app-container {
  height: 100%;
}

.app-container {
  overflow: auto;
}

.app-main {
  min-height: auto !important;
  height: calc(100% - 50px);
}

.el-tree {
  border-color: transparent;
}

.lr-ct {
  position: relative;
  min-height: 100%;
  .left-side {
    position: absolute;
    top: 62px;
    left: 0px;
    width: 400px;
    height: calc(100% - 33px);
    border-right: 1px solid #dbdbdb;
    overflow: auto;
  }
  .rt-ct {
    padding: 30px;
    margin-left: 410px;
    overflow: auto;
  }
}

.cusfom .el-form-item {
  border-bottom: 1px solid #edf1f2;
}
.box-card {
    width: 600px;
  }
</style>
