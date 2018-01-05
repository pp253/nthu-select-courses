import Vue from 'vue'
import coursesDb from './courses_db.json'

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
        ACIXSTORE: '',
        // 只儲存加入的course number，不然難以查詢
        selectedCourses: [],
        selectedCoursesDetail: [],
        favoriteCourses: [],
        favoriteCoursesDetail: []
      }
    }
  },
  methods: {
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
