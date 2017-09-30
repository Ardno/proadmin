import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getUserid() {
  return Cookies.get('Userid')
}

export function setUserid(id) {
  return Cookies.set('Userid', id)
}
export function removeToken() {
  Cookies.remove('Userid')
  return Cookies.remove(TokenKey)
}
