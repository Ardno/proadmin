<template>
  <div class="app-container">
    <div class="lr-ct">
      <div class="layui-elem-quote mb10">
        <span class="mr10 ">
          单位部门结构
        </span>
        <el-button type="primary" v-if="isAccess('101')" size="mini"  @click="dialogFormVisible = true">添加部门</el-button>
      </div>
      <div class="left-side">
        <div class="grid-content bg-purple">
          <el-tree :data="depList" :props="defaultProps" node-key="id" @node-click="nodeClick" :expand-on-click-node="true"  :render-content="renderContent">
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
            <el-form v-if="infotype" :key="'1'" label-position="left" label-width="80px" :rules="infodepRules" ref="depUpateFrom" :model="depInfo" v-loading="fromloading" class=" pl10 cusfom">
              <el-form-item label="部门名称" class="nostar" prop="name">
                <span v-if="infoupdate" class="g6">{{depInfo.name}}</span>
                <el-input v-else v-model="depInfo.name"></el-input>
              </el-form-item>
              <el-form-item label="上级部门">
                <span v-if="infoupdate" class="g6">{{depFilter(depInfo.parent)}}</span>
                <!-- <el-cascader v-else placeholder="请选择" :options="mydepArr" v-model="depInfo.parentArr" @change="val=>changeDep(depInfo.parent,val)" filterable change-on-select></el-cascader> -->
                <el-select v-else class="filter-item" filterable v-model="depInfo.parent" placeholder="请选择">
                  <el-option v-for="item in  depmenArr" :title="item.parentName" :key="item._id" :label="item.name" :value="item._id">
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
                  <el-button  v-show="firstflg && infoupdate&&isAccess('104') && depInfo._id !=1" class="r" type="text" @click="updateDtpsate">{{depInfo.status ? '恢复':'解散'}}</el-button>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="考勤规则">
                <span class="g6">{{ kaoqFiler(depInfo.dance_config_id)}}</span>
              </el-form-item>
              <el-form-item label="录入时间">
                <span class="g6">{{depInfo.create_time | parseTime('{y}-{m}-{d} {h}:{i}',true)}}</span>
              </el-form-item>
              <el-form-item style="border:none">
                <el-button type="primary" v-show="firstflg && isAccess('102')&& depInfo._id !=1" @click="updateInfo">{{infoupdate?'修改':'保存'}}</el-button>
                <el-button v-show="firstflg && infoupdate && isAccess('103')" @click="updateKaoqing">设置考勤规则</el-button>
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
                <span class="g6">{{depInfo.birthday | parseTime('{y}-{m}-{d}',true)}}</span>
              </el-form-item>
              <el-form-item v-show="depInfo.access!='0'"  v-for="(pitem,index) in depInfodep.depArr" :label="'部门'+(index+1)" :key="pitem._id">
                <span class="g6">{{pitem.deptname}}</span>
                <span class="g6 ml30">（<span class="b">职务：</span>{{pitem.rolename}}）</span>
                <el-button v-show="isAccess('105') && depInfodep.depArr.length > 1" class="r ml10" type="text" @click="handleUpdatePeInfo('2', pitem, index)"> 删除</el-button>
                <el-button v-show="isAccess('105')" class="r ml10" type="text" @click="handleUpdatePeInfo('1',pitem ,index)"> 修改</el-button>
                <el-button v-show="isAccess('105') && index===0" class="r ml10" type="text" @click="handleUpdatePeInfo('0',pitem,index)"> 添加</el-button>
              </el-form-item>
              <el-form-item label="加入时间">
                <span class="g6">{{depInfo.create_time | parseTime('{y}-{m}-{d} {h}:{i}', true)}}</span>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
    </div>
    <el-dialog title="添加部门" :visible.sync="dialogFormVisible" width="600px" >
      <el-form class="small-space" :model="depmentinfo" :rules="infoRules" ref="infoForm" label-position="right" label-width="80px">
        <el-form-item label="上级部门">
          <el-cascader placeholder="请选择" :options="mydepArr" v-model="depmentinfo.parentArr" @change="val=>changeDep(depmentinfo,val)" filterable change-on-select></el-cascader>
          <!-- <el-select class="filter-item" filterable v-model="depmentinfo.parent" placeholder="请选择">
            <el-option v-for="item in  restaurants"  :key="item._id" :title="item.parentName" :label="item.name" :value="item._id">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="考勤规则">
          <el-select class="filter-item" multiple v-model="depmentinfo.dance_config_arr" placeholder="请选择">
            <el-option v-for="item in  kaoqingArr" :key="item._id" :label="item.name" :value="item._id">
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
    <el-dialog title="设置部门考勤规则" :visible.sync="dialogFormVisiblec" width="600px" >
      <el-select class="filter-item" multiple v-model="dementrule.dance_config_arr" placeholder="请选择">
        <el-option v-for="item in  kaoqingArr" :key="item._id" :label="item.name" :value="item._id">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblec = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdateKaq">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看部门人员结构" :visible.sync="dialogFormVisibled" width="600px" >
      <el-tree :data="depPepoleList" :props="defaultProps" node-key="id" accordion :render-content="renderContentP">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisibled = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="用户部门" :visible.sync="dialogFormVisiblee" width="600px" >
      <el-form class="small-space" :model="depInfodep.department" :rules="infoRulese" ref="infoForme" label-position="right" label-width="100px">
        <el-form-item label="部门" prop="department_id">
          <el-cascader placeholder="请选择" :options="mydepArr" v-model="depInfodep.department.seltectArr" @change="userchangeDep" @visible-change="changeDepRule" filterable change-on-select></el-cascader>
          <!-- <el-select class="filter-item" filterable v-model="depInfodep.department.department_id" placeholder="请选择" @visible-change="changeDepRule">
            <el-option v-for="item in  restaurants" :key="item._id" :title="item.parentName" :label="item.name" :value="item._id">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="职务" prop="role_id">
          <el-select class="filter-item" filterable  v-model="depInfodep.department.role_id" placeholder="请选择">
            <el-option v-for="item in  fetchArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="depInfodep.depArr.length>1" label="设为主部门" >
          <el-radio class="radio" v-model="depInfodep.department.is_enable"  :label="1">是</el-radio>
          <el-radio class="radio" v-model="depInfodep.department.is_enable" :label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblee = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdatePeInfo('3')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchDepartments, createDep, fetchList, updateDep, addDepRoles, fetchRoles, queryDepRoles, updateDepRoles, deleteDepRoles } from '@/api/department'
import { TreeUtil, deepClone, sortBy, findParentTop, removeTreeArr } from '@/utils/index'
import { isAccess } from '@/utils/auth'
import { getadcArr } from '@/api/schedule'
import axios from 'axios'

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      // const arr = this.restaurants
      if (!value) {
        callback(new Error('请输入部门名称'))
        return
      }
      // arr.forEach(function(element) {
      //   if (element.name === value) {
      //     callback(new Error('部门名字已存在'))
      //     return
      //   }
      // }, this)
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
      dialogFormVisiblee: false,
      fetchArr: [],
      mydepArr: [],
      depmentinfo: {
        parent: '',
        parentArr: [],
        name: '',
        info: '',
        infoLink: '',
        dance_config_id: '',
        dance_config_arr: []
      },
      dementrule: {
        _id: '',
        dance_config_id: '',
        dance_config_arr: []
      },
      timeout: null,
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
      infoRulese: {
        department_id: [{ required: true, trigger: 'change', message: '请选择部门' }],
        role_id: [{ type: 'number', required: true, trigger: 'change', message: '请选择职务' }]
      },
      depInfoclone: null,
      depInfo: {
        test: '',
        parentArr: [],
        parent: '',
        name: '',
        info: '',
        infoLink: '',
        dance_config_id: '',
        create_time: '',
        count: 0
      },
      depInfodep: {
        department: {
          seltectArr: [],
          user_id: '',
          department_id: '',
          role_id: '',
          is_enable: 0
        },
        depArr: [],
        index: 0
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
    cloneMydepArr(depArr) {
      const array = deepClone(depArr)
      const map = { name: 'label', _id: 'value' }
      array.forEach(element => {
        element.parentid = element.parent
      })
      try {
        const tree1 = new TreeUtil(array, '_id', 'parent', map)
        const mydepArr = tree1.toTree()
        removeTreeArr(mydepArr)
        this.mydepArr = mydepArr
        console.log(this.mydepArr)
      } catch (error) {
        console.log(error)
      }
    },
    changeDep(deoart, val) { // 修改el-cascader
      deoart.parent = val[val.length - 1]
      console.log(deoart, val)
    },
    handleUpdatePeInfo(type, item, index) { // 修改人员部门
      if (type === '2') { // 删除
        this.$confirm('确定要删除当前部门？', '用户部门', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          deleteDepRoles(item).then(response => {
            this.loadDps()
            this.$delete(this.depInfodep.depArr, index)
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.$message({
              message: '删除失败，请稍后再试',
              type: 'error',
              duration: 4 * 1000
            })
          })
        })
      } else if (type === '1') { // 修改
        this.dialogFormVisiblee = true
        this.depInfodep.department = deepClone(item)
        this.depInfodep.department.seltectArr = []
        this.depInfodep.department.role_id = ''
        this.depInfodep.index = index
        this.changeDepRule('', true)
      } else if (type === '0') { // 新增
        this.dialogFormVisiblee = true
        this.depInfodep.index = index
        this.depInfodep.department = {
          user_id: item.user_id,
          seltectArr: [],
          department_id: '',
          role_id: '',
          is_enable: 0
        }
      } else if (type === '3') {
        this.$refs.infoForme.validate(valid => {
          if (valid) {
            if (this.depInfodep.department._id) {
              updateDepRoles(this.depInfodep.department).then(response => {
                this.loadDps()
                this.queryDepRoles()
                this.dialogFormVisiblee = false
                this.depInfodep.department = response.info
                this.$set(this.depInfodep.depArr, this.depInfodep.index, this.depInfodep.department)
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 4 * 1000
                })
              }).catch(err => {
                this.$message({
                  message: err,
                  type: 'error',
                  duration: 4 * 1000
                })
              })
            } else {
              addDepRoles(this.depInfodep.department).then(response => {
                this.loadDps()
                this.depInfodep.department = response.info
                this.depInfodep.depArr.push(this.depInfodep.department)
                this.dialogFormVisiblee = false
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration: 4 * 1000
                })
              }).catch(() => {
                this.$message({
                  message: '添加失败，请稍后再试',
                  type: 'error',
                  duration: 4 * 1000
                })
              })
            }
          }
        })
      }
    },
    getadcArray() { // 获取考勤规则集合
      getadcArr({ start_index: 0, length: 1000 }).then(response => {
        response.info.list.forEach(element => {
          element._id = element._id + ''
        })
        this.kaoqingArr = response.info.list.filter(obj => {
          return !obj.status
        })
      }).catch(() => { })
    },
    updateKaoqing() {
      this.dementrule._id = this.depInfo._id
      this.dementrule.dance_config_id = this.depInfo.dance_config_id + ''
      if (this.dementrule.dance_config_id) {
        this.dementrule.dance_config_arr = this.dementrule.dance_config_id.split(',')
      }
      this.dialogFormVisiblec = true
    },
    handleUpdateKaq() {
      this.dementrule.dance_config_id = this.dementrule.dance_config_arr.join(',')
      updateDep(this.dementrule).then(response => {
        this.dialogFormVisiblec = false
        this.depInfo.dance_config_id = this.dementrule.dance_config_id
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
    kaoqFiler(val) { // 转换考勤名称
      const arr = (val + '').split(',')
      const arr2 = []
      arr.forEach(element => {
        this.kaoqingArr.forEach(obj => {
          if (element === obj._id) {
            arr2.push(obj.name)
          }
        })
      })
      return arr2.join(',')
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
    queryDepRoles() { // 获取用户的部门集合
      queryDepRoles({ 'user_id': this.depInfo.cid }).then(response => {
        this.depInfodep.depArr = response.info
        this.depInfodep.restaurants = []
      })
    },
    toview(store, data) {
      event.cancelBubble = true
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
        dance_config_id: '',
        dance_config_arr: [],
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
        this.queryDepRoles()
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
      setTimeout(() => {
        this.fromloading = false
      }, 400)
      return false
    },
    renderContent(h, { node, data, store }) {
      if (data.cid) {
        return (
          <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
            <span>
              <svg-icon class='g6 f14' icon-class='yonghuming' />
              <span class='f12 maroon'>{node.label}</span>
            </span>
            <span style='float: right; margin-right: 20px'>
              <el-button size='mini' on-click={() => this.toview(store, data)}>查看</el-button>
            </span>
          </span>)
      } else {
        let cls = 'g6'
        let flg = 'dn'
        if (data.status) {
          cls = 'g9'
          flg = 'f12 ml5 vm'
        }
        return (
          <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
            <span class={cls}>
              <span>{node.label}</span>
              <el-tag class={flg} type='gray'>已删除</el-tag>
            </span>
            <span style='float: right; margin-right: 20px'>
              <el-button size='mini' on-click={() => this.toview(store, data)}>查看</el-button>
            </span>
          </span>)
      }
    },
    loadDps() { // 获取部门集合
      axios.all([fetchDepartments(''), fetchList({ start_index: 0, length: 10000 })])
        .then(axios.spread((acct, perms) => {
          var data = deepClone(perms.info.list)
          this.restaurants = []
          acct.info.forEach(element => {
            acct.info.forEach(sle => {
              if (element.parent === sle._id) {
                element.parentName = '隶属-' + sle.name
              } else {
                if (!element.parent) {
                  element.parentName = ''
                }
              }
            })
          })
          acct.info.forEach(function(element) {
            if (!element.status) {
              this.restaurants.push(element)
            }
          }, this)
          this.cloneMydepArr(this.restaurants)
          const perpArr = []
          data.forEach(function(element) { // 将用户对象修改成带parent的对象以便和部门对象数组合并
            element.department_roles.forEach(function(cls) {
              const ars = deepClone(element)
              ars.cid = ars['_id']
              delete ars['_id']
              ars.department_id = cls.department_id
              ars.role_id = cls.role_id
              ars.parent = cls.department_id
              perpArr.push(ars)
            }, this)
          }, this)
          const map = { name: 'label', _id: 'id' }
          const list = deepClone(acct.info)
          list.forEach(function(element) { // 保留父元素id，以便查询信息时用到
            for (const key in element) {
              if (key === 'parent') {
                element.parentid = element[key]
              }
            }
          }, this)
          list.push(...perpArr)
          try {
            const tree1 = new TreeUtil(list, '_id', 'parent', map)
            this.depList = tree1.toTree()
          } catch (error) {
            console.log(error)
          }
          this.depArr = this.$store.getters.commonInfo.depArr
        })).catch(() => {
          this.$message({
            message: '获取部门结构失败，请稍后再试',
            type: 'error',
            duration: 4 * 1000
          })
        })
    },
    nodeClick(data, node, store) {
      // console.log(data, node, store)
      this.toview(store, data)
    },
    renderContentP(h, { node, data, store }) {
      return (
        <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
          <span>
            <span >{node.label}</span>
            <span class='f12 maroon ml10'>({data.role_name})</span>
          </span>
        </span>)
    },
    getDepPepArr(id) {
      axios.all([fetchRoles(''), fetchList({ start_index: 0, length: 10000, department_id: id })])
        .then(axios.spread((acct, perms) => {
          var data = perms.info.list
          acct.info.forEach(function(element) { // 赋值职位级别到对象
            data.forEach(function(els) {
              els.department_roles.forEach(function(asf) {
                if (Number(asf.department_id) === id) {
                  if (element['_id'] === Number(asf.role_id)) {
                    els['level'] = element['level']
                  }
                }
              }, this)
            }, this)
          }, this)
          data.sort(sortBy('level'))
          const datacopy = deepClone(data)
          for (let a = 0; a < datacopy.length; a++) {
            datacopy[a]['parent'] = 0
            for (let b = 0; b < data.length; b++) {
              if (datacopy[a]['level'] < data[b]['level']) {
                datacopy[a]['parent'] = data[b]['level']
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
      this.depmentinfo.dance_config_id = this.depmentinfo.dance_config_arr.join(',')
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
    },
    userchangeDep(val) {
      this.depInfodep.department.department_id = val[val.length - 1]
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      const request = {
        start_index: 0,
        length: 10000,
        department_id: val[0]
      }
      this.timeout = setTimeout(() => {
        fetchRoles(request).then(response => {
          this.fetchArr = response.info
        })
      }, 400)
    },
    changeDepRule(id, flg) {
      const request = {
        start_index: 0,
        length: 10000,
        department_id: id || this.depInfodep.department.department_id
      }
      if (request.department_id) {
        const alldepArr = this.$store.getters.commonInfo.alldepArr
        const arr = alldepArr.filter(obj => {
          return obj._id === request.department_id
        })
        if (arr.length) {
          request.department_id = findParentTop(alldepArr, arr[0])
        }
      }
      fetchRoles(request).then(response => {
        this.fetchArr = response.info
        if (id === false && !flg) {
          this.depInfodep.department.role_id = ''
        }
      })
    }
  },
  created() {
    this.changeDepRule()
    this.loadDps()
    this.getadcArray()
  }
}
</script>
<style lang="scss" scoped>

.el-tree {
  border-color: transparent;
}

.lr-ct {
  position: relative;
  min-height: 100%;
  .left-side {
    position: absolute;
    top: 72px;
    left: 0px;
    width: 400px;
    // border-right: 1px solid #dbdbdb;
    max-height: 720px;
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
