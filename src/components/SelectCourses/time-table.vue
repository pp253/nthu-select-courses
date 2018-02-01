<template>
  <v-container fluid pa-0 ma-0 class="full-height">
    <v-toolbar dense>
      <v-toolbar-title>{{ $t('timeTable.title') }}</v-toolbar-title>
    </v-toolbar>
    <v-container class="time-table">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>{{ $t('timeTable.weekday.m') }}</th>
            <th>{{ $t('timeTable.weekday.t') }}</th>
            <th>{{ $t('timeTable.weekday.w') }}</th>
            <th>{{ $t('timeTable.weekday.r') }}</th>
            <th>{{ $t('timeTable.weekday.f') }}</th>
            <th>{{ $t('timeTable.weekday.s') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="timeSection in timeSectionName"
            :key="timeSection"
            :class="'time-section-' + timeSection"
          >
            <th>{{ timeSection }}</th>
            <td
              v-for="weekday in weekdayName"
              :key="weekday"
              :class="previewTime.includes(weekday + timeSection) ? 'cyan lighten-4 preview' : ''"
            >
              <div
                v-for="course in timeTable[weekday][timeSection]"
                :key="course.number"
                class="green--after"
              >{{ courses[course.number].title }}</div>
            </td>
          </tr>
        </tbody>
      </table>
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
      courses: {},
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
  },
  mounted () {
    this.courses = this.$store.state.selectCourses.courses
  }
}
</script>

<style lang="scss">
.time-table {
  height: calc(100% - 48px);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 64px;

  table {
    table-layout: fixed;
    min-width: 500px;
    width: 100%;
    min-height: 100%;
    text-align: center;
    border-collapse: collapse;
    
    tbody {
      tr td{
        // In table, height means min-height
        height: 16px * 4;
        width: 100px;
        border: 1px solid #aaa;
        vertical-align: middle;

        .course {
          background-color: #999;
        }
      }

      .preview {
        border-color: #aaa !important;
      }

      tr.time-section-n td, tr.time-section-5 td, tr.time-section-a td {
        border-top: 3px double #aaa;
      }
    }

    thead th, th {
      height: 16px * 2;
      width: 30px;
    }
  }
}
</style>
