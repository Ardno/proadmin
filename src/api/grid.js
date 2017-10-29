import fetch from '@/utils/fetch'

export function addRegion(data) { // 添加网格区域
  return fetch({
    url: 'region/add',
    method: 'post',
    data: data
  })
}
export function updateRegion(data) { // 修改网格区域
  return fetch({
    url: 'region/update',
    method: 'post',
    data: data
  })
}
export function getRegion(data) { // 获取网格区域
  return fetch({
    url: 'region/get',
    method: 'post',
    data: data
  })
}
export function getRegionArr(data) { // 获取网格区域集合
  return fetch({
    url: 'region/list',
    method: 'post',
    data: data
  })
}

