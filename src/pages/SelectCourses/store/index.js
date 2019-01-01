import * as api from '../api'
import error from '@/lib/error'
import coursesDb from './courses_db.min.json'

export default {
  namespaced: true,
  state: {
    departments: coursesDb.departments,
    geDegreeTypes: [
      '社會科學領域 Elective GE course: Social Sciences',
      '人文學領域 Elective GE course: Humanities',
      '自然科學領域 Elective GE course: Natural Sciences',
      '核心通識Core GE courses 1',
      '核心通識Core GE courses 2',
      '核心通識Core GE courses 3',
      '核心通識Core GE courses 4',
      '核心通識Core GE courses 5',
      '核心通識Core GE courses 6'
    ],
    doubleTypes: coursesDb.doubleTypes.sort(),
    programTypes: coursesDb.programTypes.sort(),
    catalog: coursesDb.catalog,
    courses: coursesDb.courses,
    availableSelectionResult: null,
    selectionResult: {},
    currentSelectedCourses: null,
    favoriteCourses: [],

    selectionPhase: true,
    addOrDropPhase: false,
    withdrawalPhase: false,
    editable: false,
    currentSemester: '10720',
    currentPhase: '100',
    semester: '',
    /**
     * phase
     *   - 'current': we are in selection phase right now.
     *   - otherwise: semester of the result
     */
    phase: '',

    /**
     * Configuration of the sorting of courses stauts,
     * - header: their title to be shown in the <CourseList>
     * - status: course.status (0, 1, 2)
     * - orderable: set orderable=true to show the reorder button in <CourseList>.
     * - includesCatalogs: the catalog of random course
     */
    coursesFilteringConfig: [
      {
        header: 'SelectCourses.coursesList.waitingForRandomGEPETitle',
        status: 2,
        orderable: true,
        includesCatalogs: ['通', '體']
      },
      {
        header: 'SelectCourses.coursesList.waitingForRandomCLTTitle',
        status: 2,
        orderable: true,
        includesCatalogs: ['中']
      },
      {
        header: 'SelectCourses.coursesList.waitingForRandomTitle',
        status: 2,
        orderable: false
      },
      {
        header: 'SelectCourses.coursesList.addedCoursesTitle',
        status: 1
      },
      {
        header: 'SelectCourses.coursesList.failedCoursesTitle',
        status: 0
      }
    ],
    geDegreeCode: {
      '自然科學領域 Elective GE course: Natural Sciences': 'GENaturalSciences',
      '社會科學領域 Elective GE course: Social Sciences': 'GESocialSciences',
      '人文學領域 Elective GE course: Humanities': 'GEHumanities',
      '核心通識Core GE courses 1': 'GEC1',
      '核心通識Core GE courses 2': 'GEC2',
      '核心通識Core GE courses 3': 'GEC3',
      '核心通識Core GE courses 4': 'GEC4',
      '核心通識Core GE courses 5': 'GEC5',
      '核心通識Core GE courses 6': 'GEC6'
    },

    /**
     * Store popular item in <department-picker>
     */
    popular: {
      departments: [
        coursesDb.departments['GE'],
        coursesDb.departments['GEC'],
        coursesDb.departments['PE'],
        coursesDb.departments['LANG']
      ],
      geDegree: [],
      double: [],
      program: []
    },
    popularLimit: 7,

    style: {
      selectionResult: {
        textColor: 'blue lighten-2',
        toolbar: {
          color: 'blue lighten-2',
          dark: true
        }
      },
      timeTable: {
        textColor: 'purple lighten-2',
        toolbar: {
          color: 'purple lighten-2',
          dark: true
        }
      },
      coursesCatalog: {
        textColor: 'cyan lighten-2',
        toolbar: {
          color: 'cyan lighten-2',
          dark: true
        }
      }
    }
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
          state.currentSelectedCourses != null &&
          courseNumber !== undefined &&
          state.currentSelectedCourses.find(course => {
            return course.number === courseNumber
          }) !== undefined
        )
      }
    },
    toReadableProfessor() {
      return professorList => {
        if (!professorList) {
          return ''
        }
        let name = ''
        for (let p of professorList) {
          name += p.split('\t')[0] + ' '
        }
        return name
      }
    },
    coursesFiltering(state) {
      /**
       * If we are not in selection phase, skip it and return
       * an empty list.
       */
      if (state.phase !== 'current' || !state.currentSelectedCourses) {
        return []
      }

      /**
       * Performing the result of selection.
       * First, we put there types of course status (0, 1, 2) into
       * 3 list in
       *   coursesSet[course.status] = [course, ...]
       *
       * And the random course (status = 2) is in the
       *   coursesSet[course.status][course.orderCatalog]
       *     = [course, ...]
       */
      let coursesSet = {}
      for (let course of state.currentSelectedCourses) {
        if (!course.status) {
          console.error('Course should have course status.', course)
          continue
        }
        if (!(course.status in coursesSet)) {
          coursesSet[course.status] = []
        }
        if (course.status === 2) {
          if (!course.status) {
            console.error(
              'Course which is ordarable should have course orderCatalog.',
              course
            )
            continue
          }
          if (!(course.orderCatalog in coursesSet[course.status])) {
            coursesSet[course.status][course.orderCatalog] = []
          }
          coursesSet[course.status][course.orderCatalog].push(course)
        } else {
          coursesSet[course.status].push(course)
        }
      }

      let resultSet = {}
      /**
       * Process each courses filtering configuration to fulfill it.
       */
      for (let item of state.coursesFilteringConfig) {
        /**
         * If item.status not appear in the course status of courses
         * in the coursesSet, skip it.
         */
        if (!(item.status in coursesSet)) {
          continue
        }
        /**
         * If item.status is randomized (status=2).
         */
        if (item.status === 2) {
          if (item.orderable === true) {
            let list = []
            for (let catalog of item.includesCatalogs) {
              if (!(catalog in coursesSet[item.status])) {
                continue
              }
              list = list.concat(coursesSet[item.status][catalog])
            }
            if (list.length === 0) {
              continue
            }
            let sorting = (courseA, courseB) => {
              return courseA.order - courseB.order
            }
            list.sort(sorting)

            resultSet[item.header] = list
          } else if ('' in coursesSet[item.status]) {
            resultSet[item.header] = coursesSet[item.status]['']
          }
        } else if (item.status in coursesSet) {
          /**
           * Otherwise, item.status is 0, 1, which to be success selected
           * or failed.
           */
          resultSet[item.header] = coursesSet[item.status]
        }
      }
      return resultSet
    }
  },
  mutations: {
    RESET_STATE(state) {
      state.departments = coursesDb.departments
      state.catalog = coursesDb.catalog
      state.courses = coursesDb.courses
      state.availableSelectionResult = null
      state.selectionResult = {}
      state.currentSelectedCourses = null
      state.favoriteCourses = []

      state.selectionPhase = true
      state.addOrDropPhase = false
      state.withdrawalPhase = false
      state.editable = false
      state.currentSemester = '10720'
      state.currentPhase = '100'
      state.semester = ''

      state.phase = ''
    },
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
    SET_CURRENT_SEMESTER(state, options) {
      state.currentSemester = options.currentSemester
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
    SET_POPULAR(state, options) {
      /**
       * If the options.item already exist, remove it and insert it
       * to the front.
       */
      if (state.popular[options.type].find(v => v === options.item)) {
        state.popular[options.type].splice(
          state.popular[options.type].indexOf(options.item),
          1
        )
      }
      state.popular[options.type].unshift(options.item)
      state.popular[options.type].splice(state.popularLimit)
    }
  },
  actions: {
    quitCourse(context, options) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }
        if (!(context.state.phase === 'current')) {
          reject(error.ResponseErrorMsg.NotInSelectionPhase())
          return
        }

        api
          .quitCourse(context.rootState.user.sessionToken, options.courseNumber)
          .then(data => {
            context.commit('SET_CURRENT_SELECTED_COURSES', {
              currentSelectedCourses: data.currentSelectedCourses
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
        if (
          !(context.state.phase === 'current') ||
          !context.state.currentSelectedCourses
        ) {
          reject(error.ResponseErrorMsg.NotInSelectionPhase())
          return
        }

        /**
         * Check whether the course is a randomized and orderable course,
         * if it is, we have to get the order.
         * Course order is the largest order of the current selectd courses.
         */
        if (
          !options.order &&
          context.state.courses[options.courseNumber].random !== 0
        ) {
          options.order =
            context.state.currentSelectedCourses
              .filter(course => {
                return (
                  course.status &&
                  course.status === 2 &&
                  context.state.courses[course.number].random ===
                    context.state.courses[course.number].random
                )
              })
              .reduce((a, c) => (c.order > a.order ? c : a)).order + 1
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
            }
            resolve(context.state.currentSelectedCourses)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getCurrentSelectedCourses(context) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }
        context.dispatch(
          'loading/start',
          'selectCourses.getCurrentSelectedCourses',
          {
            root: true
          }
        )

        api
          .getCurrentSelectedCourses(context.rootState.user.sessionToken)
          .then(data => {
            context.commit('SET_CURRENT_SELECTED_COURSES', {
              currentSelectedCourses: data.currentSelectedCourses
            })
            context.dispatch(
              'loading/end',
              'selectCourses.getCurrentSelectedCourses',
              {
                root: true
              }
            )
            resolve(context.state.currentSelectedCourses)
          })
          .catch(err => {
            context.dispatch(
              'loading/end',
              'selectCourses.getCurrentSelectedCourses',
              {
                root: true
              }
            )
            reject(err)
          })
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
          context.dispatch('loading/start', 'selectCourses.getSyllabus', {
            root: true
          })
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
              context.dispatch('loading/end', 'selectCourses.getSyllabus', {
                root: true
              })
              resolve(data.syllabus)
            })
            .catch(err => {
              context.dispatch('loading/end', 'selectCourses.getSyllabus', {
                root: true
              })
              reject(err)
            })
        }
      })
    },
    getAvailableSelectionResult(context) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

        if (context.state.availableSelectionResult !== null) {
          resolve(context.state.availableSelectionResult)
        } else {
          context.dispatch(
            'loading/start',
            'selectCourses.getAvailableSelectionResult',
            {
              root: true
            }
          )
          api
            .getAvailableSelectionResult(context.rootState.user.sessionToken)
            .then(data => {
              context.commit('SET_AVAILABLE_SELECTION_RESULT', {
                availableSelectionResult: data.availableSelectionResult
              })
              context.commit('SET_SEMESTER', {
                semester: data.semester
              })
              context.commit('SET_CURRENT_SEMESTER', {
                currentSemester: data.semester
              })
              context.commit('SET_PHASE', { semester: data.phase })
              context.commit('SET_EDITABLE', {
                editable: data.editable
              })
              context.dispatch(
                'loading/end',
                'selectCourses.getAvailableSelectionResult',
                {
                  root: true
                }
              )

              resolve(data.availableSelectionResult)
            })
            .catch(err => {
              context.dispatch(
                'loading/end',
                'selectCourses.getAvailableSelectionResult',
                {
                  root: true
                }
              )
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

        context.dispatch('loading/start', 'selectCourses.getSelectionResult', {
          root: true
        })
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
            context.dispatch(
              'loading/end',
              'selectCourses.getSelectionResult',
              {
                root: true
              }
            )
            resolve(data)
          })
          .catch(err => {
            context.dispatch(
              'loading/end',
              'selectCourses.getSelectionResult',
              {
                root: true
              }
            )
            reject(err)
          })
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
