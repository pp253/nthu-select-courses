export default {
  namespaced: true,
  state: {
    isMobile: false,
    loading: false,
    dialog: false,
    dialogTitle: '',
    dialogText: '',
    dialogMore: ''
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
    startLoading (state) {
      state.loading = true
    },
    stopLoading (state) {
      state.loading = false
    }
  }
}
