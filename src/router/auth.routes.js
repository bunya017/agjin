
const authRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/auth/Login.vue'),
    meta: {
      isLoginPath: true
    }
  }
]

export default authRoutes
