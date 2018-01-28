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
    },
    getDistribution (context, courseNumber) {
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
    // This should move to select-courses
    getDepartmentDetail (context, abbr) {
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
    }
  }
}
