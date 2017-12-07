<template>
  <div>
    <transition name="el-fade-in-linear">
      <div v-show="!minchatck && !closechatck" class="layui-layim-chat ovh">
        <!-- 当前聊天列表 -->
        <!-- <ul class="layim-chat-list">
          <li class="tabChat" v-for="(item,index) in tabList" @click="selectTargetEmit(item,index)" :class="{active:index===activeItem.activeIndex}" @mouseenter="colseim=index" @mouseleave="colseim=-1" :key="index">
            <img src="//tva1.sinaimg.cn/crop.0.0.512.512.180/6a4acad5jw8eqi6yaholjj20e80e8t9f.jpg">
            <span>{{item.name}}</span>
            <i v-if="colseim === index" class="layui-icon">
              <svg-icon icon-class="icon-shanchu" />
            </i>
          </li>
        </ul> -->
        <!-- 聊天框 -->
        <div class="chat-ct">
          <!-- 头部 -->
          <div class="chat-title">
            <div class="layim-chat-other">
              <img :src="activeItem.avatar || activeItem.avatarUrl" :onerror="defaultImg()">
              <span class="layim-chat-username ell" v-if="activeItem.type === 3">{{activeItem.nickname}}</span>
              <span class="layim-chat-username ell" v-if="activeItem.type === 4">{{activeItem.name}}</span>
              <!-- <p class="layim-chat-status ell">暂无签名</p> -->
            </div>
            <span class="layui-layer-setwin">
              <!-- <span @click="minchatck=true">
                <svg-icon icon-class="icon-iconmianxingshujujian" />
              </span> -->
              <!-- <span>
                <svg-icon icon-class="fullscreen" />
              </span> -->
              <span v-if="activeItem.type === 4" @click="groupFlg=true" >
                <svg-icon  icon-class="qunzu" />
              </span>
              <span @click="togglechatck">
                <svg-icon  icon-class="close" />
              </span>
            </span>
          </div>
          <!-- 主体 -->
          <div class="layim-chat-bg">
            <div class="layim-chat-main"  ref="layscoll">
              <ul>
                <li v-for="(list,index) in activeItem.msgs" :key="index"  :class="{'layim-chat-mine':userInfo.username == list.content.from_id }">
                  <div class="layim-chat-user">
                    <img v-if="userInfo.username == list.content.from_id" :src="userInfo.avatar" :onerror="defaultImg()">
                    <img v-else :src="activeItem.avatar" :onerror="defaultImg()">
                    <cite >
                      {{ userInfo.username == list.content.from_id ? '':filterName(list.content.from_name)}}
                    <i >{{list.content.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</i></cite>
                  </div>   
                  <span v-if="list.success == 1" class="spinrose mr10 activespin"></span>
                  <span v-if="list.success == 3" title="重新发送" @click="repeatSendMsg(list)" class="dib f24 g9 mt30 poi mr10"><svg-icon icon-class="refresh" /></span>
                  <div class="layim-chat-text" v-if="list.content.msg_type=='text'" v-html="list.content.msg_body.text">
                  </div>
                  <div class="layim-chat-img" v-else-if="list.content.msg_type=='image'" ><img :style="{width:cpount(list.content.msg_body.width, list.content.msg_body.height, true),height:cpount(list.content.msg_body.width, list.content.msg_body.height, false)}" @click="showImg(list.content.msg_body.media_url)" :src="list.content.msg_body.media_url" alt=""></div>
                  <div class="layim-chat-file" v-else-if="list.content.msg_type=='file'" >
                      <div class="top display-flex">
                        <div class="image"></div>
                        <p class="text flex-1">{{list.content.msg_body.fname}}</p>
                      </div>
                      <div v-if="userInfo.username == list.content.from_id" class="bottom fix">
                        <span class="l">{{list.content.msg_body.fsize | FileSize}}</span>
                        <span class="r" v-if="list.success == 1">正在发送</span>
                        <span class="r" v-else-if="list.success == 3">发送失败</span>
                        <span class="r" v-else>已发送</span>
                      </div>
                      <div v-else class="bottom fix">
                        <span class="l">{{list.content.msg_body.fsize | FileSize}}</span>
                        <a class="r" :href="list.content.msg_body.media_url" target="_blank" style="color:#2DD0CF">查看文件</a>
                      </div>
                  </div>
                  <div class="layim-chat-file" v-else ><img src="//.sadasd.asd.png" alt=""></div>
                </li>
              </ul>
            </div>
            <!-- 工具栏 -->
            <div class="layim-chat-tool">
              <span class="layui-icon layim-tool-image g9" title="上传图片" layim-event="image">
                <svg-icon icon-class="picture" />
                <input type="file" name="file" @change="sendPicEmit" id="sendPic"></span>
              <span class="layui-icon layim-tool-image g9" style="font-size:19px" title="发送文件" layim-event="image" data-type="file">
                <svg-icon icon-class="icon-wenjian" />
                <input type="file" name="file" @change="sendFileEmit" id="sendFile"></span>
              <!-- <span class="layui-icon layim-tool-audio g9" style="font-size:21px" title="发送网络音频" layim-event="media" data-type="audio">
                <svg-icon icon-class="icon-erji" />
              </span>
              <span class="layui-icon layim-tool-video g9" title="发送网络视频" layim-event="media" data-type="video">
                <svg-icon icon-class="video" />
              </span> -->
              <span class="layim-tool-log" layim-event="chatLog">
                <svg-icon class="f20 g9" icon-class="time" />
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
        <!-- 群信息 -->
        <div class="group-setting-container" :class="{'in':groupFlg}">
          <div class="group-setting-header pl20 pr20">
            <div class="group-setting-title">
              群信息
              <span class="r poi" @click="groupFlg=false">
                <svg-icon  icon-class="close" />
              </span>
            </div>
            <div class="group-setting-info fix">
              <img class="l" :src="activeItem.avatar" :onerror="defaultImg(activeItem.avatarUrl)">
              <div class="ml60 ovh">
                <p class="ell pl10 pt5">{{activeItem.name}}</p>
                <p class="g9 f12 pl10 pt5">群描述:未填写</p>
              </div>
            </div>
          </div>
          <div class="group-setting-list">
            <div class="group-setting-add">
              <span>群人数</span>
              <span>{{member_list.length}}</span>
              <span class="r blue poi" @click="addpersonGroup.dialogVisible=true;addpersonGroup.value=[]">添加群成员</span>
            </div>
          </div>
          <ul class="group-setting-scroll">
            <li v-for="(obj,index) in member_list" :key="index">
              <img class="avatar l" :src="obj.avatar" :onerror="defaultImg(activeItem.avatarUrl)" alt="">
              <div class="ml40 ovh" style="line-height:50px;height:50px">
                <span class="dib w150 ell">{{ obj.nickname||obj.username}}</span>
                <span v-if="obj.flag" class="r blue mr10" title="群主"><svg-icon  icon-class="qunzhuhuangguan" /></span>
              </div>
              <span v-if="isqunzhu" v-show="!obj.flag" class="poi close" @click="JIMdelGroupMembers(obj,index)"><svg-icon  icon-class="close" /></span>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="el-fade-in-linear">
      <div v-if="minchatck && !closechatck" @click="minchatck=false" class="layui-layim-close">
        <img :src="activeItem.avatar" :onerror="defaultImg(activeItem.avatarUrl)">
        <span  v-if="activeItem.type === 3">{{activeItem.username}}</span>
        <span v-if="activeItem.type === 4">{{activeItem.name}}</span>
      </div>
    </transition>
    <!-- 图片预览 -->
    <transition name="el-fade-in-linear">
      <div v-if="imgshow.flg" @click="imgshow.flg=false" class="imgshow">
        <div class="wats">
          <span style="display: table-cell; vertical-align: middle; ">
            <img :src="imgshow.src">
          </span>
        </div>
      </div>
    </transition>
    <!-- 添加群成员 -->
    <el-dialog title="添加群成员" class="custom-dialog" :visible.sync="addpersonGroup.dialogVisible">
      <div>
        <span class="mb10 db">群成员</span>
        <el-transfer filterable :filter-method="addpersonGroup.filterMethod" filter-placeholder="请输入用户名"  v-model="addpersonGroup.value" :data="addpersonGroup.data">
        </el-transfer>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addpersonGroup.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCreatGroup">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getJMessage, authPayload, errorApiTip } from '@/utils/IM'
import { imgReader, getFileFormData, getExt } from '@/utils/utils'
import { imgUpLoad } from '@/api/upload'
import { setHistoryIm } from '@/api/message'
import drag from '@/directive/drag/index.js'
import single_avatar from '@/assets/images/single-avatar.svg'
import { fetchList } from '@/api/department'
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
    },
    userArr: {
      type: null
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
      groupFlg: false,
      isqunzhu: false,
      imgshow: {
        flg: false,
        src: ''
      },
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
      addpersonGroup: {
        dialogVisible: false,
        data: [],
        value: [],
        filterMethod(query, item) {
          return item.label.indexOf(query) > -1
        }
      },
      member_list: [],
      userList: [],
      msgKey: 0,
      msgs: [],
      tabList: [] // 当前tab列表
    }
  },
  watch: {
    activeUser(val, oldVal) {
      this.minchatck = false
      this.groupFlg = false
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
    fetchList({ start_index: 0, length: 10000 }).then((data) => {
      const userList = data.info.list.filter(obj => { // 获取正常状态的用户
        return !obj.status
      })
      this.userList = userList
    })
  },
  methods: {
    filterName(strid) {
      let name = ''
      const id = strid.substring(5)
      this.userList.forEach(element => {
        if (element._id === Number(id)) {
          name = element.name
        }
      })
      return name
    },
    defaultImg(ads) {
      // return 'this.onerror=null;this.src="' + ads + '"'
      if (!ads) {
        ads = single_avatar
      }
      return 'this.src="' + ads + '"'
    },
    showImg(src) { //  放大图片
      this.imgshow.flg = true
      this.imgshow.src = src
    },
    cpount(wi, hi, flg) { // 计算图片宽高
      let w = 0
      let h = 0
      if (wi / hi > 1) { // 宽大于高
        if (wi > 219) {
          w = 219
          h = w * hi / wi
        } else {
          w = wi
          h = hi
        }
      } else { // 高大宽
        if (hi > 300) {
          h = 300
          w = wi * h / hi
        } else {
          w = wi
          h = hi
        }
      }
      return flg ? w + 'px' : h + 'px'
    },
    togglechatck() {
      this.$emit('update:closechatck', true)
    },
    getActiveMsg() {
      const m = this.messageList
      const a = this.activeItem
      if (m[a.id]) { // 判断当前用户是否存在历史消息
        a.msgs = m[a.id].msgs
        this.msgs = m[a.id].msgs
        for (let index = 0; index < this.msgs.length; index++) {
          const element = this.msgs[index]
          if (element.content.msg_type === 'image' || element.content.msg_type === 'file') {
            this.JIM.getResource({ media_id: element.content.msg_body.media_id })
              .onSuccess((urlInfo) => {
                this.$set(this.msgs[index].content.msg_body, 'media_url', urlInfo.url)
              }).onFail((errr) => {
                if (!this.msgs[index].content.msg_body.media_url) {
                  this.$set(this.msgs[index].content.msg_body, 'media_url', '')
                }
              })
          }
        }
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
      this.getActiveMsg()
      if (this.activeItem.type === 4) {
        this.JIMgetGroupMembers(activeItem.id)
      }
    },
    repeatSendMsg(msg) { // 重发消息
      msg.success = 1
      if (msg.content.msg_type === 'text') {
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
      } else if (msg.content.msg_type === 'image') {
        this.sendPicContent(msg, 'value', 'data', true)
      } else if (msg.content.msg_type === 'file') {
        this.sendFileContent(msg, true)
      }
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
      if (!data.content) {
        return false
      }
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
        msgKey: resl.msgKey || this.msgKey++
      }
      if (activePerson.type === 3) {
        const singleMsg = {
          target_username: activePerson.username,
          content: data.content,
          need_receipt: false
        }
        if (data.extras) {
          singleMsg.extras = data.extras
        }
        msgs.singleMsg = singleMsg
        msgs.msg_type = 3
        if (!data.repeatSend) {
          this.requstData.content = ''
        }
        this.JIMsendSingleMsg(singleMsg, msgs)
        // 发送群组消息
      } else if (activePerson.type === 4) {
        const groupMsg = {
          target_gid: activePerson.gid,
          content: data.content,
          need_receipt: false
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
        if (!data.repeatSend) {
          this.requstData.content = ''
        }
        this.sendGroupMsg(groupMsg, msgs)
      }
      if (!data.repeatSend) {
        const msglist = this.messageList // 离线消息列表
        if (msglist[activePerson.id]) {
          msglist[activePerson.id].msgs.push(msgs)
        } else {
          msglist[activePerson.id] = { // 构造消息记录
            from_appkey: '',
            from_username: this.userInfo.username,
            key: '',
            msg_type: activePerson.type,
            msgs: [msgs],
            receipt_msgs: '',
            unread_msg_count: 0
          }
          this.getActiveMsg()
        }
      }
      // this.$store.dispatch('SetMsgList', msglist)
    }, // end 文本消息
    sendPicEmit(event) { // 发送图片消息
      const file = document.getElementById('sendPic')
      if (!event.target.files[0]) {
        return
      }
      let msgs
      const img = getFileFormData(event.target)
      imgReader(file, () => {
        this.$message.error('选择的文件必须是图片')
      }, (value) => {
        this.sendPicContent(msgs, value, img)
      })
    }, // end发送图片消息
    sendPicContent(msgs, value, data, repeatSend) {
      if (!repeatSend) {
        msgs = {
          content: {
            from_id: this.userInfo.username,
            create_time: new Date().getTime(),
            msg_type: 'image',
            msg_body: {
              media_url: value.src,
              width: value.width,
              height: value.height
            }
          },
          ctime_ms: new Date().getTime(),
          success: 1,
          msgKey: this.msgKey++,
          unread_count: 0
        }
        // 发送单聊图片
        if (this.activeItem.type === 3) {
          const singlePicFormData = {
            target_username: this.activeItem.username,
            appkey: authPayload.appKey,
            image: data,
            need_receipt: false
          }
          msgs.singlePicFormData = singlePicFormData
          msgs.msg_type = 3
        // 发送群聊图片
        } else if (this.activeItem.type === 4) {
          const groupPicFormData = {
            target_gid: this.activeItem.gid,
            image: data,
            need_receipt: false
          }
          msgs.groupPicFormData = groupPicFormData
          msgs.msg_type = 4
        }
        const msglist = this.messageList // 离线消息列表
        imgUpLoad({ FileData: value.src, type: 1 }).then(obj => {
        })
        if (msglist[this.activeItem.id]) {
          msglist[this.activeItem.id].msgs.push(msgs)
        } else {
          msglist[this.activeItem.id] = { // 构造消息记录
            from_appkey: '',
            from_username: this.userInfo.username,
            key: '',
            msg_type: this.activeItem.type,
            msgs: [msgs],
            receipt_msgs: '',
            unread_msg_count: 0
          }
          this.getActiveMsg()
        }
      }
      // 发送单聊图片
      if (this.activeItem.type === 3) {
        this.JIMsendSinglePic(msgs.singlePicFormData, msgs)
      // 发送群聊图片
      } else if (this.activeItem.type === 4) {
        this.JIMsendGroupPic(msgs.groupPicFormData, msgs)
      }
    },
    sendFileEmit(event) { // 发送文件消息
      if (!event.target.files[0]) {
        return
      }
      const file = getFileFormData(event.target)
      this.sendFileContent({
        file,
        fileData: event.target.files[0]
      })
    }, // end发送文件消息
    sendFileContent(data, repeatSend) {
      let msgs
      if (!repeatSend) {
        const ext = getExt(data.fileData.name)
        msgs = {
          content: {
            create_time: (new Date()).getTime(),
            msg_type: 'file',
            from_id: this.userInfo.username,
            from_name: this.userInfo.nickname,
            msg_body: {
              fname: data.fileData.name,
              fsize: data.fileData.size,
              extras: {
                fileSize: data.fileData.size,
                fileType: ext
              }
            }
          },
          ctime_ms: (new Date()).getTime(),
          success: 1,
          msgKey: this.msgKey++,
          unread_count: 0
        }
        // 发送单聊文件
        if (this.activeItem.type === 3) {
          const ext = getExt(data.fileData.name)
          const singleFile = {
            file: data.file,
            target_username: this.activeItem.username,
            appkey: authPayload.appKey,
            extras: {
              fileSize: data.fileData.size,
              fileType: ext
            },
            need_receipt: false
          }
          msgs.singleFile = singleFile
          msgs.msg_type = 3
        // 发送群聊文件
        } else if (this.activeItem.type === 4) {
          const ext = getExt(data.fileData.name)
          const groupFile = {
            file: data.file,
            target_gid: this.activeItem.gid,
            extras: {
              fileSize: data.fileData.size,
              fileType: ext
            },
            need_receipt: false
          }
          msgs.groupFile = groupFile
          msgs.msg_type = 4
        }
        const msglist = this.messageList // 离线消息列表
        if (msglist[this.activeItem.id]) {
          msglist[this.activeItem.id].msgs.push(msgs)
        } else {
          msglist[this.activeItem.id] = { // 构造消息记录
            from_appkey: '',
            from_username: this.userInfo.username,
            key: '',
            msg_type: this.activeItem.type,
            msgs: [msgs],
            receipt_msgs: '',
            unread_msg_count: 0
          }
          this.getActiveMsg()
        }
      }
      if (repeatSend) {
        msgs = data
      }
      // 发送单聊文件
      if (this.activeItem.type === 3) {
        this.JIMsendSingleFile(msgs.singleFile, msgs)
      // 发送群聊文件
      } else if (this.activeItem.type === 4) {
        this.JIMsendGroupFile(msgs.groupFile, msgs)
      }
    },
    JIMsendSingleMsg(singleMsg, msgs) { // 发送单人文本消息
      this.JIM.sendSingleMsg(singleMsg)
        .onSuccess((data, msg) => {
          this.sendMsgComplete(true, msg, msgs)
        }).onFail((erros) => {
          this.sendMsgComplete(false, '', msgs)
        }).onTimeout((data) => {
          this.sendMsgComplete(false, '', msgs)
        })
    },
    sendGroupMsg(groupMsg, msgs) { // 发送群组文本消息
      this.JIM.sendGroupMsg(groupMsg)
        .onSuccess((data, msg) => {
          this.sendMsgComplete(true, msg, msgs)
        }).onFail((erros) => {
          this.sendMsgComplete(false, '', msgs)
        }).onTimeout((data) => {
          this.sendMsgComplete(false, '', msgs)
        })
    },
    JIMsendSinglePic(singlePicFormData, msgs) { // 发送单人图片消息
      this.JIM.sendSinglePic(singlePicFormData)
        .onSuccess((data, msg) => {
          this.sendMsgComplete(true, msg, msgs)
        }).onFail((erros) => {
          this.sendMsgComplete(false, '', msgs)
        }).onTimeout((data) => {
          this.sendMsgComplete(false, '', msgs)
        })
    },
    JIMsendGroupPic(groupPicFormData, msgs) { // 发送群组图片消息
      this.JIM.sendGroupPic(groupPicFormData)
        .onSuccess((data, msg) => {
          this.sendMsgComplete(true, msg, msgs)
        }).onFail((erros) => {
          this.sendMsgComplete(false, '', msgs)
        }).onTimeout((data) => {
          this.sendMsgComplete(false, '', msgs)
        })
    },
    JIMsendSingleFile(singleFileData, msgs) { // 发送单人文件消息
      this.JIM.sendSingleFile(singleFileData).onSuccess((data, msg) => {
        this.sendMsgComplete(true, msg, msgs)
      }).onFail((erros) => {
        this.sendMsgComplete(false, '', msgs)
      }).onTimeout((data) => {
        this.sendMsgComplete(false, '', msgs)
      })
    },
    JIMsendGroupFile(groupFileData, msgs) { // 发送群组文件消息
      this.JIM.sendGroupFile(groupFileData)
        .onSuccess((data, msg) => {
          this.sendMsgComplete(true, msg, msgs)
        }).onFail((erros) => {
          this.sendMsgComplete(false, '', msgs)
        }).onTimeout((data) => {
          this.sendMsgComplete(false, '', msgs)
        })
    },
    sendMsgComplete(flg, msg, msgs) { // 发送消息完成
      if (this.messageList[this.activeItem.id]) {
        const arr = this.messageList[this.activeItem.id].msgs
        for (let index = 0; index < arr.length; index++) {
          if (msgs.msgKey === arr[index].msgKey) {
            if (flg) { // 发送成功
              this.setHistoryIm(msgs)
              if (msg.content.msg_type === 'image' || msg.content.msg_type === 'file') {
                this.JIM.getResource({ media_id: msg.content.msg_body.media_id })
                  .onSuccess((urlInfo) => {
                    arr[index].success = 2
                    msg.content.msg_body.media_url = urlInfo.url
                    arr[index] = msg
                    // this.$set(this.msgs[index].content.msg_body, 'media_url', urlInfo.url)
                  }).onFail((errr) => {
                    // this.$set(this.msgs[index].content.msg_body, 'media_url', '')
                    arr[index].success = 2
                    msg.content.msg_body.media_url = ''
                    arr[index] = msg
                  })
              } else {
                arr[index].success = 2
                arr[index] = msg
              }
            } else { // 发送失败
              arr[index].success = 3
            }
          }
        }
      }
    }, // end 完成消息发送
    setHistoryIm(msgs) { // IM消息存储
      const requst = {
        user_id: msgs.content.from_id,
        im_type: 0,
        im_id: this.activeItem.id,
        message_type: 0,
        message_content: ''
      }
      if (msgs.msg_type === 4) {
        requst.im_type = 1
      }
      if (msgs.content.msg_type === 'text') {
        requst.message_content = msgs.content.msg_body.text
      } else if (msgs.content.msg_type === 'image') {
        requst.message_type = 1
        requst.message_content = msgs.content.msg_body.media_url
      } else if (msgs.content.msg_type === 'file') {
        requst.message_type = 4
        requst.message_content = msgs.content.msg_body.fname
      }
      setHistoryIm(requst)
    },
    JIMgetGroupMembers(gid) { // 获取群组成员
      this.member_list = []
      this.JIM.getGroupMembers({
        gid: gid
      }).onSuccess((data) => {
        if (data.member_list.length) {
          this.member_list.push(...data.member_list)
          for (let i = 0; i < data.member_list.length; i++) {
            this.member_list[i].nickname = this.filterName(this.member_list[i].username)
            console.log(this.member_list[i].nickname)
            if (this.member_list[i].flag) {
              if (this.member_list[i].username === this.userInfo.username) {
                this.isqunzhu = true
              }
              const arr = this.member_list.splice(i, 1) // 把群主提到第一位
              this.member_list.unshift(arr[0])
            }
          }
        }
        this.getUserArr()
      }).onFail((data) => {
        errorApiTip(data)
      })
    },
    getUserArr() { // 获取可添加的群成员
      const userArr = []
      this.userList.forEach((obj) => {
        let flg = true
        this.member_list.forEach(element => {
          const username = 'yzwg_' + obj._id
          if (username === element.username) {
            flg = false
          }
        })
        if (flg) {
          userArr.push({
            label: this.filterName('yzwg_' + obj._id),
            key: 'yzwg_' + obj._id
          })
        }
      })
      this.addpersonGroup.data = userArr
    },
    addCreatGroup() { // 添加群成员
      if (!this.addpersonGroup.value.length) {
        return false
      }
      const member_usernames = []
      this.addpersonGroup.value.forEach(element => {
        const obj = {
          username: element,
          appkey: authPayload.appKey
        }
        member_usernames.push(obj)
      })
      const reqest = {
        gid: this.activeItem.id,
        member_usernames: member_usernames
      }
      this.JIM.addGroupMembers(reqest).onSuccess((res) => {
        this.addpersonGroup.dialogVisible = false
        this.$message({
          message: '添加成功！',
          type: 'success',
          duration: 4 * 1000
        })
        this.JIMgetGroupMembers(this.activeItem.id)
      }).onFail((error) => {
        errorApiTip(error)
      })
    },
    JIMdelGroupMembers(item, index) {
      this.$confirm('确认删除这个用户？').then(() => {
        this.JIM.delGroupMembers({
          gid: this.activeItem.id,
          member_usernames: [{ 'username': item.username, 'appkey': authPayload.appKey }]
        }).onSuccess((data) => {
          this.member_list.splice(index, 1)
          this.$message({
            message: '删除成功！',
            type: 'success',
            duration: 4 * 1000
          })
        }).onFail((data) => {
          // 同上
          this.$message({
            message: '删除失败，请稍后再试',
            type: 'error'
          })
        })
      }).catch(() => { console.log('取消修改') })
    }
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
  min-width: 650px;
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
    width: 650px;
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
      .layim-chat-file{
        position: relative;
        display: inline-block;
        vertical-align: top;
        margin-top: 25px;
        width: 236px;
        height: 110px;
        background: #F2F6FB;
        border: 1px solid #E2E9F0;
        border-radius: 0 5px 5px 5px;
        .top{
          padding: 18px 18px 14px 18px;
        }
        .display-flex {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
        }
        .bottom{
          width: 100%;
          height: 27px;
          margin-top: 1px;
          line-height: 27px;
          font-size: 12px;
          color: #989898;
          padding: 0 7px;
          border-top: 1px solid #DCDCDC;
        }
        .image{
          width: 50px;
          height: 50px;
          margin-right: 18px;
          background: url(~assets/icon/file-logo.svg) center center no-repeat;
          background-size: 50px;
        }
        .text{
          line-height: 25px;
          text-align: left;
          font-size: 18px;
          color: #5A5A5A;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
          word-break: break-word;
        }
        .flex-1 {
          -webkit-box-flex: 1;
          -moz-flex: 1;
          -ms-flex: 1;
          flex: 1;
          overflow: hidden;
        }
      }
      .layim-chat-img{
        max-width: 219px;
        max-height: 300px;
        cursor: -webkit-zoom-in;
        cursor: zoom-in;
        border-radius: 5px;
        overflow: hidden;
        display: inline-block;
        margin-top: 25px;
        .ws{
          width: 100%;
          height: auto;
        }
        .hs{
          width: 100%;
          height: auto;
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
  background: url(~assets/icon/icon-spin-s.png) no-repeat center;
  background-size: cover;
}
.activespin{
  animation: spin 800ms infinite linear;
}
.imgshow{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  padding: 20px 0;
  background-color: rgba(0, 0, 0, .9);
  text-align: center;
  .wats{
    width: 100%;
    height: 100%;
    display: table;
    img{
      display: inline-block;
      max-width: 100%;
      max-height: 100%;
    }
  }
}
@keyframes spin {
  0%   { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}
.group-setting-container{
  width: 260px;
  height: 100%;
  background: #fff;
  position: absolute;
  top: 80px;
  right: 0;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  border-bottom-right-radius: 3px;
  z-index: 4;
  transition: all 0.5s;
  transform: translateX(101%);
  &.in{
    transform: translateX(0);
  }
  .group-setting-title{
    height: 40px;
    border-bottom: 1px solid #E3E6EB;
    line-height: 40px;
    font-size: 14px;
    color: #2C2C2C;
    margin-bottom: 10px;
  }
  .group-setting-info{
    img{
      display: block;
      width: 60px;
      height: 60px;
    }
    margin-bottom: 10px;
  }
  .group-setting-add{
    line-height: 34px;
    height: 34px;
    font-size: 12px;
    color: #2C2C2C;
    border-top: 1px solid #E3E6EB;
  }
  .group-setting-list{
    padding: 0 20px;
  }
  .group-setting-scroll{
    width: 100%;
    height: 300px;
    overflow: auto;
    li{
      padding-left: 20px;
      font-size: 14px;
      color: #2C2C2C;
      position: relative;
      list-style-type: none;
      .avatar{
        display: block;
        width: 30px;
        height: 30px;
        margin: 10px 10px 0 0;
      }
      &:hover{
        background-color: #F2F6FB;
        .close{
          display: inline-block;
        }
      }
      .close{
        position: absolute;
        display: none;
        width: 20px;
        height: 20px;
        top: 50%;
        left: 2px;
        font-size: 12px;
        margin-top: -6px;
        color: red;
      }
    }
  }
}
.ml60{
  margin-left: 60px;
}
.custom-dialog{
  .el-dialog{
    width: 600px
  }
}
</style>