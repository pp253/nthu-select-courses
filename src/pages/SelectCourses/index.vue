<template>
  <v-container fluid pa-0 class="select-courses full-height">
    <keep-alive>
      <v-layout row class="full-height">
        <v-flex
          :hidden="hideDrawer"
          class="navdrawer"
        >
          <v-navigation-drawer
            permanent
            light
            :mini-variant="true"
            :value="!$store.state.ui.isMobile"
            :hidden="hideDrawer"
          >
            <v-list pt-0>
              <v-list-tile
                @click="$router.push('/service')"
                ripple
                class="mb-3"
              >
                <v-list-tile-action>
                  <v-icon>arrow_back</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-tooltip
                v-for="item in menu"
                :key="item.title"
                right
              >
                <v-list-tile
                  slot="activator"
                  @click="pc[item.attr] = !pc[item.attr]"
                  ripple
                >
                  <v-list-tile-action>
                    <v-icon
                      :class="pc[item.attr] ? 'blue--text' : ''"
                    >{{item.icon}}</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
                <span>{{ $t(item.title) }}</span>
              </v-tooltip>
            </v-list>
          </v-navigation-drawer>
        </v-flex>

        <v-flex class="main">
          <v-layout class="full-height">
            <v-flex
              :class="layoutSize.coursesList"
              :hidden="!showCoursesList"
              class="full-height"
            >
              <courses-catalog
                :title="$t('coursesList.title')"
                @update-preview-time="updatePreviewTime"
                @open-course-detail="openCourseDetail"
                :empty-text="$t('coursesList.pleaseSelect')"
              />
            </v-flex>

            <v-flex
              :class="layoutSize.selectedCourses"
              :hidden="!showSelectedCoursesList"
            >
              <selection-result
                :courses="courses"
                :list="list"
                :title="$t('selectedCoursesList.title')"
                @update-preview-time="updatePreviewTime"
                @open-course-detail="openCourseDetail"
              />
            </v-flex>

            <v-flex
              :class="layoutSize.timeTable"
              :hidden="!showTimeTable"
            >
              <time-table
                :courses="courses"
                :preview-time="previewTime"
                :list="list"
                @update-preview-time="updatePreviewTime"
              ></time-table>
            </v-flex>

            <v-flex
              :class="layoutSize.courseDetail"
              :hidden="!showCourseDetail"
            >
              <course-detail
                :title="$t('courseDetail.title')"
                :course-number="courseDetailNumber"
                @close-course-detail="closeCourseDetail"
              ></course-detail>
            </v-flex>

            <v-bottom-nav
              fixed
              :value="$store.state.ui.isMobile"
              :hidden="hideDrawer"
              :active="bottomDrawerActive"
              color="white"
            >
              <v-btn
                v-for="item in menu"
                :key="item.title + '-btn'"
                @click="uiMobileClearShowing(); mobile[item.attr] = !mobile[item.attr]"
                flat
              >
                <span v-text="$t(item.title)"></span>
                <v-icon>{{ item.icon }}</v-icon>
              </v-btn>
            </v-bottom-nav>
          </v-layout>
        </v-flex>
      </v-layout>
    </keep-alive>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import TimeTable from './components/time-table'
import CourseDetail from './components/course-detail'
import CoursesCatalog from './components/courses-catalog'
import SelectionResult from './components/selection-result'

export default {
  name: "SelectCourses",
  components: {
    TimeTable,
    CourseDetail,
    CoursesCatalog,
    SelectionResult
  },
  data() {
    return {
      previewTime: '',
      menu: [
        {
          attr: 'showCoursesList',
          icon: 'list',
          title: 'coursesList.title'
        },
        {
          attr: 'showSelectedCoursesList',
          icon: 'playlist_add_check',
          title: 'selectedCoursesList.title'
        },/*
        {
          attr: 'showFavoriteCoursesList',
          icon: 'favorite',
          title: 'favoriteCoursesList.title'
        },*/
        {
          attr: 'showTimeTable',
          icon: 'grid_on',
          title: 'timeTable.title'
        }
      ],
      showCourseDetail: false,
      courseDetailNumber: '',
      hideDrawer: false,
      pc: {
        showCoursesList: true,
        showSelectedCoursesList: true,
        showFavoriteCoursesList: false,
        showTimeTable: true
      },
      mobile: {
        showCoursesList: false,
        showSelectedCoursesList: true,
        showFavoriteCoursesList: false,
        showTimeTable: false
      }
    }
  },
  computed: {
    ...mapState('selectCourses', [
      'selectionPhase',
      'addOrDropPhase',
      'withdrawalPhase',
      'currentSelectedCourses',
      'selectionResult',
      'availableSelectionResult',
      'semester',
      'phase',
    ]),
    courses () {
      let courses = this.$store.state.selectCourses.courses
      let semester = this.semester
      let phase = this.phase

      if (semester && phase) {
        if (semester in this.selectionResult &&
          phase in this.selectionResult[semester]
        ) {
          let selectionResult = this.selectionResult[semester][phase]
          courses = Object.assign({}, courses, selectionResult.status, selectionResult.randomFailed, selectionResult.waitingForRandom)
        }
      }
      return courses
    },
    list () {
      let list = []
      let semester = this.semester
      let phase = this.phase

      if (phase === 'current') {
        list = this.currentSelectedCourses
      } else if (semester && phase) {
        if (semester in this.selectionResult &&
          phase in this.selectionResult[semester]
        ) {
          let selectionResult = this.selectionResult[semester][phase]
          let selectionResultCatalog = ['waitingForRandom', 'status', 'randomFailed']
          for (let catalog of selectionResultCatalog) {
            let tmpList = []
            for (let courseNumber in selectionResult[catalog]) {
              tmpList.push({
                number: courseNumber,
                status: catalog
              })
            }

            if (tmpList.length) {
              list.push({
                header: `selectionResult.${catalog}`
              })
              list = list.concat(tmpList)
            }
          }
        }
      }

      return list
    },
    bottomDrawerActive () {
      let idx = this.menu.findIndex((item) => {return this.mobile[item.attr] === true})
      return idx
    },
    layoutSize () {
      let layoutSize = {
        coursesList: 'xs3',
        selectedCourses: 'xs3',
        favoriteCourses: 'xs3',
        timeTable: 'xs6',
        courseDetail: 'xs6'
      }

      let uc = this.pc
      let cd = this.showCourseDetail

      if (this.$vuetify.breakpoint.mdAndUp) {
        if (uc.showTimeTable) {
          if (!uc.showCoursesList && !uc.showSelectedCoursesList) {
            if (cd) {
              layoutSize.timeTable = 'xs6'
              layoutSize.courseDetail = 'xs6'
            } else {
              layoutSize.timeTable = 'xs12'
            }
          } else if (uc.showCoursesList && uc.showSelectedCoursesList) {
            if (cd) {
              layoutSize.courseDetail = 'xs6'
            } else {
              layoutSize.timeTable = 'xs6'
            }
            layoutSize.coursesList = 'xs3'
            layoutSize.selectedCourses = 'xs3'
          } else {
            if (cd) {
              layoutSize.courseDetail = 'xs6'
            } else {
              layoutSize.timeTable = 'xs6'
            }
            layoutSize.coursesList = 'xs6'
            layoutSize.selectedCourses = 'xs6'
          }
        } else {
          if (uc.showCoursesList && uc.showSelectedCoursesList) {
            if (cd) {
              layoutSize.courseDetail = 'xs6'
              layoutSize.coursesList = 'xs3'
              layoutSize.selectedCourses = 'xs3'
            } else {
              layoutSize.coursesList = 'xs6'
              layoutSize.selectedCourses = 'xs6'
            }
          } else if (uc.showCoursesList || uc.showSelectedCoursesList) {
            if (cd) {
              layoutSize.courseDetail = 'xs6'
              layoutSize.coursesList = 'xs6'
              layoutSize.selectedCourses = 'xs6'
            } else {
              layoutSize.coursesList = 'xs12'
              layoutSize.selectedCourses = 'xs12'
            }
          }
        }
      } else {
        layoutSize.coursesList = 'xs12'
        layoutSize.selectedCourses = 'xs12'
        layoutSize.favoriteCourses = 'xs12'
        layoutSize.timeTable = 'xs12'
        layoutSize.courseDetail = 'xs12'
      }

      return layoutSize
    },
    showCoursesList () {
      return !this.$store.state.ui.isMobile ?
        this.pc.showCoursesList :
        (!this.showCourseDetail && this.mobile.showCoursesList)
    },
    showSelectedCoursesList () {
      return !this.$store.state.ui.isMobile ?
        this.pc.showSelectedCoursesList :
        (!this.showCourseDetail && this.mobile.showSelectedCoursesList)
    },
    showTimeTable () {
      return !this.$store.state.ui.isMobile ?
        (!this.showCourseDetail && this.pc.showTimeTable) :
        (!this.showCourseDetail && this.mobile.showTimeTable)
    }
  },
  methods: {
    updatePreviewTime(courseNumber) {
      this.previewTime = courseNumber in this.courses ? this.courses[courseNumber].time : 
        (courseNumber in this.$store.state.selectCourses.courses ?
          this.$store.state.selectCourses.courses[courseNumber].time :
          courseNumber)
    },
    uiMobileClearShowing () {
      this.mobile.showCoursesList = false
      this.mobile.showSelectedCoursesList = false
      this.mobile.showFavoriteCoursesList = false
      this.mobile.showTimeTable = false
    },
    openCourseDetail (courseNumber) {
      this.showCourseDetail = true
      this.courseDetailNumber = courseNumber
    },
    closeCourseDetail () {
      this.showCourseDetail = false
    }
  },
  mounted () {
    this.hideDrawer = false
    this.$store.commit('ui/startLoading')

    // TODO: 應該把下面的改成並行，而非循序
    this.$store.dispatch('selectCourses/getAvailableSelectionResult')
    .then(() => {
      if (this.selectionPhase || this.addOrDropPhase || this.withdrawalPhase) {
        this.$store.dispatch('selectCourses/getCurrentSelectedCourses')
        .then(() => {
          this.$store.commit('ui/stopLoading')
        })
        .catch((err) => {
          this.$router.push('/')
          this.$store.commit('ui/stopLoading')
        })
      } else {
        this.$store.commit('ui/stopLoading')
      }
    })
    .catch((err) => {
      this.$router.push('/')
      this.$store.commit('ui/stopLoading')
    })
  }
}
</script>

<style lang="scss">
.select-courses {
  .navdrawer {
    display: none;
    z-index: 1;
    aside.navigation-drawer--mini-variant {
      width: 64px !important;

      .list__tile {
        padding: 0 8px;
      }
    }
  }

  .main {
    width: 100vw;
    height: 100vh;
  }

  .memo {
    // text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.mode-mobile .select-courses {
  .main {
    height: calc(100vh - 56px);
  }
}

.mode-pc .select-courses {
  .navdrawer {
    display: block;
  }
  .main {
    width: calc(100vw - 64px);
  }
}
</style>

