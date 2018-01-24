<template>
  <v-container pa-0 ma-0 fluid class="scores">
    <score-list
      @show-score-detail="showDetail"
      :scores="scores"
      :hidden="showCourseDetail"
    >
    </score-list>
    <score-course-detail
      @close-score-detail="closeDetail"
      :scores="scores"
      :course-detail-number="courseDetailNumber"
      :hidden="!showCourseDetail"
    >
    </score-course-detail>
  </v-container>
</template>

<script>
import store from '../lib/store'

export default {
  data () {
    return {
      store: store,
      scores: {},
      showCourseDetail: false,
      courseDetailNumber: ''
    }
  },
  methods: {
    showDetail (courseNumber) {
      this.showCourseDetail = true
      this.courseDetailNumber = courseNumber
    },
    closeDetail () {
      this.showCourseDetail = false
    }
  },
  mounted () {
    this.store.ui.common.loading = true
    store.getScores()
    .then((data) => {
      this.store.ui.common.loading = false
      for (let key in data) {
        this.$set(this.scores, key, data[key])
      }
    })
    .catch((err) => {
      console.log(err)
      this.$router.push('/')
    })
  }
}
</script>

<style lang="scss">
.scores {
}
</style>

