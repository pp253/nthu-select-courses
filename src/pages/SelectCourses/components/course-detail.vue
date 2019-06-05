<template>
  <v-container pa-0 ma-0 fluid class="course-detail h-100">
    <v-toolbar dense tabs style="z-index: 1;">
      <v-toolbar-title>
        <span v-if="course.canceled" class="red--text">停開</span>
        {{ course.title || course.chineseTitle || title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="close">
        <v-icon>close</v-icon>
      </v-btn>

      <v-tabs slot="extension" centered v-model="tabs">
        <v-tab href="#tab-course-detail-syllabus">
          {{ $t('courseDetail.syllabus') }}
        </v-tab>
        <v-tab href="#tab-course-detail-enrolled-classmates">
          {{ $t('courseDetail.classmates') }}
        </v-tab>
        <!-- <v-tab href="#tab-course-detail-comments">課程評論</v-tab> -->
      </v-tabs>
    </v-toolbar>

    <loading-container v-if="$wait.is('selectCourses.getSyllabus')" />
    <v-container v-else fluid pa-0 ma-0>
      <v-tabs-items v-model="tabs" touchless>
        <v-tab-item value="tab-course-detail-syllabus" :key="0">
          <v-layout wrap justify-center>
            <v-flex xs12>
              <v-container>
                <v-layout wrap>
                  <v-flex xs3 md2 class="grey--text text--darken-2">
                    {{ $t('courseDetail.number') }}
                  </v-flex>
                  <v-flex xs9 md4>{{ course.number }}</v-flex>
                  <v-flex xs3 md2 class="grey--text text--darken-2">
                    <a
                      href="http://curricul.web.nthu.edu.tw/files/13-1073-12448.php"
                      rel="noreferrer"
                      target="_blank"
                    >
                      {{ $t('courseDetail.time') }}
                    </a>
                  </v-flex>
                  <v-flex xs9 md4>{{ course.time || '' }}</v-flex>
                  <v-flex xs3 md2 class="grey--text text--darken-2">
                    {{ $t('courseDetail.professor') }}
                  </v-flex>
                  <v-flex xs9 md4>
                    {{ toReadableProfessor(course.professor) }}
                  </v-flex>
                  <v-flex xs3 md2 class="grey--text text--darken-2">
                    {{ $t('courseDetail.credit') }}
                  </v-flex>
                  <v-flex xs9 md4>{{ course.credit }}</v-flex>
                  <v-flex xs3 md2 class="grey--text text--darken-2">
                    {{ $t('courseDetail.size_limit') }}
                  </v-flex>
                  <v-flex xs9 md4>
                    {{
                      (course.size_limit || '-') +
                        ` (${course.previous_size || '-'})`
                    }}
                  </v-flex>
                  <v-flex xs3 md2 class="grey--text text--darken-2">
                    {{ $t('courseDetail.reserved') }}
                  </v-flex>
                  <v-flex xs9 md4>{{ course.reserved }}</v-flex>
                  <v-flex xs3 md2 class="grey--text text--darken-2">
                    {{ $t('courseDetail.room') }}
                  </v-flex>
                  <v-flex xs9 md4>{{ course.room }}</v-flex>
                  <v-flex xs3 md2 class="grey--text text--darken-2">
                    {{ $t('courseDetail.language') }}
                  </v-flex>
                  <v-flex xs9 md4>{{ course.language }}</v-flex>
                  <v-flex xs3 md2 class="grey--text text--darken-2">
                    <a
                      href="http://cge.gec.nthu.edu.tw/course-3/"
                      rel="noreferrer"
                      target="_blank"
                    >
                      {{ $t('courseDetail.ge_object') }}
                    </a>
                  </v-flex>
                  <v-flex xs9 md4>{{ course.ge_object }}</v-flex>
                </v-layout>
                <v-layout wrap pb-3>
                  <template v-for="key in ['ge_degree']">
                    <template v-if="course[key]">
                      <v-flex
                        :key="key"
                        xs3
                        md2
                        class="grey--text text--darken-2"
                      >
                        {{ $t(`courseDetail.${key}`) }}
                      </v-flex>
                      <v-flex :key="key + '-content'" xs9 md10>
                        <v-chip @click="search(`${key}:${course[key]}`)">
                          {{ course[key] }}
                        </v-chip>
                      </v-flex>
                    </template>
                  </template>
                  <template v-for="key in ['required', 'double', 'program']">
                    <template v-if="course[key]">
                      <v-flex
                        :key="key"
                        xs3
                        md2
                        class="grey--text text--darken-2"
                        >{{ $t(`courseDetail.${key}`) }}</v-flex
                      >
                      <v-flex :key="key + '-content'" xs9 md10>
                        <v-chip
                          v-for="item in course[key]"
                          :key="item"
                          @click="search(`${key}:${item}`)"
                        >
                          {{ item }}
                        </v-chip>
                      </v-flex>
                    </template>
                  </template>
                  <template
                    v-for="key in ['prerequirement', 'course_rule', 'memo']"
                  >
                    <template v-if="course[key]">
                      <v-flex
                        :key="key"
                        xs3
                        md2
                        class="grey--text text--darken-2"
                      >
                        {{ $t(`courseDetail.${key}`) }}
                      </v-flex>
                      <v-flex
                        :key="key + '-content'"
                        xs9
                        md10
                        v-html="course[key]"
                      ></v-flex>
                    </template>
                  </template>
                </v-layout>

                <v-btn
                  v-if="
                    isCurrentSemester(course.number) &&
                      selectionPhase &&
                      !course.canceled
                  "
                  @click="
                    isCourseSelected(course.number)
                      ? quitCourse(course.number)
                      : addCourse(course.number)
                  "
                >
                  {{
                    isCourseSelected(course.number)
                      ? $t('SelectCourses.action.quitCourse')
                      : $t('SelectCourses.action.addCourse')
                  }}
                </v-btn>
                <!--
                <v-btn
                  @click="store.user.favoriteCourses.indexOf(course.number) === -1 ? addFavorite(course.number) : removeFavorite(course.number)"
                >{{ store.user.favoriteCourses.indexOf(course.number) === -1 ? $t('action.addFavorite') : $t('action.removeFavorite') }}</v-btn>
                -->
              </v-container>
              <v-divider></v-divider>
            </v-flex>

            <v-flex xs12 v-if="!valid">
              <v-container>
                您目前無法看這堂課的歷年成績分布。如果想要了解，請進行以下步驟

                <ol>
                  <li>在<b>電腦</b>上開啟 Google Chrome，手機沒辦法用。</li>
                  <li>
                    安裝
                    <a
                      href="https://chrome.google.com/webstore/detail/nthuscoresharing/fbbgchnopppgncdjbckkjehfchncghdf"
                      target="_blank"
                    >
                      NTHU ScoreSharing 擴充功能 </a
                    >。
                  </li>
                  <li>
                    登入校務資訊系統。登入後，如有詢問是否願意分享成績，點「是」。
                  </li>
                  <li><a @click="retry">點此重試。</a></li>
                </ol>

                <div class="text-xs-right" style="font-size: 0.9em;">
                  以上資料來自
                  <a
                    href="https://chrome.google.com/webstore/detail/nthuscoresharing/fbbgchnopppgncdjbckkjehfchncghdf"
                    target="_blank"
                  >
                    NTHU ScoreSharing
                  </a>
                </div>
              </v-container>
              <v-divider></v-divider>
            </v-flex>

            <v-flex xs12 v-if="valid">
              <distribution-chart
                v-if="scoresDist.length > 0"
                :chart-data="chartData"
              />

              <v-container :pt-0="scoresDist.length > 0">
                <v-wait for="scoresharing/query">
                  <loading-container slot="waiting"></loading-container>

                  <div v-if="!scoresDist || scoresDist.length === 0">
                    還沒有人上傳過這堂課的歷年成績分布😥
                  </div>

                  <div class="text-xs-center" v-if="scoresDist.length > 0">
                    歷年成績：{{ scoresDist[scoresDistIndex][0] }}，全班{{
                      scoresDist[scoresDistIndex][1][13]
                    }}人
                  </div>

                  <v-layout v-if="scoresDist.length > 0">
                    <v-flex xs12>
                      <v-slider
                        :max="scoresDist.length - 1"
                        :min="0"
                        v-model="scoresDistIndex"
                        label="年分"
                      ></v-slider>
                    </v-flex>
                    <v-flex mt-2>
                      <v-btn
                        icon
                        flat
                        @click="scoresDistIndex--"
                        :disabled="scoresDistIndex <= 0"
                      >
                        <v-icon>chevron_left</v-icon>
                      </v-btn>
                    </v-flex>
                    <v-flex mt-2>
                      <v-btn
                        icon
                        flat
                        @click="scoresDistIndex++"
                        :disabled="scoresDistIndex === scoresDist.length - 1"
                      >
                        <v-icon>chevron_right</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>

                  <div class="text-xs-right" style="font-size: 0.9em;">
                    以上資料來自
                    <a
                      href="https://chrome.google.com/webstore/detail/nthuscoresharing/fbbgchnopppgncdjbckkjehfchncghdf"
                      target="_blank"
                    >
                      NTHU ScoreSharing
                    </a>
                  </div>
                </v-wait>
              </v-container>
              <v-divider></v-divider>
            </v-flex>

            <v-flex
              xs12
              v-if="course.syllabus && course.syllabus.briefDescription !== ''"
            >
              <v-container
                v-html="course.syllabus.briefDescription"
              ></v-container>
              <v-divider></v-divider>
            </v-flex>

            <v-flex xs12 v-if="course.syllabus">
              <v-container>
                <v-btn
                  :href="
                    `https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/output/6_6.1_6.1.12/${
                      course.number
                    }.pdf`
                  "
                  target="_blank"
                  rel="noreferrer"
                >
                  {{ $t('courseDetail.downloadSyllabus') }}
                </v-btn>
                <div v-html="course.syllabus.description"></div>
              </v-container>
            </v-flex>
          </v-layout>
        </v-tab-item>

        <v-tab-item value="tab-course-detail-enrolled-classmates" :key="1" lazy>
          <v-container>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  prepend-icon="search"
                  clearable
                  v-model="enrollingSearchText"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>

          <v-list three-line>
            <v-subheader>
              <!-- +1 is for myself. -->
              共{{ enrolledClassmates.length + 1 }}位同學
            </v-subheader>
            <template
              v-for="(student, index) of enrolledClassmatesSearchResult"
            >
              <v-list-tile :key="`student-${index}`">
                <v-list-tile-content>
                  <v-list-tile-title
                    v-text="`${student.name} ${student.studentId}`"
                  ></v-list-tile-title>
                  <v-list-tile-sub-title
                    v-text="student.department"
                  ></v-list-tile-sub-title>
                  <v-list-tile-sub-title
                    v-text="student.email"
                  ></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider :key="`student-${index}-divider`"></v-divider>
            </template>
            <v-list-tile v-if="enrolledClassmatesSearchResult.length === 0">
              <v-list-tile-content>
                沒有人選這堂課，或是你沒辦法看到這堂課的同學
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </v-container>
</template>

<script>
import {
  VList,
  VListTile,
  VListTileSubTitle,
  VListTileTitle,
  VListTileContent,
  VTabs,
  VTab,
  VTabsItems,
  VTabItem,
  VBtn,
  VToolbar,
  VToolbarTitle,
  VTextField,
  VIcon,
  VChip,
  VSlider
} from 'vuetify/lib'
import { mapState, mapGetters } from 'vuex'
import LoadingContainer from '@/components/loading-container'
import DistributionChart from '../../Scores/components/distribution-chart'
import Vue from 'vue'
import { register, unregister } from '../../../router/back'

export default {
  name: 'CourseDetail',
  components: {
    LoadingContainer,
    VList,
    VListTile,
    VListTileSubTitle,
    VListTileTitle,
    VListTileContent,
    VTabs,
    VTab,
    VTabsItems,
    VTabItem,
    VBtn,
    VToolbar,
    VToolbarTitle,
    VTextField,
    VIcon,
    VChip,
    VSlider,
    DistributionChart
  },
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
      enrolledClassmates: [],
      enrollingSearchText: '',
      scoresDist: [],
      scoresDistIndex: 0,
      chartData: null
    }
  },
  computed: {
    ...mapGetters('selectCourses', [
      'isCurrentSemester',
      'isCourseSelected',
      'toReadableProfessor'
    ]),
    ...mapState('selectCourses', [
      'selectionPhase',
      'addOrDropPhase',
      'withdrawalPhase',
      'currentSelectedCourses',
      'notSupport'
    ]),
    ...mapState('selectCourses/scoresharing', ['valid']),
    enrolledClassmatesSearchResult() {
      if (!this.enrollingSearchText) {
        return this.enrolledClassmates
      }
      let list = []
      for (let classmate of this.enrolledClassmates) {
        if (
          (classmate.name &&
            classmate.name.includes(this.enrollingSearchText)) ||
          (classmate.department &&
            classmate.department.includes(this.enrollingSearchText)) ||
          (classmate.studentId &&
            classmate.studentId.includes(this.enrollingSearchText))
        ) {
          list.push(classmate)
        }
      }
      return list
    }
  },
  watch: {
    courseNumber(newVal) {
      let courseNumber = newVal
      unregister(this.beforeBack)
      register(this.beforeBack)
      if (this.courses[newVal]) {
        if (!this.courses[newVal].syllabus) {
          this.$store
            .dispatch('selectCourses/getSyllabus', {
              courseNumber: newVal
            })
            .then(() => {
              if (courseNumber !== this.courseNumber) {
                return
              }
              this.updateCourse()
              this.updateScoresDist()
            })
        } else {
          this.updateCourse()
          this.updateScoresDist()
        }
      } else {
        this.$store
          .dispatch('selectCourses/getSyllabus', {
            courseNumber: newVal
          })
          .then(() => {
            if (courseNumber !== this.courseNumber) {
              return
            }
            this.updateCourse()
            this.updateScoresDist(newVal)
          })
      }

      this.$store
        .dispatch('selectCourses/getClassmates', { courseNumber: newVal })
        .then(classmates => {
          if (courseNumber !== this.courseNumber) {
            return
          }
          this.enrolledClassmates = classmates
        })
        .catch(() => {
          if (courseNumber !== this.courseNumber) {
            return
          }
          this.enrolledClassmates = []
        })
    },
    scoresDistIndex(newVal) {
      if (this.scoresDist.length > 0) {
        this.chartData = {
          labels: [
            'A+',
            'A',
            'A-',
            'B+',
            'B',
            'B-',
            'C+',
            'C',
            'C-',
            'D',
            'E',
            'X'
          ],
          datasets: [
            {
              label: 'Distribution of scores',
              backgroundColor: '#64b4f6',
              data: this.scoresDist[newVal][1].slice(0, 13)
            }
          ]
        }
      }
    }
  },
  methods: {
    updateScoresDist() {
      let courseNumber = this.courseNumber
      let course =
        Object.keys(this.course) === 0
          ? this.courses[courseNumber]
          : this.course
      if (!course || Object.keys(course) === 0) {
        console.error(
          'course and courses[courseNumber] are both null',
          course,
          courseNumber
        )
        return
      }

      let teacher
      if (Array.isArray(course.professor)) {
        teacher = course.professor
      } else if (typeof course.professor === 'string') {
        teacher = [course.professor.split('(')[0]]
      } else {
        throw new Error(
          '[course-detail/updateScoresDist] course.professor should be either an array or string.' +
            course.professor
        )
      }
      this.$store
        .dispatch('selectCourses/scoresharing/query', {
          NAME: course.title || course.chineseTitle,
          TEACHER: teacher
        })
        .then(scoresDist => {
          if (courseNumber !== this.courseNumber) {
            return
          }
          Vue.set(this, 'scoresDist', scoresDist || [])
          if (this.scoresDist.length > 0) {
            this.chartData = {
              labels: [
                'A+',
                'A',
                'A-',
                'B+',
                'B',
                'B-',
                'C+',
                'C',
                'C-',
                'D',
                'E',
                'X'
              ],
              datasets: [
                {
                  label: 'Distribution of scores',
                  backgroundColor: '#64b4f6',
                  data: this.scoresDist[0][1].slice(0, 13)
                }
              ]
            }
          }
        })
      this.scoresDistIndex = 0
    },
    updateCourse() {
      if (this.courseNumber in this.courses) {
        this.course = this.courses[this.courseNumber]
      } else {
        this.course = {}
      }
    },
    addCourse(courseNumber) {
      if (this.notSupport.includes(this.courses[courseNumber].title)) {
        this.$store.dispatch('ui/openRequestDialog', {
          title: `很抱歉，簡易選課不支援加選「${
            this.courses[courseNumber].title
          }」`,
          text: '因為這堂課的加選機制比較複雜，請至原選課系統選課！',
          mode: 'info'
        })
        return
      }

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
    beforeBack() {
      this.close()
      return false
    },
    close() {
      this.$emit('close-course-detail')
      unregister(this.beforeBack)
    },
    search(text) {
      this.$emit('search', text)
      if (this.$store.state.ui.isMobile) {
        this.close()
        this.$emit('goto-panel-courses-catalog')
      }
    },
    async retry() {
      let courseNumber = this.courseNumber
      let valid = await this.$store.dispatch(
        'selectCourses/scoresharing/validate'
      )
      if (courseNumber !== this.courseNumber) {
        return
      }
      if (valid) {
        await this.updateScoresDist()
      }
    }
  }
}
</script>

<style lang="scss">
.course-detail {
  .v-window {
    height: calc(100vh - 96px);
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 64px;
    user-select: text;
    transform: translateZ(0);
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
    .v-window {
      height: calc(100vh - 96px - 56px);
    }
  }
}
</style>
