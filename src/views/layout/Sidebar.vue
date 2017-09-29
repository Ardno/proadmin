<template>
  <el-menu mode="vertical" theme="dark" :default-active="$route.path">
    <li class="logo-title b">
      <router-link class='inlineBlock' to="/">
          <icon-svg class="mr10 f16" :icon-class="'zonghe'" />崖州网格化
        </router-link></li>
    <sidebar-item :routes='permission_routers'></sidebar-item>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-menu {
    min-height: 100%;
  }
  .logo-title{
    padding: 20px;
    font-size: 20px;
    color: #c4d0d9;
  }
</style>
