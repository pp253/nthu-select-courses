<!-- eslint-disable vue/valid-v-on -->

<template>
  <v-list class="courses-list"
          ripple
          id="courses-list">
    <slot name="header"></slot>

    <v-subheader v-if="list && moreThanOnePage"
                 class="mb-3">
      {{ $t('SelectCourses.coursesList.pages', [list.length, page, getPage(list.length)]) }}
    </v-subheader>

    <template v-if="list && list.length > 0"
              v-for="(course, index) in adjustedList">
      <v-subheader v-if="course.header"
                   :key="course.header"
                   class="pr-0">
        {{ $t(course.header) }}</v-subheader>
      <v-subheader v-if="course.orderable"
                   :key="course.header + '-btn'">
        <v-dialog v-if="course.orderable"
                  v-model="course.dialog"
                  persistent
                  :fullscreen="$store.state.ui.isMobile"
                  max-width="500"
                  scrollable
                  style="width: 100%;">
          <v-btn outline
                 block
                 slot="activator"
                 v-t="'SelectCourses.coursesList.editOrder'"></v-btn>
          <v-card class="dialog-full-scrollable">
            <v-card-title class="headline"
                          v-t="'SelectCourses.coursesList.editOrder'"></v-card-title>
            <v-card-text class="fill-height">
              <v-list subheader>
                <draggable v-model="course.newOrder"
                           :options="{handle:'.drag-handle'}">
                  <template v-for="element in course.newOrder">
                    <v-list-tile avatar
                                 :key="'drag-' + element.number">
                      <v-list-tile-action class="grey--text lighten-1">
                        {{ $t('SelectCourses.coursesList.order', [element.order]) }}
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ courses[element.number].title }}</v-list-tile-title>
                        <v-list-tile-sub-title>{{ courses[element.number].professor }} {{ courses[element.number].time }}</v-list-tile-sub-title>
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
              <v-btn @click.native="cancelEditOrder(course)"
                     flat
                     v-t="'dialog.Cancel'"></v-btn>
              <v-btn @click.native="editOrder(course)"
                     color="primary"
                     flat
                     v-t="'dialog.Apply'"></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-subheader>

      <v-list-tile v-if="(course.number) in courses"
                   ripple
                   @click=""
                   :key="course.number"
                   :title="`${courses[course.number].title} ${courses[course.number].time}\n${courses[course.number].professor} ${course.number}\n${courses[course.number].room}`"
                   @mouseover="updatePreviewTime(courses[course.number].time || course.number)"
                   @mouseleave="updatePreviewTime('')"
                   @dblclick="openCourseDetail(course.number)">
        <v-list-tile-content>
          <v-list-tile-title>
            <span v-if="courses[course.number].canceled"
                  class="course-tag">停開</span>
            <!--
            <span v-if="courses[course.number].required"
                  class="course-tag">{{ courses[course.number].required }}</span> -->
            {{ courses[course.number].title }}
          </v-list-tile-title>
          <v-list-tile-sub-title class="grey--text text--darken-4">{{ $t('SelectCourses.coursesList.courseSub', [ courses[course.number].professor, courses[course.number].number ]) }}
          </v-list-tile-sub-title>
          <v-list-tile-sub-title class="detail">{{ $t('SelectCourses.coursesList.courseDetail', [ courses[course.number].credit, courses[course.number].size_limit, courses[course.number].previous_size || '-', courses[course.number].room ]) }}
          </v-list-tile-sub-title>
          <v-list-tile-sub-title class="memo">{{ courses[course.number].memo || ' ' }}</v-list-tile-sub-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-list-tile-action-text>{{ courses[course.number].time }}</v-list-tile-action-text>
          <div class="text-xs-center">
            <v-menu top
                    left
                    lazy>
              <v-btn icon
                     slot="activator">
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile v-if="isCurrentSemester(course.number) && (addOrDropPhase || selectionPhase) && !courses[course.number].canceled"
                             @click="isCourseSelected(course.number) ? quitCourse(course.number) : addCourse(course.number)"
                             ripple>{{ isCourseSelected(course.number) ? $t('SelectCourses.action.quitCourse') : $t('SelectCourses.action.addCourse') }}</v-list-tile>
                <v-list-tile v-if="addOrDropPhase && !courses[course.number].canceled"
                             @click="isCourseSelected(course.number) ? quitCourse(course.number) : addCourse(course.number)"
                             ripple>{{ isCourseSelected(course.number) ? $t('SelectCourses.action.addLimitedCourse') : $t('SelectCourses.action.printLimitedCourseForm') }}</v-list-tile>
                <!--
                <v-list-tile
                  @click="store.user.favoriteCourses.indexOf(course.number) === -1 ? addFavorite(course.number) : removeFavorite(course.number)"
                  ripple
                >{{ store.user.favoriteCourses.indexOf(course.number) === -1 ? $t('SelectCourses.action.addFavorite') : $t('SelectCourses.action.removeFavorite') }}</v-list-tile>
                -->
                <v-list-tile @click="openCourseDetail(course.number)"
                             ripple>{{ $t('SelectCourses.coursesList.detail') }}</v-list-tile>
              </v-list>
            </v-menu>
          </div>
        </v-list-tile-action>
      </v-list-tile>
      <v-divider v-if="courses[course.number] && index < adjustedList.length - 1"
                 :key="course.number + '-divider'"></v-divider>
    </template>

    <div v-if="list && moreThanOnePage"
         class="text-xs-center mt-3">
      <v-container v-if="page < getPage(list.length)">
        <v-btn block
               @click="page++"
               color="white">下一頁</v-btn>
      </v-container>
      <v-pagination :length="getPage(list.length)"
                    v-model="page"
                    :total-visible="4"></v-pagination>
    </div>

    <div v-if="list && list.length === 0"
         class="text-xs-center pt-5"
         v-t="emptyText"></div>
  </v-list>
</template>

<script>
import {
  VList,
  VListTile,
  VListTileAvatar,
  VListTileActionText,
  VListTileSubTitle,
  VListTileAction,
  VListTileTitle,
  VListTileContent,
  VPagination,
  VIcon,
  VDialog,
  VBtn,
  VMenu
} from 'vuetify/lib'
import draggable from 'vuedraggable'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'CoursesList',
  components: {
    draggable,
    VList,
    VListTile,
    VListTileAvatar,
    VListTileActionText,
    VListTileSubTitle,
    VListTileAction,
    VListTileTitle,
    VListTileContent,
    VPagination,
    VIcon,
    VDialog,
    VBtn,
    VMenu
  },
  props: {
    list: Array,
    courses: Object,
    'empty-text': {
      default: 'SelectCourses.coursesList.emptyText'
    },
    result: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      page: 1,
      coursesPerPage: 20,
      resultList: []
    }
  },
  watch: {
    list() {
      this.page = 1
    }
  },
  computed: {
    ...mapState('selectCourses', [
      'selectionPhase',
      'addOrDropPhase',
      'withdrawalPhase',
      'currentSemester',
      'currentSelectedCourses'
    ]),
    ...mapGetters('selectCourses', ['isCurrentSemester', 'isCourseSelected']),
    moreThanOnePage() {
      return !this.result && this.list && this.list.length > this.coursesPerPage
    },
    adjustedList() {
      this.$emit('update-page', this.page)

      if (!this.list) {
        return []
      }

      if (!this.result) {
        let start = (this.page - 1) * this.coursesPerPage
        return this.list.slice(start, start + this.coursesPerPage)
      }

      let randomCoursesSet = {}
      for (let course of this.list) {
        if (!course.status) {
          console.error('Course should have course status.', course)
          continue
        }
        if (!(course.status in randomCoursesSet)) {
          randomCoursesSet[course.status] = []
        }
        if (course.status === 2) {
          if (!course.status) {
            console.error('Course should have course orderCatalog.', course)
            continue
          }
          if (!(course.orderCatalog in randomCoursesSet[course.status])) {
            randomCoursesSet[course.status][course.orderCatalog] = []
          }
          randomCoursesSet[course.status][course.orderCatalog].push(course)
        } else {
          randomCoursesSet[course.status].push(course)
        }
      }

      this.resultList = []
      let sorting = (courseA, courseB) => {
        return courseA.order - courseB.order
      }
      let randomCoursesFilteringConfig = [
        {
          header: '通識、體育志願（待亂數）',
          status: 2,
          orderable: true,
          includesCatalogs: ['通', '體']
        },
        {
          header: '大學中文志願（待亂數）',
          status: 2,
          orderable: true,
          includesCatalogs: ['中']
        },
        {
          header: 'SelectCourses.coursesList.waitingForRandomTitle',
          status: 2,
          orderable: false
        },
        {
          header: '已選上',
          status: 1
        },
        {
          header: '未選上',
          status: 0
        }
      ]
      for (let item of randomCoursesFilteringConfig) {
        if (!(item.status in randomCoursesSet)) {
          continue
        }
        if (item.status === 2) {
          if (item.orderable === true) {
            let list = []
            for (let catalog of item.includesCatalogs) {
              if (!(catalog in randomCoursesSet[item.status])) {
                continue
              }
              list = list.concat(randomCoursesSet[item.status][catalog])
            }
            if (list.length === 0) {
              continue
            }
            list.sort(sorting)
            this.resultList.push({
              header: item.header,
              newOrder: list,
              oldOrder: item.orderable && list.slice(0),
              dialog: false,
              orderable: item.orderable
            })
            this.resultList = this.resultList.concat(list)
          } else if ('' in randomCoursesSet[item.status]) {
            this.resultList.push({
              header: item.header
            })
            this.resultList = this.resultList.concat(
              randomCoursesSet[item.status]['']
            )
          }
        } else if (item.status in randomCoursesSet) {
          this.resultList.push({
            header: item.header
          })
          this.resultList = this.resultList.concat(
            randomCoursesSet[item.status]
          )
        }
      }

      return this.resultList
    }
  },
  methods: {
    getPage(index) {
      return parseInt((index - 1) / this.coursesPerPage) + 1
    },
    addCourse(courseNumber) {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch('ui/openRequestDialog', {
            title: `確定加選「${this.courses[courseNumber].title}」嗎？`,
            text: this.courses[courseNumber].memo,
            mode: 'request'
          })
          .then(result => {
            if (result) {
              this.$store.commit('ui/START_LOADING')
              let order = ''
              if (
                this.courses[courseNumber].random !== 0 &&
                this.currentSelectedCourses
              ) {
                order =
                  this.currentSelectedCourses.filter(course => {
                    return (
                      course.status &&
                      course.status === 2 &&
                      this.courses[course.number].random ===
                        this.courses[courseNumber].random
                    )
                  }).length + 1
              }

              this.$store
                .dispatch('selectCourses/addCourse', {
                  courseNumber: courseNumber,
                  order: order
                })
                .then(data => {
                  this.$store.commit('ui/STOP_LOADING')
                  this.$store.dispatch('ui/openSnackbar', {
                    snackbarText: this.$t('SelectCourses.action.addSuccess', [
                      this.courses[courseNumber].title
                    ])
                  })
                  resolve(data)
                })
                .catch(err => {
                  this.$store.commit('ui/STOP_LOADING')
                  reject(err)
                })
            }
          })
      })
    },
    quitCourse(courseNumber) {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch('ui/openRequestDialog', {
            title: `確定退選「${this.courses[courseNumber].title}」嗎？`,
            text: '此動作無法還原。',
            mode: 'request'
          })
          .then(result => {
            if (result) {
              this.$store.commit('ui/START_LOADING')
              this.$store
                .dispatch('selectCourses/quitCourse', {
                  courseNumber: courseNumber
                })
                .then(data => {
                  this.$store.commit('ui/STOP_LOADING')
                  this.$store.dispatch('ui/openSnackbar', {
                    snackbarText: this.$t('SelectCourses.action.quitSuccess', [
                      this.courses[courseNumber].title
                    ])
                  })
                  resolve(data)
                })
                .catch(err => {
                  this.$store.commit('ui/STOP_LOADING')
                  reject(err)
                })
            }
          })
      })
    },
    // eslint-disable-next-line
    addFavorite(number) {
      // this.store.addFavorateCourses(number)
    },
    // eslint-disable-next-line
    removeFavorite(number) {
      // this.store.removeFavorateCourses(number)
    },
    updatePreviewTime(number) {
      this.$emit('update-preview-time', number)
    },
    openCourseDetail(courseNumber) {
      this.$emit('open-course-detail', courseNumber)
    },
    editOrder(category) {
      this.$store.commit('ui/START_LOADING')
      this.$store
        .dispatch('selectCourses/editOrder', {
          newOrder: category.newOrder,
          oldOrder: category.oldOrder
        })
        .then(() => {
          category.dialog = false
          this.$store.dispatch('ui/openSnackbar', {
            snackbarText: this.$t('SelectCourses.action.editOrderSuccess')
          })
          this.$store.commit('ui/STOP_LOADING')
        })
        .catch(err => {
          console.error(err)
          this.$store.commit('ui/STOP_LOADING')
        })
    },
    cancelEditOrder(category) {
      category.newOrder.splice(0, category.newOrder.length)
      for (let order of category.oldOrder) {
        category.newOrder.push(order)
      }
      category.dialog = false
    }
  }
}
</script>

<style lang="scss">
.courses-list {
  min-height: 100%;
  padding-bottom: 64px;

  .v-list__tile {
    height: 88px + 16px !important;

    .v-list__tile__action-text {
      font-size: 16px;
    }

    .memo {
      // text-overflow: ellipsis;
      white-space: nowrap;
      min-height: 21.5px;
    }
  }

  .course-tag {
    background-color: rgba(244, 64, 51, 0.05);
    border-radius: 3px;
    color: #f44336;
    margin-right: 3px;
    padding-left: 2px;
    padding-right: 2px;
  }
}
</style>
