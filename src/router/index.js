import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/article',
    name: 'article',

    component: () => import('../views/ArticleView.vue')
  },
  {
    path: '/categories/:categoryId/:categoryName',
    name: 'categories',

    component: () => import('../views/CategoriesView.vue')
  },
  {
    path: '/login',
    name: 'login',

    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/userprofile',
    name: 'userprofile',

    component: () => import('../views/UserProfileView.vue')
  },
  {
    path: '/register',
    name: 'register',

    component: () => import('../views/RegisterView.vue')
  },


  {
    path: '/',
    redirect: '/home'
  }
]


const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})


export default router
