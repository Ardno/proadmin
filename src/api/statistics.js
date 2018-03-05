import fetch from '@/utils/fetch'

export function getUserStatist(data) { // 获取用户统计
  return fetch({
    url: 'statistics/list',
    method: 'post',
    data: data
  })
}
export function getRegionStatist(data) { // 获取用户统计
  return fetch({
    url: 'statistics/region_list',
    method: 'post',
    data: data
  })
}
