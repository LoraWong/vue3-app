export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '',
        name: 'main',
        component: () => import('@/views/main/index.vue'),
      },
    ],
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: () => import('@/views/detail/index.vue'),
  },
]
