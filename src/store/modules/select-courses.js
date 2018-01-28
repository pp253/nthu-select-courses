import * as api from '@/api'
import coursesDb from '@/lib/courses_db.json'

export default {
  namespaced: true,
  state: {
    departments: coursesDb.departments,
    catalog: coursesDb.catalog,
    courses: coursesDb.courses
  },
  getters: {

  },
  mutations: {
    setCourseSyllabus (state, options) {
      return new Promise((resolve, reject) => {
        if (!state.courses[options.courseNumber]) {
          Object.assign({}, state.courses, {
            number: options.courseNumber
          })
        }
        if (!state.courses[options.courseNumber].syllabus) {
          api.getSyllabus()
          Object.assign({}, state.courses[options.courseNumber], )
        } else {
          resolve(state.courses[options.courseNumber].syllabus)
        }
          
      })
    }
  },
  actions: {
    getSyllabus (context, courseNumber) {
      return new Promise((resolve, reject) => {
        api.getSyllabus(this.user.sessionToken, courseNumber)
        .then((data) => {
          if (courseNumber in this.courses) {
            this.courses[courseNumber].syllabus.description = data.description
            this.courses[courseNumber].syllabus.briefDescription = data.briefDescription
            this.courses[courseNumber].syllabus.file = data.file
          }
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
      })
    }
  }
}
