<template>
  <div :class="'courses-list full-height' + (!list ? ' extended' : '')">
    <v-toolbar dense :extended="!list">
      <v-toolbar-title>
        {{ (departmentName ? departmentName : title) }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <choose-department
        v-if="!list"
        @update-department="updateCourses"
      ></choose-department>
      <div slot="extension" v-if="!list" class="search-box">
        <v-text-field
          v-model="searchText"
          type="text"
          value=""
          prepend-icon="search"
          clearable
        ></v-text-field>
      </div>
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
            :fullscreen="store.isMobile"
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
                          {{ store.courses[element.number].title }}
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
          v-if="store.courses[course.number]"
          ripple
          @click=""
          :key="course.number"
          @mouseover="updatePreviewTime(course.number)"
          @mouseleave="updatePreviewTime('')"
          @dblclick="store.openCourseDetail(course.number)"
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ store.courses[course.number].title }}</v-list-tile-title>
            <v-list-tile-sub-title class="grey--text text--darken-4">{{
              $t('coursesList.courseSub')
              .replace('{0}', store.courses[course.number].number)
              .replace('{1}', store.courses[course.number].professor)
            }}</v-list-tile-sub-title>
            <v-list-tile-sub-title class="detail">{{
              $t('coursesList.courseDetail')
              .replace('{0}', store.courses[course.number].credit)
              .replace('{1}', store.courses[course.number].size_limit)
              .replace('{2}', store.courses[course.number].previous_size)
              .replace('{3}', store.courses[course.number].room)
            }}</v-list-tile-sub-title>
            <v-list-tile-sub-title class="memo">{{ store.courses[course.number].memo || ' ' }}</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-list-tile-action-text>{{ store.courses[course.number].time }}</v-list-tile-action-text>
            <div class="text-xs-center">
              <v-menu offset-y left>
                <v-btn icon slot="activator">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile
                    ripple
                    @click="store.courseSelected(course.number) ? store.quitCourseAuto(course.number) : store.addCourseAuto(course.number)"
                  >{{ store.courseSelected(course.number) ? $t('action.quitCourse') : $t('action.addCourse') }}</v-list-tile>
                  <v-list-tile
                    ripple
                    @click="store.user.favoriteCourses.indexOf(course.number) === -1 ? addFavorite(course.number) : removeFavorite(course.number)"
                  >{{ store.user.favoriteCourses.indexOf(course.number) === -1 ? $t('action.addFavorite') : $t('action.removeFavorite') }}</v-list-tile>
                  <v-list-tile
                    ripple
                    @click="store.openCourseDetail(course.number)"
                  >{{ $t('coursesList.detail') }}</v-list-tile>
                </v-list>
              </v-menu>
            </div>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider
          v-if="store.courses[course.number] && index < coursesList.length - 1"
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
import store from '../lib/store'

export default {
  name: 'CoursesList',
  props: {
    'title': String,
    list: Array,
    'empty-text': {
      default: '您還沒有加入的課程歐！'
    }
  },
  data () {
    return {
      store: store,
      coursesList: [],
      departmentName: '',
      searchText: '',
      abbr: ''
    }
  },
  watch: {
    list (newVal, oldVal) {
      this.updateList()
    },
    searchText (newVal) {
      setTimeout(() => {
        if (this.searchText !== null && newVal !== '' && newVal === this.searchText) {
          this.store.ui.common.loading = true
          this.coursesList.splice(0, this.coursesList.length)
          for (let courseNumber in this.store.courses) {
            let course = this.store.courses[courseNumber]
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
            if (this.coursesList.length > 100) {
              this.store.ui.common.dialog = true
              this.store.ui.common.dialogTitle = '你搜尋的範圍太廣了'
              this.store.ui.common.dialogText = '試著找出關鍵字吧。'
              break
            }
          }
          this.departmentName = this.$t('common.search').replace('{0}', this.searchText)
          this.store.ui.common.loading = false
        } else if (this.searchText === null) {
          this.updateCourses(this.abbr)
        }
      }, 1000)
    }
  },
  methods: {
    updateList () {
      this.coursesList.splice(0, this.coursesList.length)

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
        return course.status && course.status === 2 && this.store.courses[course.number].random === 20
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
        return course.status && course.status === 2 && this.store.courses[course.number].random === 5
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
    updateCourses (abbr) {
      this.abbr = abbr

      if (abbr === '') {
        this.departmentName = this.title
        this.coursesList.splice(0, this.coursesList.length)
        return []
      } else {
        this.departmentName = this.store.getDepartmentDetail(abbr).chineseName || this.store.getDepartmentDetail(abbr).name

        this.coursesList.splice(0, this.coursesList.length)
        for (let courseNumber of this.store.getCourses(abbr)) {
          this.coursesList.push({
            number: courseNumber
          })
        }
        return this.coursesList
      }
    },
    addFavorite (number) {
      this.store.addFavorateCourses(number)
    },
    removeFavorite (number) {
      this.store.removeFavorateCourses(number)
    },
    updatePreviewTime (number) {
      this.$emit('update-preview-time', number)
    },
    editOrder (catagory) {
      this.store.ui.common.loading = true
      this.store.editOrder(catagory.newOrder, catagory.oldOrder)
      .then((data) => {
        catagory.dialog = false
      this.store.ui.common.loading = false
      })
    },
    cancelEditOrder (catagory) {
      catagory.newOrder.splice(0, catagory.newOrder.length)
      for (let order of catagory.oldOrder) {
        catagory.newOrder.push(order)
      }
      catagory.dialog = false
    }
  },
  mounted () {
    if (this.list) {
      this.updateList()
    }
  }
}
</script>

<style lang="scss">
.courses-list {
  .search-box {
    width: calc(100% - 32px);
  }

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
