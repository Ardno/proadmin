
const webim = {
  state: {
    messageList: []
  },
  mutations: {
    SET_MSGLIST: (state, arr) => {
      state.messageList = arr
    }
  },
  actions: {
    SetMsgList({ commit }, data) { // 设置离线消息列表
      commit('SET_MSGLIST', data)
    }
  }
}

export default webim
