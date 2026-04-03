import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/dashboard/index.vue'
import Auth from '../views/auth/index.vue'
import Diagnosis from '../views/diagnosis/index.vue'
import Upload from '../views/upload/index.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/auth',
    name: 'Auth', 
    component: Auth
  },
  {
    path: '/diagnosis',
    name: 'Diagnosis',
    component: Diagnosis
  },
  {
    path: '/upload',
    name: 'Upload',
    component: Upload
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router