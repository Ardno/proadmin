<template>
  <div class="app-container">
    <div class="layui-elem-quote">
      <span class="mr10 ">
        我的电子印章
      </span> 
    </div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="印章单位">
        <el-input v-model.trim="formInline.compay" @change="createSeal" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="印章名称">
        <el-input v-model.trim="formInline.name" @change="createSeal" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">上传</el-button>
      </el-form-item>
    </el-form>
    <canvas id="canvas" class="vh" width="140" height="140"></canvas><br>
    <img class="ml40" :src="src">
  </div>
</template>

<script>
import { createSeal } from '@/utils/seal.js'
export default {
  data() {
    return {
      formInline: {
        compay: '某某某有限公司',
        name: '测试专用章'
      },
      src: ''
    }
  },
  methods: {
    onSubmit() {
      console.log(document.getElementById('canvas').toDataURL('image/png'))
    },
    createSeal() {
      createSeal('canvas', this.formInline.compay, this.formInline.name)
      this.src = document.getElementById('canvas').toDataURL('image/png')
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.createSeal()
    })
  }
}
</script>
<style lang="css">

</style>