<template>
  <v-container fluid pa-0 ma-0 class="courses-catalog">
    <v-toolbar dense extended>
      <v-toolbar-title>
        {{ title || $t('coursesList.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <v-btn
          slot="activator"
          @click="showDepartmentPicker = true"
          icon
          flat
        >
          <v-icon>list</v-icon>
        </v-btn>
        <span>選擇科系</span>
      </v-tooltip>
      <department-picker
        :value="showDepartmentPicker"
        @update-department="updateDepartment"
        @close="showDepartmentPicker = false"
      />

      <v-text-field
        slot="extension"
        v-model="searchText"
        type="text"
        value=""
        prepend-icon="search"
        clearable
        @focus="showMenu = true"
        @input="(str) => {str === null && (searchText = '', updateList(), showMenu = false)}"
        @keyup.native="(e) => {e.key === 'Enter' && (updateList(), showMenu = false)}"
      >
      </v-text-field>
      <v-menu
        v-model="showMenu"
        absolute
        :position-x="($store.state.ui.isMobile ? 0 : 64) + 16"
        :position-y="96 + ($store.state.ui.isMobile ? 0 : 16)"
        :close-on-click="false"
        :close-on-content-click="false"
        min-width="250"
        max-width="250"
      >
        <v-card>
          <v-card-title class="pa-0">
            <v-spacer></v-spacer>
            <v-btn
              @click="showMenu = false"
              flat
              class="pr-0"
            >
              <span style="position: relative; top: -1px;">關閉搜尋方框</span>
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-0 pr-0 pl-0">
            <v-list class="pa-0">
              <v-divider />
              <v-list-tile v-for="item in searchItems" :key="item.value" @click="showMenu = false; item.action && item.action(); updateList()" ripple>
                <v-list-tile-title>
                  <span class="grey--text lighten-1">{{`搜尋${item.scope} `}}</span>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile>
              <v-divider
                v-if="abbr"
              />
            </v-list>
            <v-switch
              v-if="abbr"
              v-model="onlySearchAbbr"
              :label="`只搜尋「${getDepartmentDetail(abbr).chineseName || getDepartmentDetail(abbr).name}」`"
              hide-details
              class="pt-2 ml-3 mr-3"
            />
          </v-card-text>
        </v-card>
      </v-menu>
      <period-picker
        :value="showPeriodPicker"
        @update-periods="updatePeriods"
        @close="showPeriodPicker = false"
      />
    </v-toolbar>

    <v-container fluid pa-0 ma-0 class="list-wrapper">
      <courses-list
        :courses="courses"
        :list="list"
        :empty-text="$t('coursesList.pleaseSelect')"
        @update-preview-time="updatePreviewTime"
        @open-course-detail="openCourseDetail"
      />
    </v-container>
  </v-container>
</template>

<script>
import CoursesList from './courses-list'
import DepartmentPicker from './department-picker'
import PeriodPicker from './period-picker'

export default {
  name: 'CoursesCatalog',
  components: {
    DepartmentPicker,
    PeriodPicker,
    CoursesList
  },
  data () {
    return {
      courses: {},
      catalog: {},
      departments: {},
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
    onlySearchAbbr () {
      this.updateList()
    }
  },
  computed: {
    searchItems () {
      let searchText = this.searchText
      return [{
        type: 'suggest',
        scope: '教授',
        text: searchText,
        value: 'professor:' + searchText,
        action: () => {this.searchText = `professor:${searchText || ''}`}
      }, {
        type: 'suggest',
        scope: '課名',
        text: searchText,
        value: 'title:' + searchText,
        action: () => {this.searchText = `title:${searchText || ''}`}
      }, {
        type: 'suggest',
        scope: '代號',
        text: searchText,
        value: 'number:' + searchText,
        action: () => {this.searchText = `number:${searchText || ''}`}
      }, {
        type: 'suggest',
        scope: '全部',
        text: searchText,
        value: '' + searchText,
        action: () => {this.searchText = `${searchText || ''}`}
      }, {
        type: 'suggest',
        scope: '時段',
        text: searchText,
        value: 'period:' + searchText,
        action: () => {searchText ? this.searchText = `period:${searchText || ''}` : this.showPeriodPicker = true}
      }]
    }
  },
  methods: {
    log (...abbr) {
      console.log(...abbr)
    },
    updateList () {
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
          this.title = this.$t('common.search', [searchPeriods.join('')])
          if (searchPeriods.length === 0) {
            return
          }
          for (let courseNumber in courses) {
            let atleast = false
            let meet = true
            let course = courses[courseNumber]
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
            if (list.length > 100) {
              this.$store.commit('ui/openDialog', {
                title: '你搜尋的時段太多了',
                text: '試著找出關鍵字吧。'
              })
              break
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
            if (course.professor.toLowerCase().includes(searchProfessor)) {
              list.push({
                number: courseNumber
              })
              if (list.length > 100) {
                this.$store.commit('ui/openDialog', {
                  title: '你搜尋的範圍太大了',
                  text: '試著找出關鍵字吧。'
                })
                break
              }
            }
          }
        } else if (searchText.startsWith('title:')) {
          let searchTitle = searchText.slice('title:'.length)
          if (searchTitle === '') {
            return
          }
          this.title = this.$t('common.search', searchText)
          for (let courseNumber in courses) {
            let course = courses[courseNumber]
            if (course.title && course.title.toLowerCase().includes(searchTitle)) {
              list.push({
                number: courseNumber
              })
              if (list.length > 100) {
                this.$store.commit('ui/openDialog', {
                  title: '你搜尋的範圍太大了',
                  text: '試著找出關鍵字吧。'
                })
                break
              }
            }
          }
        } else if (searchText.startsWith('number:')) {
          let searchNumber = searchText.slice('number:'.length)
          if (searchNumber === '') {
            return
          }
          this.title = this.$t('common.search', searchText)
          for (let courseNumber in courses) {
            let course = courses[courseNumber]
            if (course.number.toLowerCase().includes(searchNumber)) {
              list.push({
                number: courseNumber
              })
              if (list.length > 100) {
                this.$store.commit('ui/openDialog', {
                  title: '你搜尋的範圍太大了',
                  text: '試著找出關鍵字吧。'
                })
                break
              }
            }
          }
        } else {
          this.title = this.$t('common.search', searchText)
          for (let courseNumber in courses) {
            let course = courses[courseNumber]
            if (course.number.toLowerCase().includes(searchText) ||
              course.title.toLowerCase().includes(searchText) ||
              course.professor.toLowerCase().includes(searchText) ||
              course.memo.toLowerCase().includes(searchText) ||
              course.time.toLowerCase().includes(searchText) ||
              course.room.toLowerCase().includes(searchText)
            ) {
              list.push({
                number: courseNumber
              })
            }
            if (list.length > 100) {
              this.$store.commit('ui/openDialog', {
                title: '你搜尋的範圍太大了',
                text: '試著找出關鍵字吧。'
              })
              break
            }
          }
        }
      } else if (abbr) {
        this.title = this.getDepartmentDetail(abbr).chineseName || this.getDepartmentDetail(abbr).name

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
    updateDepartment (abbr) {
      this.abbr = abbr
      this.updateList()
    },
    updatePeriods (periods) {
      this.searchPeriods = periods
      this.searchText = 'period:' + periods.join('')
      this.updateList()
    },
    getDepartmentDetail (abbr) {
      if (abbr.length <= 4 && (abbr in this.departments)) {
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
    updatePreviewTime (number) {
      this.$emit('update-preview-time', number)
    },
    openCourseDetail (courseNumber) {
      this.$emit('open-course-detail', courseNumber)
    }
  },
  mounted () {
    this.courses = this.$store.state.selectCourses.courses
    this.catalog = this.$store.state.selectCourses.catalog
    this.departments = this.$store.state.selectCourses.departments
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
