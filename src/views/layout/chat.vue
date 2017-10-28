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
              <div class="layui-layim-user">纸飞机</div>
              <div class="layui-layim-status">
                <span class="layim-status-online"></span>
              </div>
              <span class="layui-layim-remark">在深邃的编码世界，做一枚轻盈的纸飞机</span>
            </div>
            <!-- 面板 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane name="first">
                <span slot="label">
                  <icon-svg icon-class="people_fill" />
                </span>
                <el-collapse :style="{overflow:'auto'}" class="layim-tab-content">
                  <el-collapse-item>
                    <template slot="title">
                      <span>知名人物</span>
                      <em>(
                        <cite class="layim-count">5</cite>)</em>
                    </template>
                    <ul class="layui-layim-list">
                      <li @click="closechatck=false" layim-event="chat" data-type="friend" data-index="0" class="layim-friend100001 "><img src="//tva1.sinaimg.cn/crop.0.0.118.118.180/5db11ff4gw1e77d3nqrv8j203b03cweg.jpg">
                        <span>贤心</span>
                        <p>这些都是测试数据，实际使用请严格按照该格式返回</p>
                      </li>
                      <li layim-event="chat" data-type="friend" data-index="0" class="layim-friend100001222 "><img src="//tva4.sinaimg.cn/crop.0.1.1125.1125.180/475bb144jw8f9nwebnuhkj20v90vbwh9.jpg">
                        <span>刘涛tamia</span>
                        <p>如约而至，不负姊妹欢乐颂</p>
                      </li>
                      <li layim-event="chat" data-type="friend" data-index="0" class="layim-friend10034001 "><img src="//tva2.sinaimg.cn/crop.1.0.747.747.180/633f068fjw8f9h040n951j20ku0kr74t.jpg">
                        <span>谢楠</span>
                        <p></p>
                      </li>
                      <li layim-event="chat" data-type="friend" data-index="0" class="layim-friend168168 "><img src="//tva1.sinaimg.cn/crop.0.0.180.180.180/7fde8b93jw1e8qgp5bmzyj2050050aa8.jpg">
                        <span>马小云</span>
                        <p>让天下没有难写的代码</p>
                      </li>
                      <li layim-event="chat" data-type="friend" data-index="0" class="layim-friend666666 "><img src="//tva1.sinaimg.cn/crop.0.0.512.512.180/6a4acad5jw8eqi6yaholjj20e80e8t9f.jpg">
                        <span>徐小峥</span>
                        <p>代码在囧途，也要写到底</p>
                      </li>
                    </ul>
                  </el-collapse-item>
                  <el-collapse-item>
                    <template slot="title">
                      <span>这些都是测试数据</span>
                      <em>(
                        <cite class="layim-count">5</cite>)</em>
                    </template>
                    <ul class="layui-layim-list">
                      <li layim-event="chat" data-type="friend" data-index="0" class="layim-friend100001 "><img src="//tva1.sinaimg.cn/crop.0.0.118.118.180/5db11ff4gw1e77d3nqrv8j203b03cweg.jpg">
                        <span>贤心</span>
                        <p>这些都是测试数据，实际使用请严格按照该格式返回</p>
                      </li>
                      <li layim-event="chat" data-type="friend" data-index="0" class="layim-friend100001222 "><img src="//tva4.sinaimg.cn/crop.0.1.1125.1125.180/475bb144jw8f9nwebnuhkj20v90vbwh9.jpg">
                        <span>刘涛tamia</span>
                        <p>如约而至，不负姊妹欢乐颂</p>
                      </li>
                      <li layim-event="chat" data-type="friend" data-index="0" class="layim-friend10034001 "><img src="//tva2.sinaimg.cn/crop.1.0.747.747.180/633f068fjw8f9h040n951j20ku0kr74t.jpg">
                        <span>谢楠</span>
                        <p></p>
                      </li>
                      <li layim-event="chat" data-type="friend" data-index="0" class="layim-friend168168 "><img src="//tva1.sinaimg.cn/crop.0.0.180.180.180/7fde8b93jw1e8qgp5bmzyj2050050aa8.jpg">
                        <span>马小云</span>
                        <p>让天下没有难写的代码</p>
                      </li>
                      <li layim-event="chat" data-type="friend" data-index="0" class="layim-friend666666 "><img src="//tva1.sinaimg.cn/crop.0.0.512.512.180/6a4acad5jw8eqi6yaholjj20e80e8t9f.jpg">
                        <span>徐小峥</span>
                        <p>代码在囧途，也要写到底</p>
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
                      <li layim-event="chat" data-type="group" data-index="0" class="layim-group101 "><img src="//tva1.sinaimg.cn/crop.0.0.200.200.50/006q8Q6bjw8f20zsdem2mj305k05kdfw.jpg">
                        <span>前端群</span>
                        <p></p>
                      </li>
                      <li layim-event="chat" data-type="group" data-index="1" class="layim-group102 "><img src="//tva2.sinaimg.cn/crop.0.0.199.199.180/005Zseqhjw1eplix1brxxj305k05kjrf.jpg">
                        <span>Fly社区官方群</span>
                        <p></p>
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
                      <li layim-event="chat"><img src="//tva4.sinaimg.cn/crop.0.1.1125.1125.180/475bb144jw8f9nwebnuhkj20v90vbwh9.jpg">
                        <span>刘涛tamia</span>
                        <p>如约而至，不负姊妹欢乐颂</p>
                      </li>
                      <li layim-event="chat" data-type="history" data-index="friend168168" class="layim-friend168168 "><img src="//tva1.sinaimg.cn/crop.0.0.180.180.180/7fde8b93jw1e8qgp5bmzyj2050050aa8.jpg">
                        <span>马小云</span>
                        <p>让天下没有难写的代码</p>

                      </li>
                      <li layim-event="chat" data-type="history" data-index="friend121286" class="layim-friend121286 "><img src="//tva4.sinaimg.cn/crop.0.0.640.640.180/4a02849cjw8fc8vn18vktj20hs0hs75v.jpg">
                        <span>罗玉凤</span>
                        <p>在自己实力不济的时候，不要去相信什么媒体和记者。他们不是善良的人，有时候候他们的采访对当事人而言就是陷阱</p>

                      </li>
                      <li layim-event="chat" data-type="history" data-index="group101" class="layim-group101 "><img src="//tva1.sinaimg.cn/crop.0.0.200.200.50/006q8Q6bjw8f20zsdem2mj305k05kdfw.jpg">
                        <span>前端群</span>
                        <p></p>

                      </li>
                      <li layim-event="chat" data-type="history" data-index="friend12123454" class="layim-friend12123454 "><img src="//tva2.sinaimg.cn/crop.0.0.512.512.180/005LMAegjw8f2bp9qg4mrj30e80e8dg5.jpg">
                        <span>大鱼_MsYuyu</span>
                        <p>我瘋了！這也太準了吧 超級笑點低</p>

                      </li>
                      <li layim-event="chat" data-type="history" data-index="friend102101" class="layim-friend102101 "><img src="//tva4.sinaimg.cn/crop.0.0.180.180.180/6d424ea5jw1e8qgp5bmzyj2050050aa8.jpg">
                        <span>Lemon_CC</span>
                        <p></p>

                      </li>
                      <li layim-event="chat" data-type="history" data-index="group12333333" class="layim-group12333333 "><img src="//tva3.sinaimg.cn/crop.64.106.361.361.50/7181dbb3jw8evfbtem8edj20ci0dpq3a.jpg">
                        <span>Angular开发</span>
                        <p></p>

                      </li>
                      <li layim-event="chat" data-type="history" data-index="group102" class="layim-group102 "><img src="//tva2.sinaimg.cn/crop.0.0.199.199.180/005Zseqhjw1eplix1brxxj305k05kjrf.jpg">
                        <span>Fly社区官方群</span>
                        <p></p>

                      </li>
                      <li layim-event="chat" data-type="history" data-index="friend4803920" class="layim-friend4803920 "><img src="//tva3.sinaimg.cn/crop.0.0.750.750.180/5033b6dbjw8etqysyifpkj20ku0kuwfw.jpg">
                        <span>佟丽娅</span>
                        <p>我也爱贤心吖吖啊</p>

                      </li>
                      <li layim-event="chat" data-type="history" data-index="friend198909151014" class="layim-friend198909151014 "><img src="//tva1.sinaimg.cn/crop.7.0.736.736.50/bd986d61jw8f5x8bqtp00j20ku0kgabx.jpg">
                        <span>小酱</span>
                        <p></p>

                      </li>
                      <li layim-event="chat" data-type="history" data-index="friend76543" class="layim-friend76543 "><img src="//tva3.sinaimg.cn/crop.0.0.512.512.180/48f122e6jw8fcmi072lkyj20e80e8t9i.jpg">
                        <span>林心如</span>
                        <p>我爱贤心</p>

                      </li>
                      <li layim-event="chat" data-type="history" data-index="friend100001" class="layim-friend100001 "><img src="//tva1.sinaimg.cn/crop.0.0.118.118.180/5db11ff4gw1e77d3nqrv8j203b03cweg.jpg">
                        <span>贤心</span>
                        <p>这些都是测试数据，实际使用请严格按照该格式返回</p>

                      </li>
                      <li layim-event="chat" data-type="history" data-index="friend1008612" class="layim-friend1008612 "><img src="//tva3.sinaimg.cn/crop.0.0.180.180.180/7f5f6861jw1e8qgp5bmzyj2050050aa8.jpg">
                        <span>小闲</span>
                        <p></p>

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
        <img  src="//res.layui.com/images/fly/avatar/00.jpg">
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
import chatck from './chatck'
export default {
  name: 'chat',
  components: {
    chatck
  },
  directives: {
    drag
  },
  computed: {
  },
  data() {
    return {
      colseIm: true,
      searchflg: false,
      closechatck: true,
      activeName: 'first',
      overflow: 'hidden'
    }
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
      console.log(tab, event)
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

