import fetch from '@/utils/fetch'

export function login(mobile, pwd) {
  return fetch({
    url: 'people/login',
    method: 'post',
    data: {
      mobile,
      pwd
    }
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
export function getInfo(mobile) {
  return fetch({
    url: 'people/get',
    method: 'get',
    params: { mobile }
  })
}

export function logout() {
  return fetch({
    url: '/user/logout',
    method: 'post'
  })
}
