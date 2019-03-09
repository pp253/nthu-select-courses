<!-- eslint-disable vue/valid-v-on -->

<template>
  <v-list
    class="courses-list"
    ripple
    id="courses-list"
    style="transform: translateZ(0);"
  >
    <slot name="header"></slot>

    <v-subheader v-if="list && moreThanOnePage" class="mb-3">
      {{
        $t('SelectCourses.coursesList.pages', [
          list.length,
          page,
          getPage(list.length)
        ])
      }}
    </v-subheader>
    <template v-if="list && list.length > 0">
      <template v-for="(course, index) in adjustedList">
        <v-subheader v-if="course.header" :key="course.header" class="pr-0">
          {{ $t(course.header) }}</v-subheader
        >
        <v-subheader v-if="course.orderable" :key="course.header + '-btn'">
          <v-dialog
            v-if="course.orderable"
            v-model="course.dialog"
            persistent
            :fullscreen="$store.state.ui.isMobile"
            max-width="500"
            scrollable
            style="width: 100%;"
          >
            <v-btn
              slot="activator"
              outline
              block
              v-t="'SelectCourses.coursesList.editOrder'"
            ></v-btn>
            <v-card class="dialog-full-scrollable">
              <v-card-title
                class="headline"
                v-t="'SelectCourses.coursesList.editOrder'"
              ></v-card-title>
              <v-card-text class="fill-height">
                <v-list subheader>
                  <draggable
                    v-model="course.newOrder"
                    :options="{ handle: '.drag-handle' }"
                  >
                    <template v-for="element in course.newOrder">
                      <v-list-tile avatar :key="'drag-' + element.number">
                        <v-list-tile-action class="grey--text lighten-1">
                          {{
                            $t('SelectCourses.coursesList.order', [
                              element.order
                            ])
                          }}
                        </v-list-tile-action>
                        <v-list-tile-content>
                          <v-list-tile-title>{{
                            courses[element.number].title
                          }}</v-list-tile-title>
                          <v-list-tile-sub-title
                            >{{
                              toReadableProfessor(
                                courses[element.number].professor
                              )
                            }}
                            {{
                              courses[element.number].time
                            }}</v-list-tile-sub-title
                          >
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
                  v-t="'dialog.Cancel'"
                ></v-btn>
                <v-btn
                  @click.native="editOrder(course)"
                  color="primary"
                  flat
                  v-t="'dialog.Apply'"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-subheader>

        <v-list-tile
          v-if="course.number in courses"
          ripple
          :key="course.number"
          :title="
            `${courses[course.number].title} ${
              courses[course.number].time
            }\n${toReadableProfessor(courses[course.number].professor)} ${
              course.number
            }\n${courses[course.number].room}`
          "
          @mouseover="
            updatePreviewTime(courses[course.number].time || course.number)
          "
          @mouseleave="updatePreviewTime('')"
          @click="openCourseDetail(course.number)"
        >
          <v-list-tile-content>
            <v-list-tile-title>
              <span v-if="courses[course.number].canceled" class="course-tag"
                >停開</span
              >
              <span
                v-if="courses[course.number].ge_degree"
                class="course-tag"
                :title="`${courses[course.number].ge_degree}`"
              >
                {{
                  $t(
                    `SelectCourses.geDegreeShort.${
                      geDegreeCode[courses[course.number].ge_degree]
                    }`
                  )
                }}
              </span>
              <!--
            <span v-if="courses[course.number].required"
                  class="course-tag">{{ courses[course.number].required }}</span> -->
              {{ courses[course.number].title }}
            </v-list-tile-title>
            <v-list-tile-sub-title class="grey--text text--darken-4"
              >{{
                $t('SelectCourses.coursesList.courseSub', [
                  toReadableProfessor(courses[course.number].professor),
                  courses[course.number].number
                ])
              }}
            </v-list-tile-sub-title>
            <v-list-tile-sub-title class="detail"
              >{{
                $t('SelectCourses.coursesList.courseDetail', [
                  courses[course.number].credit,
                  courses[course.number].size_limit,
                  courses[course.number].previous_size || '-',
                  courses[course.number].room
                ])
              }}
            </v-list-tile-sub-title>
            <v-list-tile-sub-title class="memo">{{
              courses[course.number].memo ||
                courses[course.number].course_rule ||
                ' '
            }}</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-list-tile-action-text>{{
              courses[course.number].time
            }}</v-list-tile-action-text>
            <div class="text-xs-center" @click.stop>
              <v-menu top left lazy>
                <v-btn icon slot="activator">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile
                    v-if="
                      isCurrentSemester(course.number) &&
                        (addOrDropPhase || selectionPhase) &&
                        !courses[course.number].canceled
                    "
                    @click="
                      isCourseSelected(course.number)
                        ? quitCourse(course.number)
                        : addCourse(course.number)
                    "
                    ripple
                  >
                    {{
                      isCourseSelected(course.number)
                        ? $t('SelectCourses.action.quitCourse')
                        : $t('SelectCourses.action.addCourse')
                    }}</v-list-tile
                  >
                  <v-list-tile
                    v-if="addOrDropPhase && !courses[course.number].canceled"
                    @click="
                      isCourseSelected(course.number)
                        ? quitCourse(course.number)
                        : addCourse(course.number)
                    "
                    ripple
                  >
                    {{
                      isCourseSelected(course.number)
                        ? $t('SelectCourses.action.addLimitedCourse')
                        : $t('SelectCourses.action.printLimitedCourseForm')
                    }}</v-list-tile
                  >
                  <!--
                <v-list-tile
                  @click="store.user.favoriteCourses.indexOf(course.number) === -1 ? addFavorite(course.number) : removeFavorite(course.number)"
                  ripple
                >{{ store.user.favoriteCourses.indexOf(course.number) === -1 ? $t('SelectCourses.action.addFavorite') : $t('SelectCourses.action.removeFavorite') }}</v-list-tile>
                -->
                  <v-list-tile
                    @click="openCourseDetail(course.number)"
                    ripple
                    >{{ $t('SelectCourses.coursesList.detail') }}</v-list-tile
                  >
                </v-list>
              </v-menu>
            </div>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider
          v-if="courses[course.number] && index < adjustedList.length - 1"
          :key="course.number + '-divider'"
        ></v-divider>
      </template>
    </template>

    <div v-if="list && moreThanOnePage" class="text-xs-center mt-3">
      <v-container v-if="page < getPage(list.length)">
        <v-btn block @click="page++" color="white">下一頁</v-btn>
      </v-container>
      <v-pagination
        :length="getPage(list.length)"
        v-model="page"
        :total-visible="4"
      ></v-pagination>
    </div>

    <div
      v-if="list && list.length === 0"
      class="text-xs-center pt-5"
      v-t="emptyText"
    ></div>
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
      'currentSelectedCourses',
      'coursesFilteringConfig',
      'geDegreeCode'
    ]),
    ...mapGetters('selectCourses', [
      'isCurrentSemester',
      'isCourseSelected',
      'coursesFiltering',
      'toReadableProfessor'
    ]),
    moreThanOnePage() {
      return !this.result && this.list && this.list.length > this.coursesPerPage
    },
    adjustedList() {
      this.$emit('update-page', this.page)

      /**
       * If there is no list to perform, return an empty list.
       */
      if (!this.list) {
        return []
      }

      /**
       * If is not performing the result of selection,
       * return the paged list.
       */
      if (!this.result) {
        let start = (this.page - 1) * this.coursesPerPage
        return this.list.slice(start, start + this.coursesPerPage)
      }

      /**
       * Performing the result of selection.
       * Process each courses filtering configuration to fulfill it.
       */
      /**
       * Why we need to modify the this.resultList?
       * Because we have to maintain dialog property to be directive,
       * if we just return a new local variable, it will not work.
       */
      /* eslint-disable-next-line */
      this.resultList = []

      for (let item of this.coursesFilteringConfig) {
        /**
         * If item.status not appear in the course status of courses
         * in the coursesSet, skip it.
         */
        if (!(item.header in this.coursesFiltering)) {
          continue
        }
        let list = this.coursesFiltering[item.header]
        /**
         * If item.status is randomized (status=2) and orderable.
         */
        if (item.status === 2 && item.orderable === true) {
          /* eslint-disable-next-line */
          this.resultList.push({
            header: item.header,
            newOrder: list,
            oldOrder: item.orderable && list.slice(0),
            dialog: false,
            orderable: true
          })
          /* eslint-disable-next-line */
          this.resultList = this.resultList.concat(list)
        } else {
          /* eslint-disable-next-line */
          this.resultList.push({
            header: item.header
          })
          /* eslint-disable-next-line */
          this.resultList = this.resultList.concat(
            this.coursesFiltering[item.header]
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
          .then(response => {
            if (!response) {
              resolve()
              return
            }
            this.$store.commit('ui/START_LOADING')

            this.$store
              .dispatch('selectCourses/addCourse', {
                courseNumber: courseNumber
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
          .then(response => {
            if (!response) {
              resolve()
              return
            }

            /**
             * If the courses prepare to quit is a orderable course,
             * suggest user to reorder the list.
             */
            let suggestReorder = this.courses[courseNumber].random > 1
            let header = null
            if (suggestReorder) {
              for (header in this.coursesFiltering) {
                if (
                  this.coursesFiltering[header].find(
                    c => c.number === courseNumber
                  )
                ) {
                  break
                }
              }
            }

            this.$store.commit('ui/START_LOADING')
            this.$store
              .dispatch('selectCourses/quitCourse', {
                courseNumber: courseNumber
              })
              .then(() => {
                this.$store.commit('ui/STOP_LOADING')
                this.$store.dispatch('ui/openSnackbar', {
                  snackbarText: this.$t('SelectCourses.action.quitSuccess', [
                    this.courses[courseNumber].title
                  ])
                })

                /**
                 * Check whether the course is a randomized and orderable course,
                 * if it is, we suggest user to perform editOrder().
                 */
                if (this.courses[courseNumber].random === 0) {
                  resolve()
                  return
                }

                return this.$store.dispatch('ui/openRequestDialog', {
                  title: `請問是否要自動補齊空缺的志願序？`,
                  text:
                    '補齊空缺的志願序可能會花些時間，如果要大量退選的話，建議稍後再自動補齊空缺的志願序。你可以透過「編輯志願序」按鈕補齊空缺的志願序。',
                  mode: 'request'
                })
              })
              .then(response => {
                if (!response) {
                  resolve()
                  return
                }

                let list = this.coursesFiltering[header]

                this.$store.commit('ui/START_LOADING')
                this.$store
                  .dispatch('selectCourses/editOrder', {
                    newOrder: list,
                    oldOrder: list
                  })
                  .then(() => {
                    this.$store.dispatch('ui/openSnackbar', {
                      snackbarText: this.$t(
                        'SelectCourses.action.editOrderSuccess'
                      )
                    })
                    this.$store.commit('ui/STOP_LOADING')
                  })
                  .catch(err => {
                    console.error(err)
                    this.$store.commit('ui/STOP_LOADING')
                  })

                resolve()
              })
              .catch(err => {
                this.$store.commit('ui/STOP_LOADING')
                reject(err)
              })
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
    color: #cf0e00;
    margin-right: 3px;
    padding-left: 2px;
    padding-right: 2px;
  }
}
</style>
