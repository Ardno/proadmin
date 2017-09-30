<template>
  <div class="app-container">
    <div class="wrapper">
        <div class="pestwar">
          <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="9">
            <div class="tc pt20">
             <img :src="avatar ? 'http://gridmap-file.xiaoketech.com/images/user/'+useinfo._id+'.png':avatarm">
            </div>
          </el-col>
          <el-col :span="15">
            <ul>
             <li>
               <h3>部门</h3>
               <p>{{useinfo.department.name}}</p>
             </li>
             <li>
               <h3>姓名</h3>
               <p>{{useinfo.name}}</p>
             </li>
             <li>
               <h3>性别</h3>
               <p>{{useinfo.sex?'女':'男'}}</p>
             </li>
             <li>
               <h3>手机号</h3>
               <p>{{useinfo.mobile}}</p>
             </li>
           </ul>
          </el-col>
        </el-row>  
        </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import avatarm from '@/assets/login_images/avatar.png'
export default {
  data() {
    return {
      avatarm
    }
  },
  computed: {
    ...mapGetters([
      'useinfo',
      'avatar'
    ])
  }
}
</script>
<style lang="scss">
  html,body,#app,.main-container,.app-container{
    height: 100%;
  }
  .app-main{
    min-height: auto !important;
    height: calc(100% - 50px);
  }
  .wrapper{
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../../assets/images/atlas_book-wallpaper-1920x1080.jpg) no-repeat center;
    background-size: cover;
    &:after{
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,.2)
    }
    .pestwar{
      position: absolute;
      top: 50%;
      left:50%;
      width: 450px;
      padding:30px 20px;
      background-color: rgba(255,255,255,.2);
      transform: translate(-50%,-50%);
      ul{
        padding:0;
      }
      li{
        width: 200px;
        list-style: none;
        h3{
          color: #fff;
          font-size: 15px;
          margin-top: 10px;
          font-weight: normal;
        }
        p{
          font-size: 13px;
          color: rgba(255,255,255,.6);
          padding: 10px 0;
          border-bottom: 1px dashed rgba(255,255,255,.6);
        }
      }
    }
  }
</style>
