<template>
  <div class="scores">
    <v-toolbar dense extended>
      <v-menu :nudge-width="100">
        <v-toolbar-title slot="activator">
          <span>{{ readableSemester }}</span>
          <v-icon>arrow_drop_down</v-icon>
        </v-toolbar-title>
        <v-list>
          <v-list-tile v-for="item in availableSemester" :key="item.value" @click="semester = item.value" ripple>
            <v-list-tile-title v-text="item.text"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>


      <v-layout row slot="extension">
        <v-flex>
          <v-text-field
            type="text"
            name="input-search"
            value=""
            prepend-icon="search"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-toolbar>

    <v-list
      two-line
      ripple
    >
      <template
        v-if="scoresList.length > 0"
        v-for="(score, index) in scoresList"
      >
        <v-list-tile
          :key="score.number"
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ score.courseTitle }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ score.courseNumber + ' 學分' + score.credit }}</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <div class="text-xs-center">
              <v-list-tile-action-text>{{ score.grade }}</v-list-tile-action-text>
              <v-menu offset-y left>
                <v-btn icon slot="activator">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile
                    ripple
                    @click="store.openCourseDetail(score.courseNumber)"
                  >{{ $t('scores.distribution') }}</v-list-tile>
                  <v-list-tile
                    ripple
                    @click="store.openCourseDetail(score.courseNumber)"
                  >{{ $t('coursesList.syllabus') }}</v-list-tile>
                </v-list>
              </v-menu>
            </div>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider v-if="index < scoresList.length - 1" :key="score.courseNumber + '-divider'"></v-divider>
      </template>

      <div
        v-if="scoresList.length === 0"
        class="text-xs-center pt-5"
      >{{ $t('scores.emptyText') }}</div>
    </v-list>
  </div>
</template>

<script>
import store from '../lib/store'

export default {
  data () {
    return {
      store: store,
      semester: '',
      scores: {}
    }
  },
  computed: {
    readableSemester () {
      if (this.semester === '') {
        return this.$t('scores.selecting')
      }
      let seText = /(\d{3})(\d{2})/.exec(this.semester)
      return seText[1] + this.$t(`semester.${seText[2]}`)
    },
    availableSemester () {
      let list = []
      for (let i of Object.keys(this.scores).reverse()) {
        let seText = /(\d{3})(\d{2})/.exec(i)
        list.push({
          text: seText[1] + this.$t(`semester.${seText[2]}`),
          value: i
        })
      }
      return list
    },
    scoresList () {
      return this.scores[this.semester] ? this.scores[this.semester] : []
    }
  },
  mounted () {
    store.getScores()
    .then((data) => {
      this.scores = data
      this.semester = Object.keys(this.scores).reverse()[Object.keys(this.scores).length > 1 ? 1 : 0]
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
  ul {
    height: calc(100vh - 100px);

    .list__tile__action {
      min-width: 100px;

      .list__tile__action-text {
        font-size: 16px;
        position: relative;
        top: 3px;
      }
    }
  }
}
</style>

