import fetch from '@/utils/fetch'

export function fetchList(query) { // 获取用户集合
  return fetch({
    url: '/people/list',
    method: 'post',
    data: query
  })
}

export function fetchDepartments(query) { // 获取部门集合
  return fetch({
    url: 'department/list',
    method: 'post',
    data: query
  })
}

export function fetchRoles(query) { // 获取职务集合
  return fetch({
    url: '/roles/list',
    method: 'post',
    data: query
  })
}
export function updatePeInfo(data) { // 修改个人信息
  return fetch({
    url: 'people/update',
    method: 'post',
    data: data
  })
}
