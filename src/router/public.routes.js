
const publicRoutes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        redirect: { name: 'login' }
      }
    ]
  }
]

export default publicRoutes
