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
            v-model="store.isNotMobile"
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
              <courses-list
                :title="$t('coursesList.title')"
                @update-preview-time="updatePreviewTime"
                @open-course-detail="openCourseDetail"
                :empty-text="$t('coursesList.pleaseSelect')"
              ></courses-list>
            </v-flex>

            <v-flex
              :class="layoutSize.selectedCourses"
              :hidden="!showSelectedCoursesList"
            >
              <courses-list
                :title="$t('selectedCoursesList.title')"
                :list="store.user.currentSelectedCourses"
                @update-preview-time="updatePreviewTime"
                @open-course-detail="openCourseDetail"
              ></courses-list>
            </v-flex>

            <v-flex
              :class="layoutSize.timeTable"
              :hidden="!showTimeTable"
            >
              <time-table
                :preview-time="previewTime"
                :list="store.user.currentSelectedCourses"
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
              v-model="store.isMobile"
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
import store from "../lib/store"

export default {
  name: "SelectCourses",
  data() {
    return {
      store: store,
      previewTime: "",
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
        showCoursesList: true,
        showSelectedCoursesList: false,
        showFavoriteCoursesList: false,
        showTimeTable: false
      }
    }
  },
  computed: {
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
      return this.store.isNotMobile ?
        this.pc.showCoursesList :
        (!this.showCourseDetail && this.mobile.showCoursesList)
    },
    showSelectedCoursesList () {
      return this.store.isNotMobile ?
        this.pc.showSelectedCoursesList :
        (!this.showCourseDetail && this.mobile.showSelectedCoursesList)
    },
    showTimeTable () {
      return this.store.isNotMobile ?
        (!this.showCourseDetail && this.pc.showTimeTable) :
        (!this.showCourseDetail && this.mobile.showTimeTable)
    }
  },
  methods: {
    updatePreviewTime(courseNumber) {
      this.previewTime = this.store.courses[courseNumber] ? this.store.courses[courseNumber].time : '';
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
    /*
    this.hideDrawer = false
    this.store.ui.common.loading = true
    this.store.getCurrentSelectedCourses()
    .then(() => {
      this.store.ui.common.loading = false
    })
    .catch((err) => {
      console.log(err)
      this.$router.push('/')
      this.store.ui.common.loading = false
    })
    */
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

