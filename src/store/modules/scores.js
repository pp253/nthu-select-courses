import * as api from '@/api'
import error from '@/lib/error'

export default {
  namespaced: true,
  state: {
    scores: {},
    courses: {},
    scoresLoaded: false,
    overview: {}
  },
  getters: {

  },
  mutations: {
    setScores (state, options) {
      state.scores = Object.assign({}, state.scores, options.scores)
    },
    setCourses (state, options) {
      state.courses = Object.assign({}, state.courses, options.courses)
    },
    /**
     * Set the distribution of an existed course.
     * @param {*} options Options should include `courseNumber`, `distribution`
     */
    setDistribution (state, options) {
      if (!state.courses[options.courseNumber]) {
        return
      }
      state.courses[options.courseNumber] = Object.assign({}, state.courses[options.courseNumber], {
        distribution: options.distribution
      })
    },
    /**
     * Set the distribution of an existed course.
     * @param {object} options Options should include `courseNumber`, `syllabus`
     */
    setSyllabus (state, options) {
      if (!state.courses[options.courseNumber]) {
        return
      }
      state.courses[options.courseNumber] = Object.assign({}, state.courses[options.courseNumber], {
        syllabus: options.syllabus
      })
    },
    setOverview (state, options) {
      state.overview = Object.assign({}, state.overview, options.overview)
    },
    setScoresLoaded (state) {
      state.scoresLoaded = true
    }
  },
  actions: {
    getScores (context) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

        if (context.state.scoresLoaded) {
          resolve({
            scores: context.state.scores,
            courses: context.state.courses,
            overview: context.state.overview
          })
        } else {
          api.getScores(context.rootState.user.sessionToken)
          .then((data) => {
            context.commit('setScores', {scores: data.scores})
            context.commit('setCourses', {courses: data.courses})
            context.commit('setOverview', {overview: data.overview})
            context.commit('setScoresLoaded')
            resolve(data)
          })
          .catch((err) => {
            reject(err)
          })
        }
      })
    },
    /**
     * Get distribution of score in a course.
     * @param {*} options Options should include `courseNumber`
     * @returns {Promise}
     */
    getDistribution (context, options) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

        api.getDistribution(context.rootState.user.sessionToken, options.courseNumber)
        .then((data) => {
          context.commit('setDistribution', {
            courseNumber: options.courseNumber,
            distribution: data.distribution
          })
          resolve(data.distribution)
        })
        .catch((err) => {
          reject(err)
        })
      })
    },
    /**
     * Get syllabus of score in a course.
     * @param {Object} options Options should include `courseNumber`
     * @returns {Promise}
     */
    getSyllabus (context, options) {
      return new Promise((resolve, reject) => {
        if (!context.rootState.user.isLogin) {
          reject(error.ResponseErrorMsg.UserNotLogin())
          return
        }

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
      })
    }
  }
}
