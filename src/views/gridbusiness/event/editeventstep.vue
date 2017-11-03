<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky :className="'sub-navbar '">
          <div style="display:inline-block">
              <router-link style="margin-right:15px;" v-show='isEdit' :to="{ path:'/event/editeventstep/:id'}">
                <el-button type="info">创建form</el-button>
              </router-link>
          </div>
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">发布
          </el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <el-form-item style="margin-bottom: 40px;" prop="name">
              <MDinput name="name" v-model="postForm.name" required :maxlength="100">
                步骤名称
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label-width="65px" label="部门:" prop="department_id" class="postInfo-container-item">
          <el-select clearable class="filter-item" style="width: 130px" filterable @change="changeDepRule" v-model="postForm.department_id" placeholder="请选择">
            <el-option v-for="item in  depArr" :key="item._id" :label="item.name" :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="postInfo-container">
          <el-row>
            <el-col :span="11">
              <el-form-item label-width="65px" v-for="(para, index) in postForm.para_list" :label="'参数' + (index)" :key="para.para_type"  >
                <el-select style="width: 120px"  v-model="para.para_type"  placeholder="请选择">
                  <el-option v-for="item in  fetchArr" :key="item._id" :label="item.name" :value="item._id">
                  </el-option>
                </el-select>
                <el-input style="width: 130px" v-model="para.para_name"></el-input>
                <el-button v-if="index === 0" @click="addPare">新增</el-button>
                <el-button v-show="index !== 0" @click.prevent="removePare(para)">删除</el-button>
                <el-button @click.prevent="insertContent('para')">插入</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label-width="80px" v-for="(role, index) in postForm.roleArr" :label="'审核'+ (index)" :key="role._id">
                <el-select  v-model="role._id"  placeholder="请选择">
                  <el-option v-for="item in  fetchArr" :key="item._id" :label="item.name" :value="item._id">
                  </el-option>
                </el-select>
                <el-button v-if="index === 0" @click="addRole">新增</el-button>
                <el-button v-show="index !== 0" @click.prevent="removeRole(role)">删除</el-button>
                <el-button @click.prevent="insertContent('Role')">插入</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div>
          <tinymce id="tinymce" :height='500' v-model="content"></tinymce>
        </div>
        <div class='editor-content' v-html='content'></div>
      </div>
    </el-form>
  </div>
</template>


<script>
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky' // 粘性header组件
import MDinput from '@/components/MDinput'
import { fetchDepartments, fetchRoles } from '@/api/department'
import { getSteps } from '@/api/depevent'
export default {
  components: { Tinymce, Sticky, MDinput },
  data() {
    return {
      loading: false,
      isEdit: false,
      content: '请输入内容~',
      postForm: {
        department_id: '',
        name: '',
        content: '',
        para_list: [
          {
            para_name: '',
            para_type: 1
          }
        ],
        para: '',
        roleArr: [
          {
            _id: ''
          }
        ],
        role_id_access: ''
      },
      rules: {
        department_id: [{ type: 'number', required: true, trigger: 'change', message: '请选择部门' }],
        name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
        content: [{ required: true, trigger: 'blur', message: '请填写内容' }]
      },
      depArr: [],
      fetchArr: []
    }
  },
  computed: {
    // 计算属性的 getter
    reversedMessage() {
      // `this` 指向 vm 实例
      const str = 'para'
      const reg = new RegExp('<span style="color: red;" data-mce-style="color: red;">{{' + str + '}}</span>', 'g')
      return this.content.replace(reg, 'jb51.net')
    }
  },
  created() {
    console.log(this.$route.params.id)
    if (this.$route.params.id !== ':id') {
      this.getSteps(this.$route.params.id)
    }
    this.init()
  },
  methods: {
    insertContent(str) {
      const strHtml = `<span style="color:red;">{{${str}}}</span>`
      window.tinymce.get('tinymce').insertContent(strHtml)
    },
    getSteps(id) {
      getSteps({ _id: id }).then(response => {
        this.isEdit = true
        this.postForm = Object.assign(this.postForm, response.info)
      })
    },
    removePare(item) { // 移除参数
      var index = this.postForm.para_list.indexOf(item)
      if (index !== -1) {
        this.postForm.para_list.splice(index, 1)
      }
    },
    addPare() { // 添加参数
      this.postForm.para_list.push({
        para_name: '',
        para_type: this.postForm.para_list.length + 1
      })
    },
    removeRole(item) { // 移除审核人
      var index = this.postForm.roleArr.indexOf(item)
      if (index !== -1) {
        this.postForm.roleArr.splice(index, 1)
      }
    },
    addRole() { // 添加审核人
      this.postForm.roleArr.push({
        _id: ''
      })
    },
    changeDepRule(id, flg) { // 根据部门查询职务
      const request = {
        start_index: 0,
        length: 10000,
        department_id: id || this.postForm.department_id
      }
      fetchRoles(request).then(response => {
        this.fetchArr = response.info
        // if (id === false && !flg) {
        //   this.postForm.role_id_access = ''
        // }
      })
    },
    submitForm() {

    },
    init() { // 初始化
      fetchDepartments('').then(response => {
        this.depArr = response.info
      })
      this.changeDepRule()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    font-size: 12px;
    top:10px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
            text-align: right;
            margin-right: 10px;
            .editor-upload-btn {
                display: inline-block;
            }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>


