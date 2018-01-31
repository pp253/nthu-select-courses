import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import i18n from '@/i18n'
import router from '@/router'
import store from '@/store'
import '@/lib/store'
import App from '@/App'

Vue.use(Vuetify)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  i18n,
  template: '<App/>',
  components: {
    App
  }
})

console.info('I know you are interested in source code, go https://github.com/pp253/nthu-select-courses and get it!')
