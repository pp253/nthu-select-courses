<template>
  <v-container pa-0
               ma-0
               fluid
               class="scores">
    <score-list @show-score-detail="showDetail"
                :scores="scores"
                :courses="courses"
                :overview="overview"
                :hidden="showCourseDetail" />
    <score-course-detail @close-score-detail="closeDetail"
                         :courses="courses"
                         :course-detail-number="courseDetailNumber"
                         :hidden="!showCourseDetail" />
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import ScoreCourseDetail from './components/score-course-detail'
import ScoreList from './components/score-list'
import store from './store'

export default {
  components: {
    ScoreCourseDetail,
    ScoreList
  },
  data() {
    return {
      showCourseDetail: false,
      courseDetailNumber: ''
    }
  },
  computed: {
    ...mapState('scores', ['scores', 'courses', 'overview'])
  },
  methods: {
    showDetail(courseNumber) {
      this.showCourseDetail = true
      this.courseDetailNumber = courseNumber
    },
    closeDetail() {
      this.showCourseDetail = false
    }
  },
  beforeCreate() {
    // load store
    if (!this.$store.state.scores) {
      this.$store.registerModule('scores', store)
    }

    // load locale
    import(`./lang/${this.$i18n.locale}.json`).then(msg => {
      this.$i18n.mergeLocaleMessage(this.$i18n.locale, msg)
    })
  },
  mounted() {
    this.$store.commit('ui/START_LOADING')
    this.$store
      .dispatch('scores/getScores')
      .then(() => {
        this.$store.commit('ui/STOP_LOADING')
      })
      .catch(err => {
        console.log(err)
        this.$store.commit('ui/STOP_LOADING')
        this.$router.push('/')
      })
  }
}
</script>

<style lang="scss">
.scores {
}
</style>
