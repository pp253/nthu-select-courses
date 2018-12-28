<template>
  <v-container pa-0
               ma-0
               fluid
               class="score-course-detail">
    <v-tabs fixed
            centered>
      <v-toolbar dense
                 class="elevation-1">
        <v-btn @click="$emit('close-score-detail')"
               icon>
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title v-if="course && course.syllabus">{{ course.syllabus.chineseTitle }}</v-toolbar-title>

        <v-tabs-bar slot="extension">
          <v-tabs-item href="#tab-distribution">{{ $t('Scores.distribution') }}</v-tabs-item>
          <v-tabs-item href="#tab-syllabus">{{ $t('courseDetail.syllabus') }}</v-tabs-item>
          <v-tabs-slider color="grey"></v-tabs-slider>
        </v-tabs-bar>
      </v-toolbar>
      <v-tabs-items>
        <v-tabs-content id="tab-distribution">
          <v-layout wrap
                    justify-center>
            <v-flex xs12
                    lg8
                    xl6>
              <v-container v-if="course && course.distribution">
                <v-layout>
                  <v-flex xs2
                          class="grey--text text--darken-2"
                          v-t="'Scores.totalStudents'"></v-flex>
                  <v-flex xs4>{{ $t('common.people', [course.distribution.total]) }}</v-flex>
                  <v-flex xs2
                          class="grey--text text--darken-2"
                          v-t="'Scores.passRate'"></v-flex>
                  <v-flex xs4>{{ passRate }}%</v-flex>
                </v-layout>
              </v-container>
              <v-divider />
              <v-container pr-0
                           pl-0>
                <distribution-chart :chart-data="chartData" />
              </v-container>
            </v-flex>
          </v-layout>
        </v-tabs-content>

        <v-tabs-content id="tab-syllabus">
          <v-layout wrap
                    justify-center>
            <v-flex xs12
                    lg8
                    xl6>
              <v-container v-if="course && course.syllabus">
                <v-layout wrap>
                  <v-flex xs3
                          md2
                          class="grey--text text--darken-2">{{ $t('courseDetail.number') }}</v-flex>
                  <v-flex xs9
                          md4>{{ course.syllabus.number }}</v-flex>
                  <v-flex xs3
                          md2
                          class="grey--text text--darken-2">{{ $t('courseDetail.time') }}</v-flex>
                  <v-flex xs9
                          md4>{{ course.syllabus.time }}</v-flex>
                  <v-flex xs3
                          md2
                          class="grey--text text--darken-2">{{ $t('courseDetail.professor') }}</v-flex>
                  <v-flex xs9
                          md4>{{ course.syllabus.professor }}</v-flex>
                  <v-flex xs3
                          md2
                          class="grey--text text--darken-2">{{ $t('courseDetail.credit') }}</v-flex>
                  <v-flex xs9
                          md4>{{ course.syllabus.credit }}</v-flex>
                  <v-flex xs3
                          md2
                          class="grey--text text--darken-2">{{ $t('courseDetail.size_limit') }}</v-flex>
                  <v-flex xs9
                          md4>{{ course.syllabus.size_limit }}</v-flex>
                  <v-flex xs3
                          md2
                          class="grey--text text--darken-2">{{ $t('courseDetail.room') }}</v-flex>
                  <v-flex xs9
                          md4>{{ course.syllabus.room }}</v-flex>
                </v-layout>
              </v-container>
              <v-divider></v-divider>
              <v-container v-if="course && course.syllabus && course.syllabus.briefDescription !== ''">
                <div v-html="course.syllabus.briefDescription"></div>
              </v-container>
              <v-divider></v-divider>
              <v-container v-if="course && course.syllabus">
                <v-btn v-if="course.syllabus.file"
                       :href="`https://www.ccxp.nthu.edu.tw/ccxp/INQUIRE/JH/output/6_6.1_6.1.12/${course.syllabus.number}.pdf`"
                       target="_blank"
                       rel="noreferrer">{{ $t('courseDetail.downloadSyllabus') }}</v-btn>
                <div v-html="course.syllabus.description"></div>
              </v-container>
            </v-flex>
          </v-layout>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
  </v-container>
</template>

<script>
import { toArray } from '@/lib/utils'
import DistributionChart from './distribution-chart'

export default {
  name: 'ScoreCourseDetail',
  components: {
    DistributionChart
  },
  props: {
    scores: Object,
    courses: Object,
    'course-detail-number': String
  },
  data() {
    return {
      chartData: null
    }
  },
  watch: {
    courseDetailNumber(newVal) {
      this.$store.commit('ui/START_LOADING')

      this.$store
        .dispatch('scores/getDistribution', { courseNumber: newVal })
        .then(distribution => {
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
                backgroundColor: '#f87979',
                data: toArray(distribution).slice(0, 13)
              }
            ]
          }

          this.$store.commit('ui/STOP_LOADING')
        })
        .catch(err => {
          console.error(err)
        })

      this.$store.dispatch('scores/getSyllabus', { courseNumber: newVal })
    }
  },
  computed: {
    passRate() {
      if (!this.course || !this.course.distribution) {
        return 0
      }

      let sum = this.course.distribution.total

      return (
        (1 -
          (this.course.distribution.D +
            this.course.distribution.E +
            this.course.distribution.X) /
            sum) *
        100
      ).toFixed(1)
    },
    course() {
      if (!this.courseDetailNumber) {
        return {}
      }

      if (this.courseDetailNumber in this.courses) {
        return this.courses[this.courseDetailNumber]
      } else {
        return {}
      }
    }
  }
}
</script>

<style lang="scss">
.score-course-detail {
  .tabs__content {
    height: calc(100vh - 96px);
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 64px;
    user-select: text;
  }
}
</style>
