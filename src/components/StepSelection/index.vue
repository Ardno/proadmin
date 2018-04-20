<!--  -->
<template>
  <div class="select">
    <el-tag
      v-for="tag in tags"
      :key="tag.name"
      closable
      type="info">
      {{tag.name}}
    </el-tag>
  </div>
</template>

<script>
export default {
  name: 'StepSelection',
  data() {
    return {
      tags: [
        { name: '标签一', type: '' },
        { name: '标签二', type: 'success' },
        { name: '标签三', type: 'info' },
        { name: '标签四', type: 'warning' },
        { name: '标签五', type: 'danger' }
      ]
    }
  },
  components: {},
  computed: {},
  created() {},
  methods: {}
}
</script>
<style lang='scss' scoped>
.select{
  position: relative;
  width: 70%;
  -webkit-appearance: none;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #d8dce5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #5a5e66;
  display: inline-block;
  font-size: inherit;
  min-height: 40px;
  line-height: 1;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  .tag{

  }
}
</style>