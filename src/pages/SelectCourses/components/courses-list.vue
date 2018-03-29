<!-- eslint-disable vue/valid-v-on -->

<template>
  <v-list
    class="courses-list"
    ripple
    id="courses-list"
  >
    <v-subheader
      v-if="list.length > coursesPerPage"
      class="mb-3"
    >
      有{{list.length}}個課程。第{{page}}頁，共{{getPage(list.length)}}頁。
    </v-subheader>

    <template
      v-if="list.length > 0"
      v-for="(course, index) in pagedList"
    >
      <v-subheader
        v-if="course.header"
        :key="course.header"
        class="pr-0"
      >
        {{ $t(course.header) }}
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
            v-t="'SelectCourses.coursesList.editOrder'"
          ></v-btn>
          <v-card>
            <v-card-title
              class="headline"
              v-t="'SelectCourses.coursesList.editOrder'"
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
                        {{ $t('SelectCourses.coursesList.order', [idx + 1]) }}
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
                v-t="'dialog.Cancel'"
              ></v-btn>
              <v-btn
                @click.native="editOrder(course)"
                flat
                v-t="'dialog.Apply'"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-subheader>

      <v-list-tile
        v-if="(course.number) in courses"
        ripple
        @click=""
        :key="course.number"
        @mouseover="updatePreviewTime(courses[course.number].time || course.number)"
        @mouseleave="updatePreviewTime('')"
        @dblclick="openCourseDetail(course.number)"
      >
        <v-list-tile-content>
          <v-list-tile-title>
            <span
              v-if="courses[course.number].canceled"
              class="red--text"
            >停開</span>
            <span
              v-if="courses[course.number].required"
              class="red--text"
            >{{ courses[course.number].required }}</span>
            {{ courses[course.number].title }}
          </v-list-tile-title>
          <v-list-tile-sub-title class="grey--text text--darken-4">{{
            $t('SelectCourses.coursesList.courseSub', [
              courses[course.number].number,
              courses[course.number].professor
            ])
          }}</v-list-tile-sub-title>
          <v-list-tile-sub-title class="detail">{{
            $t('SelectCourses.coursesList.courseDetail', [
              courses[course.number].credit,
              courses[course.number].size_limit,
              courses[course.number].previous_size || '-',
              courses[course.number].room
            ])
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
                  v-if="(addOrDropPhase || selectionPhase) && !courses[course.number].canceled"
                  @click="isCourseSelected(course.number) ? quitCourse(course.number) : addCourse(course.number)"
                  ripple
                >{{ isCourseSelected(course.number) ? $t('SelectCourses.action.quitCourse') : $t('SelectCourses.action.addCourse') }}</v-list-tile>
                <v-list-tile
                  v-if="addOrDropPhase && !courses[course.number].canceled"
                  @click="isCourseSelected(course.number) ? quitCourse(course.number) : addCourse(course.number)"
                  ripple
                >{{ isCourseSelected(course.number) ? $t('SelectCourses.action.addLimitedCourse') : $t('SelectCourses.action.printLimitedCourseForm') }}</v-list-tile>
                <!--
                <v-list-tile
                  @click="store.user.favoriteCourses.indexOf(course.number) === -1 ? addFavorite(course.number) : removeFavorite(course.number)"
                  ripple
                >{{ store.user.favoriteCourses.indexOf(course.number) === -1 ? $t('SelectCourses.action.addFavorite') : $t('SelectCourses.action.removeFavorite') }}</v-list-tile>
                -->
                <v-list-tile
                  @click="openCourseDetail(course.number)"
                  ripple
                >{{ $t('SelectCourses.coursesList.detail') }}</v-list-tile>
              </v-list>
            </v-menu>
          </div>
        </v-list-tile-action>
      </v-list-tile>
      <v-divider
        v-if="courses[course.number] && index < pagedList.length - 1"
        :key="course.number + '-divider'"
      ></v-divider>
    </template>

    <div
      v-if="list.length > coursesPerPage"
      class="text-xs-center mt-3"
    >
      <v-pagination
        :length="getPage(list.length)"
        v-model="page"
        :total-visible="5"
      ></v-pagination>
    </div>

    <div
      v-if="list.length === 0"
      class="text-xs-center pt-5"
    >{{ emptyText }}</div>
  </v-list>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState } from 'vuex'

export default {
  name: 'CoursesList',
  components: {
    draggable
  },
  props: {
    list: Array,
    courses: Object,
    'empty-text': {
      default: '您還沒有加入的課程歐！'
    }
  },
  data() {
    return {
      page: 1,
      coursesPerPage: 20
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
      'withdrawalPhase'
    ]),
    pagedList() {
      this.$emit('update-page', this.page)

      let start = (this.page - 1) * this.coursesPerPage
      return this.list.slice(start, start + this.coursesPerPage)
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
                this.$store.state.selectCourses.currentSelectedCourses
              ) {
                order =
                  this.$store.state.selectCourses.currentSelectedCourses.filter(
                    course => {
                      return (
                        course.status &&
                        course.status === 2 &&
                        this.courses[course.number].random ===
                          this.courses[courseNumber].random
                      )
                    }
                  ).length + 1
              }

              this.$store
                .dispatch('selectCourses/addCourse', {
                  courseNumber: courseNumber,
                  order: order
                })
                .then(data => {
                  this.$store.commit('ui/STOP_LOADING')
                  this.$store.dispatch('ui/openSnackbar', {
                    snackbarText: this.$t('SelectCourses.coursesList.addSuccess', [
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
              /*
              this.$store.dispatch('selectCourses/quitCourse', {
                courseNumber: courseNumber
              })
              .then((data) => {
                this.$store.commit('ui/STOP_LOADING')
                resolve(data)
              })
              .catch((err) => {
                this.$store.commit('ui/STOP_LOADING')
                reject(err)
              })
              */
            }
          })
      })
    },
    addFavorite(number) {
      // this.store.addFavorateCourses(number)
    },
    removeFavorite(number) {
      // this.store.removeFavorateCourses(number)
    },
    updatePreviewTime(number) {
      this.$emit('update-preview-time', number)
    },
    openCourseDetail(courseNumber) {
      this.$emit('open-course-detail', courseNumber)
    },
    editOrder(catagory) {
      this.$store.commit('ui/START_LOADING')
      this.$store
        .dispatch('selectCourses/editOrder', {
          newOrder: catagory.newOrder,
          oldOrder: catagory.oldOrder
        })
        .then(data => {
          catagory.dialog = false
          this.$store.commit('ui/STOP_LOADING')
        })
    },
    cancelEditOrder(catagory) {
      catagory.newOrder.splice(0, catagory.newOrder.length)
      for (let order of catagory.oldOrder) {
        catagory.newOrder.push(order)
      }
      catagory.dialog = false
    },
    isCourseSelected(courseNumber) {
      return (
        this.$store.state.selectCourses.currentSelectedCourses &&
        this.$store.state.selectCourses.currentSelectedCourses.find(course => {
          return course.number === courseNumber
        }) !== undefined
      )
    }
  }
}
</script>

<style lang="scss">
.courses-list {
  min-height: 100%;
  padding-bottom: 64px;

  .menu {
    position: relative;
    bottom: 20px;
  }

  .list__tile {
    height: 88px + 16px !important;

    .list__tile__action-text {
      font-size: 16px;
    }

    .memo {
      // text-overflow: ellipsis;
      white-space: nowrap;
      min-height: 21.5px;
    }
  }
}
</style>
