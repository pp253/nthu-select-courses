<template>
  <v-container class="time-table">
    <table>
      <thead>
        <tr>
          <th></th>
          <th>一</th>
          <th>二</th>
          <th>三</th>
          <th>四</th>
          <th>五</th>
          <th>六</th>
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
              >{{ course.title }}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </v-container>
</template>

<script>
import store from '../lib/store'

export default {
  name: 'TimeTable',
  props: {
    'preview-time': String
  },
  data () {
    return {
      timeSectionName: ['1', '2', '3', '4', 'n', '5', '6', '7', '8', '9', 'a', 'b', 'c'],
      weekdayName: ['M', 'T', 'W', 'R', 'F', 'S']
    }
  },
  watch: {
    previewTime (nV, oV) {
      return this.previewTime
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

      for (let course of store.user.selectedCoursesDetail) {
        for (let i = 0; i < course.time.length; i += 2) {
          let list = /([MTWRFS])([1-9abcnABCN])/g.exec(course.time.slice(i, i + 2))
          table[list[1].toUpperCase()][list[2].toLowerCase()].push(course)
        }
      }
      return table
    }
  },
  methods: {
    

  }
}
</script>

<style lang="scss">
.time-table {
  height: calc(100vh - 48px);
  overflow: auto;

  table {
    table-layout: fixed;
    min-width: 100%;
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
