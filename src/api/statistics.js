import fetch from '@/utils/fetch'

export function getUserStatist() { // 获取用户统计
  return fetch({
    url: 'statistics/list',
    method: 'post'
  })
}
export function getRegionStatist() { // 获取用户统计
  return fetch({
    url: 'statistics/region_list',
    method: 'post'
  })
}
