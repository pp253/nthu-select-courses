<template>
  <v-container pa-0 ma-0 fluid class="scores">
    <score-list
      @show-score-detail="showDetail"
      :scores="scores"
      :courses="courses"
      :overview="overview"
      :hidden="showCourseDetail"
    >
    </score-list>
    <score-course-detail
      @close-score-detail="closeDetail"
      :courses="courses"
      :course-detail-number="courseDetailNumber"
      :hidden="!showCourseDetail"
    >
    </score-course-detail>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import ScoreCourseDetail from './score-course-detail'
import ScoreList from './score-list'

export default {
  components: {
    ScoreCourseDetail,
    ScoreList
  },
  data () {
    return {
      showCourseDetail: false,
      courseDetailNumber: ''
    }
  },
  computed: {
    ...mapState('scores', [
      'scores',
      'courses',
      'overview'
    ])
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
    this.$store.commit('ui/startLoading')
    this.$store.dispatch('scores/getScores')
    .then((data) => {
      this.$store.commit('ui/stopLoading')
    })
    .catch((err) => {
      console.log(err)
      this.$store.commit('ui/stopLoading')
      this.$router.push('/')
    })
  }
}
</script>

<style lang="scss">
.scores {
}
</style>

