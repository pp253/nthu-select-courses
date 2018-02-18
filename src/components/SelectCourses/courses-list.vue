<!-- eslint-disable vue/valid-v-on -->

<template>
  <v-list
    class="courses-list"
    ripple
  >
    <template
      v-if="list.length > 0"
      v-for="(course, index) in list"
    >
      <v-subheader
        v-if="course.type === 'subheader'"
        :key="course.title"
        class="pr-0"
      >
        {{ $t(course.title) }}
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
                        {{ $t('coursesList.order', [idx + 1]) }}
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
        v-if="course && (course.number in courses)"
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
            $t('coursesList.courseSub')
            .replace('{0}', courses[course.number].number)
            .replace('{1}', courses[course.number].professor)
          }}</v-list-tile-sub-title>
          <v-list-tile-sub-title class="detail">{{
            $t('coursesList.courseDetail')
            .replace('{0}', courses[course.number].credit)
            .replace('{1}', courses[course.number].size_limit)
            .replace('{2}', courses[course.number].previous_size || '-')
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
        v-if="courses[course.number] && index < list.length - 1"
        :key="course.number + '-divider'"
      ></v-divider>
    </template>

    <div
      v-if="list.length === 0"
      class="text-xs-center pt-5"
    >{{ emptyText }}</div>
  </v-list>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'CoursesList',
  components: {
    draggable
  },
  props: {
    'list': Array,
    'courses': Object,
    'empty-text': {
      default: '您還沒有加入的課程歐！'
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
          this.$store.dispatch('ui/openSnackbar', {
            snackbarText: this.$t('coursesList.addSuccess', [this.courses[courseNumber].title])
          })
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
    addFavorite (number) {
      // this.store.addFavorateCourses(number)
    },
    removeFavorite (number) {
      // this.store.removeFavorateCourses(number)
    },
    updatePreviewTime (number) {
      this.$emit('update-preview-time', number)
    },
    openCourseDetail (courseNumber) {
      this.$emit('open-course-detail', courseNumber)
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
    isCourseSelected (courseNumber) {
      return (this.$store.state.selectCourses.currentSelectedCourses.find((course) => {
        return course.number === courseNumber
      }) !== undefined)
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
