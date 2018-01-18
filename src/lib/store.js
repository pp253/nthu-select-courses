import Vue from 'vue'
import coursesDb from './courses_db.json'
import * as api from '../api'

const store = new Vue({
  data () {
    return {
      ui: {
        mode: 'pc', // 'mobile', 'pc'
        common: {
          showCourseDetail: false,
          courseDetailNumber: '',
          showCoursesList: true,
          showSelectedCoursesList: true,
          showFavoriteCoursesList: true,
          showTimeTable: true
        },
        pc: {

        },
        mobile: {

        }
      },
      departments: coursesDb.departments,
      catalog: coursesDb.catalog,
      courses: coursesDb.courses,
      user: {
        isLogin: false,
        username: '',
        sessionToken: '',
        // 只儲存加入的course number，不然難以查詢
        selectedCourses: [],
        selectedCoursesStatus: [],
        selectedCoursesDetail: [],
        favoriteCourses: [],
        favoriteCoursesDetail: [],
        scores: {},
        scoresLoaded: false
      }
    }
  },
  methods: {
    login (loginInfo) {
      return new Promise((resolve, reject) => {
        api.getSessionToken(loginInfo)
        .then((data) => {
          this.user.sessionToken = data.sessionToken
          this.user.username = data.username
          this.user.isLogin = true
          resolve(data)
        })
        .catch(function (err) {
          reject(err)
        })
      })
    },
    getScores () {
      return new Promise((resolve, reject) => {
        if (this.user.sessionToken === '') {
          reject()
          return
        }
        if (this.user.scoresLoaded === true) {
          resolve(this.user.scores)
        } else {
          api.getScores(this.user.sessionToken)
          .then((data) => {
            for (let semester in data) {
              this.user.scores[semester] = data[semester]
            }
            this.user.scoresLoaded = true
            resolve(this.user.scores)
          })
          .catch((err) => {
            reject(err)
          })
        }
      })
    },
    getSyllabus (courseNumber) {
      return new Promise((resolve, reject) => {
        if (!(courseNumber in this.courses)) {
          reject()
          return
        }
        if (this.courses[courseNumber].syllabus) {
          resolve(this.courses[courseNumber].syllabus)
        } else {
          api.getSyllabus(courseNumber)
          .then((data) => {
            resolve(data)
          })
          .catch((err) => {
            reject(err)
          })
        }
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
      return this.courses[courseNumber] || {}
    },
    addSelectedCourses (courseNumber) {
      if (this.user.selectedCourses.indexOf(courseNumber) !== -1) {
        console.log('duplicate course selected!')
        return this.user.selectedCourses
      }
      this.user.selectedCourses.push(courseNumber)
      this.user.selectedCoursesDetail.push(this.getCourseDetail(courseNumber))
      return this.user.selectedCourses
    },
    removeSelectedCourses (courseNumber) {
      let idx = this.user.selectedCourses.indexOf(courseNumber)
      if (idx === -1) {
        console.log('course is not selected!')
        return this.user.selectedCourses
      }
      this.user.selectedCourses.splice(idx, 1)
      this.user.selectedCoursesDetail.splice(idx, 1)
      return this.user.selectedCourses
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
    openCourseDetail (courseNumber) {
      this.ui.common.showCourseDetail = true
      this.ui.common.courseDetailNumber = courseNumber
    }
  },
  created () {
    this.$on('open-course-detail', this.openCourseDetail)
  }
})

export default store
