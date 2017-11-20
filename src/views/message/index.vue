<template>
  <div class="app-container">
      <div class="box-msg g6">
        <div class="header" v-if="zuijingArr.length">
          最新消息
          <span class="r count">{{zuijingArr.length}}条</span>
        </div>
        <ul class="ibox-ct" v-if="zuijingArr.length">
          <li class="fix" v-for="(item, index) in zuijingArr" :key="index" >
            <img class="avatar l" :src="'http://gridmap-file.xiaoketech.com/images/user/'+item.user_id+'.png'" :onerror="defaultImg" alt="">
            <div class="ovh tis">
              <h4 class="ell mt5">{{filterUser(item.user_id)}}
                <span class="r f12 g9 n ">{{ item.create_time | parseTime('{y}.{m}.{d} {h}:{i}', true) }}</span>
              </h4>
              <p class="pt5">{{item.content}}</p>
            </div>
          </li>
        </ul>
        <div class="header lsdf" v-if="lishiArr.length">
          历史消息
          <span class="r count">{{totalCount}}条</span>
        </div>
        <ul class="ibox-ct" v-if="lishiArr.length">
          <li class="fix" v-for="(item, index) in lishiArr" :key="index" >
            <img class="avatar l" :src="'http://gridmap-file.xiaoketech.com/images/user/'+item.user_id+'.png'" :onerror="defaultImg" alt="">
            <div class="ovh tis">
              <h4 class="ell mt5">{{filterUser(item.user_id)}}
                <span class="r f12 g9 n ">{{ item.create_time|parseTime('{y}.{m}.{d} {h}:{i}', true) }}</span>
              </h4>
              <p class="pt5">{{item.content}}</p>
            </div>
          </li>
          <li class="tc" v-if="!nomore">
            <span class="jiasfa poi" @click="moreMsg">加载更多</span>
          </li>
          <li class="tc" v-else>
            <span class="f12 g9">没有了~</span>
          </li>
        </ul>
        <div v-if="!zuijingArr.length && !lishiArr.length" class="no-msg tc f14">
          <span>你最近暂时没有收到任何消息~</span>
        </div>
      </div>
  </div>
</template>

<script>
import avatar from 'assets/login_images/avatar.png'
import { fetchList } from '@/api/department'
import { getSmsList, readSms } from '@/api/message'
export default {
  data() {
    return {
      defaultImg: 'this.onerror=null;this.src="' + require('../../assets/login_images/avatar.png') + '"',
      avatar: avatar,
      zuijingArr: [],
      lishiArr: [],
      pageno: 10,
      nomore: false,
      totalCount: 0,
      start_index: 0,
      userArr: []
    }
  },
  created() {
    this.getSmsList()
    this.getlishiSmsList()
    this.loadDep()
  },
  computed: {
    message() {
    }
  },
  methods: {
    getSmsList() { // 查询最近消息
      getSmsList({ start_index: 0, length: 10000, isread: 0 }).then((res) => {
        const arr = res.info.list.filter(obj => {
          return !obj.isread
        })
        const laarr = []
        this.zuijingArr = arr
        this.start_index = res.info.UnreadCount // 未读数量
        arr.forEach(function(element) {
          laarr.push(element._id)
        }, this)
        if (laarr.length) {
          const str = laarr.join(',')
          readSms({ sms_id: str }).then(res => {
            this.$store.dispatch('SetMsgCount', 0)
          })
        }
      })
    },
    filterUser(userid) {
      const arr = this.userArr.filter(obj => {
        return obj._id === userid
      })
      if (arr.length) {
        return arr[0]['name']
      }
      return '未知姓名'
    },
    moreMsg() {
      this.start_index += this.pageno
      this.pageno += 10
      this.getlishiSmsList()
    },
    getlishiSmsList() { // 查询历史消息
      getSmsList({ start_index: this.start_index, length: this.pageno, isread: 1 }).then((res) => {
        const arr = res.info.list.filter(obj => {
          return obj.isread
        })
        this.lishiArr.push(...arr)
        if (res.info.list.length < 10) {
          this.nomore = true
        }
        this.totalCount = res.info.count
      })
    },
    loadDep() { // 获取用户
      fetchList({ start_index: 0, length: 10000 }).then(response => {
        if (response.info.list.length) {
          const array = response.info.list
          const arrs = []
          array.forEach(function(element) {
            if (!element.status) {
              arrs.push(element)
            }
          }, this)
          this.userArr = arrs
        }
      })
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
