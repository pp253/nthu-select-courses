<template>
  <v-container mt-5
               fluid
               class="advisor-password">
    <v-layout>
      <v-flex xs12
              sm6
              offset-sm3
              md4
              offset-md4
              xl2
              offset-xl5>
        <v-card>
          <v-card-title>
            <v-btn @click="$router.push('/service')"
                   icon
                   flat>
              <v-icon>arrow_back</v-icon>
            </v-btn>
            <span class="headline">輸入導師密碼</span>
          </v-card-title>
          <v-card-text>
            <v-text-field label="導師密碼"></v-text-field>
            <p>107年03月08日加退選前輸入一次即可。</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn flat
                   v-text="$t('dialog.OK')"></v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {}
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
  mounted() {
    /*
    this.$store.commit('ui/START_LOADING')
    this.$store
      .dispatch('scores/getScores')
      .then(data => {
        this.$store.commit('ui/STOP_LOADING')
      })
      .catch(err => {
        console.log(err)
        this.$store.commit('ui/STOP_LOADING')
        this.$router.push('/')
      })
      */
  }
}
</script>

<style lang="scss">
</style>
