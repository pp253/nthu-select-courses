<template>
  <v-container pa-0 ma-0 fluid class="score-list">
    <v-toolbar
      dense
      extended
      :dark="style.scoreList.toolbar.dark"
      :color="style.scoreList.toolbar.color"
      app
    >
      <v-btn @click="$router.push('/service')" icon>
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-menu :nudge-width="100">
        <v-toolbar-title slot="activator">
          <span>{{ readableSemester }}</span>
          <v-icon>arrow_drop_down</v-icon>
        </v-toolbar-title>
        <v-list>
          <v-list-tile
            v-for="item in availableSemester"
            :key="item.value"
            @click="semester = item.value"
          >
            <v-list-tile-title v-text="item.text" />
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

    <v-content>
      <v-container v-if="overview && overview[semester] && !searchText">
        <v-card>
          <v-card-text>
            <v-layout wrap>
              <v-flex xs4 md2 pb-2 class="list-with-label">
                <div class="label">GPA</div>
                {{ overview[semester].gpa }}
              </v-flex>

              <v-flex xs4 md2 pb-2 class="list-with-label">
                <div class="label">應得學分</div>
                {{ overview[semester].credit }}
              </v-flex>
              <v-flex xs4 md2 pb-2 class="list-with-label">
                <div class="label">實得學分</div>
                {{ overview[semester].deservedCredit }}
              </v-flex>

              <v-flex xs6 sm3 md2 pb-2 class="list-with-label">
                <div class="label">班排名</div>
                {{ overview[semester].classRanking }}
              </v-flex>
              <v-flex xs6 sm3 md2 pb-2 class="list-with-label">
                <div class="label">系排名</div>
                {{ overview[semester].departmentRanking }}
              </v-flex>

              <v-flex xs6 sm3 md2 class="list-with-label">
                <div class="label">累計排名</div>
                {{ cumulative.cumulativeRanking }}
              </v-flex>
              <v-flex xs6 sm3 md2 class="list-with-label">
                <div class="label">累計平均GPA</div>
                {{ cumulative.gpa }}
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-container>

      <v-list two-line class="list-wrapper">
        <template v-if="scoresList.length > 0">
          <template v-for="(score, index) in scoresList">
            <v-subheader
              v-if="score.type && score.type === 'subheader'"
              :key="score.title"
            >
              {{ score.title }}
            </v-subheader>
            <v-list-tile
              v-if="!score.type && score.type !== 'subheader'"
              @click="$emit('show-score-detail', score.courseNumber)"
              :key="score.number"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ score.courseTitle }}</v-list-tile-title>
                <v-list-tile-sub-title>
                  {{ score.courseNumber + ' 學分' + score.credit }}
                </v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <div class="text-xs-center">
                  <v-list-tile-action-text>
                    {{ score.grade }}
                  </v-list-tile-action-text>
                  <v-menu offset-y left>
                    <v-btn slot="activator" icon>
                      <v-icon>keyboard_arrow_right</v-icon>
                    </v-btn>
                  </v-menu>
                </div>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider
              v-if="
                !score.type &&
                  score.type !== 'subheader' &&
                  index < scoresList.length - 1
              "
              :key="score.courseNumber + '-divider-' + Math.random()"
            ></v-divider>
          </template>
        </template>

        <div
          v-if="scoresList.length === 0"
          class="text-xs-center pt-5"
          v-text="$t('scores.emptyText')"
        ></div>
      </v-list>
    </v-content>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import {
  VTextField,
  VList,
  VListTile,
  VListTileActionText,
  VListTileAction,
  VListTileSubTitle,
  VListTileTitle,
  VListTileContent,
  VIcon,
  VMenu,
  VToolbar,
  VToolbarTitle,
  VContent,
  VSubheader
} from 'vuetify/lib'

export default {
  name: 'ScoreList',
  components: {
    VTextField,
    VList,
    VListTile,
    VListTileActionText,
    VListTileAction,
    VListTileSubTitle,
    VListTileTitle,
    VListTileContent,
    VIcon,
    VMenu,
    VToolbar,
    VToolbarTitle,
    VContent,
    VSubheader
  },
  props: {
    scores: Object,
    courses: Object,
    overview: Object,
    cumulative: Object
  },
  data() {
    return {
      semester: '',
      searchText: ''
    }
  },
  watch: {
    scores(newVal) {
      if (!newVal) {
        return
      }
      // Take the first one or second one as default semester.
      this.semester = Object.keys(newVal).reverse()[
        Object.keys(newVal).length > 1 ? 1 : 0
      ]
    }
  },
  computed: {
    ...mapState('scores', ['style']),
    readableSemester() {
      return this.searchText
        ? this.$t('common.search', [this.searchText])
        : this.toReadableSemester(this.semester)
    },
    availableSemester() {
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
    scoresList() {
      if (!this.scores) {
        return []
      }
      if (this.searchText) {
        let searchText = this.searchText.toLowerCase()
        let list = []
        for (let semester of Object.keys(this.scores).reverse()) {
          let semesterList = []
          for (let courseNumber of this.scores[semester]) {
            let course = this.courses[courseNumber]
            if (
              course.courseTitle.toLowerCase().includes(searchText) ||
              course.courseNumber.toLowerCase().includes(searchText) ||
              course.grade.toLowerCase().includes(searchText)
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
    toReadableSemester(semester) {
      if (!semester) {
        return this.$t('scores.selecting')
      }
      let seText = /(\d{3})(\d{2})/.exec(semester)
      return seText[1] + this.$t(`semester.${seText[2]}`)
    }
  },
  mounted() {
    if (this.scores) {
      this.semester = Object.keys(this.scores).reverse()[
        Object.keys(this.scores).length > 1 ? 1 : 0
      ]
    }
  }
}
</script>

<style lang="scss">
.score-list {
  .v-content {
    padding-top: 0 !important;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: calc(100vh - 96px);
    margin-top: 96px;
  }

  .v-list {
    padding-bottom: 64px;

    .v-list__tile__action-text {
      font-size: 16px;
      position: relative;
      top: 2px;
    }
  }

  .list-with-label {
    font-size: 20px;

    .label {
      display: block;
      font-size: 12px;
    }
  }
}
</style>
