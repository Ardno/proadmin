import fetch from '@/utils/fetch'

export function getAccess() { // 获取部门集合
  return fetch({
    url: 'people/access',
    method: 'post'
  })
}
export function fetchDepartments(query) { // 获取部门集合
  return fetch({
    url: 'department/list',
    method: 'post',
    data: query
  })
}
export function createDep(data) { // 创建部门
  return fetch({
    url: 'department/add',
    method: 'post',
    data: data
  })
}
export function updateDep(data) { // 修改部门
  return fetch({
    url: 'department/update',
    method: 'post',
    data: data
  })
}
export function fetchRoles(query) { // 获取职务集合
  return fetch({
    url: 'roles/list',
    method: 'post',
    data: query
  })
}
export function createRoles(data) { // 创建职务
  return fetch({
    url: 'roles/add',
    method: 'post',
    data: data
  })
}
export function updateRoles(data) { // 修改职务
  return fetch({
    url: 'roles/update',
    method: 'post',
    data: data
  })
}
export function fetchList(query) { // 获取用户集合
  return fetch({
    url: 'people/list',
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

export function queryDepRoles(data) { // 查询人员部门集合
  return fetch({
    url: 'department_roles/list',
    method: 'post',
    data: data
  })
}
export function updateDepRoles(data) { // 修改人员部门集合
  return fetch({
    url: 'department_roles/update',
    method: 'post',
    data: data
  })
}
export function deleteDepRoles(data) { // 删除人员部门集合
  return fetch({
    url: 'department_roles/delete',
    method: 'post',
    data: data
  })
}
export function addDepRoles(data) { // 添加人员部门集合
  return fetch({
    url: 'department_roles/add',
    method: 'post',
    data: data
  })
}

