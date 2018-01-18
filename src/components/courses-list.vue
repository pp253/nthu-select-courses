<template>
  <div class="courses-list">
    <v-toolbar dense extended>
      <v-toolbar-title>
        {{ (departmentName ? departmentName : title) }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <choose-department
        v-if="!list"
        @update-department="updateCourses"
      ></choose-department>
      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>

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
      ripple
    >
      <template
        v-if="coursesList.length > 0"
        v-for="(course, index) in coursesList"
      >
        <v-list-tile
          ripple
          @click=""
          :key="course.number"
          @mouseover="updatePreviewTime(course.time)"
          @mouseleave="updatePreviewTime('')"
          @dblclick="store.openCourseDetail(course.number)"
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ course.title }}</v-list-tile-title>
            <v-list-tile-sub-title class="grey--text text--darken-4">{{ course.number + ' ' + course.professor }}</v-list-tile-sub-title>
            <v-list-tile-sub-title class="detail">{{ '學分' + course.credit + '　人限' + course.size_limit + '　' + course.room }}</v-list-tile-sub-title>
            <v-list-tile-sub-title class="memo">{{ course.memo || ' ' }}</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-list-tile-action-text>{{ course.time }}</v-list-tile-action-text>
            <div class="text-xs-center">
              <v-menu offset-y left>
                <v-btn icon slot="activator">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile
                    ripple
                    @click="store.user.selectedCourses.indexOf(course.number) === -1 ? addCourses(course.number) : removeCourses(course.number)"
                  >{{ store.user.selectedCourses.indexOf(course.number) === -1 ? $t('action.addCourse') : $t('action.removeCourse') }}</v-list-tile>
                  <v-list-tile
                    ripple
                    @click="store.user.favoriteCourses.indexOf(course.number) === -1 ? addFavorite(course.number) : removeFavorite(course.number)"
                  >{{ store.user.favoriteCourses.indexOf(course.number) === -1 ? $t('action.addFavorite') : $t('action.removeFavorite') }}</v-list-tile>
                  <v-list-tile
                    ripple
                    @click="store.openCourseDetail(course.number)"
                  >{{ $t('coursesList.detail') }}</v-list-tile>
                </v-list>
              </v-menu>
            </div>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider v-if="index < coursesList.length - 1" :key="course.number + '-divider'"></v-divider>
      </template>

      <div
        v-if="coursesList.length === 0"
        class="text-xs-center pt-5"
      >{{ emptyText }}</div>

    </v-list>
  </div>
</template>

<script>
import store from '../lib/store'

export default {
  name: 'CoursesList',
  props: {
    'title': String,
    list: Array,
    'empty-text': {
      default: '您還沒有加入的課程歐！'
    }
  },
  data () {
    return {
      store: store,
      coursesList: [],
      departmentName: ''
    }
  },
  methods: {
    updateCourses (abbr) {
      this.departmentName = store.getDepartmentDetail(abbr).chineseName || store.getDepartmentDetail(abbr).name

      this.coursesList.splice(0, this.coursesList.length)
      for (let courseNumber of store.getCourses(abbr)) {
        this.coursesList.push(store.getCourseDetail(courseNumber))
      }
      return this.coursesList
    },
    addCourses (number) {
      store.addSelectedCourses(number)
    },
    removeCourses (number) {
      store.removeSelectedCourses(number)
    },
    addFavorite (number) {
      store.addFavorateCourses(number)
    },
    removeFavorite (number) {
      store.removeFavorateCourses(number)
    },
    updatePreviewTime (time) {
      this.$emit('update-preview-time', time)
    }
  },
  mounted () {
    if (this.list) {
      this.coursesList = this.list
    }
  }
}
</script>

<style lang="scss">
.courses-list {

  .list {
    height: calc(100vh - 100px);
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    z-index: -100;

    .list__tile {
      height: 88px + 16px !important;
    }

    .memo {
      // text-overflow: ellipsis;
      white-space: nowrap;
      min-height: 21.5px;
    }
  }

}
</style>

