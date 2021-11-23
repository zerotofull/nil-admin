import request from "../utils/request";

export function userLogin(data) {
  return request({
    url: "/auth/admin/user/login",
    method: 'POST',
    data: data
  })
}
export function userinfo() {
  return request({
    url: "/auth/admin/user/info",
    method: 'GET',
  })
}

export function userMenu(role:any) {
  return request({
    url: "/auth/admin/role/menus",
    method: 'GET',
    params: {
      role
    }
  })
}

///auth/admin/user/password

export function changeUserPass(data) {
  return request({
    url: "/auth/admin/user/password",
    method: 'POST',
    data: data
  })
}

export function reUserpass(uid) {
  return request({
    url: "/auth/admin/user/repass",
    method: 'POST',
    data: {
      uid
    }
  })
}