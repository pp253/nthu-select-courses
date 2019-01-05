<template>
  <v-container fluid
               pa-0
               ma-0
               class="h-100">
    <v-toolbar dense
               :dark="style.timeTable.toolbar.dark"
               :color="style.timeTable.toolbar.color">
      <v-toolbar-title>{{ $t('SelectCourses.timeTable.title') }}</v-toolbar-title>
      <v-spacer />
      <v-menu bottom
              left
              lazy
              :close-on-click="true"
              :close-on-content-click="false"
              min-width="200"
              max-width="200">
        <v-btn icon
               slot="activator">
          <v-icon>zoom_in</v-icon>
        </v-btn>
        <v-card>
          <v-subheader>縮放大小</v-subheader>
          <v-list>
            <v-list-tile v-for="index in [0.50, 0.75, 1.00, 1.50, 2.00]"
                         :key="index"
                         @click="zoom = index"
                         ripple>
              <v-list-tile-title>{{`${parseInt(index * 100)}%`}}</v-list-tile-title>
              <v-list-tile-avatar v-if="zoom === index">
                <v-icon>check</v-icon>
              </v-list-tile-avatar>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-menu>

      <v-menu bottom
              left
              lazy
              :close-on-click="true"
              :close-on-content-click="false"
              min-width="200"
              max-width="200">
        <v-btn icon
               slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-card>
          <v-subheader>顯示</v-subheader>
          <v-card-text class="pt-0">
            <v-checkbox v-model="showRoom"
                        :label="`顯示地點`"
                        color="primary"
                        hide-details />
            <v-checkbox v-model="showProfessor"
                        :label="`顯示授課教師`"
                        color="primary"
                        hide-details />
            <v-checkbox v-model="showCourseNumber"
                        :label="`顯示科號`"
                        color="primary"
                        hide-details />
            <v-checkbox v-model="showColor"
                        :label="`為課堂上色`"
                        color="primary"
                        hide-details />
          </v-card-text>
        </v-card>
      </v-menu>
    </v-toolbar>
    <loading-container v-if="$wait.is(['selectCourses.getSelectionResult', 'selectCourses.getCurrentSelectedCourses'])"
                       slot="waiting" />
    <v-container v-else
                 fluid
                 class="time-table"
                 :style="`zoom: ${zoom}`">

      <div class="table">
        <div class="table-head">
          <div class="table-row">
            <div class="table-col col-title col-title-time"></div>
            <div class="table-col col-title"></div>
            <div class="table-col">{{ $t('SelectCourses.timeTable.weekday.m') }}</div>
            <div class="table-col">{{ $t('SelectCourses.timeTable.weekday.t') }}</div>
            <div class="table-col">{{ $t('SelectCourses.timeTable.weekday.w') }}</div>
            <div class="table-col">{{ $t('SelectCourses.timeTable.weekday.r') }}</div>
            <div class="table-col">{{ $t('SelectCourses.timeTable.weekday.f') }}</div>
            <div class="table-col">{{ $t('SelectCourses.timeTable.weekday.s') }}</div>
          </div>
        </div>
        <div class="table-body">
          <div v-for="timeSection in timeSectionName"
               :key="timeSection.name"
               :class="'table-row time-section-' + timeSection.name">
            <div class="table-col col-title col-title-time">{{ timeSection.startTime }}<br>{{ timeSection.endTime }}</div>
            <div class="table-col col-title">{{ timeSection.name }}</div>
            <div v-for="weekday in weekdayName"
                 :key="weekday"
                 :class="'table-col' + (previewTime && previewTime.includes(weekday + timeSection.name) ? ' purple lighten-4 preview' : '')">
              <div v-for="course in timeTable[weekday][timeSection.name]"
                   :key="course.number"
                   :title="`${courses[course.number].title} ${courses[course.number].time}\n${toReadableProfessor(courses[course.number].professor)} ${course.number}\n${courses[course.number].room}`"
                   @mouseover="$emit('update-preview-time', course.number)"
                   @mouseleave="$emit('update-preview-time', '')"
                   :class="course.status === 'waitingForRandom' ? 'light-blue--text' : (course.status === 'randomFailed' ? 'red--text ' : '')"
                   :style="showColor && course.color && `background-color: ${course.color[0]}; color: ${course.color[1]};`">
                <span>{{ courses[course.number].title }}</span>
                <span v-if="
                      showCourseNumber"><br>{{ courses[course.number].number }}</span>
                <span v-if="showProfessor"><br>{{ toReadableProfessor(courses[course.number].professor) }}</span>
                <span v-if="showRoom"><br>{{ courses[course.number].room }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-layout pb-5
                v-if="$store.state.selectCourses.phase !== 'current'">
        <v-flex xs12>
          <span class="">黑字</span>：已選上。<br>
          <span class="info--text">藍字</span>：待亂數，目前未選上。<br>
          <span class="error--text">紅字</span>：亂數失敗，未選上。
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import {
  VMenu,
  VToolbar,
  VToolbarTitle,
  VBtn,
  VList,
  VListTile,
  VListTileAvatar,
  VListTileTitle,
  VCheckbox,
  VIcon
} from 'vuetify/lib'
import { mapGetters, mapState } from 'vuex'
import LoadingContainer from '@/components/loading-container'

export default {
  name: 'TimeTable',
  components: {
    LoadingContainer,
    VMenu,
    VToolbar,
    VToolbarTitle,
    VBtn,
    VList,
    VListTile,
    VListTileAvatar,
    VListTileTitle,
    VCheckbox,
    VIcon
  },
  props: {
    'preview-time': String,
    list: Array,
    title: String,
    courses: Object
  },
  data() {
    return {
      timeSectionName: [
        { name: '1', startTime: '08:00', endTime: '08:50' },
        { name: '2', startTime: '09:00', endTime: '09:50' },
        { name: '3', startTime: '10:10', endTime: '11:00' },
        { name: '4', startTime: '11:10', endTime: '12:00' },
        { name: 'n', startTime: '12:10', endTime: '13:00' },
        { name: '5', startTime: '13:20', endTime: '14:10' },
        { name: '6', startTime: '14:20', endTime: '15:10' },
        { name: '7', startTime: '15:30', endTime: '16:20' },
        { name: '8', startTime: '16:30', endTime: '17:20' },
        { name: '9', startTime: '17:30', endTime: '18:20' },
        { name: 'a', startTime: '18:30', endTime: '19:20' },
        { name: 'b', startTime: '19:30', endTime: '20:20' },
        { name: 'c', startTime: '20:30', endTime: '21:30' }
      ],
      weekdayName: ['M', 'T', 'W', 'R', 'F', 'S'],
      showRoom: false,
      showProfessor: false,
      showCourseNumber: false,
      showColor: true,
      zoom: 1,

      /**
       * These color is from
       * https://sashat.me/2017/01/11/list-of-20-simple-distinct-colors/
       */
      colorPair: [
        ['#e6194B', '#fff'],
        ['#3cb44b', '#fff'],
        ['#ffe119', '#000'],
        ['#4363d8', '#fff'],
        ['#f58231', '#fff'],
        ['#911eb4', '#fff'],
        ['#42d4f4', '#000'],
        ['#f032e6', '#fff'],
        ['#bfef45', '#000'],
        ['#fabebe', '#000'],
        ['#469990', '#fff'],
        ['#e6beff', '#000'],
        ['#9A6324', '#fff'],
        ['#800000', '#fff'],
        ['#aaffc3', '#000'],
        ['#808000', '#fff'],
        ['#ffd8b1', '#000'],
        ['#000075', '#fff'],
        ['#a9a9a9', '#000']
      ],
      colorPairCount: 0
    }
  },
  watch: {
    phase(newVal) {
      if (newVal !== 'current') {
        this.showColor = false
      } else {
        this.showColor = true
      }
    }
  },
  computed: {
    ...mapState('selectCourses', ['phase', 'style']),
    ...mapGetters('selectCourses', ['toReadableProfessor']),
    timeTable() {
      let table = {}
      for (let weekday of this.weekdayName) {
        table[weekday] = {}
        for (let timeSection of this.timeSectionName) {
          table[weekday][timeSection.name] = []
        }
      }
      if (!this.list) {
        return table
      }
      for (let course of this.list) {
        if (course.header) {
          continue
        }
        if (!this.courses[course.number].time) {
          continue
        }
        for (let i = 0; i < this.courses[course.number].time.length; i += 2) {
          let list = /([MTWRFS])([1-9abcnABCN])/g.exec(
            this.courses[course.number].time.slice(i, i + 2)
          )
          if (this.showColor && !course.color) {
            course.color = this.getRandomColor()
          }
          table[list[1].toUpperCase()][list[2].toLowerCase()].push(course)
        }
      }
      return table
    }
  },
  methods: {
    getRandomColor() {
      let color = this.colorPair[this.colorPairCount]
      this.colorPairCount = (this.colorPairCount + 1) % this.colorPair.length
      return color
    }
  }
}
</script>

<style lang="scss">
.time-table {
  height: calc(100% - 48px);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 64px;

  .table {
    $title-width: 30px;
    $title-height: 16px * 2;
    $title-font-size: 16px;
    $col-width: 100px;
    $col-height: 16px * 4;

    width: fit-content;
    min-width: 100%;
    padding-right: 16px;
    padding-bottom: 16px;
    min-height: 100%;
    text-align: center;
    border-collapse: collapse;
    background-color: unset;

    .table-row {
      width: 100%;
      white-space: nowrap;
      display: table;
      table-layout: fixed;

      .table-col {
        display: table-cell;
        height: $col-height;
        min-width: $col-width;
        width: $col-width;
        border: 1px solid #aaa;
        border-bottom: none;
        vertical-align: middle;

        .course {
          background-color: #999;
          height: 100%;
        }

        > div {
          white-space: initial;
        }
      }

      .table-col.col-title {
        user-select: none;
        width: $title-width;
        min-width: $title-width;
        border: none !important;
        font-size: $title-font-size;
      }

      .table-col.col-title.col-title-time {
        width: 60px;
      }
    }

    .table-row.time-section-n .table-col,
    .table-row.time-section-5 .table-col,
    .table-row.time-section-a .table-col {
      border-top: 3px double #aaa;
    }

    .table-row.time-section-c .table-col {
      border-bottom: 1px solid #aaa;
    }

    .table-head,
    .table-body {
      width: fit-content;
      min-width: 100%;
    }

    .table-head .table-row .table-col {
      height: $title-height;
      font-size: $title-font-size;
      border: none !important;
    }

    .table-body {
      user-select: text;

      .preview {
        border-color: #aaa !important;
      }
    }
  }
}
</style>
