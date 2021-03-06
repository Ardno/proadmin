import fetch from '@/utils/fetch'

export function getLogArr(data) { //  获取用户操作记录
  return fetch({
    url: 'logs/list',
    method: 'post',
    data: data
  })
}
export function verifypassword(data) { //  验证用户密码
  return fetch({
    url: 'people/pass',
    method: 'post',
    data: data
  })
}
export function uploadCurLoc(data) { //  上传用户当前位置
  return fetch({
    url: 'locations/add',
    method: 'post',
    data: data
  })
}
export function indexInfo(data) { //  获取首页信息
  return fetch({
    url: 'tongji/index',
    method: 'post',
    data: data
  })
}
export function indexregionInfo(data) { //  获取事件统计
  return fetch({
    url: 'tongji/region',
    method: 'post',
    data: data
  })
}
