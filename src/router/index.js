import Vue from 'vue'
import Router from 'vue-router'
import Entry from '@/pages/Entry'
import Service from '@/pages/Service'
import { signal } from './back'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Entry',
      component: Entry
    },
    {
      path: '/service',
      name: 'Service',
      component: Service
    },
    {
      path: '/select_courses',
      name: 'SelectCourses',
      component: () => import('@/pages/SelectCourses')
    },
    {
      path: '/advisor_password',
      name: 'AdvisorPassword',
      component: () => import('@/pages/AdvisorPassword')
    },
    {
      path: '/scores',
      name: 'Scores',
      component: () => import('@/pages/Scores')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/pages/About')
    }
  ]
})

router.beforeEach((to, from, next) => {
  next(signal())
})

export default router
