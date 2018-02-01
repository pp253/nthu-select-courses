import * as api from '@/api'
import error from '@/lib/error'
import coursesDb from '@/lib/courses_db.json'

export default {
  namespaced: true,
  state: {
    departments: coursesDb.departments,
    catalog: coursesDb.catalog,
    courses: coursesDb.courses,
    availableSelectionResult: [],
    availableSelectionResultLoaded: false,
    selectionResult: {},
    currentSelectedCourses: [],
    currentSelectedCoursesLoaded: false,
    favoriteCourses: [],
    selectionPhase: false,
    addOrDropPhase: false,
    withdrawalPhase: false,
    editable: false,
    semester: '',
    phase: ''
  },
  mutations: {
    setSelectionPhase (state, options) {
      state.selectionPhase = options.selectionPhase
    },
    setAddOrDropPhase (state, options) {
      state.addOrDropPhase = options.addOrDropPhase
    },
    setWithdrawalPhase (state, options) {
      state.withdrawalPhase = options.withdrawalPhase
    },
    setEditable (state, options) {
      state.editable = options.editable
    },
    setSemester (state, options) {
      state.semester = options.semester
    },
    setPhase (state, options) {
      state.phase = options.phase
    },
    setSyllabus (state, options) {
      if (!state.courses[options.courseNumber]) {
        return
      }
      state.courses[options.courseNumber] = Object.assign({}, state.courses[options.courseNumber], {
        syllabus: options.syllabus
      })
    },
    setAvailableSelectionResult (state, options) {
      state.availableSelectionResult = Object.assign({}, state.availableSelectionResult, options.availableSelectionResult)
    },
    setAvailableSelectionResultLoaded (state, options) {
      state.setAvailableSelectionResultLoaded = options.availableSelectionResultLoaded
    },
    setSelectionResult (state, options) {
      state.selectionResult = Object.assign({}, state.selectionResult, {
        [options.semester]: {
          [options.phase]: options.selectionResult
        }
      })
    },
    setCurrentSelectedCourses (state, options) {
      state.currentSelectedCourses = options.currentSelectedCourses
    },
    setCurrentSelectedCoursesLoaded (state, options) {
      state.currentSelectedCoursesLoaded = options.currentSelectedCoursesLoaded
    }
  },
  actions: {
    quitCourse (context, options) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

        api.quitCourse(context.rootState.user.sessionToken, options.courseNumber)
        .then((data) => {
          context.commit('setCurrentSelectedCourses', {currentSelectedCourses: data.currentSelectedCourses})
          context.commit('setCurrentSelectedCoursesLoaded', {currentSelectedCoursesLoaded: true})
          resolve(context.state.currentSelectedCourses)
        })
        .catch((err) => {
          reject(err)
        })
      })
    },
    addCourse (context, options) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

        api.addCourse(context.rootState.user.sessionToken, options.courseNumber, options.order)
        .then((data) => {
          context.commit('setCurrentSelectedCourses', {currentSelectedCourses: data.currentSelectedCourses})
          context.commit('setCurrentSelectedCoursesLoaded', {currentSelectedCoursesLoaded: true})
          resolve(context.state.currentSelectedCourses)
        })
        .catch((err) => {
          reject(err)
        })
      })
    },
    editOrder (context, options) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

        api.editOrder(context.rootState.user.sessionToken, options.newOrder, options.oldOrder)
        .then((data) => {
          context.commit('setCurrentSelectedCourses', {currentSelectedCourses: data.currentSelectedCourses})
          context.commit('setCurrentSelectedCoursesLoaded', {currentSelectedCoursesLoaded: true})
          resolve(context.state.currentSelectedCourses)
        })
        .catch((err) => {
          reject(err)
        })
      })
    },
    getCurrentSelectedCourses (context, options) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

        if (context.state.currentSelectedCoursesLoaded) {
          resolve(context.state.currentSelectedCourses)
        } else {
          api.getCurrentSelectedCourses(context.rootState.user.sessionToken)
          .then((data) => {
            context.commit('setCurrentSelectedCourses', {currentSelectedCourses: data.currentSelectedCourses})
            context.commit('setCurrentSelectedCoursesLoaded', {currentSelectedCoursesLoaded: true})
            resolve(context.state.currentSelectedCourses)
          })
          .catch((err) => {
            reject(err)
          })
        }
      })
    },
    getSyllabus (context, options) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

        if (context.state.courses[options.courseNumber] && context.state.courses[options.courseNumber].syllabus) {
          resolve(context.state.courses[options.courseNumber].syllabus)
        } else {
          api.getSyllabus(context.rootState.user.sessionToken, options.courseNumber)
          .then((data) => {
            context.commit('setSyllabus', {
              courseNumber: options.courseNumber,
              syllabus: data.syllabus
            })
            resolve(data.syllabus)
          })
          .catch((err) => {
            reject(err)
          })
        }
      })
    },
    getAvailableSelectionResult (context, options) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

        if (context.state.availableSelectionResultLoaded) {
          resolve(context.state.availableSelectionResult)
        } else {
          api.getAvailableSelectionResult(context.rootState.user.sessionToken)
          .then((data) => {
            context.commit('setAvailableSelectionResult', {availableSelectionResult: data.availableSelectionResult})
            context.commit('setAvailableSelectionResultLoaded', {availableSelectionResultLoaded: true})
            context.commit('setSemester', {semester: data.semester})
            context.commit('setPhase', {semester: data.phase})
            context.commit('setEditable', {editable: data.editable})

            resolve(data.availableSelectionResult)
          })
          .catch((err) => {
            reject(err)
          })
        }
      })
    },
    getSelectionResult (context, options) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

        if (context.state.selectionResult[options.semester] && context.state.selectionResult[options.semester][options.phase]) {
          resolve(context.state.selectionResult[options.semester][options.phase])
        } else {
          api.getSelectionResult(context.rootState.user.sessionToken, options.semester, options.phase)
          .then((data) => {
            context.commit('setSelectionResult', {
              semester: data.semester,
              phase: data.phase,
              selectionResult: {
                semester: data.semester,
                phase: data.phase,
                status: data.status,
                randomFailed: data.randomFailed,
                waitingForRandom: data.waitingForRandom
              }
            })
            resolve(data)
          })
          .catch((err) => {
            reject(err)
          })
        }
      })
    },
    getDepartmentDetail (context, options) {
      return new Promise((resolve, reject) => {
        let abbr = options.abbr
        if (abbr.length <= 4 && (abbr in context.state.departments)) {
          // Department
          resolve(context.state.departments[abbr])
          return
        } else {
          // Class
          for (let deptAbbr in context.state.departments) {
            for (let cls of context.state.departments[deptAbbr].classes) {
              if (cls.abbr === abbr) {
                resolve(cls)
                return
              }
            }
          }
        }
        reject(error.ResponseErrorMsg.DepartmentAbbrNotFound())
      })
    },
    isCourseSelected (context, options) {
      return (context.state.currentSelectedCourses.find((course) => {
        return course.number === options.courseNumber
      }) !== undefined)
    }
  }
}
