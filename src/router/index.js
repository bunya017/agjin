import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'

import aclRoutes from './acl.routes'
import authRoutes from './auth.routes'
import publicRoutes from './public.routes'
import userRoutes from './users.routes'

import { hasPermission } from 'boot/utils'
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const ROUTES = [
  ...aclRoutes,
  ...authRoutes,
  ...publicRoutes,
  ...userRoutes,

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'error404',
    component: () => import('pages/Error404.vue')
  }
]

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes: ROUTES,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    const authToken = localStorage.getItem('authToken')
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (authToken === null) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      } else {
        console.log(1)
        if (!hasPermission(authToken, to.meta.permission)) {
          next({name: 'error404'})
        } else {
          next()
        }
      }
    } else {
      next()
    }
  })

  return Router
})
