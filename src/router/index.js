import Vue from 'vue'
import VueRouter from 'vue-router'
import Goods from '../views/Goods'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Goods',
    component: Goods
  },
  {
    path: '/ratings',
    name: 'Ratings',
    component: () => import(/* webpackChunkName: "about" */ '../views/Ratings.vue')
  },
  {
    path: '/seller',
    name: 'Seller',
    component: () => import(/* webpackChunkName: "about" */ '../views/Seller.vue')
  },
]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
  mode: "history"
})

export default router
