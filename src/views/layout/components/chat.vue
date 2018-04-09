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
              <div class="layui-layim-user">{{userInfo.nickname}}</div>
              <div class="layui-layim-status">
                <span class="layim-status-online"></span>
              </div>
              <span class="layui-layim-remark">{{userInfo.mobile}}</span>
            </div>
            <!-- 面板 -->
            <div class="rel">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane name="first">
                  <span slot="label">
                    <svg-icon icon-class="message_fill" />
                  </span>
                  <ul @mouseenter="hoverflow('on')" @mouseleave="hoverflow('off')" class="layim-tab-content layui-show" :style="{overflow:overflow}">
                    <li>
                      <ul class="layui-layim-list layui-show layim-list-history">
                        <li @click="imCkPanle(list)" v-for="(list, index) in conversations" :key="index" >
                          <img :src="list.avatar" :onerror="defaultImg(list.avatarUrl)">
                          <span v-if="list.type === 3">{{list.nickname}}</span>
                          <time class="r g9 time">{{list.mtime | reducerDate}}</time>
                          <span v-if="list.type === 4">{{list.name}}</span>
                          <p >{{list.content && list.content.msg_body && list.content.msg_body.text}}
                            <em v-if="list.unread_msg_count" class="count">{{list.unread_msg_count > 100 ? '99+': list.unread_msg_count}}</em>
                          </p>
                          <p v-if="list.content.msg_type=='image'||list.content.msg_body.type=='image'">[图片]
                            <em v-if="list.unread_msg_count" class="count">{{list.unread_msg_count > 100 ? '99+': list.unread_msg_count}}</em>
                          </p>
                          <p v-else-if="list.content.msg_type=='file'|| list.content.msg_type=='custom'">[文件]
                            <em v-if="list.unread_msg_count" class="count">{{list.unread_msg_count > 100 ? '99+': list.unread_msg_count}}</em>
                          </p>

                        </li>
                        <li v-if="!conversations.length" style="padding-top:30%;font-size: 12px;">你当前还没有任何消息~</li>
                      </ul>
                    </li>
                  </ul>
                </el-tab-pane>
                <el-tab-pane name="second">
                  <span slot="label">
                    <svg-icon icon-class="people_fill" />
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
                          <img :src="clist.avatar" :onerror="defaultImg(clist.avatarUrl)">
                          <span :class="clist.isOnline?'isOnline':''">{{clist.nickname}}</span>
                          <p>{{clist.mobile}}</p>
                        </li>
                      </ul>
                    </el-collapse-item>
                  </el-collapse>
                </el-tab-pane>
                <el-tab-pane name="third">
                  <span slot="label">
                    <svg-icon icon-class="group_fill" />
                  </span>
                  <ul @mouseenter="hoverflow('on')" @mouseleave="hoverflow('off')" class="layim-tab-content" :style="{overflow:overflow}">
                    <li>
                      <ul class="layui-layim-list layui-show layim-list-group">
                        <li @click="imCkPanle(list)" v-for="(list, index) in group_list" :key="index">
                          <img :src="list.avatar" :onerror="defaultImg(list.avatarUrl)">
                          <span>{{list.name}}</span>
                          <p>{{list.desc  || '暂无群描述'}}</p>
                        </li>
                        <li v-if="!group_list.length" style="padding-top:30%;font-size: 12px;">你还没有添加过群~</li>
                      </ul>
                    </li>
                  </ul>
                </el-tab-pane>
              </el-tabs>
              <!-- 搜索面板 -->
              <div class="seach-panle" v-if="searchflg" >
                <ul v-if="searchData.length > 0" class="layui-layim-list">
                  <li @click="imCkPanle(clist)" v-for="(clist, index) in searchData" :key="index">
                    <img :src="clist.avatar" :onerror="defaultImg(clist.avatarUrl)">
                    <span>{{clist.nickname}}</span>
                    <p>{{clist.mobile}}</p>
                  </li>
                </ul>
                <p v-else class="mt30 tc">无搜索结果...</p>
              </div>
            </div>
            <!-- 底部 -->
            <ul class="layui-unselect layui-layim-tool">
              <li class="layui-icon layim-tool-search" @click="searchflg=true" title="搜索">
                <svg-icon icon-class="icon-fangdajing" />
              </li>
              <li class="layui-icon layim-tool-msgbox vh" title="消息盒子">
                <svg-icon icon-class="icon-laba" />
                <span v-if="totalCount" class="layui-anim layui-anim-loop layer-anim-05">{{totalCount}}</span>
              </li>
              <li class="layui-icon layim-tool-find" @click="creatGroup.dialogVisible = true" title="创建群">
                <svg-icon icon-class="icon-jia1" />
              </li>
              <li class="layui-icon layim-tool-about vh" title="关于">
                <svg-icon icon-class="icon-guanyu" />
              </li>
              <li class="layui-icon layim-tool-msgbox " title="消息盒子">
                <svg-icon icon-class="icon-laba" />
                <span v-if="totalCount" class="layui-anim layui-anim-loop layer-anim-05">{{totalCount}}</span>
              </li>
            </ul>
            <div class="layui-layim-search" v-if="searchflg" style="display: block;">
              <input v-model="searchkey">
              <label class="layui-icon" layim-event="closeSearch" @click="searchflg=false">
                <svg-icon icon-class="close" />
              </label>
            </div>
          </div>
        </div>
        <!-- 主体 -->
        <span class="layui-layer-setwin"  @click="colseIm=true">
          <svg-icon class="layui-layer-ico layui-layer-close layui-layer-close1" icon-class="close" />
        </span>
      </div>
    </transition>
    <transition name="el-zoom-in-bottom">
      <div v-if="colseIm" @click="colseIm=false" class="layui-layim-close">
        <img  :src="avteinfo">
        <el-badge :value="totalCount" class="item">
          <span >我的聊天 </span>
        </el-badge>
      </div>
    </transition>
    <transition name="el-fade-in-linear">
       <chatck :closechatck.sync="closechatck" :activeUser="activeUser" :userArr="userArr" :newmsg="newmsg" ></chatck>
    </transition>
    <el-dialog title="创建群成员"  class="custom-dialog" :visible.sync="creatGroup.dialogVisible">
      <div class="pl40">
        <div class="mb10">
          <span class="mb10 db">群名称</span>
          <el-input class="w300" v-model="creatGroup.name" placeholder="请输入群名称"></el-input>
        </div>
        <div class="mb10">
          <span class="mb10 db">群描述</span>
          <el-input class="w300" v-model="creatGroup.info" placeholder="请输入群描述"></el-input>
        </div>
        <span class="mb10 db">群成员</span>
        <el-transfer filterable :filter-method="creatGroup.filterMethod" filter-placeholder="请输入用户名"  v-model="creatGroup.value" :data="creatGroup.data">
        </el-transfer>
        <!-- <span class="mb10 db mt20">是否创建部门<span class="g9 f12">(在创建群同时创建部门并添加成员）</span></span>
        <el-switch v-model="creatGroup.createDep" on-text="" off-text=""></el-switch> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="creatGroup.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="hanldeCreatGroup">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import drag from '@/directive/drag/index.js'
import chatck from './chatck'
import { fetchList, fetchDepartments } from '@/api/department'
import { getJMessage, authPayload, errorApiTip } from '@/utils/IM'
import { createSignature, imNotification } from '@/utils/utils'
import { reducerDate } from '@/utils/index'
import { md5 } from '@/utils/md5'
import group_avatar from '@/assets/images/group-avatar.svg'
import single_avatar from '@/assets/images/single-avatar.svg'
import avteinfo from '@/assets/images/avteinfo.svg'
import store from '@/store/index'
import axios from 'axios'
import Bus from '@/utils/bus'
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
    searchData() {
      var search = this.searchkey
      if (search) {
        return this.searchList.filter((obj) => {
          return String(obj['nickname']).toLowerCase().indexOf(search) > -1
        })
      }
      return []
    }
  },
  data() {
    return {
      avteinfo,
      hasOffline: 0,
      colseIm: true,
      searchflg: false,
      closechatck: true,
      activeName: 'first',
      JIM: null,
      overflow: 'hidden',
      searchkey: '',
      userArr: [],
      searchList: [],
      friend_list: [],
      group_list: [],
      conversations: [],
      activeUser: null,
      MsgList: null,
      newmsg: null,
      totalCount: 0,
      userInfo: {
        username: '',
        signature: ''
      },
      creatGroup: {
        dialogVisible: false,
        name: '',
        info: '',
        createDep: false,
        data: [],
        value: [],
        filterMethod(query, item) {
          return item.label.indexOf(query) > -1
        }
      }
    }
  },
  created() {
    if (window.Notification) {
      Notification.requestPermission((permission) => { // 通知用户显示通知
      })
    }
    this.JIMInit()
    Bus.$on('chatVel', id => { // 监听地图页面点击人员图标聊天
      const friend_list = this.friend_list
      friend_list.forEach(element => {
        element.list.forEach(els => {
          const tid = els.username.substring(5)
          if (id === tid) {
            this.imCkPanle(els)
          }
        })
      })
      this.colseIm = false
    })
  },
  methods: {
    filterName(strid) {
      let name = ''
      const id = strid.substring(5)
      this.userArr.forEach(element => {
        if (element._id === Number(id)) {
          name = element.name
        }
      })
      return name
    },
    defaultImg(ads) {
      return 'this.src="' + ads + '"'
    },
    hoverflow(type) {
      if (type === 'on') {
        this.overflow = 'auto'
      } else {
        this.overflow = 'hidden'
      }
    },
    hanldeCreatGroup() { // 创建群组
      if (!this.creatGroup.name) {
        this.$message({ message: '请填写群名称', type: 'warning' })
        return false
      }
      if (!this.creatGroup.value.length) {
        this.$message({ message: '请选择群成员', type: 'warning' })
        return false
      }
      const data = {
        group_name: this.creatGroup.name,
        group_description: this.creatGroup.info,
        usernames: this.creatGroup.value
      }
      this.JIMcreateGroup(data)
      if (this.creatGroup.createDep) { // 创建部门

      }
      this.creatGroup = Object.assign(this.creatGroup, {
        dialogVisible: false,
        name: '',
        info: '',
        createDep: false,
        value: []
      })
    },
    handleClick(tab, event) {
    },
    getGropsUser(arr) { // 获取用户列表
      const userArr = []
      const data = []
      userArr.push(...arr)
      userArr.forEach((obj) => {
        data.push({
          // label: obj.nickname,
          label: this.filterName(obj.username),
          key: obj.username
        })
      })
      this.creatGroup.data = data
    },
    imCkPanle(item) {
      this.closechatck = false
      this.activeUser = item
      let req = {}
      if (item.type === 3) {
        req = {
          username: item.username
        }
        this.UpdateConversationList(item.username, true)
      } else {
        req = {
          gid: item.gid
        }
        this.UpdateConversationList(item.gid, true)
      }
      this.resetUnreadCount(req)
    },
    UpdateConversationList(id, flg, content) {
      // 更新会话列表
      const cons = []
      cons.push(...this.conversations)
      for (let i = 0; i < cons.length; i++) {
        if (cons[i].gid) {
          cons[i].gid = Number(cons[i].gid)
        }
        if (id === cons[i].gid || id === cons[i].username) {
          const arr = this.conversations.splice(i, 1) // 把收到的消息的会话提到第一位
          if (content) {
            arr[0].content = content
            arr[0].mtime = arr[0].content.create_time
          }
          if (flg) { // 设置已读
            this.totalCount = this.totalCount - arr[0].unread_msg_count
            arr[0].unread_msg_count = 0
          } else {
            arr[0].unread_msg_count++ // 消息+1
            this.totalCount++
          }
          this.conversations.unshift(arr[0])
          break
        }
      }
    },
    receivedMsg(data) {
      const msglist = store.getters.messageList // 离线消息列表
      let id = ''
      data.messages.forEach(function(element) { // 循环收到的消息
        if (element.msg_type === 3) {
          id = element.from_username
        } else if (element.msg_type === 4) {
          id = element.from_gid
        }
        if (msglist[id]) { // 判断新消息是否存在已有的离线消息列表中
          msglist[id].msgs.push(element) // 把新消息插入到离线消息列表中
          if (!this.closechatck) { // 如果当前存在聊天窗口且是当前窗口的消息
            if (this.activeUser.username === id || this.activeUser.gid === id) {
              // 通知聊天窗口接受新的聊天消息
              this.newmsg = element
              this.UpdateConversationList(id, true, element.content)
            } else {
              this.UpdateConversationList(id, false, element.content)
            }
          } else {
            this.UpdateConversationList(id, false, element.content)
          }
        } else { // 更新会话列表，
          if (element.msg_type === 3) {
            msglist[id] = {
              from_username: element.from_username,
              key: element.key,
              msgs: [],
              msg_type: 3
            }
          } else if (element.msg_type === 4) {
            msglist[id] = {
              from_gid: element.from_gid,
              key: element.key,
              msgs: [],
              msg_type: 4
            }
          }
          console.log('更新会话列表')
          msglist[id].msgs.push(element)
          console.log(msglist[id])
          this.JIMgetConversation()
        }
        this.MsgList = msglist
        this.$store.dispatch('SetMsgList', msglist)
      }, this)
    },
    JIMInit() { // IM初始化
      this.JIM = getJMessage()
      const timestamp = new Date().getTime()
      const signature = createSignature(timestamp)
      this.JIM.init({
        appkey: authPayload.appKey,
        random_str: authPayload.randomStr,
        signature: signature,
        timestamp: timestamp,
        flag: authPayload.flag
      }).onSuccess((data) => {
        this.JIMLogin()
      }).onFail((error) => {
        errorApiTip(error)
      })
    },
    JIMLogin() {
      console.log('im', store.getters.password)
      this.JIM.login({
        username: 'yzwg_' + store.getters.useinfo._id,
        password: md5(store.getters.password),
        is_md5: true
      }).onSuccess((login) => {
        try {
          this.JIMgetUserInfo(login.username)
          this.JIMgetFriendList()
          this.JIMgetGroups()
          this.onMsgReceive() // 消息监听
          this.onSyncConversation() // 消息监听
          this.onMsgReceiptChange()
          this.onMutiUnreadMsgUpdate()
          this.onSyncMsgReceipt()
        } catch (error) {
          console.log(error)
        }
      }).onFail((error) => {
        errorApiTip(error)
        store.dispatch('FedLogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
        // this.JIMregister()
      })
    },
    JIMregister() {
      this.JIM.register({
        username: 'yzwg_' + store.getters.useinfo._id,
        password: store.getters.password,
        is_md5: true,
        extras: '',
        address: '北京'
      }).onSuccess((data) => {
        this.JIMLogin()
      }).onFail((error) => {
        errorApiTip(error)
      }).onTimeout((data) => {
        const error = { text: 'IM注册', code: 910000 }
        errorApiTip(error)
      })
    },
    JIMgetUserInfo(name) { // 获取用户信息
      this.JIM.getUserInfo({ username: name, appkey: authPayload.appKey }).onSuccess((data) => {
        const user = data.user_info
        const item = {
          avatar: process.env.upload_API + 'images/user/' + store.getters.useinfo._id + '.jpg',
          mtime: user.mtime,
          name: user.username,
          nickname: store.getters.useinfo.name,
          mobile: store.getters.useinfo.mobile,
          username: user.username,
          type: 3,
          signature: user.signature,
          gender: user.gender,
          region: user.region,
          avatarUrl: single_avatar
          // infoType,
          // eventId: info.eventId,
          // stateType: info.stateType
        }
        this.$store.dispatch('SetImUser', item)
        this.userInfo = item
      }).onFail((error) => {
        errorApiTip(error)
      }).onTimeout((data) => {
        const error = { code: 910000 }
        errorApiTip(error)
      })
    },
    JIMgetFriendList() { // 获取用户列表
      axios.all([fetchDepartments(''), fetchList({ start_index: 0, length: 10000 })])
        .then(axios.spread((acct, perms) => {
          const userList = perms.info.list.filter(obj => { // 获取正常状态的用户
            return !obj.status && obj._id !== store.getters.useinfo._id
          })
          this.userArr = perms.info.list.filter(obj => { // 获取正常状态的用户
            return !obj.status
          })
          const depList = acct.info // 获取用户部门
          const arr = []
          userList.forEach(element => { // 获取用户的部门
            const arrs = element.department_roles.filter(obj => {
              return Number(obj.is_enable)
            })
            if (arrs.length) {
              element.department_id = Number(arrs[0].department_id)
            }
            depList.forEach(res => {
              if (res._id === element.department_id) {
                element.dept_name = res.name
              }
            })
            const obj = {
              _id: element._id,
              username: 'yzwg_' + element._id,
              nickname: element.name,
              avatar: process.env.upload_API + 'images/user/' + element._id + '.jpg',
              avatarUrl: single_avatar,
              mobile: element.mobile,
              gender: element.sex + 1,
              isOnline: false,
              type: 3,
              birthday: element.birthday * 1000,
              memo_others: element.dept_name
            }
            arr.push(obj)
          })
          this.searchList = arr
          this.getGropsUser(arr)
          const memo = {}
          setInterval(() => { // 这一段是为了显示人员在线或离线的
            var loca = store.getters.allpersonlocaltion
            if (loca) {
              var memoo = {}
              arr.forEach((chatlist) => {
                loca.forEach((localist) => {
                  if (chatlist._id === localist._id) {
                    if (localist.state === 1) {
                      chatlist.isOnline = true
                    } else {
                      chatlist.isOnline = false
                    }
                  }
                })
                if (chatlist.memo_others) {
                  if (memoo[chatlist.memo_others]) {
                    memoo[chatlist.memo_others].push(chatlist)
                  } else {
                    memoo[chatlist.memo_others] = [chatlist]
                  }
                }
              })
              var nfriend_list = []
              for (const key in memoo) { // 数据
                const obj = {
                  groupname: key,
                  len: memoo[key].length,
                  list: memoo[key]
                }
                nfriend_list.push(obj)
              }
              this.friend_list = nfriend_list
            }
          }, 10000)
          arr.forEach(function(element) {
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
          for (const key in memo) { // 数据
            const obj = {
              groupname: key,
              len: memo[key].length,
              list: memo[key]
            }
            this.friend_list.push(obj)
          }
          console.log(this.friend_list)
        }))
    },
    JIMgetGroups() { // 获取群组列表
      this.JIM.getGroups().onSuccess((data) => {
        const group_list = data.group_list
        for (const group of group_list) {
          group.avatarUrl = group_avatar
          group.type = 4
        }
        this.group_list = group_list
      }).onFail((error) => {
        errorApiTip(error)
      })
    },
    initConverMsg() { // 初始化 离线消息最后一条对应到会话
      if (this.MsgList) {
        for (let i = 0; i < this.conversations.length; i++) {
          const c = this.conversations[i]
          c.content = {
            msg_type: 3,
            msg_body: {
              text: '暂无消息'
            }
          }
          if (c.type === 3) {
            if (this.MsgList[c.username]) {
              c.content = this.MsgList[c.username].msgs[this.MsgList[c.username].msgs.length - 1].content
            }
          } else {
            if (this.MsgList[c.gid]) {
              c.content = this.MsgList[c.gid].msgs[this.MsgList[c.gid].msgs.length - 1].content
            }
          }
        }
      }
    },
    JIMgetConversation(flg) { // 获取会话列表
      this.JIM.getConversation().onSuccess((data) => {
        console.log('更新会话列表2', data)
        const conversations = data.conversations
        for (const conver of conversations) {
          if (conver.type === 3) {
            conver.avatarUrl = single_avatar
            const userid = conver.name.substring(5)
            conver.avatar = process.env.upload_API + 'images/user/' + userid + '.jpg'
            conver.nickname = this.filterName(conver.username)
          } else {
            conver.avatarUrl = group_avatar
          }
          this.totalCount += conver.unread_msg_count
        }
        this.conversations = conversations.reverse()
        console.log(this.conversations)
        if (!flg) {
          this.initConverMsg()
        }
      }).onFail((error) => {
        errorApiTip(error)
      })
      setTimeout(() => {
        const conversations = this.conversations
        for (const conver of conversations) {
          if (conver.type === 3) {
            conver.nickname = this.filterName(conver.username)
          }
        }
      }, 5000)
    },
    JIMcreateGroup(data) { // 创建群组
      this.JIM.createGroup(data).onSuccess((res) => {
        const member_usernames = []
        data.usernames.forEach(element => {
          const obj = {
            username: element,
            appkey: authPayload.appKey
          }
          member_usernames.push(obj)
        })
        const reqest = {
          gid: res.gid,
          member_usernames: member_usernames
        }
        this.JIMaddGroupMembers(reqest)
      }).onFail((error) => {
        errorApiTip(error)
      })
    },
    JIMaddGroupMembers(data) { // 添加群成员
      this.JIM.addGroupMembers(data).onSuccess((res) => {
        this.JIMgetGroups()
      }).onFail((error) => {
        errorApiTip(error)
      })
    },
    onSyncConversation() { // 离线消息同步监听
      this.JIM.onSyncConversation((data) => {
        const arr = data
        const obj = {}
        arr.forEach(function(element) { // 将数组转换对象的形式，方便查询消息
          if (element.msg_type === 3) {
            obj[element.from_username] = element
          } else if (element.msg_type === 4) {
            obj[element.from_gid] = element
          }
        }, this)
        this.$store.dispatch('SetMsgList', obj)
        this.MsgList = obj
        this.JIMgetConversation()
      })
    },
    onMsgReceive() { // 聊天消息实时监听
      this.JIM.onMsgReceive((data) => {
        console.log(data)
        let alert = '你有新的消息'
        data.messages.forEach(function(element) {
          const obj = data.messages[0].content
          const title = obj.from_name
          if (obj.msg_type === 'text') {
            alert = obj.msg_body.text
          } else if (obj.msg_type === 'image') {
            alert = '【图片】'
          } else if (obj.msg_type === 'file') {
            alert = '【文件】'
          }
          imNotification({
            title: title,
            alert: alert
          })
        }, this)
        this.receivedMsg(data)
      })
    },
    onMsgReceiptChange() { // 消息已读数变更事件实时监听
      this.JIM.onMsgReceiptChange((data) => {
        console.log('onMsgReceiptChange', data)
      })
    },
    resetUnreadCount(req) { // 重置单聊会话，调用则成功，无回调函数
      this.JIM.resetUnreadCount(req)
    },
    onSyncMsgReceipt() { // 消息已读数变更事件实时监听
      this.JIM.onSyncMsgReceipt((data) => {
        console.log('onSyncMsgReceipt', data)
      })
    },
    onMutiUnreadMsgUpdate() { // 会话未读数变更监听（多端在线）
      this.JIM.onMutiUnreadMsgUpdate((data) => {
        console.log('onMutiUnreadMsgUpdate', data)
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
    line-height: 20px;
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
  .isOnline {
    color:blue!important;
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
    max-width: 120px;
    line-height: 18px;
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
    margin-left: 10px;
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
    background-color: rgba(255, 255, 255, 0.9);
  }
  .el-collapse-item__arrow{
    line-height: 28px;
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
.custom-dialog{
  .el-dialog{
    width: 700px
  }
}
.seach-panle{
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  overflow-y: auto;
}
</style>

