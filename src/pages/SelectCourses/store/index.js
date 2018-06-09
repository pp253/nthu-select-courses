import * as api from '@/api'
import error from '@/lib/error'
import coursesDb from './courses_db.json'

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
    selectionPhase: true,
    addOrDropPhase: false,
    withdrawalPhase: false,
    editable: false,
    currentSemester: '10710',
    currentPhase: '100',
    semester: '',
    phase: ''
  },
  getters: {
    isCurrentSemester(state, getters) {
      return courseNumber => {
        return (
          courseNumber !== undefined &&
          getters.getCourseSemester(courseNumber) === state.currentSemester
        )
      }
    },
    getCourseSemester() {
      return courseNumber => {
        return courseNumber.slice(0, 5)
      }
    },
    isCourseSelected(state) {
      return courseNumber => {
        return (
          courseNumber !== undefined &&
          state.currentSelectedCourses.find(course => {
            return course.number === courseNumber
          }) !== undefined
        )
      }
    }
  },
  mutations: {
    SET_SELECTION_PHASE(state, options) {
      state.selectionPhase = options.selectionPhase
    },
    SET_ADD_OR_DROP_PHASE(state, options) {
      state.addOrDropPhase = options.addOrDropPhase
    },
    SET_WITHDRAWAL_PHASE(state, options) {
      state.withdrawalPhase = options.withdrawalPhase
    },
    SET_EDITABLE(state, options) {
      state.editable = options.editable
    },
    SET_SEMESTER(state, options) {
      state.semester = options.semester
    },
    SET_PHASE(state, options) {
      state.phase = options.phase
    },
    SET_SYLLABUS(state, options) {
      if (!state.courses[options.courseNumber]) {
        state.courses[options.courseNumber] = Object.assign(
          {
            number: options.courseNumber
          },
          options.syllabus
        )
      }
      state.courses[options.courseNumber] = Object.assign(
        {},
        state.courses[options.courseNumber],
        {
          syllabus: options.syllabus
        }
      )
    },
    SET_AVAILABLE_SELECTION_RESULT(state, options) {
      state.availableSelectionResult = Object.assign(
        {},
        state.availableSelectionResult,
        options.availableSelectionResult
      )
    },
    SET_AVAILABLE_SELECTION_RESULT_LOADED(state, options) {
      state.setAvailableSelectionResultLoaded =
        options.availableSelectionResultLoaded
    },
    SET_SELECTION_RESULT(state, options) {
      state.selectionResult = Object.assign({}, state.selectionResult, {
        [options.semester]: {
          [options.phase]: options.selectionResult
        }
      })
    },
    SET_CURRENT_SELECTED_COURSES(state, options) {
      state.currentSelectedCourses = options.currentSelectedCourses
    },
    SET_CURRENT_SELECTED_COURSES_LOADED(state, options) {
      state.currentSelectedCoursesLoaded = options.currentSelectedCoursesLoaded
    }
  },
  actions: {
    quitCourse(context, options) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

        api
          .quitCourse(context.rootState.user.sessionToken, options.courseNumber)
          .then(data => {
            context.commit('SET_CURRENT_SELECTED_COURSES', {
              currentSelectedCourses: data.currentSelectedCourses
            })
            context.commit('SET_CURRENT_SELECTED_COURSES_LOADED', {
              currentSelectedCoursesLoaded: true
            })
            resolve(context.state.currentSelectedCourses)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    addCourse(context, options) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

        api
          .addCourse(
            context.rootState.user.sessionToken,
            options.courseNumber,
            options.order
          )
          .then(data => {
            context.commit('SET_CURRENT_SELECTED_COURSES', {
              currentSelectedCourses: data.currentSelectedCourses
            })
            context.commit('SET_CURRENT_SELECTED_COURSES_LOADED', {
              currentSelectedCoursesLoaded: true
            })
            resolve(context.state.currentSelectedCourses)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    editOrder(context, options) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

        let adjustedOldOrder = []
        for (
          let order = 0, idx = 0;
          order < options.oldOrder[options.oldOrder.length - 1].order;
          order++
        ) {
          let course = options.oldOrder[idx]
          if (course.order === order + 1) {
            adjustedOldOrder[order] = course
            idx++
          } else {
            adjustedOldOrder[order] = undefined
          }
        }

        api
          .editOrder(
            context.rootState.user.sessionToken,
            options.newOrder,
            adjustedOldOrder
          )
          .then(data => {
            if ('currentSelectedCourses' in data) {
              context.commit('SET_CURRENT_SELECTED_COURSES', {
                currentSelectedCourses: data.currentSelectedCourses
              })
              context.commit('SET_CURRENT_SELECTED_COURSES_LOADED', {
                currentSelectedCoursesLoaded: true
              })
            }
            resolve(context.state.currentSelectedCourses)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getCurrentSelectedCourses(context, options) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

        if (context.state.currentSelectedCoursesLoaded) {
          resolve(context.state.currentSelectedCourses)
        } else {
          api
            .getCurrentSelectedCourses(context.rootState.user.sessionToken)
            .then(data => {
              context.commit('SET_CURRENT_SELECTED_COURSES', {
                currentSelectedCourses: data.currentSelectedCourses
              })
              context.commit('SET_CURRENT_SELECTED_COURSES_LOADED', {
                currentSelectedCoursesLoaded: true
              })
              resolve(context.state.currentSelectedCourses)
            })
            .catch(err => {
              reject(err)
            })
        }
      })
    },
    getSyllabus(context, options) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

        if (
          context.state.courses[options.courseNumber] &&
          context.state.courses[options.courseNumber].syllabus
        ) {
          resolve(context.state.courses[options.courseNumber].syllabus)
        } else {
          api
            .getSyllabus(
              context.rootState.user.sessionToken,
              options.courseNumber
            )
            .then(data => {
              context.commit('SET_SYLLABUS', {
                courseNumber: options.courseNumber,
                syllabus: data.syllabus
              })
              resolve(data.syllabus)
            })
            .catch(err => {
              reject(err)
            })
        }
      })
    },
    getAvailableSelectionResult(context, options) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

        if (context.state.availableSelectionResultLoaded) {
          resolve(context.state.availableSelectionResult)
        } else {
          api
            .getAvailableSelectionResult(context.rootState.user.sessionToken)
            .then(data => {
              context.commit('SET_AVAILABLE_SELECTION_RESULT', {
                availableSelectionResult: data.availableSelectionResult
              })
              context.commit('SET_AVAILABLE_SELECTION_RESULT_LOADED', {
                availableSelectionResultLoaded: true
              })
              context.commit('SET_SEMESTER', { semester: data.semester })
              context.commit('SET_PHASE', { semester: data.phase })
              context.commit('SET_EDITABLE', { editable: data.editable })

              resolve(data.availableSelectionResult)
            })
            .catch(err => {
              reject(err)
            })
        }
      })
    },
    getSelectionResult(context, options) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

        if (
          context.state.selectionResult[options.semester] &&
          context.state.selectionResult[options.semester][options.phase]
        ) {
          resolve(
            context.state.selectionResult[options.semester][options.phase]
          )
        } else {
          api
            .getSelectionResult(
              context.rootState.user.sessionToken,
              options.semester,
              options.phase
            )
            .then(data => {
              context.commit('SET_SELECTION_RESULT', {
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
            .catch(err => {
              reject(err)
            })
        }
      })
    },
    getDepartmentDetail(context, options) {
      return new Promise((resolve, reject) => {
        let abbr = options.abbr
        if (abbr.length <= 4 && abbr in context.state.departments) {
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
    isCourseSelected(context, options) {
      return (
        context.state.currentSelectedCourses.find(course => {
          return course.number === options.courseNumber
        }) !== undefined
      )
    }
  }
}
