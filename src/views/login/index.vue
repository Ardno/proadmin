<template>
  <div class="login-container">
    <el-form class="card-box login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <h3 class="title">崖州网格系统</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="手机号" />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码" />
        <span class='show-pwd' @click='showPwd'>
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>

      <el-button class="tips" type="text" @click.native.prevent="handleQrcode">手机扫码登录</el-button>
      <!-- <el-button class='thirdparty-button' type="primary" @click='showDialog=true'>打开第三方登录</el-button> -->
    </el-form>
    <transition name="fade">
      <div class="login-code" v-if="show">
        <div class="login-box">
          <div v-if="needRresh" class="refresh_qrcode_mask">
            <i class="icon-refresh" @click="handleQrcode"></i>
          </div>
          <img class="img" :src="loginForm.qr_code" alt="二维码">
          <p v-if="!needRresh" class="sub_title">使用手机App扫码登录</p>
          <p v-if="needRresh" class="sub_title">二维码失效，点击刷新</p>
          <el-button class="tips" type="text" @click="closeQrcode">返回</el-button>
        </div>
      </div>
    </transition>
    <!-- <el-dialog title="第三方验证" :visible.sync="showDialog">
          本地不能模拟，请结合自己业务进行模拟！！！<br/><br/><br/>
          邮箱登录成功,请选择第三方验证<br/>
          <social-sign />
        </el-dialog> -->

  </div>
</template>

<script>
import { validateMblNo } from '@/utils/validate'
import { uuid } from '@/utils/index'

export default {
  name: 'login',
  data() {
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
      loginForm: {
        username: '18335410223',
        password: '123456',
        qr_code: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      pwdType: 'password',
      loading: false,
      show: false,
      timeout: null,
      needRresh: false
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleQrcode() { // 获取手机登录二维码
      const key = uuid(32, 16)
      this.loginForm.qr_code = 'http://qr.topscan.com/api.php?text=' + key
      this.show = true
      this.needRresh = false
      this.timeout = setInterval(() => {
        this.$store.dispatch('qrLogin', key).then(() => {
          clearInterval(this.timeout)
          this.timeout = null
          this.$router.push({ path: '/' })
        }).catch(() => {

        })
      }, 2000)
      setTimeout(() => { // 二维码3分钟失效
        if (this.timeout) {
          this.needRresh = true
          clearInterval(this.timeout)
        }
      }, 180000)
    },
    closeQrcode() {
      this.show = false
      clearInterval(this.timeout)
      this.timeout = null
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  @include relative;
  height: 100vh;
  background-color: $bg;
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
    -webkit-text-fill-color: #fff !important;
  }
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: $light_gray;
    height: 47px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .tips {
    float: right;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
  .login-code {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: url(~assets/login_images/2zrdI1g.jpg) no-repeat 50%;
    background-size: cover;
    .login-box {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -190px;
      margin-top: -220px;
      border-radius: 4px;
      -moz-border-radius: 4px;
      -webkit-border-radius: 4px;
      background-color: #fff;
      width: 380px;
      height: 440px;
      padding: 20px;
      box-shadow: 0 2px 10px #999;
      -moz-box-shadow: #999 0 2px 10px;
      -webkit-box-shadow: #999 0 2px 10px;
      .img {
        display: block;
        width: 270px;
        height: 270px;
        margin: 22px auto 12px;
      }
      .refresh_qrcode_mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 300px;
        background-color: rgba(255, 255, 255, 0.8);
        .icon-refresh {
          position: absolute;
          left: 50%;
          top: 123px;
          margin-left: -48px;
          cursor: pointer;
          display: inline-block;
          vertical-align: middle;
          height: 96px;
          width: 96px;
          background: url(~assets/login_images/5af37c4a880a95586cd41c5b251d5562@1x.png) no-repeat;
          background-position: 0 -150px;
          -webkit-background-size: 487px 462px;
          background-size: 487px 462px;
        }
      }
      .sub_title {
        text-align: center;
        font-size: 20px;
        color: #353535;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
