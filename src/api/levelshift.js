import fetch from '@/utils/fetch'

export function addLeaves(data) { // 请假添加
  return fetch({
    url: 'leaves/add',
    method: 'post',
    data: data
  })
}
export function updateLeaves(data) { // 请假修改
  return fetch({
    url: 'leaves/update',
    method: 'post',
    data: data
  })
}
export function getLeaves(data) { // 请假查询
  return fetch({
    url: 'leaves/get',
    method: 'post',
    data: data
  })
}
export function getLeavesArr(data) { // 请假查询集合接口
  return fetch({
    url: '/leaves/list',
    method: 'post',
    data: data
  })
}

export function addShifts(data) { // 申请换班
  return fetch({
    url: 'changeshifts/add',
    method: 'post',
    data: data
  })
}
export function updateShifts(data) { // 修改申请换班
  return fetch({
    url: 'changeshifts/update',
    method: 'post',
    data: data
  })
}
export function getShifts(data) { // 获取换班
  return fetch({
    url: 'changeshifts/get',
    method: 'post',
    data: data
  })
}
export function getShiftsArr(data) { // 获取换班集合
  return fetch({
    url: 'changeshifts/list',
    method: 'post',
    data: data
  })
}

export function getWorksArr(data) { // 获取工作集合
  return fetch({
    url: 'works/list',
    method: 'post',
    data: data
  })
}

export function getMonthdance(data) { // 获取考勤集合
  return fetch({
    url: 'people/month_dance',
    method: 'post',
    data: data
  })
}
