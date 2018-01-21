<template>
  <v-container fluid pa-0 class="select-courses">
    <v-layout row>
      <v-flex>
        <v-layout>
          <v-flex xs3 v-if="store.ui.common.showCoursesList">
            <courses-list
              :title="$t('coursesList.title')"
              @update-preview-time="updatePreviewTime"
              :empty-text="$t('coursesList.pleaseSelect')"
            ></courses-list>
          </v-flex>

          <v-flex xs3 v-if="store.ui.common.showSelectedCoursesList">
            <courses-list
              :title="$t('selectedCoursesList.title')"
              :list="store.user.currentSelectedCourses"
              @update-preview-time="updatePreviewTime"
            ></courses-list>
          </v-flex>

          <v-flex xs6 v-if="!store.ui.common.showCourseDetail && store.ui.common.showTimeTable">
            <time-table
              :preview-time="previewTime"
              :list="store.user.currentSelectedCourses"
            ></time-table>
          </v-flex>

          <v-flex xs6 v-if="store.ui.common.showCourseDetail">
            <course-detail
              :title="$t('courseDetail.title')"
              :course-number="store.ui.common.courseDetailNumber"
            ></course-detail>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import store from "../lib/store";

export default {
  name: "SelectCourses",
  data() {
    return {
      store: store,
      previewTime: ""
    };
  },
  methods: {
    updatePreviewTime(courseNumber) {
      this.previewTime = this.store.courses[courseNumber] ? this.store.courses[courseNumber].time : '';
    }
  },
  mounted () {
    this.store.ui.common.loading = true
    this.store.getCurrentSelectedCourses()
    .then(() => {
      this.store.ui.common.loading = false
    })
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

