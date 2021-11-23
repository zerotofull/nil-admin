import {Router} from 'vue-router'
import {useUserStore} from "@/store/user";


const whiteList = ["/login"]

export function createRouterGuards(router: Router) {
    router.beforeEach(async (to, from, next) => {

        const userStore = useUserStore()
        // 判断 用户 是否 登录
        console.log("userStore.token == >", userStore.token);
        if (userStore.token != "") {

            // 判断 是否获取过 用户信息
            if (userStore.userinfo.name) {
                next()
            } else {
                try {
                    // 获取 用户信息
                    const {role}: UserInfo = await userStore.getUserInfo()
                    // 获取 路由信息
                    console.log(role)
                    const accessRoutes: any = await userStore.generateRoutes(role);
                    // accessRoutes.push(ErrorPageRoute)
                    // router.addRoute(accessRoutes)
                    // next({ ...to, replace: true })
                    console.log("accessRoutes === > ",accessRoutes)

                    accessRoutes.forEach(item => {
                        router.addRoute(item)
                    })

                    next({ ...to, replace: true })
                } catch (e) {
                    console.log(e)
                    next(`/login?redirect=${to.path}`)
                }
            }

        } else {
            if (whiteList.indexOf(to.path) !== -1) {
                next()
            } else {
                next(`/login?redirect=${to.path}`)
            }
        }
    })

    router.afterEach((to, _, failure) => {
    })

    router.onError((error) => {
        console.log(error, '路由错误')
    })
}
