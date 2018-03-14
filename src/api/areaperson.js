import fetch from '@/utils/fetch'

export function addAdc(query) { // 添加考勤规则配置
  return fetch({
    url: 'areaperson/add',
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
export function getadcArr(query) { // 获取区域人员管理信息集合
  return fetch({
    url: 'areaperson/GetList',
    method: 'post',
    data: query
  })
}
export function addUpdateInfo(query) {
  return fetch({
    url: 'areaperson/addUpdateInfo',
    method: 'post',
    data: query
  })
}
export function GetpersonlogsList(query) {
  return fetch({
    url: 'areaperson/GetpersonlogsList',
    method: 'post',
    data: query
  })
}
export function updateAdc(query) { // 修改考勤规则信息
  return fetch({
    url: 'areaperson/updatePerson',
    method: 'post',
    data: query
  })
}

