<template>
  <v-container fluid pa-0 ma-0 class="full-height">
    <v-toolbar dense>
      <v-toolbar-title>{{ $t('timeTable.title') }}</v-toolbar-title>
    </v-toolbar>
    <v-container fluid pa-0 ma-0 class="time-table">
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
                class="green--after"
              >{{ courses[course.number].title }}</div>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: 'TimeTable',
  props: {
    'preview-time': String,
    'list': Array,
    'title': String
  },
  data () {
    return {
      courses: this.$store.state.selectCourses.courses,
      timeSectionName: ['1', '2', '3', '4', 'n', '5', '6', '7', '8', '9', 'a', 'b', 'c'],
      weekdayName: ['M', 'T', 'W', 'R', 'F', 'S']
    }
  },
  computed: {
    timeTable () {
      let table = {}
      for (let weekday of this.weekdayName) {
        table[weekday] = {}
        for (let timeSection of this.timeSectionName) {
          table[weekday][timeSection] = []
        }
      }

      for (let course of this.list) {
        for (let i = 0; i < this.courses[course.number].time.length; i += 2) {
          let list = /([MTWRFS])([1-9abcnABCN])/g.exec(this.courses[course.number].time.slice(i, i + 2))
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
    padding: 16px;
    padding-bottom: 64px;
    min-height: 100%;
    text-align: center;
    border-collapse: collapse;
    background-color: unset;

    .table-row {
      width: 100%;
      white-space: nowrap;
      display: table;

      .table-col{
        display: table-cell;
        height: $col-height;
        min-width: $col-width;
        width: calc(100% - 30px);
        border: 1px solid #aaa;
        border-bottom: none;
        vertical-align: middle;

        .course {
          background-color: #999;
        }
      }

      .table-col.col-title {
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

    .table-head, .table-body {
      width: fit-content;
      min-width: 100%;
    }

    .table-head .table-row .table-col {
      height: $title-height;
      font-size: $title-font-size;
      border: none !important;
    }
    
    .table-body {
      .preview {
        border-color: #aaa !important;
      }
    }
  }
}
</style>
