<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" ref="postForm">
      <sticky :className="'sub-navbar '">
          <div style="display:inline-block">
              <router-link style="margin-right:15px;" v-show='isEdit' :to="{ path:'/event/editeventstep/:id'}">
                <el-button type="info">创建form</el-button>
              </router-link>
          </div>
          <el-button v-loading="loading" style="margin-left: 10px;" type="primary" @click="submitForm()">保存
          </el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <el-form-item style="margin-bottom: 40px;">
              <MDinput name="name" v-model="postForm.name" required :maxlength="100">
                步骤名称
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label-width="65px" label="部门:" prop="department_id" class="postInfo-container-item">
              <el-select clearable class="filter-item" style="width: 130px" filterable @change="changeDepRule" v-model="postForm.department_id" placeholder="请选择">
                <el-option v-for="item in  depArr" :key="item._id" :title="item.parentName" :label="item.name" :value="item._id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label-width="85px" label="法律法规:" prop="department_id" class="postInfo-container-item">
              <el-cascader :options="myLawArr" @change="handleItemChange2" filterable change-on-select></el-cascader>
              <!-- <el-select clearable class="filter-item" style="width: 130px" filterable v-model="cur_lawArr" placeholder="请选择">
                <el-option v-for="item in  lawArr" :key="item._id" :label="item.name" :value="item.name">
                </el-option>
              </el-select> -->
              <el-button @click.prevent="insertRole_html()">插入</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="postInfo-container">
          <el-row>
            <el-col :span="11">
              <el-form-item label-width="65px" v-for="(para, index) in postForm.para_list" :label="'参数' + (index)" :key="index"  >
                <el-select style="width: 120px"  v-model="para.para_type"  placeholder="请选择">
                  <el-option v-for="item in  paraTypeArr" :key="item._id" :label="item.name" :value="item._id">
                  </el-option>
                </el-select>
                <el-select style="width: 130px" v-if="para.para_type === '6'"  v-model="para.para_name"  placeholder="请选择">
                  <el-option v-for="item in  lawArr" :key="item._id" :label="item.name" :value="item.content">
                  </el-option>
                </el-select>
                <el-input style="width: 130px" v-else placeholder="参数名" v-model="para.para_name"></el-input>
                <el-button v-if="index === 0" @click="addPare">新增</el-button>
                <el-button v-show="index !== 0" @click.prevent="removePare(para)">删除</el-button>
                <!-- 文件只做上传不做插入 -->
                <el-button v-if="para.para_type != '4'" @click.prevent="insertContent(para)">插入</el-button>
              </el-form-item>
              <p class="f12 g9">提示：
              1.参数类型指的是用户以何种方式填写事件原由，插入参数后，不可直接在富文本框里面对参数进行修改.<br>
              2.默认添加的表格无边框，添加边框需设置表格边框值</p>
            </el-col>
            <el-col :span="11">
              <el-form-item label-width="80px" v-for="(role, index) in postForm.roleArr" :label="'审核'+ (index)" :key="role._id">
                <el-select  v-model="role._id"  placeholder="请选择">
                  <el-option v-for="item in  fetchArr" :key="item._id" :label="item.name" :value="item._id">
                  </el-option>
                </el-select>
                <el-button v-if="index === 0" @click="addRole">新增</el-button>
                <el-button v-show="index !== 0" @click.prevent="removeRole(role)">删除</el-button>
                <el-button @click.prevent="insertRole(role._id)">插入</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div>
          <tinymce id="tinymce" :height='500' v-model="postForm.content"></tinymce>
        </div>
        <!-- <div class='editor-content' v-html='postForm.content'></div> -->
      </div>
    </el-form>
  </div>
</template>


<script>
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky' // 粘性header组件
import MDinput from '@/components/MDinput'
import { fetchRoles } from '@/api/department'
import { findParentTop } from '@/utils/index'
import { getSteps, addSteps, updateSteps, getLawsArr } from '@/api/depevent'
import { deepClone, TreeUtil, removeTreeArr } from '@/utils/index'
const paraTypeArr = [
  { _id: '0', name: '文本控件' },
  { _id: '1', name: '多行文本控件' },
  { _id: '2', name: '时间控件' },
  { _id: '3', name: '图片控件（多图上传）' },
  // { _id: '4', name: '文件控件（视频，语音均是文件，只做上传）' },
  { _id: '5', name: '人员选择控件（当前人员所在部门下）' },
  // { _id: '6', name: '法律法规选择控件' },
  { _id: '7', name: '地址选择控件' }
]
export default {
  components: { Tinymce, Sticky, MDinput },
  data() {
    return {
      loading: false,
      isEdit: false,
      content: '请输入内容~',
      paraTypeArr: paraTypeArr,
      fistr: true,
      postForm: {
        department_id: '',
        name: '',
        content: '请输入内容~',
        para_list: [
          {
            para_name: '',
            para_type: '0'
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
      depArr: [],
      fetchArr: [],
      lawArr: [],
      myLawArr: [],
      props: { value: 'value', children: 'children' },
      cur_lawArr: ''
    }
  },
  computed: {
    // 计算属性的 getter
    reversedMessage() {
      // `this` 指向 vm 实例
      // const str = 'para'
      // const reg = new RegExp('<span style="color: red;" data-mce-style="color: red;">{{' + str + '}}</span>', 'g')
      // return this.content.replace(reg, 'jb51.net')
    }
  },
  created() {
    const stepid = this.$store.getters.stepid
    if (stepid) {
      this.getSteps(stepid)
    }
    this.init()
  },
  methods: {
    insertRole(id) {
      const strHtml = `{{${id}}}`
      window.tinymce.get('tinymce').insertContent(strHtml)
    },
    insertRole_html() {
      window.tinymce.get('tinymce').insertContent(this.cur_lawArr)
    },
    insertContent(para) {
      const str = para.para_name
      if (!str) {
        return
      }
      let strHtml = ''
      if (para.para_type === '6') {
        strHtml = `${str}`
      } else {
        strHtml = `{{${str}}}`
      }
      window.tinymce.get('tinymce').insertContent(strHtml)
    },
    getSteps(id) {
      getSteps({ _id: id }).then(response => {
        this.isEdit = true
        this.postForm = Object.assign(this.postForm, response.info)
        const arr = this.postForm.role_id_access.split(',')
        this.postForm.roleArr = []
        arr.forEach(function(element) {
          this.postForm.roleArr.push({
            _id: Number(element)
          })
        }, this)
        // console.log(this.postForm)
        this.changeDepRule()
      })
    },
    removePare(item) { // 移除参数
      if (item.para_name) {
        let reg = null
        if (item.para_type === '6') {
          reg = new RegExp(item.para_name, 'g')
        } else {
          reg = new RegExp('\\{\\{' + item.para_name + '\\}\\}', 'g')
        }
        this.postForm.content = this.postForm.content.replace(reg, '')
        window.tinymce.get('tinymce').setContent(this.postForm.content)
      }
      var index = this.postForm.para_list.indexOf(item)
      if (index !== -1) {
        this.postForm.para_list.splice(index, 1)
      }
    },
    addPare() { // 添加参数
      this.postForm.para_list.push({
        para_name: '',
        para_type: '0'
      })
    },
    removeRole(item) { // 移除审核人
      if (item._id) {
        const reg = new RegExp('\\{\\{' + item._id + '\\}\\}', 'g')
        this.postForm.content = this.postForm.content.replace(reg, '')
        window.tinymce.get('tinymce').setContent(this.postForm.content)
      }
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
    s_up(model, val, index, callback) {
      model.forEach(item_f => {
        if (item_f.value === val[index]) {
          index++
          if (val.length > index) {
            this.s_up(item_f.children, val, index, callback)
          } else {
            callback(item_f)
          }
        }
      })
    },
    handleItemChange2(val) {
      this.cur_lawArr = ''
      val.forEach(element => { // 读取章节目录以及最后选中内容
        this.lawArr.forEach(item_f => {
          if (element === item_f._id) {
            this.cur_lawArr += item_f.name + ' '
            if (item_f.content && item_f._id === val[val.length - 1]) {
              this.cur_lawArr = this.cur_lawArr + ' ' + item_f.content
            }
            return false
          }
        })
      })
    },
    handleItemChange(val) {
      var _self = this
      setTimeout(_ => {
        this.s_up(this.myLawArr, val, 0, function(item, _id) {
          item.children = []
          _self.lawArr.forEach(item_f => {
            if (item_f.regu_id === item.value) {
              var xxitem = {
                label: item_f.name,
                value: item_f._id
              }
              _self.lawArr.forEach(item_f => {
                if (item_f.regu_id === item_f._id) {
                  xxitem.children = []
                  return false
                }
              })
              item.children.push(xxitem)
            }
          })
          console.log(item)
        })
      }, 300)
    },
    changeDepRule(id, flg) { // 根据部门查询职务
      const request = {
        start_index: 0,
        length: 10000,
        department_id: id || this.postForm.department_id
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
        if (this.fistr) {
          this.fistr = false
        } else {
          this.postForm.roleArr.forEach(obj => {
            obj._id = ''
          })
        }
        this.fetchArr = response.info
        console.log(response.info)
        // if (id === false && !flg) {
        //   this.postForm.role_id_access = ''
        // }
      })
    },
    submitForm() {
      const errAlet = (msg) => {
        this.$message({
          message: msg,
          type: 'error',
          duration: 4 * 1000
        })
      }
      if (!this.postForm.name) {
        errAlet('请填写步骤名称~')
        return
      }
      if (!this.postForm.department_id) {
        errAlet('请选择部门~')
        return
      }
      if (!this.postForm.content) {
        errAlet('请输入模板内容~')
        return
      }
      var paraflg = true
      this.postForm.para_list.forEach(function(element) {
        if (!element.para_name) {
          paraflg = false
        }
      }, this)
      if (!paraflg) {
        errAlet('请填写完参数名~')
        return
      }
      this.postForm.para = JSON.stringify(this.postForm.para_list)
      var roleflg = true
      this.postForm.roleArr.forEach(function(element) {
        if (!element._id) {
          roleflg = false
        }
      }, this)
      if (!roleflg) {
        errAlet('请选择完审核人~')
        return
      }
      const copeArr = []
      this.postForm.roleArr.forEach(function(element) {
        copeArr.push(element._id)
      }, this)
      this.postForm.role_id_access = copeArr.join(',')
      this.$confirm('确认进行此操作？').then(() => {
        if (this.isEdit) {
          updateSteps(this.postForm).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 4 * 1000
            })
            this.$router.push({ path: '/event/eventstep' })
          }).catch(() => {
            this.$message({
              message: '修改失败，请稍后再试',
              type: 'error',
              duration: 4 * 1000
            })
          })
        } else {
          addSteps(this.postForm).then(response => {
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 4 * 1000
            })
            this.$router.push({ path: '/event/eventstep' })
          }).catch(() => {
            this.$message({
              message: '添加失败，请稍后再试',
              type: 'error',
              duration: 4 * 1000
            })
          })
        }
      }).catch(() => { console.log('取消修改') })
    },
    init() { // 初始化
      this.depArr = this.$store.getters.commonInfo.depArr
      getLawsArr({ department_id: '' }).then(response => {
        this.lawArr = response.info
        const array = deepClone(response.info)
        // this.depArr = array
        const map = { name: 'label', _id: 'value' }
        array.forEach(element => {
          element.parent = element.regu_id
        })
        try {
          const tree1 = new TreeUtil(array, '_id', 'parent', map)
          const myLawArr = tree1.toTree()
          removeTreeArr(myLawArr)
          this.myLawArr = myLawArr
          console.log(this.myLawArr)
        } catch (error) {
          console.log(error)
        }
        response.info.forEach(item => {
          if (item.regu_id === 0) {
            // this.myLawArr.push({
            //   label: item.name,
            //   value: item._id,
            //   children: []
            // })
            // var xxxitem = { label: item.name, value: item._id }
            // this.lawArr.forEach(item_x => {
            //   if (item_x.regu_id === item._id) {
            //     xxxitem.children = []
            //     return false
            //   }
            // })
            // this.myLawArr.push(xxxitem)
          }
        })
      })
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


