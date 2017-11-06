<template>
  <div>
    <el-dialog title="修改信息"  :visible.sync="dialogInfo">
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
            <el-date-picker v-model="temp.birthday" type="date" :editable="false" :clearable="false" placeholder="出生日期">
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
import { updatePeInfo } from '@/api/department'
import avatarm from '@/assets/login_images/avatar.png'
import { validateMblNo, validateIdNum } from '@/utils/validate'

export default {
  props: {
    dialogInfo: {
      type: Boolean,
      default: false
    },
    dialogPwd: {
      type: Boolean,
      default: false
    }
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
      dialogInfoA: false,
      avatarm,
      infoRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        nation: [{ required: true, trigger: 'blur', message: '请输入民族' }],
        idNum: [{ required: true, trigger: 'blur', validator: validateUserIdNum }],
        mobile: [{ required: true, trigger: 'blur', validator: validateUsername }]
      }
    }
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    dialogInfoA(newVal) {
      // this.$emit('update:dialogInfo', newVal)
      // console.log('dialogInfoA', newVal)
    },
    dialogInfo(newVal) {
      this.dialogInfoA = newVal
      console.log('dialogInfo', newVal)
    }
  },
  methods: {
    closeCall() {
      // this.$emit('update:dialogInfo', false)
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
<style lang="scss">

</style>
