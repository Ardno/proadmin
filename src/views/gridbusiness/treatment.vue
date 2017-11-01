<template>
  <div class="components-container">
    <code>富文本<a target='_blank' href='https://segmentfault.com/a/1190000009762198#articleHeader13'> 相关文章 </a> <a target='_blank' href='https://www.tinymce.com/'> 官网 </a></code>
    <div>
      <tinymce :height='500' v-model="content"></tinymce>
    </div>
     
    <div class='editor-content' v-html='content'></div>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  data() {
    return {
      content: '请输入内容~'
    }
  },
  methods: {
    insertContent(str) {
      const _this = this
      console.log()
      window.tinymce.get(_this.tinymceId).insertContent(str)
    }
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>


