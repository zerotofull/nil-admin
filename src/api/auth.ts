import request from "../utils/request";
// 
export function authUsers(data) {
  return request({
    url: "/auth/admin/users",
    method: 'GET',
    params: data
  })
}

export function authUsersStatus(data) {
  return request({
    url: "/admin/auth/users/status",
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

export function authUsersUpdateRole(data) {
  return request({
    url: "/admin/auth/users/role",
    method: 'POST',
    data
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

///auth/admin/role/menus
export function changeRoleMenu(data) {
  return request({
    url: `/auth/admin/role/menus`,
    method: "POST",
    data
  })
}
