<template>
	<div>
		<el-menu class="navbar" mode="horizontal">
			<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
			<levelbar></levelbar>
			<tabs-view></tabs-view>
			<!-- <error-log v-if="log.length>0" class="errLog-container" :logsList="log"></error-log> -->
			<el-badge :value="count" class="rsms">
				<icon-svg class="" icon-class="remind" />
			</el-badge>
			<screenfull class='screenfull'></screenfull>
			<el-dropdown class="avatar-container" trigger="click">
				<div class="avatar-wrapper">
					<img class="user-avatar" :src="avatar ? 'http://gridmap-file.xiaoketech.com/images/user/'+avatar+'.png':avatarm">
					<i class="el-icon-caret-bottom"></i>
				</div>
				<el-dropdown-menu class="user-dropdown" slot="dropdown">
					<router-link class='inlineBlock' to="/">
						<el-dropdown-item>
							首页
						</el-dropdown-item>
					</router-link>
					<el-dropdown-item ><span @click="dialogInfo=true" >个人信息</span></el-dropdown-item>
					<el-dropdown-item ><span @click="handlePwd(temp)" >修改密码</span></el-dropdown-item>
					<el-dropdown-item divided><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</el-menu>
		<!-- 修改个人信息 -->
		<el-dialog title="修改信息"  @close="closeCall" :visible.sync="dialogInfo">
			<el-form class="small-space" :model="temp" :rules="infoRules" ref="infoForm" label-position="right"  label-width="80px" style='width: 400px; margin-left:50px;'>
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
					<el-date-picker v-model="temp.birthday" type="date" :editable="false" :clearable="false"   placeholder="出生日期">
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
			<el-button @click="dialogInfo = false">取 消</el-button>
			<el-button type="primary" @click="handleUpdate">确 定</el-button>
			</div>
    </el-dialog>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Levelbar from './Levelbar'
import TabsView from './TabsView'
import Hamburger from 'components/Hamburger'
import Screenfull from 'components/Screenfull'
import ErrorLog from 'components/ErrLog'
import errLogStore from 'store/errLog'
import avatarm from '@/assets/login_images/avatar.png'
import { getSmsList } from '@/api/message'
import { updatePeInfo } from '@/api/department'
import { validateMblNo, validateIdNum } from '@/utils/validate'

export default {
  components: {
    Levelbar,
    TabsView,
    Hamburger,
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
    return {
      dialogInfo: false,
      count: 0,
      log: errLogStore.state.errLog,
      infoRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        nation: [{ required: true, trigger: 'blur', message: '请输入民族' }],
        idNum: [{ required: true, trigger: 'blur', validator: validateUserIdNum }],
        mobile: [{ required: true, trigger: 'blur', validator: validateUsername }]
      },
      avatarm
    }
  },
  created() {
    this.getSmsList()
  },
  computed: {
    ...mapGetters({
      temp: 'useinfo',
      avatar: 'avatar',
      sidebar: 'sidebar',
      name: 'name'
    })
  },
  methods: {
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
        this.count = arr.length
      })
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
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
    handlePwd(item) { // 修改密码
      this.$prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[a-zA-Z0-9]{6,}$/,
        inputErrorMessage: '至少输入6位密码'
      }).then(({ value }) => {
        const parm = {
          _id: item['_id'],
          pwd: value
        }
        updatePeInfo(parm).then(response => {
          this.$message({
            message: '修改后密码为：' + value,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {
          this.$message({
            message: '修改密码失败，请稍后再试',
            type: 'error',
            duration: 4 * 1000
          })
        })
      }).catch(() => {
        console.log('取消修改')
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
			.errLog-container {
					display: inline-block;
					position: absolute;
					right: 150px;
			}
			.screenfull {
					position: absolute;
					right: 90px;
					top: 16px;
					color: red;
			}
			.rsms{
				position: absolute;
				right: 140px;
				top: 14px;
				color: #666;
				font-size: 28px;
				line-height: 1;
				cursor: pointer;
			}
			.avatar-container {
					height: 50px;
					display: inline-block;
					position: absolute;
					right: 35px;
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
</style>



