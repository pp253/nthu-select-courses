import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import locale from '@/locale'
import router from '@/router'
import store from '@/store'
import App from '@/App'
import '@/lib/bus'

Vue.use(Vuetify)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  i18n: locale,
  template: '<App/>',
  components: {
    App
  }
})

console.info('I know you are interested in source code, go https://github.com/pp253/nthu-select-courses and get it!')
