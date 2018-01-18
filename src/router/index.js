import Vue from 'vue'
import Router from 'vue-router'
import Entry from '@/components/Entry'
import SelectCourses from '@/components/SelectCourses'
import Scores from '@/components/Scores'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Entry',
      component: Entry
    },
    {
      path: '/select_courses',
      name: 'SelectCourses',
      component: SelectCourses
    },
    {
      path: '/scores',
      name: 'Scores',
      component: Scores
    }
  ]
})
