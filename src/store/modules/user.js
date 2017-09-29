import { login, getQrcode, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken, setUserid } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    useinfo: {},
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_USEINFO: (state, useinfo) => {
      state.useinfo = useinfo
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.mobile.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.pwd).then(response => {
          const data = response.info
          setToken(data.access_token)
          setUserid(data._id)
          commit('SET_TOKEN', data.access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 二维码登录
    qrLogin({ commit }, key) {
      return new Promise((resolve, reject) => {
        getQrcode(key).then(response => {
          const data = response.info
          if (data) {
            setToken(data.access_token)
            setUserid(data._id)
            commit('SET_TOKEN', data.access_token)
            resolve()
          }
          reject()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({ commit }, _id) {
      return new Promise((resolve, reject) => {
        getInfo(_id).then(response => {
          const data = response.info
          const role = ['admin'] // 暂时写死权限
          commit('SET_USEINFO', data)
          commit('SET_ROLES', role)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data._id)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
