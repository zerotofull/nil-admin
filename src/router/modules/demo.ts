let Layout = () => import('@/layout/index.vue')

const demoRouter = {
    path: '/demo',
    name: "Demo",
    component: Layout,
    meta: {
        title: "Demo",
        realPath: "/demo"
    },
    children: [
        {
            path: '/demo/demo1',
            name: "Demo1",
            component: () => import('@/views/demo/demo.vue'),
            meta: {
                title: "Demo1",
                realPath: "/demo/demo1"
            },
        },
        {
            path: '/demo/demo2',
            name: "Demo2",
            component: () => import('@/views/demo/demo.vue'),
            meta: {
                title: "Demo2",
                realPath: "/demo/demo2"
            },
        },
    ],
}

export default demoRouter