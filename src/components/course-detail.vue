<template>
  <div class="course-detail">
    <v-toolbar dense>
      <v-toolbar-title>
        {{ title + (course.title ? '：' + course.title : '') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <v-btn icon slot="activator" @click="store.ui.common.showCourseDetail = false">
          <v-icon>close</v-icon>
        </v-btn>
        <span>關閉課程資訊</span>
      </v-tooltip>
    </v-toolbar>

    <v-container>
      <v-layout wrap>
        <v-flex xs2 class="grey--text text--darken-2">科號</v-flex><v-flex xs4>{{ course.number }}</v-flex>
        <v-flex xs2 class="grey--text text--darken-2">時間</v-flex><v-flex xs4>{{ course.time }}</v-flex>
        <v-flex xs2 class="grey--text text--darken-2">授課教師</v-flex><v-flex xs4>{{ course.professor }}</v-flex>
        <v-flex xs2 class="grey--text text--darken-2">學分</v-flex><v-flex xs4>{{ course.credit }}</v-flex>
        <v-flex xs2 class="grey--text text--darken-2">人限</v-flex><v-flex xs4>{{ course.size_limit }}</v-flex>
        <v-flex xs2 class="grey--text text--darken-2">地點</v-flex><v-flex xs4>{{ course.room }}</v-flex>
      </v-layout>
      <v-layout wrap pb-3>
        <v-flex xs2 class="grey--text text--darken-2">擋修</v-flex><v-flex xs10>{{ course.prerequirement }}</v-flex>
        <v-flex xs2 class="grey--text text--darken-2">備註</v-flex><v-flex xs10>{{ course.memo }}</v-flex>
      </v-layout>

      <v-btn
        @click="store.user.selectedCourses.indexOf(course.number) === -1 ? addCourses(course.number) : removeCourses(course.number)"
      >{{ store.user.selectedCourses.indexOf(course.number) === -1 ? '加入課程' : '移除課程' }}</v-btn>
      <v-btn
        @click="store.user.favoriteCourses.indexOf(course.number) === -1 ? addFavorite(course.number) : removeFavorite(course.number)"
      >{{ store.user.favoriteCourses.indexOf(course.number) === -1 ? '加入最愛' : '移除最愛' }}</v-btn>
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
  },
  mounted () {
    
  }
}
</script>

<style lang="scss">
.course-detail {

}
</style>
