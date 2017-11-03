import fetch from '@/utils/fetch'

export function getSmsList(data) { //  获取用户未读消息
  return fetch({
    url: 'sms/list',
    method: 'post',
    data: data
  })
}
