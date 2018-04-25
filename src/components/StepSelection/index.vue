<!--  -->
<template>
  <div class="stepslet">
    <el-popover ref="popover4" popper-class="custom-popover"	 placement="bottom" width="378" trigger="click" @show="showT" @hide="hideT">
      <div class="item" v-for="item in dataList" :key="item.name" @click="selectItem(item)"> {{item.name}}</div>
    </el-popover>
    <div class="select" v-popover:popover4 >
      <el-tag v-for="(tag,index) in arrName" :key="index" closable type="info" class="tag" @close="handleClose(index)">
        {{tag}}
      </el-tag>
      <i class="el-icon-arrow-down arrow" :class="{'active':arrow}"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepSelection',
  data() {
    return {
      arrow: false
    }
  },
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {},
  computed: {
    arrName() {
      const arr = []
      console.log(this.value)
      this.value.forEach(element => {
        this.dataList.forEach(els => {
          if (Number(element) === els._id) {
            arr.push(els.name)
          }
        })
      })
      return arr
    }
  },
  created() {},
  methods: {
    showT() {
      this.arrow = true
    },
    hideT() {
      this.arrow = false
      this.$emit('change', this.value)
    },
    selectItem(item) {
      this.value.push(item._id)
      this.$emit('update:value', this.value)
    },
    handleClose(index) {
      this.value.splice(index, 1)
      this.$emit('update:value', this.value)
      this.$emit('change', this.value)
    }
  }
}
</script>
<style lang='scss'>
.stepslet{
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
    padding: 5px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    .tag{
      margin: 2px;
    }
    .arrow{
      position: absolute;
      top: 50%;
      right: 5px;
      margin-top: -7px;
      transition: all .3s;
      &.active{
        transform: rotate(-180deg);
      }
    }
  }

}
.custom-popover{
  padding: 0;
  max-height: 250px;
  overflow-y: auto;
  .item{
    font-size: 14px;
    padding: 0 20px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #5a5e66;
    height: 34px;
    line-height: 34px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    cursor: pointer;
    &:hover{
      background-color: #f5f7fa;
    }
  }
}
</style>