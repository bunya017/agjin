
const aclRoutes = [
  {
    path: '/acl',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'user-permissions',
        name: 'permission-list',
        component: () => import('pages/access_control/Permissions.vue'),
        meta: {
          requiresAuth: true,
          permission: 'can_view_permission'
        }
      },
      {
        path: 'user-roles',
        name: 'role-list',
        component: () => import('pages/access_control/Roles.vue'),
        meta: {
          requiresAuth: true,
          permission: 'can_view_role'
        }
      },
      {
        path: 'user-roles/:roleName',
        name: 'role-detail',
        component: () => import('pages/access_control/RoleDetail.vue'),
        meta: {
          requiresAuth: true,
          permission: 'can_view_role'
        }
      },
      {
        path: 'user-groups',
        name: 'group-list',
        component: () => import('pages/access_control/UserGroupList.vue'),
        meta: {
          requiresAuth: true,
          permission: 'can_view_group'
        }
      },
      {
        path: 'user-groups/:groupName',
        name: 'group-detail',
        component: () => import('pages/access_control/UserGroupDetail.vue'),
        meta: {
          requiresAuth: true,
          permission: 'can_view_group'
        }
      }
    ]
  }
]

export default aclRoutes
