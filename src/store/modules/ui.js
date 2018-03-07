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
    setMobile(state, options) {
      state.isMobile = options.isMobile
    },
    openDialog(state, options) {
      state.dialog = true
      state.dialogTitle = options.title
      state.dialogText = options.text
      state.dialogMore = options.more || ''
      state.dialogMode = options.mode || 'info'
    },
    closeDialog(state) {
      state.dialog = false
    },
    openSnackbar(state, options) {
      state.snackbar = true
      state.snackbarText = options.snackbarText
    },
    closeSnackbar(state) {
      state.snackbar = false
    },
    startLoading(state) {
      state.loading = true
    },
    stopLoading(state) {
      state.loading = false
    }
  },
  actions: {
    openSnackbar(context, options) {
      let timeout = 6000
      context.commit('openSnackbar', {
        snackbarText: options.snackbarText
      })
      setTimeout(() => {
        context.commit('closeSnackbar')
      }, timeout)
    },

    /**
     *
     * @param {object} options
     * @returns {Promise} result
     */
    openRequestDialog(context, options) {
      return new Promise((resolve, reject) => {
        context.commit('openDialog', {
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
