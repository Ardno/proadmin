import fetch from '@/utils/fetch'

export function getLogArr(data) { //  获取用户操作记录
  return fetch({
    url: 'logs/list',
    method: 'post',
    data: data
  })
}
