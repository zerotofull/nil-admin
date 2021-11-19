import { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import {ErrorPageRoute, RedirectRoute} from './base'
import { createRouterGuards } from './permission'

const modules = import.meta.globEager('./modules/**/*.ts')

const routeModuleList: RouteRecordRaw[] = []

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

function sortRoute(a: any, b: any) {
  return (a.meta?.sort || 0) - (b.meta?.sort || 0)
}

routeModuleList.sort(sortRoute)

import Layout from "@/layout/index.vue"

export const RootRoute: any = {
  path: '/',
  name: 'Root',
  component: Layout,
  redirect: '/home',
  meta: {
    title: 'Root',
  },
  children: [
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/home.vue'),
      meta: {
        title: '首页',
      },
    }
  ]
}

export const LoginRoute: any = {
  path: '/login',
  name: 'Login',
  hidden: true,
  component: () => import('@/views/login.vue'),
  meta: {
    title: '登录',
  },
}
//需要验证权限
export const asyncRoutes = [...routeModuleList]

//普通路由 无需验证权限
export const constantRouter: any[] = [LoginRoute, RootRoute, RedirectRoute]

const router = createRouter({
  history: createWebHashHistory(''),
  routes: constantRouter,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export async function setupRouter(app: App) {
  app.use(router)
  // 创建路由守卫
  createRouterGuards(router)
}

export default router
