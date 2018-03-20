<template>
  <v-container pa-0 ma-0 fluid class="course-detail">
    <v-tabs fixed centered v-model="tabs">
      <v-toolbar dense>
        <v-toolbar-title>
          <span
            v-if="course.canceled"
            class="red--text"
          >停開</span>
          {{ course.title || course.chineseTitle || title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeCourseDetail">
          <v-icon>close</v-icon>
        </v-btn>

        <v-tabs-bar slot="extension">
          <v-tabs-item href="#tab-course-detail-syllabus">{{ $t('coursesList.syllabus') }}</v-tabs-item>
          <v-tabs-item href="#tab-course-detail-enrolled-students">{{ $t('courseDetail.classmates') }}</v-tabs-item>
          <!-- <v-tabs-item href="#tab-course-detail-comments">課程評論</v-tabs-item> -->
          <v-tabs-slider color="grey"></v-tabs-slider>
        </v-tabs-bar>
      </v-toolbar>
      <v-tabs-items>
        <v-tabs-content id="tab-course-detail-syllabus">
          <v-layout wrap justify-center>
            <v-flex xs12>
              <v-container>
                <v-layout wrap>
                  <v-flex xs3 md2 class="grey--text text--darken-2">{{ $t('courseDetail.number') }}</v-flex><v-flex xs9 md4>{{ course.number }}</v-flex>
                  <v-flex xs3 md2 class="grey--text text--darken-2">{{ $t('courseDetail.time') }}</v-flex><v-flex xs9 md4>{{ course.time }}</v-flex>
                  <v-flex xs3 md2 class="grey--text text--darken-2">{{ $t('courseDetail.professor') }}</v-flex><v-flex xs9 md4>{{ course.professor }}</v-flex>
                  <v-flex xs3 md2 class="grey--text text--darken-2">{{ $t('courseDetail.credit') }}</v-flex><v-flex xs9 md4>{{ course.credit }}</v-flex>
                  <v-flex xs3 md2 class="grey--text text--darken-2">{{ $t('courseDetail.size_limit') }}</v-flex><v-flex xs9 md4>{{ course.size_limit + ` (${course.previous_size || '-'})` }}</v-flex>
                  <v-flex xs3 md2 class="grey--text text--darken-2">{{ $t('courseDetail.room') }}</v-flex><v-flex xs9 md4>{{ course.room }}</v-flex>
                </v-layout>
                <v-layout wrap pb-3>
                  <v-flex xs3 md2 class="grey--text text--darken-2">{{ $t('courseDetail.prerequirement') }}</v-flex><v-flex xs9 md10>{{ course.prerequirement }}</v-flex>
                  <v-flex xs3 md2 class="grey--text text--darken-2">{{ $t('courseDetail.memo') }}</v-flex><v-flex xs9 md10>{{ course.memo }}</v-flex>
                </v-layout>

                <v-btn
                  v-if="selectionPhase && !course.canceled"
                  @click="isCourseSelected(course.number) ? quitCourse(course.number) : addCourse(course.number)"
                >{{ isCourseSelected(course.number) ? $t('action.quitCourse') : $t('action.addCourse') }}</v-btn>
                <!--
                <v-btn
                  @click="store.user.favoriteCourses.indexOf(course.number) === -1 ? addFavorite(course.number) : removeFavorite(course.number)"
                >{{ store.user.favoriteCourses.indexOf(course.number) === -1 ? $t('action.addFavorite') : $t('action.removeFavorite') }}</v-btn>
                -->
              </v-container>
            </v-flex>
            <v-flex xs12
              v-if="course.syllabus && course.syllabus.briefDescription !== ''"
            >
              <v-divider></v-divider>
              <v-container
                v-html="course.syllabus.briefDescription"
              ></v-container>
            </v-flex>
            <v-flex xs12
              v-if="course.syllabus"
            >
              <v-divider></v-divider>
              <v-container>
                <v-btn
                  v-if="course.syllabus.file"
                  :href="`https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/output/6_6.1_6.1.12/${course.number}.pdf`"
                  target="_blank"
                >{{ $t('courseDetail.downloadSyllabus') }}</v-btn>
                <div
                  v-html="course.syllabus.description"
                ></div>
              </v-container>
            </v-flex>
          </v-layout>
        </v-tabs-content>

        <v-tabs-content id="tab-course-detail-enrolled-students">
          <v-container>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  prepend-icon="search"
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-btn>全選</v-btn>
                <v-btn>寄EMAIL給同學</v-btn>
              </v-flex>
            </v-layout>
          </v-container>

          <v-list>
            <v-subheader>
              共{{enrolledStudents.length}}位同學
            </v-subheader>
            <template
              v-for="(student, index) of enrolledStudents"
            >
              <v-list-tile
                :key="`student-${index}`"
              >
                <v-list-tile-action>
                  <v-checkbox
                  ></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-text="student.name"></v-list-tile-title>
                  <v-list-tile-sub-title v-text="student.studentId + ' ' + student.department"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-tabs-content>

        <v-tabs-content id="tab-course-detail-comments">
          <v-layout wrap justify-center>
            <v-flex xs12>
              <v-container>
                <v-layout wrap>
                  <v-flex xs4>
                    <div class="comments-score-title grey--text text--darken-2">甜度</div>
                    <div class="comments-score-value">3.8</div>
                  </v-flex>
                  <v-flex xs4>
                    <div class="comments-score-title grey--text text--darken-2">甜度</div>
                    <div class="comments-score-value">3.8</div>
                  </v-flex>
                  <v-flex xs4>
                    <div class="comments-score-title grey--text text--darken-2">甜度</div>
                    <div class="comments-score-value">3.8</div>
                  </v-flex>
                </v-layout>
              </v-container>

              <v-divider />
              <v-container pa-0>
                <v-layout wrap>
                  <v-flex
                    xs12 sm6 lg4
                  >
                    <v-container>
                      <v-btn
                        @click.native="showCommentDialog = true"
                        block
                      >撰寫您的評論</v-btn>
                    </v-container>
                  </v-flex>
                  <v-flex
                    v-for="i in 6"
                    :key="i"
                    xs12 sm6 lg4
                  >
                    <v-container
                      pa-3
                    >
                      <v-card>
                        <v-card-title class="pb-0">
                          <span>123</span>
                          <v-spacer />
                          <span>
                            3.5 / 3.5 / 3.5
                          </span>
                        </v-card-title>
                        <v-card-text>任何產業均有其產業秩序及遊戲規則，利用他人著作的遊戲規則，最主要是著作權法。特別是現今多元的社會中，利用他人著作的情形，</v-card-text>
                        <v-card-actions class="pt-0">
                          <v-btn icon>
                            <v-icon class="grey--text text--lighten-1">thumb_up</v-icon>
                          </v-btn>
                          <v-btn icon>
                            <v-icon class="grey--text text--lighten-1">thumb_down</v-icon>
                          </v-btn>
                          <v-spacer />
                          <v-btn icon>
                            <v-icon class="grey--text text--lighten-1">report_problem</v-icon>
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-container>
                  </v-flex>
                </v-layout>
              </v-container>

              <v-divider />

              <v-container>
                {{ course.professor }}老師還有開設以下課程
                <v-layout>
                  <v-flex>

                  </v-flex>
                </v-layout>
              </v-container>
              <v-divider />
              <v-container>
                以上資料由NTHU+提供。
              </v-container>
            </v-flex>
          </v-layout>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>

    <v-dialog
      :fullscreen="$store.state.ui.isMobile"
      v-model="showCommentDialog"
      max-width="500px"
      persistent
    >
      <v-card>
        <v-card-title class="headline">評論{{ course.title || course.chineseTitle }}</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              name="comments-name"
              label="您的名字"
              value="匿名"
            ></v-text-field>
            <v-text-field
              name="comments-text"
              label="您的想法"
              multi-line
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn flat @click="showCommentDialog = false">取消</v-btn>
          <v-btn flat @click="showCommentDialog = false">送出</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      :fullscreen="$store.state.ui.isMobile"
      v-model="showReportDialog"
      max-width="500px"
      persistent
    >
      <v-card>
        <v-card-title class="headline">評論{{ course.title || course.chineseTitle }}</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field
              name="comments-name"
              label="您的名字"
              value="匿名"
            ></v-text-field>
            <v-text-field
              name="comments-text"
              label="您的想法"
              multi-line
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn flat @click="showReportDialog = false">取消</v-btn>
          <v-btn flat @click="showReportDialog = false">送出</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'CourseDetail',
  props: {
    title: String,
    'course-number': String
  },
  data() {
    return {
      courses: this.$store.state.selectCourses.courses,
      course: {},
      tabs: null,
      showCommentDialog: false,
      showReportDialog: false,
      enrolledStudents: [
        {
          name: '鄭建澤',
          email: 'asd@gmail.com',
          department: '工工系四年級',
          studentId: '105034009'
        },
        {
          name: '鄭建澤',
          email: 'asd@gmail.com',
          department: '工工系四年級',
          studentId: '105034009'
        },
        {
          name: '鄭建澤',
          email: 'asd@gmail.com',
          department: '工工系四年級',
          studentId: '105034009'
        },
        {
          name: '鄭建澤',
          email: 'asd@gmail.com',
          department: '工工系四年級',
          studentId: '105034009'
        }
      ]
    }
  },
  computed: {
    ...mapState('selectCourses', [
      'selectionPhase',
      'addOrDropPhase',
      'withdrawalPhase'
    ])
  },
  watch: {
    courseNumber(newVal) {
      if (this.courses[newVal]) {
        if (!this.courses[newVal].syllabus) {
          this.$store
            .dispatch('selectCourses/getSyllabus', {
              courseNumber: newVal
            })
            .then(() => {
              this.updateCourse()
            })
        } else {
          this.updateCourse()
        }
      } else {
        this.$store
          .dispatch('selectCourses/getSyllabus', {
            courseNumber: newVal
          })
          .then(() => {
            this.updateCourse()
          })
      }
    }
  },
  methods: {
    updateCourse() {
      if (this.courseNumber in this.courses) {
        this.course = this.courses[this.courseNumber]
      } else {
        this.course = {}
      }
    },
    addCourse(courseNumber) {
      return new Promise((resolve, reject) => {
        this.$store.commit('ui/START_LOADING')
        let order = ''
        if (this.courses[courseNumber].random !== 0) {
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
            resolve(data)
          })
          .catch(err => {
            this.$store.commit('ui/STOP_LOADING')
            reject(err)
          })
      })
    },
    quitCourse(courseNumber) {
      return new Promise((resolve, reject) => {
        this.$store.commit('ui/START_LOADING')
        this.$store
          .dispatch('selectCourses/quitCourse', {
            courseNumber: courseNumber
          })
          .then(data => {
            this.$store.commit('ui/STOP_LOADING')
            resolve(data)
          })
          .catch(err => {
            this.$store.commit('ui/STOP_LOADING')
            reject(err)
          })
      })
    },
    isCourseSelected(courseNumber) {
      return (
        this.$store.state.selectCourses.currentSelectedCourses.find(course => {
          return course.number === courseNumber
        }) !== undefined
      )
    },
    addFavorite(number) {
      // store.addFavorateCourses(number)
    },
    removeFavorite(number) {
      // store.removeFavorateCourses(number)
    },
    closeCourseDetail() {
      this.$emit('close-course-detail')
    }
  }
}
</script>

<style lang="scss">
.course-detail {
  .tabs__content {
    height: calc(100vh - 96px);
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 64px;
    user-select: text;
  }
  user-select: text;

  #tab-course-detail-comments {
    .comments-score-title {
      display: block;
      font-size: 16px;
    }

    .comments-score-value {
      font-size: 32px;
    }
  }
}

.mode-mobile {
  .course-detail {
    .tabs__content {
      height: calc(100vh - 96px - 56px);
    }
  }
}
</style>
