import Vue from 'vue'
import draggable from 'vuedraggable'
import CoursesList from './courses-list'
import ChooseDepartment from './choose-department'
import TimeTable from './time-table'
import CourseDetail from './course-detail'

Vue.component('courses-list', CoursesList)
Vue.component('choose-department', ChooseDepartment)
Vue.component('time-table', TimeTable)
Vue.component('course-detail', CourseDetail)
Vue.component('draggable', draggable)
