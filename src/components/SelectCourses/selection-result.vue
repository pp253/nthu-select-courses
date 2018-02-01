<template>
  <v-container fluid pa-0 ma-0 class="selection-result">
    <v-toolbar dense>
      <v-menu :nudge-width="100">
        <v-toolbar-title slot="activator">
          {{ title || $t('selectedCoursesList.title') }}
          <v-icon>arrow_drop_down</v-icon>
        </v-toolbar-title>
        <v-list>
          <v-list-tile
            v-for="item in readableAvailableSelectionResult"
            :key="item.value"
            @click="openSelectionResult(item.semester, item.phase)"
            ripple
          >
            <v-list-tile-title v-text="item.text"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-container fluid pa-0 ma-0 class="list-wrapper">
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
import {mapState} from 'vuex'
import CoursesList from './courses-list'

export default {
  name: 'SelectionResult',
  components: {
    CoursesList
  },
  data () {
    return {
      semester: '',
      phase: '',
      title: ''
    }
  },
  computed: {
    ...mapState('selectCourses', [
      'selectionResult',
      'availableSelectionResult'
    ]),
    courses () {
      let courses = {}
      let semester = this.semester
      let phase = this.phase

      if (semester && phase) {
        if (semester in this.selectionResult &&
          phase in this.selectionResult[semester]
        ) {
          let selectionResult = this.selectionResult[semester][phase]
          courses = Object.assign({}, selectionResult.status, selectionResult.randomFailed)
        }
      }
      return courses
    },
    list () {
      let list = []
      let semester = this.semester
      let phase = this.phase

      if (semester && phase) {
        if (semester in this.selectionResult &&
          phase in this.selectionResult[semester]
        ) {
          let selectionResult = this.selectionResult[semester][phase]
          let selectionResultCatalog = ['status', 'randomFailed']
          for (let catalog of selectionResultCatalog) {
            let tmpList = []
            for (let courseNumber in selectionResult[catalog]) {
              tmpList.push({
                number: courseNumber
              })
            }

            if (tmpList.length) {
              list.push({
                type: 'subheader',
                title: `selectionResult.${catalog}`
              })
              list = list.concat(tmpList)
            }
          }
        }
      }
      return list
    },
    readableAvailableSelectionResult () {
      let list = []
      for (let semester in this.availableSelectionResult) {
        for (let phase of this.availableSelectionResult[semester]) {
          list.push({
            text: semester + phase,
            value: semester + phase,
            semester: semester,
            phase: phase
          })
        }
      }
      return list
    }
  },
  methods: {
    toReadableSemesterPhase (semester, phase) {

    },
    openSelectionResult (semester, phase) {
      this.semester = semester
      this.phase = phase
      if (!this.selectionResult[semester] ||
        !this.selectionResult[semester][phase]
      ) {
        this.$store.dispatch('selectCourses/getSelectionResult', {
          semester: semester,
          phase: phase
        })
      }
    },
    updatePreviewTime (number) {
      this.$emit('update-preview-time', number)
    },
    openCourseDetail (courseNumber) {
      this.$emit('open-course-detail', courseNumber)
    }
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
    padding-bottom: 64px;
  }
}
</style>
