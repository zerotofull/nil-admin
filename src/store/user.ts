import {defineStore} from 'pinia'
import {userinfo, userMenu} from "@/api/user";
import {asyncRoutes, constantRouter} from "@/router";
import {RouteRecordRaw} from "vue-router";
import {ApiReturnData} from "@/types/user";

function hasPermission(menus, route) {
    if (route.meta && route.meta.realPath) {
        return menus.some(role => role.includes(route.meta.realPath))
    } else {
        return true
    }
}

function filterAsyncRoutes(asyncRoutes: RouteRecordRaw[], menus: any[], menusData: any[string]) {
    const res = []
    asyncRoutes.forEach((route) => {
        const tmp = {...route}
        if (hasPermission(menus, tmp)) {
            tmp.meta.title = menusData[`${route.meta.realPath}`]?.name ?? ""
            tmp.meta.icon = menusData[`${route.meta.realPath}`]?.icon ?? ""
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, menus, menusData)
            }
            res.push(tmp)
        }
    })
    return res
}


function filterAsyncRoutesHint(asyncRoutes: RouteRecordRaw[]) {
    const res = []
    asyncRoutes.forEach((route) => {
        const tmp = {...route}
        res.push({
            name: tmp.meta.title,
            path: tmp.meta.realPath
        })
        if (tmp.children) {
            let temp = filterAsyncRoutesHint(tmp.children)
            res.push(...temp)
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
                role: "",
                username: ""
            },
            menus: [],
            addMenus: [],
            menusHint:[],
            menusInner: []
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
            this.userinfo.username = ""
            this.menus = []
            this.addMenus = []
        },
        async getUserInfo() {
            return new Promise((resolve, reject) => {
                userinfo().then((res: ApiReturnData) => {
                    if (res.success) {
                        const {id, username, roleId,name} = res.data
                        this.userinfo.name = name
                        this.userinfo.username = username
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
        async ganHintMenus() {
            return new Promise((resolve) => {
                if (this.menusHint.length > 0){
                    resolve(this.menusHint)
                }else {
                    this.menusHint =  filterAsyncRoutesHint(asyncRoutes)
                    resolve(this.menusHint)
                }
            })
        },
        async generateRoutes(role: string) {
            return new Promise((resolve, reject) => {
                const menus = []
                const menusData = {};
                userMenu(role).then(res => {
                    // 格式化 请求 而来的 路由
                    const target = {}
                    res.data.forEach(item => {
                        if (!target[item.pid]) {
                            target[item.pid] = []
                        }
                        const arr = target[item.pid]

                        menus.push(item['path'])
                        menusData[item['path']] = item

                        arr.push({
                            meta: {
                                realPath: item['path'],
                                icon: item['icon'],
                                title: item['name']
                            },
                            path: item['path'],
                            id: item['id']
                        })
                    })

                    const temp = target[0]
                    if (temp) {
                        temp.forEach((item, index) => {
                            item.children = target[item.id]
                        })
                    }

                    const accessedRoutes = filterAsyncRoutes(asyncRoutes, menus, menusData)
                    this.addMenus = accessedRoutes
                    this.menusInner = constantRouter.concat(accessedRoutes)
                    this.menus = temp
                    resolve(accessedRoutes)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    },
})