/**
 * 用户权限 管理
 */

let Layout = () => import('@/layout/index.vue')

const AuthRouter = {
    path: '/auth',
    name: "Auth",
    component: Layout,
    redirect: "/auth/user",
    meta: {
        title: "权限管理",
        realPath: "/auth"
    },
    children: [
        {
            path: '/auth/user',
            name: "AuthUser",
            component: () => import('@/views/auth/user.vue'),
            meta: {
                title: "用户列表",
                realPath: "/auth/user"
            },
        },
        {
            path: '/auth/role',
            name: "AuthRole",
            component: () => import('@/views/auth/role.vue'),
            meta: {
                title: "角色列表",
                realPath: "/auth/role"
            },
        },
        {
            path: '/auth/menu',
            name: "AuthMenu",
            component: () => import('@/views/auth/menu.vue'),
            meta: {
                title: "菜单列表",
                realPath: "/auth/menu"
            },
        },
    ],


}

export default AuthRouter;