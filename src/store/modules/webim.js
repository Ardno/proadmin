
const webim = {
  state: {
    messageList: [],
    imUserinfo: {}
  },
  mutations: {
    SET_MSGLIST: (state, arr) => {
      state.messageList = arr
    },
    SET_IMUSERINFO: (state, obj) => {
      state.imUserinfo = obj
    }
  },
  actions: {
    SetImUser({ commit }, data) { // 设置登录用户信息
      commit('SET_IMUSERINFO', data)
    },
    SetMsgList({ commit }, data) { // 设置离线消息列表
      commit('SET_MSGLIST', data)
    }
  }
}

export default webim
