import {defineStore} from 'pinia'
import {userinfo, userMenu} from "@/api/user";
import {asyncRoutes, constantRouter} from "@/router";
import {RouteRecordRaw} from "vue-router";

function hasPermission(menus, route) {
    if (route.meta && route.meta.realPath) {
        return menus.some(role => role.includes(route.meta.realPath))
    } else {
        return true
    }
}

function filterAsyncRoutes(asyncRoutes: RouteRecordRaw[], menus: any[]) {
    const res = []
    asyncRoutes.forEach(route => {
        const tmp = { ...route }
        if (hasPermission(menus, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, menus)
            }
            res.push(tmp)
        }
    })
    return res
}

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            token: sessionStorage.getItem("userToken") || "",
            userinfo: {
                name: "",
                uid: "",
                role: ""
            },
            menus: [],
            addMenus: [],
        }
    },
    getters: {
        getToken: state => state.token
    },
    actions: {
        setToken(data) {
            sessionStorage.setItem("userToken", data);
            this.token = data
        },
        logout() {
            sessionStorage.setItem("userToken", "");
            this.token = ""
            this.userinfo.name = ""
            this.userinfo.uid = ""
            this.userinfo.role = ""
            this.menus = []
            this.addMenus = []
        },
        async getUserInfo() {
            return new Promise((resolve, reject) => {
                userinfo().then(res => {
                    if (res.success) {
                        const {id, username, roleId} = res.data
                        this.userinfo.name = username
                        this.userinfo.uid = id
                        this.userinfo.role = roleId
                        
                        resolve(this.userinfo)
                    } else {
                        reject('Verification failed, please Login again.')
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        async generateRoutes(role: string) {
            return new Promise((resolve, reject) => {
                const menus = []
                userMenu(role).then(res => {
                    console.log(res)
                    res.data.forEach(item => {
                        menus.push(item['path'])
                    })
                    console.log('generateRoutes -> menus ==>', menus)
                    const accessedRoutes = filterAsyncRoutes(asyncRoutes, menus)
                    this.addMenus = accessedRoutes
                    this.menus = constantRouter.concat(accessedRoutes)
                    resolve(accessedRoutes)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    },
})