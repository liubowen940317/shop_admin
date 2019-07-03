import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login/Login.vue'
import Home from './views/Home/Home.vue'
import Use from './views/Use/Use.vue'
import Roles from './views//Roles/Roles.vue'
import Rights from './views/Rights/Rights.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/use',
          component: Use
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/rights',
          component: Rights
        }
      ]
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
})
