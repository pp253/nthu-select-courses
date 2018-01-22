<template>
  <v-container fluid pa-0 class="select-courses full-height">
    <v-layout class="full-height">
      <v-flex
        :class="layoutSize.coursesList"
        v-if="showCoursesList"
        class="full-height"
      >
        <courses-list
          :title="$t('coursesList.title')"
          @update-preview-time="updatePreviewTime"
          :empty-text="$t('coursesList.pleaseSelect')"
        ></courses-list>
      </v-flex>

      <v-flex
        :class="layoutSize.selectedCourses"
        v-if="showSelectedCoursesList"
      >
        <courses-list
          :title="$t('selectedCoursesList.title')"
          :list="store.user.currentSelectedCourses"
          @update-preview-time="updatePreviewTime"
        ></courses-list>
      </v-flex>

      <v-flex
        :class="layoutSize.timeTable"
        v-if="showTimeTable"
      >
        <time-table
          :preview-time="previewTime"
          :list="store.user.currentSelectedCourses"
        ></time-table>
      </v-flex>

      <v-flex
        :class="layoutSize.courseDetail"
        v-if="showCourseDetail"
      >
        <course-detail
          :title="$t('courseDetail.title')"
          :course-number="store.ui.common.courseDetailNumber"
        ></course-detail>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import store from "../lib/store";
import { editOrder } from '../api/index';

export default {
  name: "SelectCourses",
  data() {
    return {
      store: store,
      previewTime: ""
    };
  },
  computed: {
    layoutSize () {
      let layoutSize = {
        coursesList: 'xs3',
        selectedCourses: 'xs3',
        favoriteCourses: 'xs3',
        timeTable: 'xs6',
        courseDetail: 'xs6'
      }

      let uc = this.store.ui.pc
      let cd = this.store.ui.common.showCourseDetail

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
      return this.store.isNotMobile ? this.store.ui.pc.showCoursesList : this.store.ui.mobile.showCoursesList
    },
    showSelectedCoursesList () {
      return this.store.isNotMobile ? this.store.ui.pc.showSelectedCoursesList : this.store.ui.mobile.showSelectedCoursesList
    },
    showTimeTable () {
      return this.store.isNotMobile ? (!this.store.ui.common.showCourseDetail && this.store.ui.pc.showTimeTable) : this.store.ui.mobile.showTimeTable
    },
    showCourseDetail () {
      return this.store.ui.common.showCourseDetail
    }
  },
  methods: {
    updatePreviewTime(courseNumber) {
      this.previewTime = this.store.courses[courseNumber] ? this.store.courses[courseNumber].time : '';
    }
  },
  mounted () {
    /*
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
  .memo {
    // text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

