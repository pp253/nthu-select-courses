import Vue from 'vue'
import coursesDb from './courses_db.json'
import * as api from '../api'
import { htmlEncode } from './util'

const store = new Vue({
  data () {
    return {
      ui: {
        isMobile: false,
        windowSize: {
          x: 0,
          y: 0
        },
        common: {
          loading: false,
          dialog: false,
          dialogTitle: '',
          dialogText: ''
        }
      },
      departments: coursesDb.departments,
      catalog: coursesDb.catalog,
      courses: coursesDb.courses,
      user: {
        isLogin: false,
        username: '',
        sessionToken: '',
        currentSelectedCourses: [],
        currentSelectedCoursesLoaded: false,
        favoriteCourses: [],
        favoriteCoursesDetail: [],
        scores: {},
        scoresLoaded: false,
        overview: {}
      }
    }
  },
  computed: {
    isMobile: {
      get: function () {
        // Fix Vuetify's bug
        if (this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm') {
          this.ui.isMobile = true
          return true
        } else {
          this.ui.isMobile = false
          return false
        }
      },
      set: function (val) {
        console.warn('setter of isMobile should not be called.')
      }
    },
    isNotMobile: {
      get: function () {
        return !this.isMobile
      },
      set: function (val) {
        console.warn('setter of isNotMobile should not be called.')
      }
    }
  },
  methods: {
    getScores () {
      return new Promise((resolve, reject) => {
        if (this.user.sessionToken === '') {
          reject()
          return
        }
        if (this.user.scoresLoaded === true) {
          resolve({
            scores: this.user.scores,
            overview: this.user.overview
          })
        } else {
          api.getScores(this.user.sessionToken)
          .then((data) => {
            for (let semester in data.scores) {
              this.user.scores[semester] = data.scores[semester]
            }
            for (let semester in data.overview) {
              this.user.overview[semester] = data.overview[semester]
            }
            this.user.scoresLoaded = true
            resolve(data)
          })
          .catch((err) => {
            reject(err)
          })
        }
      })
    },
    getCurrentSelectedCourses () {
      return new Promise((resolve, reject) => {
        if (this.user.sessionToken === '') {
          reject()
          return
        }
        if (this.user.currentSelectedCoursesLoaded === true) {
          resolve(this.user.currentSelectedCourses)
        } else {
          api.getCurrentSelectedCourses(this.user.sessionToken)
          .then((data) => {
            this.user.currentSelectedCourses.splice(0, this.user.currentSelectedCourses.length)
            for (let course of data.currentSelectedCourses) {
              this.user.currentSelectedCourses.push(course)
            }
            this.user.currentSelectedCoursesLoaded = true
            resolve(this.user.currentSelectedCourses)
          })
          .catch((err) => {
            reject(err)
          })
        }
      })
    },
    addCourse (courseNumber, order) {
      return new Promise((resolve, reject) => {
        api.addCourse(this.user.sessionToken, courseNumber, order)
        .then((data) => {
          this.user.currentSelectedCourses.splice(0, this.user.currentSelectedCourses.length)
          for (let course of data.currentSelectedCourses) {
            this.user.currentSelectedCourses.push(course)
          }
          this.user.currentSelectedCoursesLoaded = true
          resolve(this.user.currentSelectedCourses)
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
      })
    },
    addCourseAuto (number) {
      return new Promise((resolve, reject) => {
        this.ui.common.loading = true
        let order = ''
        if (this.courses[number].random !== 0) {
          order = this.user.currentSelectedCourses.filter((course) => {
            return course.status && course.status === 2 && this.courses[course.number].random === this.courses[number].random
          }).length + 1
        }

        this.addCourse(number, order)
        .then((data) => {
          this.ui.common.loading = false
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
      })
    },
    quitCourse (courseNumber) {
      return new Promise((resolve, reject) => {
        api.quitCourse(this.user.sessionToken, courseNumber)
        .then((data) => {
          this.user.currentSelectedCourses.splice(0, this.user.currentSelectedCourses.length)
          for (let course of data.currentSelectedCourses) {
            this.user.currentSelectedCourses.push(course)
          }
          this.user.currentSelectedCoursesLoaded = true
          resolve(this.user.currentSelectedCourses)
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
      })
    },
    quitCourseAuto (number) {
      return new Promise((resolve, reject) => {
        this.ui.common.loading = true
        this.quitCourse(number)
        .then((data) => {
          this.ui.common.loading = false
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
      })
    },
    editOrder (newOrder, oldOrder) {
      return new Promise((resolve, reject) => {
        api.editOrder(this.user.sessionToken, newOrder, oldOrder)
        .then((data) => {
          this.user.currentSelectedCourses.splice(0, this.user.currentSelectedCourses.length)
          for (let course of data.currentSelectedCourses) {
            this.user.currentSelectedCourses.push(course)
          }
          this.user.currentSelectedCoursesLoaded = true
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
      })
    },
    getSyllabus (courseNumber) {
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
    },
    getDistribution (courseNumber) {
      return new Promise((resolve, reject) => {
        api.getDistribution(this.user.sessionToken, courseNumber)
        .then((data) => {
          resolve(data.distribution)
        })
        .catch((err) => {
          reject(err)
        })
      })
    },
    getDepartmentDetail (abbr) {
      if (abbr.length <= 4) {
        // Department
        return this.departments[abbr]
      } else {
        // Class
        for (let deptAbbr in this.departments) {
          for (let cls of this.departments[deptAbbr].classes) {
            if (cls.abbr === abbr) {
              return cls
            }
          }
        }
      }
      console.error(`Can't find the abbr ${abbr}`)
      return false
    },
    getCourses (abbr) {
      return this.catalog[abbr] || []
    },
    getCourseDetail (courseNumber) {
      if (!this.courses[courseNumber]) {
        return {}
      }
      if (!this.courses[courseNumber].syllabus) {
        this.$set(this.courses[courseNumber], 'syllabus', {
          description: '',
          briefDescription: '',
          file: false
        })
        this.getSyllabus(courseNumber)
      }
      return this.courses[courseNumber]
    },
    addFavorateCourses (courseNumber) {
      if (this.user.favoriteCourses.indexOf(courseNumber) !== -1) {
        console.log('duplicate course selected!')
        return this.user.favoriteCourses
      }
      this.user.favoriteCourses.push(courseNumber)
      this.user.favoriteCoursesDetail.push(this.getCourseDetail(courseNumber))
      return this.user.favoriteCourses
    },
    removeFavorateCourses (courseNumber) {
      let idx = this.user.favoriteCourses.indexOf(courseNumber)
      if (idx === -1) {
        console.log('course is not selected!')
        return this.user.favoriteCourses
      }
      this.user.favoriteCourses.splice(idx, 1)
      this.user.favoriteCoursesDetail.splice(idx, 1)
      return this.user.favoriteCourses
    },
    courseSelected (courseNumber) {
      return (this.user.currentSelectedCourses.find((course) => {
        return course.number === courseNumber
      }) !== undefined)
    }
  }
})

export default store
