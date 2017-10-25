<template>
  <div class="app-container">
    <div class="wrapper">
        <div class="pestwar">
          <i class="el-icon-edit r white poi" @click="dialogFormVisible = true"></i>
          <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="9">
            <div class="tc pt20">
             <img :src="avatar ? 'http://gridmap-file.xiaoketech.com/images/user/'+temp._id+'.png':avatarm">
            </div>
          </el-col>
          <el-col :span="15">
            <ul>
             <li>
               <h3>部门 </h3>
               <p> 
                 <span v-for=" (item,index) in temp.department_roles" :key="item._id">
                 <span v-if="index>0">,</span>{{item.deptname}} 
                 </span> 
                </p>
             </li>
             <li>
               <h3>姓名</h3>
               <p>{{temp.name}}</p>
             </li>
             <li>
               <h3>性别</h3>
               <p>{{temp.sex?'女':'男'}}</p>
             </li>
             <li>
               <h3>手机号</h3>
               <p>{{temp.mobile}}</p>
             </li>
           </ul>
          </el-col>
        </el-row>  
        </div>
    </div>
    <el-dialog title="修改信息"  :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="temp" :rules="infoRules" ref="infoForm" label-position="left"  label-width="80px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio class="radio" v-model="temp.sex" :label="0">男</el-radio>
          <el-radio class="radio" v-model="temp.sex" :label="1">女</el-radio>
        </el-form-item>
        <el-form-item label="民族" prop="nation">
          <el-input v-model="temp.nation"></el-input>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker v-model="temp.birthday" type="date" :editable="false" :clearable="false" @change="formatDate"  placeholder="出生日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNum">
          <el-input v-model="temp.idNum"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="temp.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { updatePeInfo } from '@/api/department'
import avatarm from '@/assets/login_images/avatar.png'
import { validateMblNo, validateIdNum } from '@/utils/validate'

export default {
  data() {
    const validateUserIdNum = (rule, value, callback) => {
      if (!validateIdNum(value)) {
        callback(new Error('请输入正确的身份证号码'))
      } else {
        callback()
      }
    }
    const validateUsername = (rule, value, callback) => {
      if (!validateMblNo(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      avatarm,
      dialogFormVisible: false,
      infoRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        nation: [{ required: true, trigger: 'blur', message: '请输入民族' }],
        idNum: [{ required: true, trigger: 'blur', validator: validateUserIdNum }],
        mobile: [{ required: true, trigger: 'blur', validator: validateUsername }]
      }
    }
  },
  methods: {
    handleUpdate() { // 修改人员信息
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.$confirm('确认修改？').then(() => {
            this.temp.birthday = Math.round(new Date(this.temp.birthday).getTime() / 1000)
            updatePeInfo(this.temp).then(response => {
              this.dialogFormVisible = false
              this.$message({
                message: '信息修改成功！',
                type: 'success',
                duration: 4 * 1000
              })
              this.temp.birthday = this.temp.birthday * 1000
            }).catch(() => {
              this.$message({
                message: '修改信息失败，请稍后再试',
                type: 'error',
                duration: 4 * 1000
              })
              this.temp.birthday = this.temp.birthday * 1000
            })
          }).catch(() => { console.log('取消修改') })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    formatDate(te) {
      // this.temp.birthday = new Date(te).getTime()
    }
  },
  computed: {
    ...mapGetters({
      temp: 'useinfo',
      avatar: 'avatar'
    })
  }
}
</script>
<style lang="scss" scoped>
  html,body,#app,.main-container,.app-container{
    height: 100%;
  }
  .app-main{
    min-height: auto !important;
    height: calc(100% - 50px);
  }
  .wrapper{
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../../assets/images/atlas_book-wallpaper-1920x1080.jpg) no-repeat center;
    background-size: cover;
    &:after{
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,.2)
    }
    .pestwar{
      position: absolute;
      top: 50%;
      left:50%;
      width: 500px;
      padding:30px 20px;
      background-color: rgba(255,255,255,.2);
      transform: translate(-50%,-50%);
      ul{
        padding:0;
      }
      li{
        width: 200px;
        list-style: none;
        h3{
          color: #fff;
          font-size: 15px;
          margin-top: 10px;
          font-weight: normal;
        }
        p{
          font-size: 13px;
          color: rgba(255,255,255,.6);
          padding: 10px 0;
          border-bottom: 1px dashed rgba(255,255,255,.6);
        }
      }
    }
  }
</style>
