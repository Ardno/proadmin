<template>
  <div class="app-container">
      <div class="box-msg g6">
        <div class="header">
          最新消息
          <span class="r count">10条</span>
        </div>
        <ul class="ibox-ct">
          <li class="fix">
            <img class="avatar l" :src="avatar" alt="">
            <div class="ovh tis">
              <h4 class="ell mt5">你好啊
                <span class="r f12 g9 n ">2017.7.12 12:25</span>
              </h4>
              <p class="pt5">我只是想喝你说一件事情，你不要搞事情</p>
            </div>
          </li>
          <li class="fix">
            <img class="avatar l" :src="avatar" alt="">
            <div class="ovh tis">
              <h4 class="ell mt5">你好啊
                <span class="r f12 g9 n ">2017.7.12 12:25</span>
              </h4>
              <p class="pt5">我只是想喝你说一件事情，你不要搞事情</p>
            </div>
          </li>
          <li class="fix">
            <img class="avatar l" :src="avatar" alt="">
            <div class="ovh tis">
              <h4 class="ell mt5">你好啊
                <span class="r f12 g9 n ">2017.7.12 12:25</span>
              </h4>
              <p class="pt5">我只是想喝你说一件事情，你不要搞事情</p>
            </div>
          </li>
        </ul>
        <div class="header lsdf">
          历史消息
          <span class="r count">10条</span>
        </div>
        <ul class="ibox-ct">
          <li class="fix">
            <img class="avatar l" :src="avatar" alt="">
            <div class="ovh tis">
              <h4 class="ell mt5">你好啊
                <span class="r f12 g9 n ">2017.7.12 12:25</span>
              </h4>
              <p class="pt5">我只是想喝你说一件事情，你不要搞事情</p>
            </div>
          </li>
          <li class="fix">
            <img class="avatar l" :src="avatar" alt="">
            <div class="ovh tis">
              <h4 class="ell mt5">你好啊
                <span class="r f12 g9 n ">2017.7.12 12:25</span>
              </h4>
              <p class="pt5">我只是想喝你说一件事情，你不要搞事情</p>
            </div>
          </li>
          <li class="fix">
            <img class="avatar l" :src="avatar" alt="">
            <div class="ovh tis">
              <h4 class="ell mt5">你好啊
                <span class="r f12 g9 n ">2017.7.12 12:25</span>
              </h4>
              <p class="pt5">我只是想喝你说一件事情，你不要搞事情</p>
            </div>
          </li>
          <li class="tc">
            <span class="jiasfa poi" href="">加载更多</span>
          </li>
          <!-- <li class="tc ">
            <span class="f12 g9">没有了~</span>
          </li> -->
        </ul>
        <div v-if="false" class="no-msg tc f14">
            <span>你最近暂时没有收到任何消息~</span>
        </div>
      </div>
  </div>
</template>

<script>
import avatar from 'assets/login_images/avatar.png'
export default {
  data() {
    return {
      avatar: avatar
    }
  },
  computed: {
    message() {
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container{
  // border-top: 1px solid #ddd;
  // background-color: #f2f2f2;
}
  .box-msg{
    width: 750px;
    margin: 0 auto;
    border-top: 3px solid #324157;
    background-color: #fff;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.1);
    .header{
      font-size: 14px;
      border-bottom: 1px solid #e7eaec;
      margin-bottom: 0;
      padding: 15px 10px;
      .count{
        font-size: 12px;
        padding: 2px 5px;
        color: #f2f2f2;
        border-radius: 5px;
        background-color: #f8ac59;
      }
      &.lsdf{
        border-top: 1px solid #e7eaec;
      }
    }
    .ibox-ct{
      padding: 0px 10px;
      li{
        list-style: none;
        font-size: 14px;
        padding: 10px 0;
        border-top: 1px solid #e7eaec;
        &:first-child{
          border-top: none;
        }
      }
    }
    .avatar{
      display: block;
      width: 50px;
      height: 50px;
      border-radius: 4px;
      border:none;
    }
    .tis{
      margin-left: 60px;
    }
  }
  .no-msg{
    padding: 150px 0;
  }
  .jiasfa{
    color: #1496cc;
    &:hover{
      text-decoration: underline;
    }
  }
</style>
