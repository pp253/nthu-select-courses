<template>
  <div class="course-detail">
    <v-toolbar dense>
      <v-toolbar-title>
        <span
          v-if="course.canceled"
          class="red--text"
        >停開</span>
        {{ (course.title ? course.title : title) }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <v-btn icon slot="activator" @click="closeCourseDetail">
          <v-icon>close</v-icon>
        </v-btn>
        <span>{{ $t('courseDetail.close') }}</span>
      </v-tooltip>
    </v-toolbar>

    <v-container pa-0 ma-0 class="content">
      <v-container>
        <v-layout wrap>
          <v-flex xs3 md2 class="grey--text text--darken-2">{{ $t('courseDetail.number') }}</v-flex><v-flex xs9 md4>{{ course.number }}</v-flex>
          <v-flex xs3 md2 class="grey--text text--darken-2">{{ $t('courseDetail.time') }}</v-flex><v-flex xs9 md4>{{ course.time }}</v-flex>
          <v-flex xs3 md2 class="grey--text text--darken-2">{{ $t('courseDetail.professor') }}</v-flex><v-flex xs9 md4>{{ course.professor }}</v-flex>
          <v-flex xs3 md2 class="grey--text text--darken-2">{{ $t('courseDetail.credit') }}</v-flex><v-flex xs9 md4>{{ course.credit }}</v-flex>
          <v-flex xs3 md2 class="grey--text text--darken-2">{{ $t('courseDetail.size_limit') }}</v-flex><v-flex xs9 md4>{{ course.size_limit + ` (${course.previous_size})` }}</v-flex>
          <v-flex xs3 md2 class="grey--text text--darken-2">{{ $t('courseDetail.room') }}</v-flex><v-flex xs9 md4>{{ course.room }}</v-flex>
        </v-layout>
        <v-layout wrap pb-3>
          <v-flex xs3 md2 class="grey--text text--darken-2">{{ $t('courseDetail.prerequirement') }}</v-flex><v-flex xs9 md10>{{ course.prerequirement }}</v-flex>
          <v-flex xs3 md2 class="grey--text text--darken-2">{{ $t('courseDetail.memo') }}</v-flex><v-flex xs9 md10>{{ course.memo }}</v-flex>
        </v-layout>

        <v-btn
          v-if="!course.canceled"
          @click="isCourseSelected(course.number) ? quitCourse(course.number) : addCourse(course.number)"
        >{{ isCourseSelected(course.number) ? $t('action.quitCourse') : $t('action.addCourse') }}</v-btn>
        <!--
        <v-btn
          @click="store.user.favoriteCourses.indexOf(course.number) === -1 ? addFavorite(course.number) : removeFavorite(course.number)"
        >{{ store.user.favoriteCourses.indexOf(course.number) === -1 ? $t('action.addFavorite') : $t('action.removeFavorite') }}</v-btn>
        -->
      </v-container>
      <v-divider></v-divider>
      <v-container
        v-if="course.syllabus && course.syllabus.briefDescription !== ''"
      >
        <div
          v-html="course.syllabus.briefDescription"
        ></div>
      </v-container>
      <v-divider></v-divider>
      <v-container
        v-if="course.syllabus"
      >
        <v-btn
          v-if="course.syllabus.file"
          :href="`https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/output/6_6.1_6.1.12/${course.number}.pdf`"
          target="_blank"
        >下載課程大綱</v-btn>
        <div
          v-html="course.syllabus.description"
        ></div> 
      </v-container>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'CoursesList',
  props: {
    'title': String,
    'course-number': String,
    'courses-db': Object
  },
  data () {
    return {
      courses: {}
    }
  },
  watch: {
    courseNumber (newVal) {
      if (this.courses[this.courseNumber]) {
        if (!this.courses[this.courseNumber].syllabus && !this.coursesDb) {
          this.$store.dispatch('selectCourses/getSyllabus', {
            courseNumber: newVal
          })
        }
      }
    }
  },
  computed: {
    course () {
      if (this.courseNumber in this.courses) {
        return this.courses[this.courseNumber]
      }
      return {}
    }
  },
  methods: {
    addCourse (courseNumber) {
      return new Promise((resolve, reject) => {
        this.$store.commit('ui/startLoading')
        let order = ''
        if (this.courses[courseNumber].random !== 0) {
          order = this.$store.state.selectCourses.currentSelectedCourses.filter((course) => {
            return course.status && course.status === 2 && this.courses[course.number].random === this.courses[courseNumber].random
          }).length + 1
        }

        this.$store.dispatch('selectCourses/addCourse', {
          courseNumber: courseNumber,
          order: order
        })
        .then((data) => {
          this.$store.commit('ui/stopLoading')
          resolve(data)
        })
        .catch((err) => {
          this.$store.commit('ui/stopLoading')
          reject(err)
        })
      })
    },
    quitCourse (courseNumber) {
      return new Promise((resolve, reject) => {
        this.$store.commit('ui/startLoading')
        this.$store.dispatch('selectCourses/quitCourse', {
          courseNumber: courseNumber
        })
        .then((data) => {
          this.$store.commit('ui/stopLoading')
          resolve(data)
        })
        .catch((err) => {
          this.$store.commit('ui/stopLoading')
          reject(err)
        })
      })
    },
    isCourseSelected (courseNumber) {
      return (this.$store.state.selectCourses.currentSelectedCourses.find((course) => {
        return course.number === courseNumber
      }) !== undefined)
    },
    addFavorite (number) {
      // store.addFavorateCourses(number)
    },
    removeFavorite (number) {
      // store.removeFavorateCourses(number)
    },
    closeCourseDetail () {
      this.$emit('close-course-detail')
    }
  },
  mounted () {
    if (this.coursesDb) {
      this.courses = this.coursesDb
    } else {
      this.courses = this.$store.state.selectCourses.courses
    }
  }
}
</script>

<style lang="scss">
.course-detail {
  .content {
    height: calc(100vh - 48px);
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    user-select: auto;
  }
}

.mode-mobile {
  .content {
    height: calc(100vh - 48px - 56px);
  }
}
</style>
