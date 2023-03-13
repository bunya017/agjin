
const userRoutes = [  {
    path: '/users',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'user-list',
        component: () => import('pages/users/UserList.vue'),
        meta: {
          requiresAuth: true,
          permission: 'can_list_system_users'
        }
      },
      {
        path: 'new-user',
        name: 'new-user',
        component: () => import('pages/users/NewUser.vue'),
        meta: {
          requiresAuth: true,
          permission: 'can_create_system_user'
        }
      },
      {
        path: 'users/:uuid',
        name: 'user-detail',
        component: () => import('pages/users/UserDetail.vue'),
        meta: {
          requiresAuth: true,
          permission: 'can_view_system_user_details'
        }
      }
    ]
  }
]

export default userRoutes
