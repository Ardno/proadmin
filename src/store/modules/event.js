const event = {
  state: {
    caseid: '',
    stepid: ''
  },
  mutations: {
    SET_CASEID: (state, id) => {
      state.caseid = id
    },
    SET_STEPID: (state, id) => {
      state.stepid = id
    }
  },
  actions: {
    setCaseId({ commit }, data) { // 设置事件id
      commit('SET_CASEID', data)
    },
    setStepId({ commit }, data) { // 设置事件步骤id
      commit('SET_STEPID', data)
    }
  }
}

export default event
