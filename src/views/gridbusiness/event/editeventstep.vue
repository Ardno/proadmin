<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <sticky :className="'sub-navbar '">
          <div style="display:inline-block">
              <router-link style="margin-right:15px;" v-show='isEdit' :to="{ path:'editeventstep'}">
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
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="65px" label="部门:" prop="department_id" class="postInfo-container-item">
                    <el-select clearable class="filter-item" style="width: 130px" filterable v-model="postForm.department_id" placeholder="请选择">
                      <el-option v-for="item in  depArr" :key="item._id" :label="item.name" :value="item._id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-tooltip class="item" effect="dark" content="部门审核人" placement="top">
                    <el-form-item label-width="80px" label="审核人:" prop="role_id_access" class="postInfo-container-item">
                      <el-select  v-model="postForm.role_id_access"  multiple placeholder="请选择">
                        <el-option v-for="item in  fetchArr" :key="item._id" :label="item.name" :value="item._id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-form-item label-width="65px" v-for="(para, index) in postForm.para" :label="'参数' + (index)" :key="para.para_type"  :prop="'para.' + index + '.para_name'"
    :rules="{
      required: true, message: '参数不能为空', trigger: 'blur'
    }">
          <el-input style="width: 130px" v-model="para.para_name"></el-input>
          <el-button v-if="index === 0" @click="addPare">新增</el-button>
          <el-button v-show="index !== 0" @click.prevent="removePare(para)">删除</el-button>
          <el-button @click.prevent="removePare(para)">插入</el-button>
        </el-form-item>
        <div>
          <tinymce :height='500' v-model="content"></tinymce>
        </div>
        <div class='editor-content' v-html='content'></div>
      </div>
    </el-form>
    {{ this.$route.query.id }}
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky' // 粘性header组件
import MDinput from '@/components/MDinput'
import { fetchDepartments, fetchRoles } from '@/api/department'

export default {
  components: { Tinymce, Sticky, MDinput },
  data() {
    return {
      loading: false,
      isEdit: true,
      content: '请输入内容~',
      postForm: {
        department_id: '',
        name: '',
        content: '',
        para: [
          {
            para_name: '摊主姓名',
            para_type: 1
          }
        ],
        role_id_access: []
      },
      rules: {
        department_id: [{ required: true, trigger: 'blur', message: '请选择部门' }],
        name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
        content: [{ required: true, trigger: 'blur', message: '请填写内容' }],
        role_id_access: [{ required: true, trigger: 'blur', message: '请选择审核人' }]
      },
      depArr: [],
      fetchArr: []
    }
  },
  created() {
    console.log(this.$route.params.id)
    this.init()
  },
  methods: {
    insertContent(str) {
      const _this = this
      console.log()
      window.tinymce.get(_this.tinymceId).insertContent(str)
    },
    removePare(item) { // 移除参数
      var index = this.postForm.para.indexOf(item)
      if (index !== -1) {
        this.postForm.para.splice(index, 1)
      }
    },
    addPare() { // 添加参数
      this.postForm.para.push({
        para_name: '',
        para_type: this.postForm.para.length + 1
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
        if (id === false && !flg) {
          this.postForm.role_id_access = []
        }
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


