import Cookies from 'js-cookie'
import store from '../store'
const TokenKey = 'access_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function getPwd() {
  return Cookies.get('Pwd')
}

export function setPwd(pwd) {
  return Cookies.set('Pwd', pwd)
}
export function getUserid() {
  return Cookies.get('Userid')
}

export function setUserid(id) {
  return Cookies.set('Userid', id)
}
export function getDepCld() {
  return Cookies.get('Depcld')
}

export function setDepCld(str) {
  return Cookies.set('Depcld', str)
}
export function removeToken() {
  Cookies.remove('Userid')
  Cookies.remove('Depcld')
  Cookies.remove('Pwd')
  return Cookies.remove(TokenKey)
}

export function isAccess(what) { // 权限判断
  const roles = store.getters.roles
  if (roles.indexOf('admin') >= 0 || roles.indexOf(what) >= 0) {
    return true
  } else {
    return false
  }
}
export function isUser(id) { // 判断是否当前用户
  const useinfo = store.getters.useinfo
  if (Number(useinfo._id) === Number(id)) {
    return true
  } else {
    return false
  }
}
