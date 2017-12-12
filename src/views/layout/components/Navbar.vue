<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
      <breadcrumb class="breadcrumb-container"></breadcrumb>
      <div class="right-menu">
        <error-log v-if="log.length>0" class="errLog-container right-menu-item" :logsList="log"></error-log>
        <el-tooltip effect="dark" content="全屏" placement="bottom">
          <screenfull class="screenfull right-menu-item"></screenfull>
        </el-tooltip>
        <el-badge :value="msgcount" class="rsms right-menu-item">
          <router-link class='inlineBlock' to="/msg">
            <svg-icon class="" icon-class="remind" />
          </router-link>
        </el-badge>
        <!-- <el-tooltip effect="dark" content="换肤" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"></theme-picker>
        </el-tooltip> -->
        <el-dropdown class="avatar-container right-menu-item" @command="handleCommand">
          <div class="avatar-wrapper">
            <img class="user-avatar" :src="'http://gridmap-file.xiaoketech.com/images/user/'+avatar+'.png'" :onerror="defaultImg">
            <span class="dib vt">{{temp.name}}
              <i class="el-icon-caret-bottom"></i>
            </span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a" >
              首页
            </el-dropdown-item>
            <el-dropdown-item command="b"  >个人信息</el-dropdown-item>
            <el-dropdown-item command="c" >修改密码</el-dropdown-item>
            <el-dropdown-item command="d"  divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
		</el-menu>
		<!-- 修改个人信息 -->
		<el-dialog title="个人信息"  @close="closeCall" :visible.sync="dialogInfo">
			<el-form class="small-space" :model="temp" :rules="infoRules" ref="infoForm" label-position="right"  label-width="80px" style='width: 400px; margin-left:50px;'>
			<el-form-item label="姓名" prop="name">
        <span>{{temp.name}}</span>
        <!-- <el-input v-model="temp.name"></el-input> -->
			</el-form-item>
			<el-form-item label="性别">
        <span>{{temp.sex? '女':'男'}}</span>
        <!-- <el-radio class="radio" v-model="temp.sex" :label="0">男</el-radio>
        <el-radio class="radio" v-model="temp.sex" :label="1">女</el-radio> -->
			</el-form-item>
			<el-form-item label="民族" prop="nation">
        <span>{{temp.nation}}</span>
				<!-- <el-input v-model="temp.nation"></el-input> -->
			</el-form-item>
			<el-form-item label="出生日期">
        <span>{{temp.birthday | parseTime('{y}-{m}-{d}')}}</span>
        <!-- <el-date-picker v-model="temp.birthday" type="date" :editable="false" :clearable="false"   placeholder="出生日期">
        </el-date-picker> -->
			</el-form-item>
			<el-form-item label="身份证号" prop="idNum">
        <span>{{temp.idNum}}</span>
				<!-- <el-input v-model="temp.idNum"></el-input> -->
			</el-form-item>
			<el-form-item label="手机号码" prop="mobile">
        <span>{{temp.mobile}}</span>
        <!-- <el-input v-model="temp.mobile"></el-input> -->
			</el-form-item>
			</el-form>
			<!-- <div slot="footer" class="dialog-footer">
			<el-button @click="dialogInfo = false">取 消</el-button>
			<el-button type="primary" @click="handleUpdate">确 定</el-button>
			</div> -->
    </el-dialog>
    <!-- 修改个人密码 -->
    <el-dialog title="修改密码" :visible.sync="dialogPwdInfo">
			<el-form class="small-space" :model="pwdRequst" :rules="pwdRules" ref="pwdForm" label-position="right"  label-width="80px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="旧密码" prop="pwd">
            <el-input type="password" v-model="pwdRequst.pwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
            <el-input type="password" v-model="pwdRequst.newPwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="comPwd">
            <el-input type="password" v-model="pwdRequst.comPwd"></el-input>
        </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			<el-button @click="dialogPwdInfo = false">取 消</el-button>
			<el-button type="primary" @click="handlePwdUpdate">确 定</el-button>
			</div>
    </el-dialog>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ThemePicker from '@/components/ThemePicker'
import Screenfull from '@/components/Screenfull'
import ErrorLog from '@/components/ErrLog'
import errLogStore from 'store/errLog'
import { getSmsList } from '@/api/message'
import { updatePeInfo } from '@/api/department'
import { validateMblNo, validateIdNum } from '@/utils/validate'
import { md5 } from '@/utils/md5'
import avatar from '@/assets/login_images/avatar.png'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ThemePicker,
    ErrorLog,
    Screenfull
  },
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
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入6位密码'))
      } else {
        callback()
      }
    }
    return {
      dialogInfo: false,
      dialogPwdInfo: false,
      pwdRequst: {
        pwd: '',
        newPwd: '',
        comPwd: ''
      },
      count: 0,
      log: errLogStore.state.errLog,
      defaultImg: 'this.onerror=null;this.src="' + avatar + '"',
      infoRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        nation: [{ required: true, trigger: 'blur', message: '请输入民族' }],
        idNum: [{ required: true, trigger: 'blur', validator: validateUserIdNum }],
        mobile: [{ required: true, trigger: 'blur', validator: validateUsername }]
      },
      pwdRules: {
        pwd: [{ required: true, trigger: 'blur', validator: validatePassword }],
        newPwd: [{ required: true, trigger: 'blur', validator: validatePassword }],
        comPwd: [{ required: true, trigger: 'blur', validator: validatePassword }]
      }
    }
  },
  created() {
    this.getSmsList()
  },
  computed: {
    ...mapGetters({
      temp: 'useinfo',
      avatar: 'avatar',
      userpassword: 'password',
      sidebar: 'sidebar',
      name: 'name',
      msgcount: 'msgcount'
    })
  },
  methods: {
    handleCommand(command) {
      if (command === 'a') {
        this.$router.push({ path: '/index' })
      } else if (command === 'b') {
        this.dialogInfo = true
      } else if (command === 'c') {
        this.handlePwd(this.temp)
      } else if (command === 'd') {
        this.logout()
      }
    },
    closeCall() {
      this.$refs.infoForm.resetFields()
    },
    getSmsList() {
      getSmsList({ start_index: 0, length: 10000 }).then((res) => {
        const arr = []
        res.info.list.forEach(function(element) {
          if (!element.isread) {
            arr.push(element)
          }
        }, this)
        this.$store.dispatch('SetMsgCount', arr.length)
      })
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload()// 为了重新实例化vue-router对象 避免bug
      })
    },
    handleUpdate() { // 修改人员信息
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.$confirm('确认修改？').then(() => {
            this.temp.birthday = Math.round(new Date(this.temp.birthday).getTime() / 1000)
            updatePeInfo(this.temp).then(response => {
              this.dialogInfo = false
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
    handlePwd() { // 修改密码
      this.pwdRequst = {
        pwd: '',
        newPwd: '',
        comPwd: ''
      }
      this.dialogPwdInfo = true
    },
    handlePwdUpdate(item) { // 修改密码
      this.$refs.pwdForm.validate(valid => {
        if (valid) {
          if (this.pwdRequst.newPwd === this.pwdRequst.comPwd) {
            if (this.userpassword === md5(this.pwdRequst.pwd)) {
              updatePeInfo({ _id: this.temp['_id'], pwd: this.pwdRequst.pwd }).then(response => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 4 * 1000
                })
                this.$store.dispatch('SET_PASSWORD', md5(this.pwdRequst.pwd))
                this.dialogPwdInfo = false
              }).catch(() => {
                this.$message({
                  message: '修改密码失败，请稍后再试',
                  type: 'error',
                  duration: 4 * 1000
                })
              })
            } else {
              this.$message.error('原密码输入错误')
            }
          } else {
            this.$message.error('两次密码输入不一致')
          }
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
      .international-icon{
        font-size: 20px;
        cursor: pointer;
        vertical-align: -5px;
      }
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .rsms{
    color: #666;
    font-size: 28px;
    line-height: 1;
    cursor: pointer;
    vertical-align: 8px;
  }
}

</style>



