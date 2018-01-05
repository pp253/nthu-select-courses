import Vue from 'vue'
import components from './components'
import router from './router'
import './lib/store'
import i18n from './i18n'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import App from './App'
// import * as preselect from './api/preselect'

Vue.use(Vuetify)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  template: '<App/>',
  components: {
    App
  }
})
