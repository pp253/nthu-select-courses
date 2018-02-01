<template>
  <v-container pa-0 ma-0 class="courses-catalog">
    <v-toolbar dense extended>
      <v-toolbar-title>
        {{ departmentName || $t('coursesList.title') }}
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
      departmentName: ''
    }
  },
  computed: {
    list () {
      let abbr = this.abbr
      let list = []

      if (abbr === '') {
        this.departmentName = ''
      } else {
        this.departmentName = this.getDepartmentDetail(abbr).chineseName || this.getDepartmentDetail(abbr).name

        if (abbr in this.catalog) {
          for (let courseNumber of this.catalog[abbr]) {
            list.push({
              number: courseNumber
            })
          }
        }
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
  }
}
</style>
