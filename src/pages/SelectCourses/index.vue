<template>
  <v-container fluid pa-0 class="select-courses h-100">
    <v-navigation-drawer
      light
      :mini-variant="true"
      :mini-variant-width="80"
      :value="!$store.state.ui.isMobile"
      app
      stateless
      touchless
      class="navdrawer"
    >
      <v-list pt-0>
        <v-list-tile @click="$router.push('/service')" ripple class="mb-3">
          <v-list-tile-action>
            <v-icon>arrow_back</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-tooltip v-for="item in menu" :key="item.title" right>
          <v-list-tile
            slot="activator"
            @click="pc[item.attr] = !pc[item.attr]"
            ripple
          >
            <v-list-tile-action>
              <v-icon
                :color="pc[item.attr] ? style[item.attr].textColor : ''"
                >{{ item.icon }}</v-icon
              >
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ $t(item.title) }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <span>{{ `顯示/關閉 ` + $t(item.title) }}</span>
        </v-tooltip>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <v-layout row class="h-100">
        <v-flex class="main">
          <v-layout class="fill-height">
            <v-flex
              :class="'column ' + layoutSize.coursesList"
              :hidden="!coursesCatalog"
            >
              <courses-catalog
                :title="$t('SelectCourses.coursesCatalog.title')"
                @update-preview-time="updatePreviewTime"
                @open-course-detail="openCourseDetail"
                :search="searchText"
                ref="coursesCatalog"
                :empty-text="'SelectCourses.coursesCatalog.pleaseSelect'"
              />
            </v-flex>

            <v-flex
              :class="'column ' + layoutSize.selectedCourses"
              :hidden="!selectionResult"
            >
              <selection-result
                :courses="courses"
                :list="list"
                :title="$t('SelectCourses.selectionResult.title')"
                @update-preview-time="updatePreviewTime"
                @open-course-detail="openCourseDetail"
                @refresh="refresh(true)"
              />
            </v-flex>

            <v-flex
              :class="'column ' + layoutSize.timeTable"
              :hidden="!timeTable"
            >
              <time-table
                :courses="courses"
                :preview-time="previewTime"
                :list="list"
                @update-preview-time="updatePreviewTime"
              ></time-table>
            </v-flex>

            <v-flex
              :class="'column ' + layoutSize.courseDetail"
              :hidden="!showCourseDetail"
            >
              <course-detail
                :title="$t('courseDetail.title')"
                :course-number="courseDetailNumber"
                @close-course-detail="closeCourseDetail"
                @search="search"
                @goto-panel-courses-catalog="
                  uiMobileClearShowing()
                  mobile['coursesCatalog'] = true
                "
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
                @click="
                  uiMobileClearShowing()
                  mobile[item.attr] = true
                "
                flat
              >
                <span v-text="$t(item.title)"></span>
                <v-icon>{{ item.icon }}</v-icon>
              </v-btn>
            </v-bottom-nav>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-content>
  </v-container>
</template>

<script>
import {
  VBtn,
  VTooltip,
  VList,
  VListTile,
  VListTileAction,
  VListTileTitle,
  VListTileContent,
  VBottomNav,
  VNavigationDrawer,
  VContent,
  VIcon
} from 'vuetify/lib'
import { mapState } from 'vuex'
import TimeTable from './components/time-table'
import CourseDetail from './components/course-detail'
import CoursesCatalog from './components/courses-catalog'
import SelectionResult from './components/selection-result'
import store from './store'

export default {
  name: 'SelectCourses',
  components: {
    TimeTable,
    CourseDetail,
    CoursesCatalog,
    SelectionResult,
    VBtn,
    VTooltip,
    VList,
    VListTile,
    VListTileAction,
    VListTileTitle,
    VListTileContent,
    VBottomNav,
    VNavigationDrawer,
    VContent,
    VIcon
  },
  data() {
    return {
      searchText: null,
      previewTime: '',
      menu: [
        {
          attr: 'coursesCatalog',
          icon: 'list',
          title: 'SelectCourses.coursesCatalog.shortTitle'
        },
        {
          attr: 'selectionResult',
          icon: 'playlist_add_check',
          title: 'SelectCourses.selectionResult.shortTitle'
        } /*
        {
          attr: 'favoriteCoursesList',
          icon: 'favorite',
          title: 'SelectCourses.favoriteCoursesList.title'
        },*/,
        {
          attr: 'timeTable',
          icon: 'grid_on',
          title: 'SelectCourses.timeTable.shortTitle'
        }
      ],
      showCourseDetail: false,
      courseDetailNumber: '',
      hideDrawer: false,
      pc: {
        coursesCatalog: true,
        selectionResult: true,
        favoriteCoursesList: false,
        timeTable: true
      },
      mobile: {
        coursesCatalog: false,
        selectionResult: true,
        favoriteCoursesList: false,
        timeTable: false
      },

      lastRefresh: 0,
      refreshInterval: 2 * 60 * 1000
    }
  },
  computed: {
    ...mapState('selectCourses', [
      'selectionPhase',
      'addOrDropPhase',
      'withdrawalPhase',
      'currentSelectedCourses',
      'availableSelectionResult',
      'semester',
      'phase',
      'style'
    ]),
    ...mapState('selectCourses', { sr: 'selectionResult' }),
    courses() {
      let courses = this.$store.state.selectCourses.courses
      let semester = this.semester
      let phase = this.phase

      if (semester && phase) {
        if (semester in this.sr && phase in this.sr[semester]) {
          let selectionResult = this.sr[semester][phase]
          courses = Object.assign(
            {},
            courses,
            selectionResult.status,
            selectionResult.randomFailed,
            selectionResult.waitingForRandom
          )
        }
      }
      return courses
    },
    list() {
      let list = []
      let semester = this.semester
      let phase = this.phase

      if (phase === 'current') {
        list = this.currentSelectedCourses
      } else if (semester && phase) {
        if (semester in this.sr && phase in this.sr[semester]) {
          let selectionResult = this.sr[semester][phase]
          let selectionResultCatalog = [
            'waitingForRandom',
            'status',
            'randomFailed'
          ]
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
                header: `SelectCourses.selectionResult.${catalog}`
              })
              list = list.concat(tmpList)
            }
          }
        }
      }

      return list
    },
    bottomDrawerActive() {
      let idx = this.menu.findIndex(item => {
        return this.mobile[item.attr] === true
      })
      return idx
    },
    layoutSize() {
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
        if (uc.timeTable) {
          if (!uc.coursesCatalog && !uc.selectionResult) {
            if (cd) {
              layoutSize.timeTable = 'xs6'
              layoutSize.courseDetail = 'xs6'
            } else {
              layoutSize.timeTable = 'xs12'
            }
          } else if (uc.coursesCatalog && uc.selectionResult) {
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
          if (uc.coursesCatalog && uc.selectionResult) {
            if (cd) {
              layoutSize.courseDetail = 'xs6'
              layoutSize.coursesList = 'xs3'
              layoutSize.selectedCourses = 'xs3'
            } else {
              layoutSize.coursesList = 'xs6'
              layoutSize.selectedCourses = 'xs6'
            }
          } else if (uc.coursesCatalog || uc.selectionResult) {
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
    coursesCatalog() {
      return !this.$store.state.ui.isMobile
        ? this.pc.coursesCatalog
        : !this.showCourseDetail && this.mobile.coursesCatalog
    },
    selectionResult() {
      return !this.$store.state.ui.isMobile
        ? this.pc.selectionResult
        : !this.showCourseDetail && this.mobile.selectionResult
    },
    timeTable() {
      return !this.$store.state.ui.isMobile
        ? !this.showCourseDetail && this.pc.timeTable
        : !this.showCourseDetail && this.mobile.timeTable
    }
  },
  methods: {
    updatePreviewTime(courseNumber) {
      this.previewTime =
        courseNumber in this.courses
          ? this.courses[courseNumber].time
          : courseNumber in this.$store.state.selectCourses.courses
          ? this.$store.state.selectCourses.courses[courseNumber].time
          : courseNumber
    },
    uiMobileClearShowing() {
      this.mobile.coursesCatalog = false
      this.mobile.selectionResult = false
      this.mobile.favoriteCoursesList = false
      this.mobile.timeTable = false
    },
    openCourseDetail(courseNumber) {
      this.showCourseDetail = true
      this.courseDetailNumber = courseNumber
    },
    closeCourseDetail() {
      this.showCourseDetail = false
    },
    refresh(force = false) {
      if (
        !(this.selectionPhase || this.addOrDropPhase || this.withdrawalPhase)
      ) {
        return
      }
      if (force !== true) {
        if (Date.now() - this.lastRefresh < this.refreshInterval) {
          return
        }
      }
      this.lastRefresh = Date.now()
      this.$store
        .dispatch('selectCourses/getCurrentSelectedCourses')
        .then(() => {
          this.$store.commit('ui/STOP_LOADING')
        })
        .catch(err => {
          console.error(err)
          this.$router.push('/')
        })
    },
    search(text) {
      this.searchText = text
      this.$refs.coursesCatalog.searchText = this.searchText
      this.$refs.coursesCatalog.onlySearchAbbr = false
      this.$refs.coursesCatalog.updateList()
    }
  },
  beforeCreate() {
    // load store
    if (!this.$store.state.selectCourses) {
      this.$store.registerModule('selectCourses', store)
    }

    // load locale
    import(`./lang/${this.$i18n.locale}.json`).then(msg => {
      this.$i18n.mergeLocaleMessage(this.$i18n.locale, msg)
    })
  },
  beforeDestroy() {
    window.removeEventListener('focus', this.refresh)
  },
  mounted() {
    this.$store.commit('ui/SET_THEME_COLOR', {
      color: this.style.themeColor
    })

    this.hideDrawer = false
    this.$store.commit('ui/START_LOADING')

    this.$store
      .dispatch('selectCourses/getAvailableSelectionResult')
      .then(() => {
        if (
          this.selectionPhase ||
          this.addOrDropPhase ||
          this.withdrawalPhase
        ) {
          this.lastRefresh = Date.now()
          this.refresh(true)
          this.$store.commit('selectCourses/SET_PHASE', {
            phase: 'current'
          })
          window.addEventListener('focus', this.refresh)
        } else {
          this.$store.commit('ui/STOP_LOADING')
        }
      })
      .catch(err => {
        console.error(err)
        this.$router.push('/')
        this.$store.commit('ui/STOP_LOADING')
      })

    this.$store
      .dispatch('selectCourses/scoresharing/validate')
      .then(valid => {
        console.log(`[scoresharing/validate] valid=${valid}`)
      })
      .catch(err => console.error(err))
  }
}
</script>

<style lang="scss">
.select-courses {
  .main {
    width: 100vw;
    height: 100vh;

    .column {
      overflow: hidden;
      border-right: 1px solid #ccc;
    }
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
  .main {
    width: calc(100vw - 64px);
  }
}
</style>
