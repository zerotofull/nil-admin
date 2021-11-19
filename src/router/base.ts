let Layout = () => import('@/layout/index.vue')

// 404 on a page
export const ErrorPageRoute: any = {
  path: '/:path(.*)*',
  name: 'ErrorPage',
  hidden: true,
  component: () => import('@/views/error/404.vue'),
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
  },
};

export const RedirectRoute: any = {
  path: '/redirect',
  name: "Redirect",
  component: Layout,
  hidden: true,
  meta: {
    title: "Redirect",
    hideBreadcrumb: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: "Redirect",
      hidden: true,
      component: () => import('@/views/redirect/index.vue'),
      meta: {
        title: "Redirect",
        hideBreadcrumb: true,
      },
    },
  ],
};
