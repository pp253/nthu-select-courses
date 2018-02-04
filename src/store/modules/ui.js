export default {
  namespaced: true,
  state: {
    isMobile: false,
    loading: false,
    dialog: false,
    dialogTitle: '',
    dialogText: '',
    dialogMore: '',
    snackbar: false,
    snackbarText: ''
  },
  getters: {
    isNotMobile (state) {
      return !state.isMobile
    }
  },
  mutations: {
    setMobile (state, options) {
      state.isMobile = options.isMobile
    },
    openDialog (state, options) {
      state.dialog = true
      state.dialogTitle = options.title
      state.dialogText = options.text
      state.dialogMore = options.more
    },
    closeDialog (state) {
      state.dialog = false
    },
    openSnackbar (state, options) {
      state.snackbar = true
      state.snackbarText = options.snackbarText
    },
    closeSnackbar (state) {
      state.snackbar = false
    },
    startLoading (state) {
      state.loading = true
    },
    stopLoading (state) {
      state.loading = false
    }
  },
  actions: {
    openSnackbar (context, options) {
      context.commit('openSnackbar', {
        snackbarText: options.snackbarText
      })
      setTimeout(() => {
        context.commit('closeSnackbar')
      }, 6000)
    }
  }
}
