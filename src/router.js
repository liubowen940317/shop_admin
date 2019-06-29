import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import Use from './views/Use.vue'
import List from './views/List.vue'

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
          path: '/list',
          component: List
        }
      ]
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
})
