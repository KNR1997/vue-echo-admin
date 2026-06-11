const Layout = () => import('@/layout/index.vue')

export const basicRoutes = [
  {
    path: '/',
    redirect: '/workbench', // 默认跳转到首页
    meta: { order: 0 },
  },
  {
    name: 'Workbench-tsdsd',
    path: '/workbench',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/workbench/index.vue'),
        name: 'Workbench',
        meta: {
          title: 'Workbench',
          icon: 'icon-park-outline:workbench',
          affix: true,
        },
      },
    ],
    meta: { order: 1 },
  },
  {
    name: 'Login-tsdsd',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    isHidden: true,
  },
  {
    name: 'Posts-ddd',
    path: '/posts',
    component: Layout,
    children: [
      {
        name: 'Posts',
        path: '',
        component: () => import('@/views/post/index.vue'),
        meta: {
          title: 'Posts',
          icon: 'fluent:quiz-20-regular',
          affix: true,
        },
      },
    ],
    meta: { order: 2 },
  },
  {
    name: 'System-dev',
    path: '/system',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/system/index.vue'),
        name: 'System',
        meta: {
          title: 'System Default',
          icon: 'icon-park-outline:workbench',
          affix: true,
        },
      },
    ],
    meta: { order: 5 },
  },
  {
    name: 'Profile-dev',
    path: '/profile',
    component: Layout,
    isHidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/profile/index.vue'),
        name: 'Profile',
        meta: {
          title: 'Profile',
          icon: 'user',
          affix: true,
        },
      },
    ],
    meta: { order: 99 },
  },
  {
    name: 'Settings-tdd',
    path: '/settings',
    component: Layout,
    children: [
      {
        path: 'users',
        component: () => import('@/views/settings/users.vue'),
        name: 'Users',
        meta: {
          title: 'Users',
          icon: 'fluent:quiz-20-regular',
          affix: true,
        },
      },
      {
        path: 'roles',
        component: () => import('@/views/settings/roles.vue'),
        name: 'Roles',
        meta: {
          title: 'Roles',
          icon: 'fluent:quiz-20-regular',
          affix: true,
        },
      },
      {
        path: 'menus',
        component: () => import('@/views/settings/menus.vue'),
        name: 'Menus',
        meta: {
          title: 'Menus',
          icon: 'fluent:quiz-20-regular',
          affix: true,
        },
      },
      {
        path: 'apis',
        component: () => import('@/views/settings/apis.vue'),
        name: 'Apis',
        meta: {
          title: 'Apis',
          icon: 'fluent:quiz-20-regular',
          affix: true,
        },
      },
      {
        path: 'departments',
        component: () => import('@/views/settings/departments.vue'),
        name: 'Departments',
        meta: {
          title: 'Departments',
          icon: 'fluent:quiz-20-regular',
          affix: true,
        },
      },
    ],
    meta: { order: 2 },
  },
]
