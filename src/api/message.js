import fetch from '@/utils/fetch'

export function getSmsList(data) { //  获取用户未读消息
  return fetch({
    url: 'sms/list',
    method: 'post',
    data: data
  })
}
export function readSms(data) { //  设置已读
  return fetch({
    url: 'sms/read',
    method: 'post',
    data: data
  })
}
export function setHistoryIm(data) { //  存储用户历史记录
  return fetch({
    url: 'im/add',
    method: 'post',
    data: data
  })
}
