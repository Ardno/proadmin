import { loginByUsername, logout, getUserInfo, getQrcode } from '@/api/login'
import { fetchList, fetchDepartments } from '@/api/department'
import { getToken, setToken, removeToken, setUserid, setPwd, getPwd, setDepCld, getDepCld } from '@/utils/auth'
const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    password: getPwd(),
    introduction: '',
    useinfo: {},
    roles: [],
    msgcount: 0,
    setting: {
      articlePlatform: []
    },
    commonInfo: {
      alldepArr: [],
      depArr: [],
      userArr: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PASSWORD: (state, password) => {
      state.password = password
    },
    SET_USEINFO: (state, useinfo) => {
      state.useinfo = useinfo
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_COUNT: (state, msgcount) => {
      state.msgcount = msgcount
    },
    SET_USERARR: (state, userArr) => {
      state.commonInfo.userArr = userArr
    },
    SET_DEPARR: (state, depArr) => {
      state.commonInfo.depArr = depArr
    },
    SET_ALLDEPARR: (state, alldepArr) => {
      state.commonInfo.alldepArr = alldepArr
    }
  },

  actions: {
    SetMsgCount({ commit }, data) { // 设置消息数量
      commit('SET_COUNT', data)
    },
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response.info
          setToken(data.access_token)
          setPwd(data.pwd)
          setDepCld(data.department_sub)
          setUserid(data._id)
          commit('SET_TOKEN', data.access_token)
          commit('SET_PASSWORD', data.pwd)
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
          setToken(data.access_token)
          setPwd(data.pwd)
          setDepCld(data.department_sub)
          setUserid(data._id)
          commit('SET_TOKEN', data.access_token)
          commit('SET_PASSWORD', data.pwd)
          resolve()
          reject()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetUserInfo({ commit }, _id) {
      return new Promise((resolve, reject) => {
        getUserInfo(_id).then(response => {
          const data = response.info
          const rolesstr = data.access
          const role = rolesstr.split(',')
          if (role.indexOf('0') >= 0) {
            role[0] = 'admin'
          }
          data.birthday = data.birthday * 1000
          const arr = data.department_roles.filter(obj => {
            return obj.is_enable
          })
          if (arr.length) { // 由于信息主部门不准确，现获取个人部门数组里面的主部门
            data.department_id = arr[0].department_id
            data.dept_name = arr[0].deptname
            data.role_id = arr[0].role_id
            data.role_name = arr[0].rolename
          }
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
    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

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
    },

    // 动态修改权限
    ChangeRole({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.role)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    },
    // 获取用户集合  获取部门集合
    getAlldepPep({ commit }, data) {
      fetchDepartments({ _id: getDepCld() }).then(res => {
        const depArr = res.info.filter(obj => {
          return !obj.status
        })
        depArr.forEach(element => {
          depArr.forEach(sle => {
            if (element.parent === sle._id) {
              element.parentName = '隶属-' + sle.name
            } else {
              if (!element.parent) {
                element.parentName = ''
              }
            }
          })
        })
        commit('SET_DEPARR', depArr)
      })
      fetchDepartments().then(res => {
        const depArr = res.info.filter(obj => {
          return !obj.status
        })
        depArr.forEach(element => {
          depArr.forEach(sle => {
            if (element.parent === sle._id) {
              element.parentName = '隶属-' + sle.name
            } else {
              if (!element.parent) {
                element.parentName = ''
              }
            }
          })
        })
        commit('SET_ALLDEPARR', depArr)
      })
      fetchList({ start_index: 0, length: 10000, department_id: getDepCld() }).then(response => {
        const userArr = response.info.list.filter(obj => {
          return !obj.status
        })
        commit('SET_USERARR', userArr)
      })
    }
  }
}

export default user
