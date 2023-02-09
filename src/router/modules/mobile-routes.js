export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/main/index.vue'),
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: () => import('@/views/detail/index.vue'),
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/mobile-search/index.vue'),
    meta: {
      noTarBar: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login-register/login/index.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/login-register/register/index.vue'),
  },
  {
    path: '/profile/:userId',
    name: 'profile',
    component: () => import('@/views/profile/index.vue'),
    meta: {
      user: true,
    },
  },
  {
    path: '/member',
    name: 'member',
    component: () => import('@/views/member/index.vue'),
    meta: {
      user: true, // 需要登录才可以访问
    },
  },
  {
    path: '/pay/result',
    name: 'payResult',
    component: () => import('@/views/pay-result/index.vue'),
    meta: {
      user: true,
    },
  },
]
