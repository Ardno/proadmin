import fetch from '@/utils/fetch'

export function addAdc(query) { // 添加考勤规则配置
  return fetch({
    url: 'attendance_config/add',
    method: 'post',
    data: query
  })
}
export function getAdc(query) { // 获取考勤规则信息
  return fetch({
    url: 'attendance_config/get',
    method: 'post',
    data: query
  })
}
export function getadcArr(query) { // 获取考勤规则信息集合
  return fetch({
    url: 'attendance_config/list',
    method: 'post',
    data: query
  })
}
export function updateAdc(query) { // 修改考勤规则信息
  return fetch({
    url: 'attendance_config/update',
    method: 'post',
    data: query
  })
}

