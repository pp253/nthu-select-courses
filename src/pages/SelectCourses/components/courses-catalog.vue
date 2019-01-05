<template>
  <v-container fluid
               pa-0
               ma-0
               class="courses-catalog">
    <v-toolbar dense
               :dark="style.coursesCatalog.toolbar.dark"
               :color="style.coursesCatalog.toolbar.color"
               style="z-index: 1;"
               extended>
      <v-toolbar-title v-t="title || 'SelectCourses.coursesCatalog.title'">
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <v-btn slot="activator"
               @click="showDepartmentPicker = true"
               icon
               flat
               class="ma-0 pa-0">
          <v-icon>list</v-icon>
        </v-btn>
        <span>選擇科系</span>
      </v-tooltip>
      <department-picker :value="showDepartmentPicker"
                         @update-department="updateDepartment"
                         @close="showDepartmentPicker = false"
                         @search="t => {searchText = t; onlySearchAbbr = false; updateList()}" />

      <v-text-field slot="extension"
                    v-model="searchText"
                    type="text"
                    value=""
                    prepend-icon="search"
                    clearable
                    @focus="showMenu = true"
                    @input="(str) => {str === null && (searchText = '', updateList(), showMenu = false)}"
                    @keyup.native="(e) => {e.key === 'Enter' && (updateList(), showMenu = false)}">
      </v-text-field>
    </v-toolbar>

    <v-container fluid
                 pa-0
                 ma-0
                 class="list-wrapper"
                 id="courses-catalog-list">
      <courses-list :courses="courses"
                    :list="list"
                    empty-text="SelectCourses.coursesCatalog.pleaseSelect"
                    :result="false"
                    @update-preview-time="updatePreviewTime"
                    @open-course-detail="openCourseDetail"
                    @update-page="updatePage">

        <template slot="header">
          <v-layout>
            <v-flex xs12
                    text-xs-right>
              <v-btn flat
                     small
                     outline
                     @click="showPeriodPicker = true">
                <v-icon>event</v-icon>搜尋時段
              </v-btn>
              <v-menu bottom
                      left
                      lazy
                      min-width="250"
                      max-width="250">
                <v-btn flat
                       small
                       outline
                       slot="activator"
                       class="ml-0">
                  <v-icon>filter_list</v-icon>進階搜尋
                </v-btn>
                <v-card>
                  <v-card-text class="px-0">
                    <v-list class="pa-0">
                      <v-list-tile v-for="item in searchItems"
                                   :key="item.value"
                                   @click="showMenu = false; item.action && item.action(); updateList()"
                                   ripple>
                        <v-list-tile-title>
                          <span class="grey--text lighten-1">{{`搜尋${item.scope} `}}</span>
                          {{ item.text }}
                        </v-list-tile-title>
                      </v-list-tile>
                      <v-divider v-if="abbr" />
                    </v-list>
                    <v-checkbox v-if="abbr"
                                v-model="onlySearchAbbr"
                                :label="`只搜尋「${getDepartmentDetail(abbr).chineseName || getDepartmentDetail(abbr).name}」`"
                                hide-details
                                color="primary"
                                class="pt-2 ml-3 mr-3" />
                  </v-card-text>
                </v-card>
              </v-menu>
            </v-flex>
          </v-layout>
        </template>
      </courses-list>
    </v-container>

    <period-picker :value="showPeriodPicker"
                   @update-periods="updatePeriods"
                   @close="showPeriodPicker = false" />
  </v-container>
</template>

<script>
import {
  VMenu,
  VBtn,
  VIcon,
  VTooltip,
  VToolbar,
  VToolbarTitle,
  VTextField,
  VCheckbox,
  VList,
  VListTile,
  VListTileTitle
} from 'vuetify/lib'
import CoursesList from './courses-list'
import DepartmentPicker from './department-picker'
import PeriodPicker from './period-picker'
import { mapState } from 'vuex'

export default {
  name: 'CoursesCatalog',
  components: {
    DepartmentPicker,
    PeriodPicker,
    CoursesList,
    VMenu,
    VBtn,
    VIcon,
    VTooltip,
    VToolbar,
    VToolbarTitle,
    VTextField,
    VCheckbox,
    VList,
    VListTile,
    VListTileTitle
  },
  props: {
    search: String
  },
  data() {
    return {
      searchText: '',
      searchPeriods: '',
      onlySearchAbbr: true,
      abbr: '',
      title: '',
      list: [],
      showMenu: false,
      showPeriodPicker: false,
      showDepartmentPicker: false
    }
  },
  watch: {
    onlySearchAbbr() {
      this.updateList()
    }
  },
  computed: {
    ...mapState('selectCourses', [
      'courses',
      'catalog',
      'departments',
      'style'
    ]),
    searchItems() {
      let searchText = this.searchText
      const splitReg = /^(.*?:)?(.*)$/
      let splitSearchText = text => {
        if (!text) {
          return ''
        }
        let executed = text.match(splitReg)
        return executed[executed.length - 1]
      }
      return [
        {
          type: 'suggest',
          scope: '教授',
          text: searchText,
          value: 'professor:' + searchText,
          action: () => {
            /* eslint-disable-next-line */
            this.searchText = `professor:${splitSearchText(searchText) || ''}`
          }
        },
        {
          type: 'suggest',
          scope: '課名',
          text: searchText,
          value: 'title:' + searchText,
          action: () => {
            /* eslint-disable-next-line */
            this.searchText = `title:${splitSearchText(searchText) || ''}`
          }
        },
        {
          type: 'suggest',
          scope: '代號',
          text: searchText,
          value: 'number:' + searchText,
          action: () => {
            /* eslint-disable-next-line */
            this.searchText = `number:${splitSearchText(searchText) || ''}`
          }
        },
        {
          type: 'suggest',
          scope: '全部',
          text: searchText,
          value: '' + searchText,
          action: () => {
            /* eslint-disable-next-line */
            this.searchText = `${splitSearchText(searchText) || ''}`
          }
        }
      ]
    }
  },
  methods: {
    updateList() {
      let list = []
      let courses = this.courses
      let searchText = this.searchText.toLowerCase()
      let searchPeriods = this.searchPeriods
      let abbr = this.abbr

      if (this.onlySearchAbbr && abbr) {
        courses = {}
        if (abbr in this.catalog) {
          for (let courseNumber of this.catalog[abbr]) {
            courses[courseNumber] = this.courses[courseNumber]
          }
        }
      }

      if (searchText && searchText !== '') {
        if (searchText.startsWith('period:')) {
          this.title = this.$t('common.search', [
            searchPeriods ? searchPeriods.join('') : ''
          ])
          if (searchPeriods.length === 0) {
            return
          }
          for (let courseNumber in courses) {
            let atleast = false
            let meet = true
            let course = courses[courseNumber]
            if (!course.time) {
              continue
            }
            for (let idx = 0; idx < course.time.length; idx += 2) {
              let period = course.time.slice(idx, idx + 2)
              if (searchPeriods.indexOf(period) === -1) {
                meet = false
                break
              } else {
                atleast = true
              }
            }
            if (atleast && meet) {
              list.push({
                number: courseNumber
              })
            }
          }
        } else if (searchText.startsWith('professor:')) {
          let searchProfessor = searchText.slice('professor:'.length)
          if (searchProfessor === '') {
            return
          }
          this.title = this.$t('common.search', [searchText])
          for (let courseNumber in courses) {
            let course = courses[courseNumber]
            if (
              course.professor &&
              course.professor
                .join(' ')
                .toLowerCase()
                .includes(searchProfessor)
            ) {
              list.push({
                number: courseNumber
              })
            }
          }
        } else if (searchText.startsWith('title:')) {
          let searchTitle = searchText.slice('title:'.length)
          if (searchTitle === '') {
            return
          }
          this.title = this.$t('common.search', [searchText])
          for (let courseNumber in courses) {
            let course = courses[courseNumber]
            if (
              (course.title &&
                course.title.toLowerCase().includes(searchTitle)) ||
              (course.title_eng &&
                course.title_eng.toLowerCase().includes(searchText))
            ) {
              list.push({
                number: courseNumber
              })
            }
          }
        } else if (searchText.startsWith('number:')) {
          let searchNumber = searchText.slice('number:'.length)
          if (searchNumber === '') {
            return
          }
          this.title = this.$t('common.search', [searchText])
          for (let courseNumber in courses) {
            let course = courses[courseNumber]
            if (course.number.toLowerCase().includes(searchNumber)) {
              list.push({
                number: courseNumber
              })
            }
          }
        } else if (searchText.startsWith('ge_degree:')) {
          let searchGEDegree = searchText.slice('ge_degree:'.length)
          if (searchGEDegree === '') {
            return
          }
          this.title = this.$t('common.search', [searchText])
          for (let courseNumber in courses) {
            let course = courses[courseNumber]
            if (
              course.ge_degree &&
              course.ge_degree.toLowerCase().includes(searchGEDegree)
            ) {
              list.push({
                number: courseNumber
              })
            }
          }
        } else if (searchText.startsWith('double:')) {
          let searchDouble = searchText.slice('double:'.length)
          if (searchDouble === '') {
            return
          }
          this.title = this.$t('common.search', [searchText])
          for (let courseNumber in courses) {
            let course = courses[courseNumber]
            if (
              course.double &&
              course.double.find(v => v.toLowerCase().includes(searchDouble))
            ) {
              list.push({
                number: courseNumber
              })
            }
          }
        } else if (searchText.startsWith('program:')) {
          let searchProgram = searchText.slice('program:'.length)
          if (searchProgram === '') {
            return
          }
          this.title = this.$t('common.search', [searchText])
          for (let courseNumber in courses) {
            let course = courses[courseNumber]
            if (
              course.program &&
              course.program.find(v => v.toLowerCase().includes(searchProgram))
            ) {
              list.push({
                number: courseNumber
              })
            }
          }
        } else if (searchText.startsWith('required:')) {
          let searchRequired = searchText.slice('required:'.length)
          if (searchRequired === '') {
            return
          }
          this.title = this.$t('common.search', [searchText])
          for (let courseNumber in courses) {
            let course = courses[courseNumber]
            if (
              course.required &&
              course.required.find(v =>
                v.toLowerCase().includes(searchRequired)
              )
            ) {
              list.push({
                number: courseNumber
              })
            }
          }
        } else {
          this.title = this.$t('common.search', [searchText])
          for (let courseNumber in courses) {
            let course = courses[courseNumber]
            if (
              course.number.toLowerCase().includes(searchText) ||
              (course.title &&
                course.title.toLowerCase().includes(searchText)) ||
              (course.title_eng &&
                course.title_eng.toLowerCase().includes(searchText)) ||
              (course.professor &&
                course.professor.find(v =>
                  v.toLowerCase().includes(searchText)
                )) ||
              (course.time && course.time.toLowerCase().includes(searchText)) ||
              (course.room && course.room.toLowerCase().includes(searchText))
            ) {
              list.push({
                number: courseNumber
              })
            }
          }
        }
      } else if (abbr) {
        this.title =
          this.getDepartmentDetail(abbr).chineseName ||
          this.getDepartmentDetail(abbr).name

        if (abbr in this.catalog) {
          for (let courseNumber of this.catalog[abbr]) {
            list.push({
              number: courseNumber
            })
          }
        }
      } else {
        this.title = ''
      }
      this.list = list
    },
    updateDepartment(abbr) {
      this.abbr = abbr
      this.searchText = ''
      this.onlySearchAbbr = true
      this.updateList()
    },
    updatePeriods(periods) {
      this.searchPeriods = periods
      this.searchText = 'period:' + periods.join('')
      this.updateList()
    },
    getDepartmentDetail(abbr) {
      if (abbr.length <= 4 && abbr in this.departments) {
        // Department
        return this.departments[abbr]
      } else {
        // Class
        for (let deptAbbr in this.departments) {
          for (let cls of this.departments[deptAbbr].classes) {
            if (cls.abbr === abbr) {
              return cls
            }
          }
        }
      }
    },
    updatePreviewTime(number) {
      this.$emit('update-preview-time', number)
    },
    openCourseDetail(courseNumber) {
      this.$emit('open-course-detail', courseNumber)
    },
    updatePage() {
      if (window.document.getElementById('courses-catalog-list')) {
        window.document.getElementById('courses-catalog-list').scrollTop = 0
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.$forceUpdate()
    }, 3 * 1000)
  }
}
</script>

<style lang="scss">
.courses-catalog {
  height: 100%;

  .list-wrapper {
    height: calc(100% - 96px);
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 64px;
  }
}
</style>
