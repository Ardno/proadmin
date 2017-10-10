<template>
  <div class="app-container">
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-tree :data="data2" :props="defaultProps" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false" :render-content="renderContent">
          </el-tree>
          <el-button type="primary" @click="dialogFormVisible = true">添加部门</el-button>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple-light"></div>
      </el-col>
    </el-row>
    <el-dialog title="添加部门"  :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="depmentinfo" :rules="infoRules" ref="infoForm" label-position="left" label-width="80px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="上级部门">
          <el-select class="filter-item" v-model="depmentinfo.parent" placeholder="请选择">
            <el-option v-for="item in  restaurants" :key="item._id" :label="item.value" :value="item._id">
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
let id = 1000
export default {
  data() {
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
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
      },
      data2: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
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
    handleCreate() {

    }
  },
  computed: {
  }
}
</script>
<style lang="css">

</style>
