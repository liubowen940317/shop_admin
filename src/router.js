import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login/Login.vue'
import Home from './views/Home/Home.vue'
import Use from './views/Use/Use.vue'
import Roles from './views//Roles/Roles.vue'
import Rights from './views/Rights/Rights.vue'
import Goods from './views/Goods/goods.vue'
import Categories from './views/Goods/Categories.vue'
import goodsAdd from './views/Goods/Goods-add.vue'

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
          path: '/users',
          component: Use
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/goods-add',
          component: goodsAdd
        }
      ]
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
})
