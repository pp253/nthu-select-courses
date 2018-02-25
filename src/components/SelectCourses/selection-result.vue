<template>
  <v-container fluid pa-0 ma-0 class="selection-result">
    <v-toolbar dense>
      <v-select
        :items="readableAvailableSelectionResult"
        @input="openSelectionResult"
        item-text="text"
        item-value="value"
        :label="title || $t('selectedCoursesList.title')"
        single-line
        bottom
      ></v-select>
      <!--
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
      -->
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
  props: {
    'list': Array,
    'courses': Object
  },
  data () {
    return {
      title: '',
      semesterPhase: {}
    }
  },
  computed: {
    ...mapState('selectCourses', [
      'selectionResult',
      'availableSelectionResult',
      'semester',
      'phase'
    ]),
    readableAvailableSelectionResult () {
      let list = []
      for (let semester in this.availableSelectionResult) {
        for (let phase of this.availableSelectionResult[semester]) {
          list.push({
            text: `${this.toReadableSemester(semester)} ${this.$t('phase.' + phase)}`,
            value: `${semester} ${phase}`
          })
        }
      }
      list.reverse()
      return list
    }
  },
  methods: {
    toReadableSemester (semester) {
      if (!semester) {
        return ''
      }
      let seText = /(\d{3})(\d{2})/.exec(semester)
      return seText[1] + this.$t(`semester.${seText[2]}`)
    },
    openSelectionResult (semesterPhase) {
      if (!semesterPhase) {
        return
      }
      let rgText = semesterPhase.split(' ')
      this.$store.commit('selectCourses/setSemester', {semester: rgText[0]})
      this.$store.commit('selectCourses/setPhase', {phase: rgText[1]})
      if (!this.selectionResult[this.semester] ||
        !this.selectionResult[this.semester][this.phase]
      ) {
        this.$store.dispatch('selectCourses/getSelectionResult', {
          semester: this.semester,
          phase: this.phase
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

  .input-group {
    margin-top: 20px;
  }

  .list-wrapper {
    height: calc(100% - 48px);
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 64px;
  }
}
</style>
