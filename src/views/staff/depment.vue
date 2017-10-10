<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-tree :data="depList" :props="defaultProps" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false" :render-content="renderContent">
          </el-tree>
          <el-button type="primary" @click="dialogFormVisible = true">添加部门</el-button>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
    </el-row>
    <el-dialog title="添加部门"  :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="depmentinfo" :rules="infoRules" ref="infoForm" label-position="right" label-width="80px" style='width: 400px; margin-left:50px;'>
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
  </div>
</template>

<script>
import { fetchDepartments, createDep, updateDep } from '@/api/department'
import { treeUtil, deepClone } from '@/utils/index'
let id = 1000
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
    return {
      dialogFormVisible: false,
      depmentinfo: {
        parent: '',
        name: '',
        info: '',
        infoLink: ''
      },
      restaurants: [],
      infoRules: {
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur', validator: validateUsername }]
      },
      depList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    append(store, data) {
      store.append({ id: id++, label: 'testtest', children: [] }, data)
    },
    remove(store, data) {
      store.remove(data)
    },
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span>
            <span>{node.label}</span>
          </span>
          <span style='float: right; margin-right: 20px'>
            <el-button size='mini' on-click={ () => this.append(store, data) }>Append</el-button>
            <el-button size='mini' on-click={ () => this.remove(store, data) }>Delete</el-button>
          </span>
        </span>)
    },
    loadDps() { // 获取部门集合
      fetchDepartments('').then(response => {
        this.restaurants = response.info
        const map = { name: 'label', _id: 'id' }
        const list = deepClone(response.info)
        const tree1 = new treeUtil(list, '_id', 'parent', map)
        this.depList = tree1.toTree()
      })
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
  }
}
</script>
<style lang="css">

</style>
