<template>
  <v-container pa-0 ma-0 class="selection-result">
    <v-toolbar dense>
      <v-menu :nudge-width="100">
        <v-toolbar-title slot="activator">
          {{ title || $t('selectedCoursesList.title') }}
          <v-icon>arrow_drop_down</v-icon>
        </v-toolbar-title>
        <v-list>
          <v-list-tile
            v-for="item in availableSelectionResult"
            :key="item.value"
            ripple
          >
            <v-list-tile-title v-text="item.text"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-container pa-0 ma-0 class="list-wrapper">
      <courses-list
        :courses="courses"
        :list="list"
        @update-preview-time="updatePreviewTime"
        @open-course-detail="openCourseDetail"
      />
    </v-container>
  </v-container>
</template>

<script>
import CoursesList from './courses-list'

export default {
  name: 'SelectionResult',
  components: {
    CoursesList
  },
  data () {
    return {
      courses: {},
      abbr: '',
      departmentName: '',
      title: ''
    }
  },
  computed: {
    list () {
      return []
    },
    availableSelectionResult () {
      let list = []
      for (let semester in this.$store.state.selectCourses.availableSelectionResult) {
        for (let item of this.$store.state.selectCourses.availableSelectionResult[semester]) {
          list.push({
            text: item,
            value: semester + item
          })
        }
      }
      return list
    }
  },
  methods: {
    updatePreviewTime (number) {
      this.$emit('update-preview-time', number)
    },
    openCourseDetail (courseNumber) {
      this.$emit('open-course-detail', courseNumber)
    }
  },
  mounted () {
    this.courses = this.$store.state.selectCourses.courses
  }
}
</script>

<style lang="scss">
.selection-result {
  height: 100%;

  .list-wrapper {
    height: calc(100% - 48px);
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
