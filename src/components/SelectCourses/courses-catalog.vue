<template>
  <v-container fluid pa-0 ma-0 class="courses-catalog">
    <v-toolbar dense extended>
      <v-toolbar-title>
        {{ title || $t('coursesList.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <choose-department
        @update-department="updateDepartment"
      ></choose-department>

      <v-text-field
        slot="extension"
        v-model="searchText"
        type="text"
        value=""
        prepend-icon="search"
        clearable
      ></v-text-field>
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
import CoursesList from './courses-list'
import ChooseDepartment from './choose-department'

export default {
  name: 'CoursesCatalog',
  components: {
    ChooseDepartment,
    CoursesList
  },
  data () {
    return {
      courses: {},
      catalog: {},
      departments: {},
      searchText: '',
      abbr: '',
      title: ''
    }
  },
  computed: {
    list () {
      let list = []
      let searchText = this.searchText
      let abbr = this.abbr
      
      if (searchText) {
        this.title = this.$t('common.search').replace('{0}', searchText)
        for (let courseNumber in this.courses) {
          let course = this.courses[courseNumber]
          if (course.number.includes(searchText) ||
            course.title.includes(searchText) ||
            course.professor.includes(searchText) ||
            course.memo.includes(searchText) ||
            course.time.includes(searchText) ||
            course.room.includes(searchText)
          ) {
            list.push({
              number: courseNumber
            })
          }
          if (list.length > 20) {
            /*
            this.$store.commit('ui/openDialog', {
              title: '你搜尋的範圍太廣了',
              text: '試著找出關鍵字吧。'
            })
            */
            break
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

      return list
    }
  },
  methods: {
    updateDepartment (abbr) {
      this.abbr = abbr
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
