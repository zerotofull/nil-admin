import request from "../utils/request";
// 
export function authUsers(data) {
  return request({
    url: "/auth/admin/users",
    method: 'GET',
    params: data
  })
}
//
export function authUsersStatus(data) {
  return request({
    url: "/auth/admin/user/status",
    method: 'POST',
    data
  })
}
// 
export function authRoles() {
  return request({
    url: "/auth/admin/roles",
    method: 'GET'
  })
}

// 
export function authMenus() {
  return request({
    url: "/auth/admin/menus",
    method: 'GET'
  })
}
///auth/admin/menu
export function addMenu(data) {
  return request({
    url: "/auth/admin/menu",
    method: "POST",
    data
  })
}

//修改菜单
export function changeMenu(data) {
  return request({
    url: `/auth/admin/menu/${data.id}`,
    method: "POST",
    data
  })
}

///auth/admin/role
export function changeRoleMenu(data) {
  return request({
    url: `/auth/admin/role`,
    method: "PUT",
    data
  })
}

export function addRoleMenu(data) {
  return request({
    url: `/auth/admin/role`,
    method: "POST",
    data
  })
}

///auth/admin/menu/{id}
export function deleteMenu(id:string) {
  return request({
    url: `/auth/admin/menu/${id}`,
    method: "DELETE"
  })
}

///auth/admin/role/{id}
export function deleteRole(id:string) {
  return request({
    url: `/auth/admin/role/${id}`,
    method: "DELETE"
  })
}

///auth/admin/user
export function createUser(data) {
  return request({
    url: `/auth/admin/user`,
    method: "POST",
    data
  })
}

export function changeUser(data) {
  return request({
    url: `/auth/admin/user`,
    method: "PUT",
    data
  })
}