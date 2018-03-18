export default {
  namespaced: true,
  state: {
    /**
     * The state of the user device.
     * `isMobile` will be updated by the `updateIsMobile` method
     * in the `@/App.vue`.
     */
    isMobile: false,

    /**
     * Control the visibility of the `now-loading`.
     */
    loading: false,

    /**
     * Control the visibility of the dialog.
     */
    dialog: false,

    /**
     * Title of the dialog.
     * Note that `dialogTitle` will be parsed by the i18n.
     */
    dialogTitle: '',

    /**
     * Content of the dialog.
     * Note that `dialogText` will be parsed by the i18n.
     */
    dialogText: '',

    /**
     * More text on the dialog.
     * Note that `dialogMore` will **not** be parsed by the i18n.
     */
    dialogMore: '',

    /**
     * Control the mode of the dialog.
     * Available mode are, `info` and `request`.
     *
     * # `info` mode
     * Actions: `OK`
     *
     * # `request` mode
     * Actions: `Yes`, `No`
     */
    dialogMode: 'info',

    /**
     * Control the visibility of the snackbar.
     */
    snackbar: false,

    /**
     * Content of the snackbar.
     * Note that `snackbarText` will **not** be parsed by i18n.
     */
    snackbarText: ''
  },
  getters: {
    isNotMobile(state) {
      return !state.isMobile
    }
  },
  mutations: {
    SET_MOBILE(state, options) {
      state.isMobile = options.isMobile
    },
    OPEN_DIALOG(state, options) {
      state.dialog = true
      state.dialogTitle = options.title
      state.dialogText = options.text || ''
      state.dialogMore = options.more || ''
      state.dialogMode = options.mode || 'info'
    },
    CLOSE_DIALOG(state) {
      state.dialog = false
    },
    OPEN_SNACKBAR(state, options) {
      state.snackbar = true
      state.snackbarText = options.snackbarText
    },
    CLOSE_SNACKBAR(state) {
      state.snackbar = false
    },
    START_LOADING(state) {
      state.loading = true
    },
    STOP_LOADING(state) {
      state.loading = false
    }
  },
  actions: {
    openSnackbar(context, options) {
      let timeout = 6000
      context.commit('OPEN_SNACKBAR', {
        snackbarText: options.snackbarText
      })
      setTimeout(() => {
        context.commit('CLOSE_SNACKBAR')
      }, timeout)
    },

    /**
     * @param {object} options
     * @returns {Promise} result
     */
    openRequestDialog(context, options) {
      return new Promise((resolve, reject) => {
        context.commit('OPEN_DIALOG', {
          title: options.title,
          text: options.text,
          more: options.more,
          mode: options.mode || 'request'
        })

        this.$bus.$once('dialog-return', result => {
          switch (result) {
            case 'Yes':
              resolve(true)
              break
            case 'No':
            default:
              resolve(false)
              break
          }
        })
      })
    }
  }
}
