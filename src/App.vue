<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
  export default{
    name: 'APP',
    created() {
      try {
        // document.body.removeChild(document.getElementById('appLoading'))
        // setTimeout(function() {
        //   document.getElementById('app').style.display = 'block'
        // }, 500)
      } catch (e) {
        console.log(e)
      }
    }
  }
</script>

<style lang="scss">
@import '~normalize.css/normalize.css';// normalize.css 样式格式化
@import './styles/index.scss'; // 全局自定义的css样式
</style>
