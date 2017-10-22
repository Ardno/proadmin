import fetch from '@/utils/fetch'

export function addEventType(data) { // 添加事件类型
  return fetch({
    url: 'event_type/add',
    method: 'post',
    data: data
  })
}
export function updateEventType(data) { // 修改事件类型
  return fetch({
    url: 'event_type/update',
    method: 'post',
    data: data
  })
}
export function getEventType(data) { // 获取事件类型
  return fetch({
    url: 'event_type/get',
    method: 'post',
    data: data
  })
}

export function getEventTypeArr(data) { // 获取事件类型集合
  return fetch({
    url: 'event_type/list',
    method: 'post',
    data: data
  })
}
export function addEvent(data) { // 添加事件
  return fetch({
    url: 'event/add',
    method: 'post',
    data: data
  })
}
export function updateEvent(data) { // 修改事件
  return fetch({
    url: 'event/update',
    method: 'post',
    data: data
  })
}
export function getEvent(data) { // 获取事件
  return fetch({
    url: 'event/get',
    method: 'post',
    data: data
  })
}

export function getEventArr(data) { // 获取事件集合
  return fetch({
    url: 'event/list',
    method: 'post',
    data: data
  })
}

