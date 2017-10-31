<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="事件类型" name="first">
        <event-type></event-type>
      </el-tab-pane>
      <el-tab-pane label="事件步骤" name="second">
        <event-step></event-step>
      </el-tab-pane>
      <el-tab-pane label="事件列表" name="three">
        <event></event>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import eventType from './eventtype'
import eventStep from './eventstep'
import event from './event'
export default {
  components: {
    eventType,
    eventStep,
    event
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  created() {

  },
  methods: {
    handleClick(tab, event) {
      // tab切换
    }
  }
}
</script>
<style lang="scss">

</style>