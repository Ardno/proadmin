<template>
  <div>
    <transition name="el-zoom-in-bottom">
      <div v-if="!colseIm" class="layui-layim">
        <div v-drag class="layui-layer-title cur-move">
        </div>
        <!-- 主体 -->
        <div class="layui-layer-content">
          <div class="layui-layim-main">
            <!-- 头部信息 -->
            <div class="layui-layim-info">
              <div class="layui-layim-user">{{userInfo.username}}</div>
              <div class="layui-layim-status">
                <span class="layim-status-online"></span>
              </div>
              <span class="layui-layim-remark">{{userInfo.signature || '暂无签名'}}</span>
            </div>
            <!-- 面板 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane name="first">
                <span slot="label">
                  <icon-svg icon-class="people_fill" />
                </span>
                <el-collapse :style="{overflow:'auto'}" class="layim-tab-content">
                  <el-collapse-item v-for="(flist, index) in friend_list" :key="index" >
                    <template slot="title">
                      <span>{{flist.groupname}}</span>
                      <em>(
                        <cite class="layim-count">{{flist.len}}</cite>)</em>
                    </template>
                    <ul class="layui-layim-list">
                      <li @click="imCkPanle(clist)" v-for="(clist, index) in flist.list" :key="index">
                        <img :src="clist.avatar||clist.avatarUrl" >
                        <span>{{clist.username}}</span>
                        <p>{{clist.signature || '暂无签名'}}</p>
                      </li>
                    </ul>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>
              <el-tab-pane name="second">
                <span slot="label">
                  <icon-svg icon-class="group_fill" />
                </span>
                <ul @mouseenter="hoverflow('on')" @mouseleave="hoverflow('off')" class="layim-tab-content" :style="{overflow:overflow}">
                  <li>
                    <ul class="layui-layim-list layui-show layim-list-group">
                      <li @click="imCkPanle(list)" v-for="(list, index) in group_list" :key="index">
                        <img :src="list.avatar||list.avatarUrl">
                        <span>{{list.name}}</span>
                        <p>{{list.desc  || '暂无群描述'}}</p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane name="third">
                <span slot="label">
                  <icon-svg icon-class="message_fill" />
                </span>
                <ul @mouseenter="hoverflow('on')" @mouseleave="hoverflow('off')" class="layim-tab-content layui-show" :style="{overflow:overflow}">
                  <li>
                    <ul class="layui-layim-list layui-show layim-list-history">
                      <li @click="imCkPanle(list)" v-for="(list, index) in conversations" :key="index" >
                        <img :src="list.avatar||list.avatarUrl">
                        <span v-if="list.type === 3">{{list.username}}</span>
                        <time class="r g9 time">{{list.mtime | reducerDate}}</time>
                        <p v-if="list.type === 3">{{list.signature || '暂无签名'}}
                          <em v-if="list.unread_msg_count" class="count">{{list.unread_msg_count > 100 ? '99+': list.unread_msg_count}}</em>
                        </p>
                        <span v-if="list.type === 4">{{list.name}}</span>
                        <p v-if="list.type === 4"><em v-if="list.unread_msg_count" class="count">{{list.unread_msg_count > 100 ? '99+': list.unread_msg_count}}</em></p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </el-tab-pane>
            </el-tabs>
            <!-- 底部 -->
            <ul class="layui-unselect layui-layim-tool">
              <li class="layui-icon layim-tool-search" @click="searchflg=true" title="搜索">
                <icon-svg icon-class="icon-fangdajing" />
              </li>
              <li class="layui-icon layim-tool-msgbox " title="消息盒子">
                <icon-svg icon-class="icon-laba" />
                <span class="layui-anim layui-anim-loop layer-anim-05">5</span>
              </li>
              <li class="layui-icon layim-tool-find" title="查找">
                <icon-svg icon-class="icon-jia1" />
              </li>
              <li class="layui-icon layim-tool-skin" title="更换背景">
                <icon-svg icon-class="icon-pifu" />
              </li>
              <li class="layui-icon layim-tool-about" title="关于">
                <icon-svg icon-class="icon-guanyu" />
              </li>
            </ul>
            <div class="layui-layim-search" v-if="searchflg" style="display: block;">
              <input>
              <label class="layui-icon" layim-event="closeSearch" @click="searchflg=false">
                <icon-svg icon-class="close" />
              </label>
            </div>
          </div>

        </div>
        <!-- 主体 -->
        <span class="layui-layer-setwin"  @click="colseIm=true">
          <icon-svg class="layui-layer-ico layui-layer-close layui-layer-close1" icon-class="close" />
        </span>
      </div>
    </transition>
    <transition name="el-zoom-in-bottom">
      <div v-if="colseIm" @click="colseIm=false" class="layui-layim-close">
        <img  :src="avteinfo">
        <span >我的聊天</span>
      </div>
    </transition>
    <transition name="el-fade-in-linear">
       <chatck :closechatck.sync="closechatck" ></chatck>
    </transition>
  </div>
</template>


<script>
import drag from '@/directive/drag/index.js'
// import store from './store'
import chatck from './chatck'
import { getJMessage, authPayload, errorApiTip } from '@/utils/IM'
import { createSignature } from '@/utils/utils'
import { reducerDate } from '@/utils/index'
import { md5 } from '@/utils/md5'
import group_avatar from '@/assets/images/group-avatar.svg'
import single_avatar from '@/assets/images/single-avatar.svg'
import avteinfo from '@/assets/images/avteinfo.svg'
export default {
  name: 'chat',
  components: {
    chatck
  },
  directives: {
    drag
  },
  filters: {
    reducerDate
  },
  computed: {
  },
  data() {
    return {
      avteinfo,
      colseIm: true,
      searchflg: false,
      closechatck: true,
      activeName: 'third',
      JIM: null,
      overflow: 'hidden',
      friend_list: [],
      group_list: [],
      conversations: [],
      userInfo: {
        username: '',
        signature: ''
      }
    }
  },
  created() {
    this.JIMInit()
  },
  methods: {
    hoverflow(type) {
      console.log(type)
      if (type === 'on') {
        this.overflow = 'auto'
      } else {
        this.overflow = 'hidden'
      }
    },
    handleClick(tab, event) {
    },
    imCkPanle(item) {
      this.closechatck = false
    },
    JIMInit() { // IM初始化
      this.JIM = getJMessage()
      const timestamp = new Date().getTime()
      const signature = createSignature(timestamp)
      this.JIM.init({
        appkey: authPayload.appKey,
        random_str: authPayload.randomStr,
        signature: authPayload.signature || signature,
        timestamp: authPayload.timestamp || timestamp,
        flag: authPayload.flag
      }).onSuccess((data) => {
        this.JIMLogin()
      }).onFail((error) => {
        errorApiTip(error)
      }).onTimeout((data) => {
        const error = { text: 'IM初始化', code: 910000 }
        errorApiTip(error)
      })
    },
    JIMLogin() {
      this.JIM.login({
        // username: store.getters.useinfo.username,
        // password: store.getters.useinfo.password,
        username: 'lc2017116',
        password: md5('lc2017116'),
        is_md5: true
      }).onSuccess((login) => {
        this.JIMgetUserInfo(login.username)
        this.JIMgetFriendList()
        this.JIMgetGroups()
        this.JIMgetConversation()
      }).onFail((error) => {
        errorApiTip(error)
      })
    },
    JIMgetUserInfo(name) { // 获取用户信息
      this.JIM.getUserInfo({ username: name, appkey: authPayload.appKey }).onSuccess((data) => {
        const user = data.user_info
        const item = {
          avatar: user.avatar,
          mtime: user.mtime,
          name: user.username,
          nickName: user.nickname,
          username: user.username,
          nickname: user.nickname,
          type: 3,
          signature: user.signature,
          gender: user.gender,
          region: user.region,
          avatarUrl: single_avatar
          // infoType,
          // eventId: info.eventId,
          // stateType: info.stateType
        }
        this.userInfo = item
      }).onFail((error) => {
        errorApiTip(error)
      }).onTimeout((data) => {
        const error = { code: 910000 }
        errorApiTip(error)
      })
    },
    JIMgetFriendList() { // 获取用户列表
      this.JIM.getFriendList().onSuccess((data) => {
        const friend_list = data.friend_list
        for (const friend of friend_list) {
          friend.avatarUrl = single_avatar
        }
        const memo = {}
        friend_list.forEach(function(element) {
          if (element.memo_others) {
            if (memo[element.memo_others]) {
              memo[element.memo_others].push(element)
            } else {
              memo[element.memo_others] = [element]
            }
          } else {
            if (memo['我的好友']) {
              memo['我的好友'].push(element)
            } else {
              memo['我的好友'] = [element]
            }
          }
        }, this)
        for (const key in memo) {
          const obj = {
            groupname: key,
            len: memo[key].length,
            list: memo[key]
          }
          this.friend_list.push(obj)
        }
      }).onFail((error) => {
        errorApiTip(error)
      })
    },
    JIMgetGroups() { // 获取群组列表
      this.JIM.getGroups().onSuccess((data) => {
        const group_list = data.group_list
        for (const group of group_list) {
          group.avatarUrl = group_avatar
        }
        this.group_list = group_list
        console.log(group_list)
      }).onFail((error) => {
        errorApiTip(error)
      })
    },
    JIMgetConversation() { // 获取会话列表
      this.JIM.getConversation().onSuccess((data) => {
        const conversations = data.conversations
        for (const conver of conversations) {
          if (conver.type === 3) {
            conver.avatarUrl = single_avatar
          } else {
            conver.avatarUrl = group_avatar
          }
        }
        this.conversations = conversations
      }).onFail((error) => {
        errorApiTip(error)
      })
    }
  }
}
</script>
<style lang="scss" >
.layui-layim-close {
  position: fixed;
  bottom: 10px;
  right: 5px;
  z-index: 1999;
  display: block;
  width: 145px;
  height: 52px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 1px 1px 50px rgba(0, 0, 0, .3);
  border: 1px solid #D9D9D9;
  margin: 0 5px;
  padding: 5px 10px;
  white-space: nowrap;
  line-height: 40px;
  cursor: pointer;
  border-radius: 3px;
  img {
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    vertical-align: top;
    font-size: 14px;
  }
  span {
    width: auto;
    max-width: 120px;
    display: inline-block;
    vertical-align: top;
    padding-left: 10px;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.cur-move{
  cursor: move;
}
.layui-layim {
  position: fixed;
  bottom: 10px;
  right: 5px;
  z-index: 1999;
  display: block;
  width: 262px;
  height: 520px;
  border: 1px solid #D9D9D9;
  background-repeat: no-repeat;
  background-color: #F6F6F6;
  color: #333;
  font-family: \5FAE\8F6F\96C5\9ED1;
  -webkit-background-clip: content;
  border-radius: 2px;
  box-shadow: 1px 1px 50px rgba(0, 0, 0, .3);
  background-image: url(~assets/images/chatbg1.jpg);


  .layui-layer-title {
    padding: 0 80px 0 20px;
    line-height: 42px;
    font-size: 14px;
    color: #333;
    overflow: hidden;
    border-radius: 2px 2px 0 0;
    height: 110px;
  }

  .layui-layer-content {
    position: relative;
    overflow: visible;
    height: 410px;
  }

  .layui-layim-main {
    position: relative;
    top: -98px;
    left: 0;
  }

  .layui-layim-info {
    height: 50px;
    font-size: 0;
    padding: 0 15px;
  }

  .layui-layim-user {
    max-width: 150px;
    margin-right: 5px;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    vertical-align: top;
  }

  .layui-layim-status {
    display: inline-block;
    vertical-align: top;
    position: relative;
    top: 2px;
    line-height: 19px;
    cursor: pointer;
  }

  .layim-status-online {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 100%;
    background-color: #3FDD86;
    border: 1px solid #f2f2f2;
  }

  .layui-layim-remark {
    position: relative;
    left: -6px;
    display: block;
    font-size: 14px;
    width: 242px;
    border: 1px solid transparent;
    margin-top: 8px;
    padding: 0 5px;
    height: 26px;
    line-height: 26px;
    background: 0 0;
    border-radius: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    outline: 0;
    &:hover {
      border: 1px solid #d2d2d2;
      border-color: rgba(0, 0, 0, .15);
    }
  }

  .layui-layer-setwin {
    position: absolute;
    right: 15px;
    top: 15px;
    font-size: 0;
    line-height: initial;
    cursor: pointer;
    &:hover {
      opacity: .7;
    }
  }

  .layui-layer-setwin .layui-layer-close1 {
    position: relative;
    width: 16px;
    height: 16px;
    margin-left: 10px;
    font-size: 12px;
  }

  .el-tabs__nav {
    margin-top: 10px;
    width: 100%;
  }

  .el-tabs__item {
    width: 33.33%;
    font-size: 28px;
    color: rgba(0, 0, 0, .6);
    text-align: center;
  }

  .el-tabs__header {
    border: none;
    margin-bottom: 0;
  }

  .el-tabs__item:hover {
    color: rgba(0, 0, 0, .7);
  }

  .el-tabs__item.is-active {
    color: rgba(0, 0, 0, .7);
  }

  .el-tabs__active-bar {
    background-color: #3FDD86
  }

  .layim-tab-content li h5 {
    position: relative;
    margin-right: 15px;
    padding-left: 30px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    font-size: 0;
    white-space: nowrap;
    font-weight: 400;
    overflow: hidden;
  }

  .layim-tab-content {
    padding: 10px 0;
    height: 369px;
    overflow: hidden;
    background-color: rgba(255, 255, 255, .9);
  }

  .layim-tab-content li {
    display: block;
  }

  .layim-tab-content li ul {
    display: none;
    margin-bottom: 10px;
  }

  .layui-show {
    display: block!important;
  }

  .layui-layim-list li {
    position: relative;
    height: 42px;
    padding: 5px 15px 5px 60px;
    font-size: 0;
    cursor: pointer;
    box-sizing: content-box;
    .time{
      font-size: 12px;
      margin-top: 4px;
    }
    .count{
      min-width: 13px;
      height: 13px;
      line-height: 13px;
      padding: 1px 2px;
      border-radius: 13px;
      background: #33DF83;
      color: #fff;
      position: absolute;
      top: 3px;
      right: 3px;
      text-align: center;
      font-size: 12px;
      font-style: normal;
      
    }
  }

  .layui-layim-list li img {
    position: absolute;
    left: 15px;
    top: 8px;
    width: 36px;
    height: 36px;
    border-radius: 100%;
  }

  .layui-layim-list li * {
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
  }

  .layui-layim-list li span {
    margin-top: 4px;
    max-width: 155px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .layui-layim-list li p {
    position: relative;
    display: block;
    padding-right: 30px;
    line-height: 18px;
    font-size: 12px;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .layui-layim-list li:hover {
    background-color: #F2F2F2;
    background-color: rgba(0, 0, 0, .05);
  }

  .el-collapse-item__header {
    position: relative;
    margin-right: 15px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    border-bottom: 0;
    .jied {
      position: absolute;
      left: 12px;
      top: 0;
      color: #C9BDBB;
    }
    em {
      padding-left: 5px;
      color: #999;
      font-style: normal;
      cite {
        font-style: normal;
      }
    }
  }

  .el-collapse,
  .el-collapse-item__wrap {
    border: none;
  }

  .el-collapse-item__content {
    padding: 0;
    line-height: 1.15;
  }

  .el-icon-arrow-right {
    color: #C9BDBB;
    font-size: 12px;
  }

  .layui-layim-tool {
    padding: 0 10px;
    font-size: 0;
    background-color: #F6F6F6;
    border-radius: 0 0 2px 2px;
  }

  .layui-layim-tool li {
    position: relative;
    display: inline-block;
    vertical-align: top;
    width: 48px;
    height: 37px;
    line-height: 40px;
    text-align: center;
    font-size: 22px;
    cursor: pointer;
    color: #666;
  }
  .f28 {
    font-size: 28px !important;
  }
  .layui-layim-tool li:active {
    background-color: #e2e2e2;
  }

  .layim-tool-msgbox .layer-anim-05 {
    display: block;
  }
  .layim-tool-msgbox span {
    display: none;
    position: absolute;
    left: 12px;
    top: -12px;
    height: 20px;
    line-height: 20px;
    padding: 0 10px;
    border-radius: 2px;
    background-color: #33DF83;
    color: #fff;
    font-size: 12px;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
  }

  .layer-anim-05 {
    -webkit-animation-name: layer-fadeIn;
    animation-name: layer-fadeIn;
  }

  .layui-anim-loop {
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
  }

  .layui-anim {
    -webkit-animation-duration: .3s;
    animation-duration: .3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }



  @keyframes layer-fadeIn {
    0% {
      opacity: 0
    }
    100% {
      opacity: 1
    }
  }

  .layui-layim-search {
    display: none;
    position: absolute;
    bottom: 5px;
    left: 5px;
    height: 28px;
    line-height: 28px;
  }

  .layui-layim-search input {
    display: block;
    width: 250px;
    padding: 0 30px 0 10px;
    height: 28px;
    line-height: 28px;
    border: none;
    font-size: 14px;
    border-radius: 3px;
    background-color: #ddd;
    outline: none;
  }

  .layui-layim-search label {
    position: absolute;
    right: 6px;
    top: 2px;
    font-size: 14px;
    cursor: pointer;
    color: #333;
    font-weight: 400;
  }
}
</style>

