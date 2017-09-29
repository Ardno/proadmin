<template>
  <div class="footbar">
      <span >© 2017 Copyright.</span>
      <span class="r">1.0.0</span>
  </div>
</template>

<script>
export default {
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .footbar{
    position: fixed;
    left: 180px;
    bottom: 0;
    right: 0;
    padding:15px 20px;
    border-top: 1px solid #dee5e7;
    font-size: 12px;
    color: #58666e;
    background-color: #eef1f6;
  }
</style>

