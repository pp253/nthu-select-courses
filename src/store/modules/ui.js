export default {
  namespaced: true,
  state: {
    isMobile: false,
    showCourseDetail: false,
    courseDetailNumber: '',
    loading: false,
    dialog: false,
    dialogTitle: '',
    dialogText: '',
    hideDrawer: false,
    pc: {
      showCoursesList: true,
      showSelectedCoursesList: true,
      showFavoriteCoursesList: false,
      showTimeTable: true
    },
    mobile: {
      showCoursesList: true,
      showSelectedCoursesList: false,
      showFavoriteCoursesList: false,
      showTimeTable: false
    }
  },
  getters: {

  },
  mutations: {
    setMobile (state, options) {
      state.isMobile = options.isMobile
    },
    openCourseDetail (state, options) {
      state.showCourseDetail = true
      state.courseDetailNumber = options.courseNumber
    },
    closeCourseDetail (state) {
      state.showCourseDetail = false
    },
    openDialog (state, options) {
      state.dialog = true
      state.dialogTitle = options.title
      state.dialogText = options.text
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
  },
  actions: {

  }
}
