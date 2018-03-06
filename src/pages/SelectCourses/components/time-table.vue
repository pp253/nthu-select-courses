<template>
  <v-container fluid pa-0 ma-0 class="full-height">
    <v-toolbar dense>
      <v-toolbar-title>{{ $t('timeTable.title') }}</v-toolbar-title>
      <v-spacer />
      <v-menu
        offset-y
        :close-on-click="true"
        :close-on-content-click="false"
        min-width="250"
        max-width="250"
      >
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-card>
          <v-card-text>
            <v-switch
              v-model="showRoom"
              :label="`顯示地點`"
            />
            <v-switch
              v-model="showProfessor"
              :label="`顯示授課教師`"
            />
            <v-switch
              v-model="showCourseNumber"
              :label="`顯示科號`"
            />
          </v-card-text>
        </v-card>
      </v-menu>
    </v-toolbar>
    <v-container fluid class="time-table">
      <div class="table">
        <div class="table-head">
          <div class="table-row">
            <div class="table-col col-title"></div>
            <div class="table-col">{{ $t('timeTable.weekday.m') }}</div>
            <div class="table-col">{{ $t('timeTable.weekday.t') }}</div>
            <div class="table-col">{{ $t('timeTable.weekday.w') }}</div>
            <div class="table-col">{{ $t('timeTable.weekday.r') }}</div>
            <div class="table-col">{{ $t('timeTable.weekday.f') }}</div>
            <div class="table-col">{{ $t('timeTable.weekday.s') }}</div>
          </div>
        </div>
        <div class="table-body">
          <div
            v-for="timeSection in timeSectionName"
            :key="timeSection"
            :class="'table-row time-section-' + timeSection"
          >
            <div class="table-col col-title">{{ timeSection }}</div>
            <div
              v-for="weekday in weekdayName"
              :key="weekday"
              :class="'table-col' + (previewTime.includes(weekday + timeSection) ? ' cyan lighten-4 preview' : '')"
            >
              <div
                v-for="course in timeTable[weekday][timeSection]"
                :key="course.number"
                @mouseover="$emit('update-preview-time', course.number)"
                @mouseleave="$emit('update-preview-time', '')"
                :class="course.status === 'waitingForRandom' ? 'light-blue--text' : (course.status === 'randomFailed' ? 'red--text ' : '')"
              >
                <span
                >{{ courses[course.number].title }}</span>
                <span
                  v-if="showCourseNumber"
                  class="grey--text text--darken-1"
                ><br>{{ courses[course.number].number }}</span>
                <span
                  v-if="showProfessor"
                  class="grey--text text--darken-1"
                ><br>{{ courses[course.number].professor }}</span>
                <span
                  v-if="showRoom"
                  class="grey--text text--darken-1"
                ><br>{{ courses[course.number].room }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <v-layout pb-5>
        <v-flex xs12>
          <span class="light-blue--text">藍字</span>：待亂數，目前未選上。<br>
          <span class="red--text">紅字</span>：亂數失敗，未選上。
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: 'TimeTable',
  props: {
    'preview-time': String,
    list: Array,
    title: String,
    courses: Object
  },
  data() {
    return {
      timeSectionName: [
        '1',
        '2',
        '3',
        '4',
        'n',
        '5',
        '6',
        '7',
        '8',
        '9',
        'a',
        'b',
        'c'
      ],
      weekdayName: ['M', 'T', 'W', 'R', 'F', 'S'],
      showRoom: false,
      showProfessor: false,
      showCourseNumber: false
    }
  },
  computed: {
    timeTable() {
      let table = {}
      for (let weekday of this.weekdayName) {
        table[weekday] = {}
        for (let timeSection of this.timeSectionName) {
          table[weekday][timeSection] = []
        }
      }
      for (let course of this.list) {
        if (course.header) {
          continue
        }
        for (let i = 0; i < this.courses[course.number].time.length; i += 2) {
          let list = /([MTWRFS])([1-9abcnABCN])/g.exec(
            this.courses[course.number].time.slice(i, i + 2)
          )
          table[list[1].toUpperCase()][list[2].toLowerCase()].push(course)
        }
      }
      return table
    }
  }
}
</script>

<style lang="scss">
.time-table {
  height: calc(100% - 48px);
  overflow: auto;
  -webkit-overflow-scrolling: touch;

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
