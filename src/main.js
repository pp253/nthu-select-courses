import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueWait from 'vue-wait'
import locale from '@/locale'
import router from '@/router'
import store from '@/store'
import App from '@/App'
import '@/lib/bus'

Vue.use(Vuetify, {
  theme: {
    primary: '#9C27B0',
    secondary: '#FF6F00',
    accent: '#8C9EFF',
    error: '#f44336',
    warning: '#FFD600',
    info: '#2196f3',
    success: '#4caf50'
  }
})

Vue.use(VueWait)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  i18n: locale,
  wait: new VueWait({
    // Defaults values are following:
    useVuex: true, // Uses Vuex to manage wait state
    vuexModuleName: 'loading', // Vuex module name

    registerComponent: true, // Registers `v-wait` component
    componentName: 'v-wait', // <v-wait> component name, you can set `my-loader` etc.

    registerDirective: true, // Registers `v-wait` directive
    directiveName: 'wait' // <span v-wait /> directive name, you can set `my-loader` etc.
  }),
  template: '<App/>',
  components: {
    App
  }
})

console.info(
  'I know you are interested in source code, go https://github.com/pp253/nthu-select-courses and get it!'
)
