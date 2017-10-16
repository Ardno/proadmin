import fetch from '@/utils/fetch'

export function getAccess() { // 获取权限集合
  return fetch({
    url: 'people/access',
    method: 'post'
  })
}
export function loginByUsername(mobile, pwd) {
  const data = {
    mobile,
    pwd
  }
  return fetch({
    url: 'people/login',
    method: 'post',
    data
  })
}
export function getQrcode(key) {
  return fetch({
    url: 'people/qr',
    method: 'post',
    data: {
      key
    }
  })
}
export function getUserInfo(_id) {
  return fetch({
    url: 'people/get',
    method: 'post',
    data: {
      _id
    }
  })
}

export function logout() {
  return fetch({
    url: 'user/logout',
    method: 'post'
  })
}
