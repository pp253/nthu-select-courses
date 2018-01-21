<template>
  <div class="course-detail">
    <v-toolbar dense>
      <v-toolbar-title>
        {{ (course.title ? course.title : title) }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <v-btn icon slot="activator" @click="store.ui.common.showCourseDetail = false">
          <v-icon>close</v-icon>
        </v-btn>
        <span>{{ $t('courseDetail.close') }}</span>
      </v-tooltip>
    </v-toolbar>

    <v-container>
      <v-layout wrap>
        <v-flex xs2 class="grey--text text--darken-2">{{ $t('courseDetail.number') }}</v-flex><v-flex xs4>{{ course.number }}</v-flex>
        <v-flex xs2 class="grey--text text--darken-2">{{ $t('courseDetail.time') }}</v-flex><v-flex xs4>{{ course.time }}</v-flex>
        <v-flex xs2 class="grey--text text--darken-2">{{ $t('courseDetail.professor') }}</v-flex><v-flex xs4>{{ course.professor }}</v-flex>
        <v-flex xs2 class="grey--text text--darken-2">{{ $t('courseDetail.credit') }}</v-flex><v-flex xs4>{{ course.credit }}</v-flex>
        <v-flex xs2 class="grey--text text--darken-2">{{ $t('courseDetail.size_limit') }}</v-flex><v-flex xs4>{{ course.size_limit }}</v-flex>
        <v-flex xs2 class="grey--text text--darken-2">{{ $t('courseDetail.room') }}</v-flex><v-flex xs4>{{ course.room }}</v-flex>
      </v-layout>
      <v-layout wrap pb-3>
        <v-flex xs2 class="grey--text text--darken-2">{{ $t('courseDetail.prerequirement') }}</v-flex><v-flex xs10>{{ course.prerequirement }}</v-flex>
        <v-flex xs2 class="grey--text text--darken-2">{{ $t('courseDetail.memo') }}</v-flex><v-flex xs10>{{ course.memo }}</v-flex>
      </v-layout>

      <v-btn
        @click="store.courseSelected(course.number) ? addCourse(course.number) : quitCourse(course.number)"
      >{{ store.courseSelected(course.number) ? $t('action.addCourse') : $t('action.quitCourse') }}</v-btn>
      <v-btn
        @click="store.user.favoriteCourses.indexOf(course.number) === -1 ? addFavorite(course.number) : removeFavorite(course.number)"
      >{{ store.user.favoriteCourses.indexOf(course.number) === -1 ? $t('action.addFavorite') : $t('action.removeFavorite') }}</v-btn>
    </v-container>
    <v-divider></v-divider>
    <v-container>
    </v-container>
  </div>
</template>

<script>
import store from '../lib/store'

export default {
  name: 'CoursesList',
  props: {
    'title': String,
    'course-number': String
  },
  data () {
    return {
      store: store,
      course: store.getCourseDetail(this.courseNumber)
    }
  },
  watch: {
    courseNumber (newValue, oldValue) {
      this.course = store.getCourseDetail(newValue)
    }
  },
  methods: {
    addCourse (number) {
      let order = ''
      if (this.store.courses[number].random !== 0) {
        order = this.store.user.currentSelectedCourses.filter((course) => {
          return course.status && course.status === 2 && this.store.courses[course.number].random === this.store.courses[number].random
        }).length + 1
      }
      this.store.addCourse(number, order)
    },
    quitCourse (number) {
      this.store.quitCourse(number)
    },
    addFavorite (number) {
      store.addFavorateCourses(number)
    },
    removeFavorite (number) {
      store.removeFavorateCourses(number)
    },
  },
  mounted () {
    
  }
}
</script>

<style lang="scss">
.course-detail {

}
</style>
