import Vue from 'vue'
import draggable from 'vuedraggable'
import { Bar, HorizontalBar, mixins } from 'vue-chartjs'
import datalabels from 'chartjs-plugin-datalabels'
import CoursesList from './courses-list'
import ChooseDepartment from './choose-department'
import TimeTable from './time-table'
import CourseDetail from './course-detail'
import ScoreList from './score-list'
import ScoreCourseDetail from './score-course-detail'
const { reactiveProp } = mixins

Vue.component('courses-list', CoursesList)
Vue.component('choose-department', ChooseDepartment)
Vue.component('time-table', TimeTable)
Vue.component('course-detail', CourseDetail)
Vue.component('draggable', draggable)
Vue.component('score-list', ScoreList)
Vue.component('score-course-detail', ScoreCourseDetail)
Vue.component('horizontal-bar-chart', {
  extends: Bar,
  mixins: [reactiveProp],
  props: {
    'options': {
      type: Object,
      default: () => {
        return {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                    // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return value + '人'
                },
                fontSize: 12
              }
            }],
            xAxes: [{
              ticks: {
                fontSize: 16
              }
            }]
          },
          legend: {
            display: false
          },
          tooltips: {
            enabled: false
          },
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 30,
              bottom: 0
            }
          }
        }
      }
    }
  },
  mounted () {
    this.addPlugin(datalabels)
    this.renderChart(this.chartData, this.options)
  }
})
