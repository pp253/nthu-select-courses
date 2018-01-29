import Vue from 'vue'
import Vuex from 'vuex'
import ui from './modules/ui'
import selectCourses from './modules/select-courses'
import scores from './modules/scores'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {

  },
  actions: {

  },
  modules: {
    ui,
    selectCourses,
    scores,
    user
  }
})
