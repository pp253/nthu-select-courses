import Vue from 'vue'
import Vuex from 'vuex'

const $bus = new Vue()
Vue.prototype.$bus = $bus
Vuex.Store.prototype.$bus = $bus

export default $bus
