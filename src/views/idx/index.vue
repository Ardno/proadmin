<template>
  <div class="app-container">
    <el-row :gutter="20" class="tc white">
      <el-col :span="6">
        <div class="grid-content bg-purple1 ">
          <h2 class="f36 n tl">150</h2>
          <p class="f16 mt20 tl">新增</p>
          <p class="tip">新增案件数量</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple2">
          <h2 class="f36 n tl">150</h2>
          <p class="f16 mt20 tl">待处理</p>
          <p class="tip">待处理案件数量</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple3">
          <h2 class="f36 n tl">150</h2>
          <p class="f16 mt20 tl">任务</p>
          <p class="tip">当前执行任务用户数量</p>
        </div>
        </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple4">
          <h2 class="f36 n tl">150</h2>
          <p class="f16 mt20 tl">在线</p>
          <p class="tip">当前在线用户</p>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
      </el-col>
      <el-col :span="12">
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  computed: {

  }
}
</script>
<style lang="scss" scoped>
  .grid-content{
    position: relative;
    display: inline-block;
    padding:20px 15px;
    width: 90%;
    max-width: 300px;
    height: 160px;
    border-radius: 3px;
    overflow: hidden;
    cursor: pointer;
    &.bg-purple1{
      background: url(../../assets/images/inx-03.png)no-repeat;
      background-position: 95% 42%;
      background-color: #04c1f1;
      
    }
    &.bg-purple2{
      background: url(../../assets/images/inx-02.png)no-repeat;
      background-position: 95% 42%;
      background-color: #03a75a;
    }
    &.bg-purple3{
      background: url(../../assets/images/inx-01.png)no-repeat;
      background-position: 95% 42%;
      background-color: #f49d10;
    }
    &.bg-purple4{
      background: url(../../assets/images/inx-04.png)no-repeat;
      background-position: 95% 42%;
      background-color: #f56954;
    }
    .tip{
      position: absolute;
      left: 0;
      bottom:0;
      width: 100%;
      height: 30px;
      line-height: 30px;
      background-color: rgba(0,0,0,.2)
    }
  }
</style>