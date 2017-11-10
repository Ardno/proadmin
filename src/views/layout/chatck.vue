<template>
  <div>
    <transition name="el-fade-in-linear">
      <div v-show="!minchatck && !closechatck" class="layui-layim-chat">
        <!-- 当前聊天列表 -->
        <!-- <ul class="layim-chat-list">
          <li class="tabChat" v-for="(item,index) in tabList" @click="selectTargetEmit(item,index)" :class="{active:index===activeItem.activeIndex}" @mouseenter="colseim=index" @mouseleave="colseim=-1" :key="index">
            <img src="//tva1.sinaimg.cn/crop.0.0.512.512.180/6a4acad5jw8eqi6yaholjj20e80e8t9f.jpg">
            <span>{{item.name}}</span>
            <i v-if="colseim === index" class="layui-icon">
              <icon-svg icon-class="icon-shanchu" />
            </i>
          </li>
        </ul> -->
        <!-- 聊天框 -->
        <div class="chat-ct">
          <!-- 头部 -->
          <div class="chat-title">
            <div class="layim-chat-other">
              <img :src="activeItem.avatar||activeItem.avatarUrl">
              <span class="layim-chat-username ell" v-if="activeItem.type === 3">{{activeItem.username}}</span>
              <span class="layim-chat-username ell" v-if="activeItem.type === 4">{{activeItem.name}}</span>
              <!-- <p class="layim-chat-status ell">暂无签名</p> -->
            </div>
            <span class="layui-layer-setwin">
              <!-- <span @click="minchatck=true">
                <icon-svg icon-class="icon-iconmianxingshujujian" />
              </span> -->
              <!-- <span>
                <icon-svg icon-class="fullscreen" />
              </span> -->
              <span @click="togglechatck">
                <icon-svg  icon-class="close" />
              </span>
            </span>
          </div>
          <!-- 主体 -->
          <div class="layim-chat-bg">
            <div class="layim-chat-main"  ref="layscoll">
              <ul>
                <li v-for="(list,index) in activeItem.msgs" :key="index"  :class="{'layim-chat-mine':userInfo.username == list.content.from_id }">
                  <div class="layim-chat-user"><img :src="activeItem.avatar||activeItem.avatarUrl">
                    <cite >
                      {{ userInfo.username == list.content.from_id ? '':list.content.from_name}}
                    <i >{{list.content.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</i></cite>
                  </div>
                  {{list}}
                  <span v-if="list.success == 1" class="spinrose mr10 activespin"></span>
                  <span v-if="list.success == 3" @click="repeatSendMsg(list)" class="dib f24 g9 mt30 poi mr10"><icon-svg icon-class="refresh" /></span>
                  <div class="layim-chat-text" v-if="list.content.msg_type=='text'" v-html="list.content.msg_body.text">
                  </div>
                  <div class="layim-chat-text" v-else><img src="//.sadasd.asd.png" alt=""></div>
                </li>
              </ul>
            </div>
            <!-- 工具栏 -->
            <div class="layim-chat-tool">
              <span class="layui-icon layim-tool-image g9" title="上传图片" layim-event="image">
                <icon-svg icon-class="picture" />
                <input type="file" name="file"></span>
              <span class="layui-icon layim-tool-image g9" style="font-size:19px" title="发送文件" layim-event="image" data-type="file">
                <icon-svg icon-class="icon-wenjian" />
                <input type="file" name="file"></span>
              <span class="layui-icon layim-tool-audio g9" style="font-size:21px" title="发送网络音频" layim-event="media" data-type="audio">
                <icon-svg icon-class="icon-erji" />
              </span>
              <span class="layui-icon layim-tool-video g9" title="发送网络视频" layim-event="media" data-type="video">
                <icon-svg icon-class="video" />
              </span>
              <span class="layim-tool-log" layim-event="chatLog">
                <icon-svg class="f20 g9" icon-class="time" />
                <i>聊天记录</i>
              </span>
            </div>
            <!-- 输入框 -->
            <div class="layim-chat-textarea">
              <textarea v-model="requstData.content" @keydown.ctrl.enter="sendMsgEmit('')"></textarea>
            </div>
            <div class="layim-chat-bottom">
              <div class="layim-chat-send">
                <span class="layim-send-close" @click="togglechatck()" layim-event="closeThisChat">关闭</span>
                <span class="layim-send-btn" @click="sendMsgEmit('')"  layim-event="send" title="按Ctrl+Enter键发送消息">发送</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="el-fade-in-linear">
      <div v-if="minchatck && !closechatck" @click="minchatck=false" class="layui-layim-close">
        <img :src="activeItem.avatar||activeItem.avatarUrl">
        <span  v-if="activeItem.type === 3">{{activeItem.username}}</span>
        <span v-if="activeItem.type === 4">{{activeItem.name}}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getJMessage } from '@/utils/IM'
import drag from '@/directive/drag/index.js'
export default {
  name: 'chatck',
  props: {
    closechatck: {
      type: Boolean,
      default: true
    },
    activeUser: {
      type: Object
    },
    newmsg: {
      type: Object
    }
  },
  directives: {
    drag
  },
  data() {
    return {
      JIM: null,
      minchatck: false,
      colseim: false,
      activeItem: {
        // 当前active的用户
        id: '',
        info: '',
        type: 0,
        msgs: []
      },
      requstData: {
        content: '',
        repeatSend: false,
        extras: '',
        localExtras: '',
        atList: '',
        isAtAll: ''
      },
      msgKey: 0,
      msgs: [],
      tabList: [] // 当前tab列表
    }
  },
  watch: {
    activeUser(val, oldVal) {
      this.minchatck = false
      this.selectTargetEmit()
    },
    msgs(val, oldVal) {
      setTimeout(() => {
        this.$refs.layscoll.scrollTop = this.$refs.layscoll.scrollHeight
      })
    },
    newmsg(val, oldVal) { // 收到新的消息
      this.getActiveMsg()
    }
  },
  computed: {
    ...mapGetters({
      messageList: 'messageList',
      userInfo: 'imUserinfo'
    })
  },
  created() {
    this.JIM = getJMessage()
  },
  methods: {
    togglechatck() {
      this.$emit('update:closechatck', true)
    },
    getActiveMsg() {
      const m = this.messageList
      const a = this.activeItem
      if (m[a.id]) { // 判断当前用户是否存在历史消息
        a.msgs = m[a.id].msgs
        this.msgs = m[a.id].msgs
      } else {
        // 通知更新会话面板
      }
    },
    selectTargetEmit() { // 切换当前对话用户
      const a = this.activeUser
      const activeItem = {
        id: '',
        info: '',
        type: 0,
        msgs: []
      }
      activeItem.id = a.username || a.gid
      this.activeItem = Object.assign(activeItem, a)
      console.log(this.activeItem)
      this.getActiveMsg()
    },
    repeatSendMsg(msg) {
      msg.success = 1
      const req = {
        content: msg.content.msg_body.text,
        repeatSend: true,
        extras: '',
        localExtras: '',
        atList: '',
        isAtAll: '',
        msgKey: msg.msgKey
      }
      this.sendMsgEmit(req)
    },
    sendMsgEmit(resl) { // 发送文本消息
      const activePerson = this.activeItem
      const data = resl || this.requstData
      // repeatSend = true重发消息
      /**
        * success
        * 取值 状态
        * 1  正在发送
        * 2  发送成功
        * 3  发送失败
        */
      const msgs = {
        content: {
          create_time: new Date().getTime(),
          msg_type: 'text',
          from_id: this.userInfo.username,
          msg_body: {
            text: data.content,
            extras: data.localExtras
          }
        },
        ctime_ms: new Date().getTime(),
        success: 1,
        msgKey: resl.msgKey || this.msgKey ++
      }
      if (activePerson.type === 3 && !data.repeatSend) {
        const singleMsg = {
          target_username: activePerson.name,
          content: data.content,
          need_receipt: true
        }
        if (data.extras) {
          singleMsg.extras = data.extras
        }
        msgs.singleMsg = singleMsg
        msgs.msg_type = 3
        this.requstData.content = ''
        // 发送群组消息
      } else if (activePerson.type === 4 && !data.repeatSend) {
        const groupMsg = {
          target_gid: activePerson.key,
          content: data.content,
          need_receipt: true
        }
        if (data.extras) {
          groupMsg.extras = data.extras
        }
        if (data.isAtAll) {
          groupMsg.at_list = []
        } else if (data.atList && data.atList.length > 0) {
          groupMsg.at_list = data.atList
        }
        msgs.groupMsg = groupMsg
        msgs.msg_type = 4
        this.requstData.content = ''
        // 重发单聊消息
      } else if (activePerson.type === 3 && data.repeatSend) {

      // 重发群聊消息
      } else if (activePerson.type === 4 && data.repeatSend) {
        console.log(data)
      }
      const obj = {
        msgs: msgs,
        select: {
          name: activePerson.id,
          nickName: activePerson.name
        }
      }
      this.JIMsendSingleMsg(obj)
      if (!data.repeatSend) {
        const msglist = this.messageList // 离线消息列表
        if (msglist[activePerson.id]) {
          msglist[activePerson.id].msgs.push(msgs)
        }
      }
      // this.$store.dispatch('SetMsgList', msglist)
    }, // end 文本消息
    JIMsendSingleMsg(text) {
      const msgBody = {
        text: text.msgs.content.msg_body.text,
        extras: text.msgs.content.msg_body.extras
      }
      this.JIM.sendSingleMsg({
        target_username: text.select.name,
        target_nickname: text.select.nickName,
        msg_body: msgBody
      })
      .onSuccess((data, msgs) => {
        this.sendMsgComplete(true, msgs, text)
      }).onFail((erros) => {
        this.sendMsgComplete(false)
      }).onTimeout((data) => {
        this.sendMsgComplete(false)
      })
    },
    sendMsgComplete(flg, msgs, text) { // 发送消息完成
      if (this.messageList[this.activeItem.id]) {
        const arr = this.messageList[this.activeItem.id].msgs
        for (let index = 0; index < arr.length; index++) {
          if (text.msgs.msgKey === arr[index].msgKey) {
            if (flg) { // 发送成功
              arr[index].success = 2
              arr[index] = msgs
            } else { // 发送失败
              arr[index].success = 3
            }
          }
        }
      }
    } // end 完成消息发送
  }
}
</script>

<style  lang="scss" scoped>
.layui-layim-close{
  right: 50%;
  width: 180px;
  span{
    max-width: 110px;
  }
}
.layui-layim-chat {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 1999;
  display: block;
  min-width: 600px;
  height: 662px;
  transform: translate(-50%, -50%);
  border: 1px solid #D9D9D9;
  background-color: #F6F6F6;
  color: #333;
  font-family: \5FAE\8F6F\96C5\9ED1;
  border-radius: 2px;
  box-shadow: 1px 1px 50px rgba(0, 0, 0, .3);
  .layim-chat-list {
    float: left;
    width: 200px;
    height: 100%;
    background-color: #D9D9D9;
    overflow: auto;
    .tabChat {
      position: relative;
      margin: 5px;
      padding: 5px 30px 5px 5px;
      line-height: 40px;
      cursor: pointer;
      border-radius: 3px;
      white-space: nowrap;
      img {
        width: 40px;
        height: 40px;
        border-radius: 100%;
      }
      span {
        width: 100px;
        padding-left: 10px;
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &.active {
        background-color: #F3F3F3 !important;
      }
      &>* {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
      }
      &:hover {
        background-color: #E2E2E2;
      }
      .layui-icon {
        position: absolute;
        right: 5px;
        top: 3px;
        color: #555;
        font-size: 15px;
        &:hover {
          color: #c00;
        }
      }
    }
  }
  .chat-ct {
    width: 600px;
    height: 100%;
    // margin-left: 200px;
    background: url(~assets/images/chatbg1.jpg) no-repeat center center;
    background-size: cover;
    .chat-title {
      position: relative;
      height: 80px;
      border-bottom: none;
      background-color: #F8F8F8;
      background-color: rgba(245, 245, 245, .7);
      padding: 0 80px 0 0;
      border-bottom: 1px solid #eee;
      font-size: 14px;
      color: #333;
      overflow: hidden;
      border-radius: 2px 2px 0 0;
      .layim-chat-other {
        position: relative;
        top: 15px;
        left: 15px;
        padding-left: 60px;
        cursor: default;
        max-width: 500px;
      }
      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 50px;
        height: 50px;
        display: inline-block;
        border: none;
        border-radius: 100%;
      }
      .layim-chat-username {
        position: relative;
        top: 5px;
        font-size: 18px;
        color: #444;
      }
      .layim-chat-status {
        margin-top: 6px;
        font-size: 14px;
        color: #999;
      }
      .layui-layer-setwin {
        position: absolute;
        right: 12px;
        top: 12px;
        font-size: 0;
        span {
          position: relative;
          margin-left: 10px;
          font-size: 18px;
          display: inline-block;
          vertical-align: top;
          cursor: pointer;
          &:hover {
            color: #2D93CA;
          }
        }
      }
    }
    .layim-chat-bg {
      background-color: rgba(255, 255, 255, .9);
    }
    .layim-chat-main {
      height: 422px;
      padding: 15px 15px 5px;
      overflow-x: hidden;
      overflow-y: auto;
      li {
        position: relative;
        font-size: 0;
        margin-bottom: 10px;
        padding-left: 60px;
        min-height: 68px;
      }
      .layim-chat-user {
        position: absolute;
        left: 3px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 100%;
          display: inline-block;
          border: none;
        }
        cite {
          position: absolute;
          left: 60px;
          top: -2px;
          width: 500px;
          line-height: 24px;
          font-size: 12px;
          white-space: nowrap;
          color: #999;
          text-align: left;
          font-style: normal;
          i {
            padding-left: 15px;
            font-style: normal;
          }
        }
      }
      .layim-chat-text {
        position: relative;
        line-height: 22px;
        margin-top: 25px;
        padding: 8px 15px;
        background-color: #e2e2e2;
        border-radius: 3px;
        color: #333;
        word-break: break-all;
        max-width: 450px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        &:after {
          content: '';
          position: absolute;
          left: -10px;
          top: 13px;
          width: 0;
          height: 0;
          border-style: solid dashed dashed;
          border-color: #e2e2e2 transparent transparent;
          overflow: hidden;
          border-width: 10px;
        }
        img {
          max-width: 100%;
          vertical-align: middle;
          display: inline-block;
          border: none;
        }
      }
      .layim-chat-mine {
        text-align: right;
        padding-left: 0;
        padding-right: 60px;
        .layim-chat-user {
          left: auto;
          right: 3px;
        }
        .layim-chat-text {
          margin-left: 0;
          text-align: left;
          background-color: #5FB878;
          color: #fff;

          &:after {
            left: auto;
            right: -10px;
            border-top-color: #5FB878;
          }
        }
        cite {
          left: auto;
          right: 60px;
          text-align: right;
          i {
            padding-left: 0;
          }
        }
      }
    }
    .layim-chat-tool {
      position: relative;
      padding: 0 8px;
      height: 38px;
      line-height: 38px;
      font-size: 0;
      background-color: rgba(245, 245, 245, 0.7);
      border-bottom: 1px solid #eee;
      span {
        position: relative;
        margin: 0 10px;
        display: inline-block;
        vertical-align: top;
        font-size: 24px;
        cursor: pointer;
      }
      .layim-tool-log {
        position: absolute;
        right: 5px;
        font-size: 14px;
        i {

          font-style: normal;
          vertical-align: 1px;
        }
      }
      input {
        position: absolute;
        font-size: 0;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: .01;
        filter: Alpha(opacity=1);
        cursor: pointer;
      }
    }
    .layim-chat-textarea {
      margin-left: 10px;
      textarea {
        display: block;
        width: 100%;
        padding: 5px 0 0;
        height: 76px;
        line-height: 20px;
        border: none;
        overflow: auto;
        resize: none;
        background: 0 0;
        outline: none;
      }
    }
    .layim-chat-bottom {
      position: relative;
      height: 46px;
      .layim-chat-send {
        position: absolute;
        right: 15px;
        top: 3px;
        height: 32px;
        line-height: 32px;
        font-size: 0;
        cursor: pointer;
      }
      .layim-chat-send span {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
        line-height: 32px;
        margin-left: 5px;
        padding: 0 20px;
        background-color: #5FB878;
        color: #fff;
        border-radius: 3px;
      }
    }
  }
}
.spinrose{
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-top: 32px;
  background: url(../../assets/icon/icon-spin-s.png) no-repeat center;
  background-size: cover;
}
.activespin{
  animation: spin 800ms infinite linear;
}
@keyframes spin {
  0%   { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}
</style>