import fetch from '@/utils/fetch'

export function addPerson(query) { // 添加区域人员
  return fetch({
    url: 'personfacilities/addPerson',
    method: 'post',
    data: query
  })
}
export function GetPersonForId(query) { // 获取区域人员管理信息集合
  return fetch({
    url: 'personfacilities/GetPersonForId',
    method: 'post',
    data: query
  })
}
export function addUpdatePersonInfo(query) { // 添加修改人员信息记录
  return fetch({
    url: 'personfacilities/addUpdatePersonInfo',
    method: 'post',
    data: query
  })
}
export function GetpersonlogsList(query) { // 获取一条人员记录
  return fetch({
    url: 'personfacilities/GetpersonlogsList',
    method: 'post',
    data: query
  })
}
export function updatePerson(query) { // 修改人员信息
  return fetch({
    url: 'personfacilities/updatePerson',
    method: 'post',
    data: query
  })
}
/**
 * 下面是区域设施的请求接口地址
 */
export function addFacilities(query) { // 添加区域设施信息
  return fetch({
    url: 'personfacilities/addFacilities',
    method: 'post',
    data: query
  })
}
export function updateFacilities(query) { // 修改区域设施信息
  return fetch({
    url: 'personfacilities/updateFacilities',
    method: 'post',
    data: query
  })
}
export function GetFacilitiesForId(query) { // 获取所有区域设施的信息
  return fetch({
    url: 'personfacilities/GetFacilitiesForId',
    method: 'post',
    data: query
  })
}
export function addUpdateFacilitiesInfo(query) { // 添加修改区域设施的信息记录
  return fetch({
    url: 'personfacilities/addUpdateFacilitiesInfo',
    method: 'post',
    data: query
  })
}
export function GetfacilitieslogsList(query) { // 获取一条区域设施的所有更新记录
  return fetch({
    url: 'personfacilities/GetfacilitieslogsList',
    method: 'post',
    data: query
  })
}
