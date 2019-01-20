<template>
  <v-container fluid
               pa-0
               ma-0
               class="selection-result">
    <v-toolbar dense
               :dark="style.selectionResult.toolbar.dark"
               :color="style.selectionResult.toolbar.color"
               style="z-index: 1;"
               extended>
      <v-toolbar-title>
        {{$t('SelectCourses.selectionResult.title')}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <v-btn slot="activator"
               icon
               flat
               @click="$emit('refresh')">
          <v-icon>refresh</v-icon>
        </v-btn>
        <span>重新整理</span>
      </v-tooltip>
      <v-select slot="extension"
                :items="readableAvailableSelectionResult"
                @input="(semesterPhase) => {openSelectionResult(semesterPhase); selectedSemesterPhase = semesterPhase}"
                item-text="text"
                item-value="value"
                :value="selectedSemesterPhase"
                :label="$t('SelectCourses.selectionResult.title')"
                single-line
                menu-props="bottom">
        <template slot="item"
                  slot-scope="data">
          <template v-if="data.item.type === 'divider'">
            <v-divider />
          </template>
          <template v-else>
            <v-list-tile-content>
              <v-list-tile-title v-html="data.item.text"></v-list-tile-title>
            </v-list-tile-content>
          </template>
        </template>
      </v-select>
    </v-toolbar>

    <v-container fluid
                 pa-0
                 ma-0
                 class="list-wrapper">
      <loading-container v-if="$wait.is(['selectCourses.getSelectionResult', 'selectCourses.getCurrentSelectedCourses'])"
                         slot="waiting" />
      <courses-list v-else
                    :courses="courses"
                    :list="list"
                    :result="$store.state.selectCourses.phase === 'current'"
                    @update-preview-time="updatePreviewTime"
                    @open-course-detail="openCourseDetail" />
    </v-container>
  </v-container>
</template>

<script>
import {
  VToolbar,
  VToolbarTitle,
  VSelect,
  VTooltip,
  VListTileTitle,
  VListTileContent
} from 'vuetify/lib'
import { mapState } from 'vuex'
import LoadingContainer from '@/components/loading-container'
import CoursesList from './courses-list'

export default {
  name: 'SelectionResult',
  components: {
    CoursesList,
    LoadingContainer,
    VToolbar,
    VToolbarTitle,
    VSelect,
    VTooltip,
    VListTileTitle,
    VListTileContent
  },
  props: {
    list: Array,
    courses: Object
  },
  data() {
    return {
      title: '',
      semesterPhase: {},
      selectedSemesterPhase: 'current'
    }
  },
  watch: {
    editable(newVal) {
      if (newVal === true || !this.readableAvailableSelectionResult) {
        return
      }
      let latest = 'current'
      for (let i = 0; i < this.readableAvailableSelectionResult.length; i++) {
        if (this.readableAvailableSelectionResult[i].divider === true) {
          continue
        }
        latest = this.readableAvailableSelectionResult[i].value
        break
      }

      this.selectedSemesterPhase = latest
      this.openSelectionResult(this.selectedSemesterPhase)
    }
  },
  computed: {
    ...mapState('selectCourses', [
      'selectionPhase',
      'addOrDropPhase',
      'withdrawalPhase',
      'selectionResult',
      'availableSelectionResult',
      'semester',
      'phase',
      'style',
      'editable'
    ]),
    readableAvailableSelectionResult() {
      let list = []

      for (let semester in this.availableSelectionResult) {
        for (let phase of this.availableSelectionResult[semester]) {
          list.push({
            text: `${this.toReadableSemester(semester)} ${this.$t(
              'SelectCourses.phase.' + phase
            )}`,
            value: `${semester} ${phase}`
          })
        }
        list.push({
          header: this.toReadableSemester(semester)
        })
        list.push({
          divider: true
        })
      }

      if (this.addOrDropPhase) {
        list.push({
          text: '加簽課程清單',
          value: `add`
        })
      }

      if (this.withdrawPhase) {
        list.push({
          text: '二退課程清單',
          value: `withdraw`
        })
      }

      if (this.selectionPhase || this.addOrDropPhase || this.withdrawPhase) {
        list.push({
          text: '目前選課狀況',
          value: `current`
        })
      }

      /**
       * Avoid redundant divider.
       */
      if (list[list.length - 1].divider === true) {
        list.pop()
      }

      list.reverse()
      return list
    }
  },
  methods: {
    toReadableSemester(semester) {
      if (!semester) {
        return ''
      }
      let seText = /(\d{3})(\d{2})/.exec(semester)
      return seText[1] + this.$t(`semester.${seText[2]}`)
    },
    openSelectionResult(semesterPhase) {
      if (!semesterPhase) {
        return
      }
      if (semesterPhase === 'current') {
        this.$store.commit('selectCourses/SET_PHASE', { phase: 'current' })
      } else {
        let rgText = semesterPhase.split(' ')
        this.$store.commit('selectCourses/SET_SEMESTER', {
          semester: rgText[0]
        })
        this.$store.commit('selectCourses/SET_PHASE', { phase: rgText[1] })
        if (
          !this.selectionResult[this.semester] ||
          !this.selectionResult[this.semester][this.phase]
        ) {
          this.$store.dispatch('selectCourses/getSelectionResult', {
            semester: this.semester,
            phase: this.phase
          })
        }
      }
    },
    updatePreviewTime(number) {
      this.$emit('update-preview-time', number)
    },
    openCourseDetail(courseNumber) {
      this.$emit('open-course-detail', courseNumber)
    }
  }
}
</script>

<style lang="scss">
.selection-result {
  height: 100%;

  .list-wrapper {
    height: calc(100% - 96px);
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 64px;
    transform: translateZ(0);
  }
}
</style>
