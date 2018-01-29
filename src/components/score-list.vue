<template>
  <v-container pa-0 ma-0 fluid class="score-list">
    <v-toolbar dense extended>
      <v-btn
        @click="$router.push('/service')"
        icon
      >
        <v-icon>arrow_back</v-icon>
      </v-btn>
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

      <v-text-field
        slot="extension"
        v-model="searchText"
        type="text"
        name="input-search"
        prepend-icon="search"
        clearable
      ></v-text-field>
    </v-toolbar>

    <v-list
      two-line
      ripple
    >
      <v-list-tile
        v-if="overview && overview[semester] && !searchText"
        class="three-line-list-tile"
      >
        <v-list-tile-content>
          <v-list-tile-title>
            GPA：{{overview[semester].gpa}}
          </v-list-tile-title>
          <v-list-tile-sub-title>班排名：{{overview[semester].classRanking}}　系排名：{{overview[semester].departmentRanking}}</v-list-tile-sub-title>
          <v-list-tile-sub-title>應得學分：{{overview[semester].credit}}　實得學分：{{overview[semester].deservedCredit}}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider
        v-if="overview && overview[semester] && !searchText"
      />
      
      <template
        v-if="scoresList.length > 0"
        v-for="(score, index) in scoresList"
      >
      
        <v-subheader
          v-if="score.type && score.type === 'subheader'"
          :key="score.title"
        >
          {{ score.title }}
        </v-subheader>
        <v-list-tile
          v-if="!score.type && score.type !== 'subheader'"
          @click="$emit('show-score-detail', score.semester + score.courseNumber)"
          :key="score.number"
          ripple
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ score.courseTitle }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ score.courseNumber + ' 學分' + score.credit }}</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <div class="text-xs-center">
              <v-list-tile-action-text>{{ score.grade }}</v-list-tile-action-text>
              <v-menu offset-y left>
                <v-btn
                  slot="activator"
                  icon
                >
                  <v-icon>keyboard_arrow_right</v-icon>
                </v-btn>
              </v-menu>
            </div>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider
          v-if="(!score.type && score.type !== 'subheader') && index < scoresList.length - 1"
          :key="score.courseNumber + '-divider-' + Math.random()"
        ></v-divider>
      </template>

      <div
        v-if="scoresList.length === 0"
        class="text-xs-center pt-5"
        v-text="$t('scores.emptyText')"
      ></div>
    </v-list>
  </v-container>
</template>

<script>
export default {
  name: 'ScoreList',
  props: {
    'scores': Object,
    'courses': Object,
    'overview': Object
  },
  data () {
    return {
      semester: '',
      searchText: ''
    }
  },
  watch: {
    scores (newVal) {
      if (!newVal) {
        return
      }
      this.semester = Object.keys(newVal).reverse()[Object.keys(newVal).length > 1 ? 1 : 0]
    }
  },
  computed: {
    readableSemester () {
      return this.searchText ? this.$t('common.search').replace('{0}', this.searchText) : this.toReadableSemester(this.semester)
    },
    availableSemester () {
      if (!this.scores) {
        return []
      }
      let list = []
      for (let semester of Object.keys(this.scores).reverse()) {
        list.push({
          text: this.toReadableSemester(semester),
          value: semester
        })
      }
      return list
    },
    scoresList () {
      if (!this.scores) {
        return []
      }
      if (this.searchText) {
        let list = []
        for (let semester of Object.keys(this.scores).reverse()) {
          let semesterList = []
          for (let courseNumber of this.scores[semester]) {
            let course = this.courses[courseNumber]
            if (course.courseTitle.includes(this.searchText) ||
              course.courseNumber.includes(this.searchText) ||
              course.grade.includes(this.searchText)
            ) {
              semesterList.push(course)
            }
          }
          if (semesterList.length > 0) {
            list.push({
              type: 'subheader',
              title: this.toReadableSemester(semester)
            })
            for (let score of semesterList.reverse()) {
              list.push(score)
            }
          }
        }
        return list
      } else {
        let list = []
        if (this.scores[this.semester]) {
          for (let courseNumber of this.scores[this.semester]) {
            list.push(this.courses[courseNumber])
          }
        }
        return list
      }
    }
  },
  methods: {
    toReadableSemester (semester) {
      if (semester === '') {
        return this.$t('scores.selecting')
      }
      let seText = /(\d{3})(\d{2})/.exec(semester)
      return seText[1] + this.$t(`semester.${seText[2]}`)
    }
  }
}
</script>

<style lang="scss">
.score-list {
  ul {
    height: calc(100vh - 96px);
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 64px;

    .three-line-list-tile {
      .list__tile {
        height: 88px;
      }
    }

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
