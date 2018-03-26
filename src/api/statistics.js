import fetch from '@/utils/fetch'

export function getUserStatist(data) { // 获取用户统计
  return fetch({
    url: 'statistics/list',
    method: 'post',
    data: data
  })
}
export function getRegionStatist(data) { // 获取区域统计
  return fetch({
    url: 'statistics/region_list',
    method: 'post',
    data: data
  })
}
export function getDepartmentStatist(data) { // 获取部门统计
  return fetch({
    url: 'statistics/department_list',
    method: 'post',
    data: data
  })
}
export function getPeopleStatist(data) { // 获取人员统计
  return fetch({
    url: 'statistics/peoplemongo',
    method: 'post',
    data: data
  })
}
export function getMongoareaStatist(data) { // 获取人员统计
  return fetch({
    url: 'statistics/mongoarea',
    method: 'post',
    data: data
  })
}
