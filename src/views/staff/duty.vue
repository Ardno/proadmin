<template>
  <div class="app-container">
    <div class="pct50 p30 bd-radius bgf0 auto">
      <el-form :label-position="labelPosition" label-width="80px" :model="duty">
        <el-form-item label="职位名称">
          <el-input v-model="duty.name"></el-input>
        </el-form-item>
        <el-form-item label="职务权限">
          <el-input v-model="duty.access"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      duty: {
        name: '',
        access: ''
      }
    }
  }
}
</script>
<style lang="sass">


</style>