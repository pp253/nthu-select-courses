<template>
  <div :class="'courses-list full-height' + (!list ? ' extended' : '')">
    <v-toolbar dense :extended="!list">
      <v-menu :nudge-width="100">
        <v-toolbar-title slot="activator">
          {{ (departmentName ? departmentName : title) }}
          <v-icon>arrow_drop_down</v-icon>
        </v-toolbar-title>
        <v-list>
          <v-list-tile
            v-if="list"
            v-for="item in availableSelectionResult"
            :key="item.value"
            ripple
          >
            <v-list-tile-title v-text="item.text"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <v-spacer></v-spacer>
      <choose-department
        v-if="!list"
        @update-department="updateCourses"
      ></choose-department>

      <v-text-field
        slot="extension"
        v-if="!list"
        v-model="searchText"
        type="text"
        value=""
        prepend-icon="search"
        clearable
      ></v-text-field>
    </v-toolbar>

    <v-list
      ripple
    >
      <template
        v-if="coursesList.length > 0"
        v-for="(course, index) in coursesList"
      >
        <v-subheader
          v-if="course.type === 'subheader'"
          :key="course.title"
          class="pr-0"
        >
          {{ course.title }}
          <v-spacer></v-spacer>
          <v-dialog
            v-if="course.orderable"
            v-model="course.dialog"
            persistent
            :fullscreen="$store.state.ui.isMobile"
            max-width="350"
            scrollable
          >
            <v-btn
              color="primary"
              dark
              slot="activator"
              v-text="$t('coursesList.editOrder')"
            ></v-btn>
            <v-card>
              <v-card-title
                class="headline"
                v-text="$t('coursesList.editOrder')"
              ></v-card-title>
              <v-card-text>
                <v-list>
                  <draggable v-model="course.newOrder" :options="{handle:'.drag-handle'}">
                    <template
                      v-for="(element, idx) in course.newOrder"
                    >
                      <v-list-tile
                        avatar
                        :key="'drag-' + element.number"
                      >
                        <v-list-tile-action class="grey--text lighten-1">
                          {{ $t('coursesList.order').replace('{0}', idx + 1) }}
                        </v-list-tile-action>
                        <v-list-tile-content>
                          {{ courses[element.number].title }}
                        </v-list-tile-content>
                        <v-list-tile-avatar class="drag-handle">
                          <v-icon>drag_handle</v-icon>
                        </v-list-tile-avatar>
                      </v-list-tile>
                    </template>
                  </draggable>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  @click.native="cancelEditOrder(course)"
                  flat
                  v-text="$t('dialog.Cancel')"
                ></v-btn>
                <v-btn
                  @click.native="editOrder(course)"
                  flat
                  v-text="$t('dialog.Apply')"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-subheader>

        <v-list-tile
          v-if="courses[course.number]"
          ripple
          @click=""
          :key="course.number"
          @mouseover="updatePreviewTime(course.number)"
          @mouseleave="updatePreviewTime('')"
          @dblclick="openCourseDetail(course.number)"
        >
          <v-list-tile-content>
            <v-list-tile-title>
              <span
                v-if="courses[course.number].canceled"
                class="red--text"
              >停開</span>
              {{ courses[course.number].title }}
            </v-list-tile-title>
            <v-list-tile-sub-title class="grey--text text--darken-4">{{
              $t('coursesList.courseSub')
              .replace('{0}', courses[course.number].number)
              .replace('{1}', courses[course.number].professor)
            }}</v-list-tile-sub-title>
            <v-list-tile-sub-title class="detail">{{
              $t('coursesList.courseDetail')
              .replace('{0}', courses[course.number].credit)
              .replace('{1}', courses[course.number].size_limit)
              .replace('{2}', courses[course.number].previous_size)
              .replace('{3}', courses[course.number].room)
            }}</v-list-tile-sub-title>
            <v-list-tile-sub-title class="memo">{{ courses[course.number].memo || ' ' }}</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-list-tile-action-text>{{ courses[course.number].time }}</v-list-tile-action-text>
            <div class="text-xs-center">
              <v-menu offset-y left>
                <v-btn icon slot="activator">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile
                    v-if="!courses[course.number].canceled"
                    @click="isCourseSelected(course.number) ? quitCourse(course.number) : addCourse(course.number)"
                    ripple
                  >{{ isCourseSelected(course.number) ? $t('action.quitCourse') : $t('action.addCourse') }}</v-list-tile>
                  <!--
                  <v-list-tile
                    @click="store.user.favoriteCourses.indexOf(course.number) === -1 ? addFavorite(course.number) : removeFavorite(course.number)"
                    ripple
                  >{{ store.user.favoriteCourses.indexOf(course.number) === -1 ? $t('action.addFavorite') : $t('action.removeFavorite') }}</v-list-tile>
                  -->
                  <v-list-tile
                    @click="openCourseDetail(course.number)"
                    ripple
                  >{{ $t('coursesList.detail') }}</v-list-tile>
                </v-list>
              </v-menu>
            </div>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider
          v-if="courses[course.number] && index < coursesList.length - 1"
          :key="course.number + '-divider'"
        ></v-divider>
      </template>

      <div
        v-if="coursesList.length === 0"
        class="text-xs-center pt-5"
      >{{ emptyText }}</div>
    </v-list>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'CoursesList',
  components: {
    draggable
  },
  props: {
    'title': String,
    list: Array,
    'empty-text': {
      default: '您還沒有加入的課程歐！'
    },
    'courses-db': Object
  },
  data () {
    return {
      coursesList: [],
      departmentName: '',
      searchText: '',
      abbr: '',
      courses: {}
    }
  },
  watch: {
    list (newVal, oldVal) {
      this.updateList()
    },
    searchText (newVal) {
      setTimeout(() => {
        if (this.searchText !== null && newVal !== '' && newVal === this.searchText) {
          this.$store.commit('ui/startLoading')
          this.coursesList = []
          for (let courseNumber in this.courses) {
            let course = this.courses[courseNumber]
            if (course.number.includes(newVal) ||
              course.title.includes(newVal) ||
              course.professor.includes(newVal) ||
              course.memo.includes(newVal) ||
              course.time.includes(newVal) ||
              course.room.includes(newVal)
            ) {
              this.coursesList.push({
                number: courseNumber
              })
            }
            if (this.coursesList.length > 30) {
              this.$store.commit('ui/openDialog', {
                title: '你搜尋的範圍太廣了',
                text: '試著找出關鍵字吧。'
              })
              break
            }
          }
          this.departmentName = this.$t('common.search').replace('{0}', this.searchText)
          this.$store.commit('ui/stopLoading')
        } else if (this.searchText === null) {
          this.updateCourses(this.abbr)
        }
      }, 1000)
    }
  },
  computed: {
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
    updateList () {
      this.coursesList = []

      if (!this.list) {
        return
      }
      
      // 待亂數
      let waitingForRandomCoursesList = this.list.filter((course) => {
        return course.status && course.status === 2 && !['通', '體', '中'].includes(course.orderCatalog)
      })
      if (waitingForRandomCoursesList.length > 0) {
        this.coursesList.push({
          type: 'subheader',
          title: this.$t('coursesList.waitingForRandomTitle'),
          newOrder: waitingForRandomCoursesList,
          oldOrder: waitingForRandomCoursesList.slice(0, waitingForRandomCoursesList.length),
          dialog: false,
          orderable: false
        })
        for (let course of waitingForRandomCoursesList) {
          this.coursesList.push(course)
        }
      }
      
      // 通識、體育志願（待亂數）
      let waitingForRandomGePeCoursesList = this.list.filter((course) => {
        return course.status && course.status === 2 && this.courses[course.number].random === 20
      }).sort((courseA, courseB) => {
        return courseA.order - courseB.order
      })
      if (waitingForRandomGePeCoursesList.length > 0) {
        this.coursesList.push({
          type: 'subheader',
          title: '通識、體育志願（待亂數）',
          newOrder: waitingForRandomGePeCoursesList,
          oldOrder: waitingForRandomGePeCoursesList.slice(0, waitingForRandomGePeCoursesList.length),
          dialog: false,
          orderable: true
        })
        for (let course of waitingForRandomGePeCoursesList) {
          this.coursesList.push(course)
        }
      }
      
      // 大學中文志願（待亂數）
      let waitingForRandomCLCoursesList = this.list.filter((course) => {
        return course.status && course.status === 2 && this.courses[course.number].random === 5
      }).sort((courseA, courseB) => {
        return courseA.order - courseB.order
      })
      if (waitingForRandomCLCoursesList.length > 0) {
        this.coursesList.push({
          type: 'subheader',
          title: '大學中文志願（待亂數）',
          newOrder: waitingForRandomCLCoursesList,
          oldOrder: waitingForRandomCLCoursesList.slice(0, waitingForRandomCLCoursesList.length),
          dialog: false,
          orderable: true
        })
        for (let course of waitingForRandomCLCoursesList) {
          this.coursesList.push(course)
        }
      }
      
      // 已選上
      let addedCourses = this.list.filter((course) => {
        return course.status && course.status === 1
      })
      if (addedCourses.length > 0) {
        this.coursesList.push({
          type: 'subheader',
          title: '已選上',
          newOrder: addedCourses,
          oldOrder: addedCourses.slice(0, addedCourses.length),
          dialog: false,
          orderable: false
        })
        for (let course of addedCourses) {
          this.coursesList.push(course)
        }
      }
    },
    getDepartmentDetail (abbr) {
      let departments = this.$store.state.selectCourses.departments
      if (abbr.length <= 4 && (abbr in departments)) {
        // Department
        return departments[abbr]
      } else {
        // Class
        for (let deptAbbr in departments) {
          for (let cls of departments[deptAbbr].classes) {
            if (cls.abbr === abbr) {
              return cls
            }
          }
        }
      }
    },
    updateCourses (abbr) {
      this.abbr = abbr

      if (abbr === '') {
        this.departmentName = this.title
        this.coursesList = []
      } else {
        this.departmentName = this.getDepartmentDetail(abbr).chineseName || this.getDepartmentDetail(abbr).name

        this.coursesList = []
        if (abbr in this.$store.state.selectCourses.catalog) {
          for (let courseNumber of this.$store.state.selectCourses.catalog[abbr]) {
            this.coursesList.push({
              number: courseNumber
            })
          }
        }
      }
    },
    addFavorite (number) {
      // this.store.addFavorateCourses(number)
    },
    removeFavorite (number) {
      // this.store.removeFavorateCourses(number)
    },
    updatePreviewTime (number) {
      this.$emit('update-preview-time', number)
    },
    editOrder (catagory) {
      this.$store.commit('ui/startLoading')
      this.$store.dispatch('selectCourses/editOrder', {
        newOrder: catagory.newOrder,
        oldOrder: catagory.oldOrder
      })
      .then((data) => {
        catagory.dialog = false
        this.$store.commit('ui/stopLoading')
      })
    },
    cancelEditOrder (catagory) {
      catagory.newOrder.splice(0, catagory.newOrder.length)
      for (let order of catagory.oldOrder) {
        catagory.newOrder.push(order)
      }
      catagory.dialog = false
    },
    openCourseDetail (courseNumber) {
      this.$emit('open-course-detail', courseNumber)
    },
    isCourseSelected (courseNumber) {
      return (this.$store.state.selectCourses.currentSelectedCourses.find((course) => {
        return course.number === courseNumber
      }) !== undefined)
    }
  },
  mounted () {
    if (this.list) {
      this.updateList()
    }
    if (this.coursesDb) {
      this.courses = this.coursesDb
    } else {
      this.courses = this.$store.state.selectCourses.courses
    }
  }
}
</script>

<style lang="scss">
.courses-list {
  .list {
    height: calc(100% - 48px);
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 64px;
    z-index: -100;

    .list__tile {
      height: 88px + 16px !important;

      .list__tile__action-text {
        font-size: 16px;
      }
    }

    .memo {
      // text-overflow: ellipsis;
      white-space: nowrap;
      min-height: 21.5px;
    }
  }
}

.courses-list.extended {
  .list {
    height: calc(100% - 96px);
  }
}
</style>
