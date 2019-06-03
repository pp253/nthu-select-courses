<template>
  <v-container fluid pa-0 ma-0 class="h-100" style="transform: translateZ(0);">
    <v-toolbar
      dense
      :dark="style.timeTable.toolbar.dark"
      :color="style.timeTable.toolbar.color"
      style="z-index: 1; position: fixed;"
    >
      <v-toolbar-title>
        {{ $t('SelectCourses.timeTable.title') }}
      </v-toolbar-title>
      <v-spacer />
      <v-menu
        bottom
        left
        lazy
        :close-on-click="true"
        :close-on-content-click="false"
        min-width="200"
        max-width="200"
      >
        <v-btn icon slot="activator">
          <v-icon>zoom_in</v-icon>
        </v-btn>
        <v-card>
          <v-subheader>縮放大小</v-subheader>
          <v-list>
            <v-list-tile
              v-for="index in [0.5, 0.75, 1.0, 1.5, 2.0]"
              :key="index"
              @click="zoom = index"
            >
              <v-list-tile-title>
                {{ `${parseInt(index * 100)}%` }}
              </v-list-tile-title>
              <v-list-tile-avatar v-if="zoom === index">
                <v-icon>check</v-icon>
              </v-list-tile-avatar>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-menu>

      <v-menu
        bottom
        left
        lazy
        :close-on-click="true"
        :close-on-content-click="false"
        min-width="200"
        max-width="200"
      >
        <v-btn icon slot="activator">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-card>
          <v-subheader>顯示</v-subheader>
          <v-list class="pt-0">
            <v-list-tile @click="showColor = !showColor">
              <v-list-tile-title>為課堂上色</v-list-tile-title>
              <v-list-tile-avatar v-if="showColor">
                <v-icon>done</v-icon>
              </v-list-tile-avatar>
            </v-list-tile>

            <v-list-tile @click="showRoom = !showRoom">
              <v-list-tile-title>顯示地點</v-list-tile-title>
              <v-list-tile-avatar v-if="showRoom">
                <v-icon>done</v-icon>
              </v-list-tile-avatar>
            </v-list-tile>

            <v-list-tile @click="showProfessor = !showProfessor">
              <v-list-tile-title>顯示授課教師</v-list-tile-title>
              <v-list-tile-avatar v-if="showProfessor">
                <v-icon>done</v-icon>
              </v-list-tile-avatar>
            </v-list-tile>

            <v-list-tile @click="print">
              列印課表
            </v-list-tile>
          </v-list>
          <v-card-text> </v-card-text>
        </v-card>
      </v-menu>
    </v-toolbar>

    <loading-container
      v-show="
        $wait.is([
          'selectCourses.getSelectionResult',
          'selectCourses.getCurrentSelectedCourses'
        ])
      "
      slot="waiting"
    />

    <v-container
      v-show="
        !$wait.is([
          'selectCourses.getSelectionResult',
          'selectCourses.getCurrentSelectedCourses'
        ])
      "
      px-0
      fluid
      class="time-table"
      :style="
        `zoom: ${zoom}; padding-top: ${48 / zoom}px; padding-bottom: ${64 /
          zoom}px; transform: translateZ(0);`
      "
      id="time-table-content"
      ref="timeTable"
      @scroll="scrollTop = $refs.timeTable.scrollTop"
    >
      <v-layout
        :class="
          `table-row table-head ${scrollTop === 0 ? '' : 'shadow'} ${scrollTop}`
        "
        color="primary"
      >
        <v-flex class="table-row-head"> </v-flex>
        <v-flex xs2>
          {{ $t('SelectCourses.timeTable.weekday.m') }}
        </v-flex>
        <v-flex xs2>
          {{ $t('SelectCourses.timeTable.weekday.t') }}
        </v-flex>
        <v-flex xs2>
          {{ $t('SelectCourses.timeTable.weekday.w') }}
        </v-flex>
        <v-flex xs2>
          {{ $t('SelectCourses.timeTable.weekday.r') }}
        </v-flex>
        <v-flex xs2>
          {{ $t('SelectCourses.timeTable.weekday.f') }}
        </v-flex>
        <v-flex xs2>
          {{ $t('SelectCourses.timeTable.weekday.s') }}
        </v-flex>
      </v-layout>

      <v-layout
        v-for="timeSection in timeSectionName"
        :key="timeSection.name"
        align-space-around
        justify-center
        row
        class="table-row"
      >
        <v-flex d-flex class="table-row-head">
          <v-container pa-0>
            <v-layout align-center wrap>
              <v-flex xs12>
                <span>
                  <span class="time-section-time">
                    {{ timeSection.startTime }}
                  </span>
                  {{ timeSection.name }}
                  <span class="time-section-time">
                    {{ timeSection.endTime }}
                  </span>
                </span>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>

        <v-flex
          d-flex
          xs2
          v-for="weekday in weekdayName"
          :key="weekday"
          :class="
            'table-col ' +
              (previewTime && previewTime.includes(weekday + timeSection.name)
                ? 'preview'
                : '')
          "
        >
          <v-container pa-0>
            <v-layout align-center wrap>
              <v-flex
                xs12
                v-for="course in timeTable[weekday][timeSection.name]"
                :key="course.number"
                @mouseover="$emit('update-preview-time', course.number)"
                @mouseleave="$emit('update-preview-time', '')"
                :class="
                  (course.status === 'waitingForRandom'
                    ? 'highlight '
                    : course.status === 'randomFailed'
                    ? 'highlight '
                    : '') + ' course-cell'
                "
                :style="
                  showColor &&
                    course.color &&
                    `background-color: ${course.color[0]}; color: ${
                      course.color[1]
                    };`
                "
              >
                <div
                  class="vertical-middle-wrapper"
                  :title="
                    `${courses[course.number].title} ${
                      courses[course.number].time
                    }\n${toReadableProfessor(
                      courses[course.number].professor
                    )} ${course.number}\n${toShoterRoom(
                      courses[course.number].room
                    )}`
                  "
                >
                  <span class="two-line">
                    {{ courses[course.number].title }}
                  </span>
                  <span v-if="showProfessor" class="one-line">
                    {{ toReadableProfessor(courses[course.number].professor) }}
                  </span>
                  <span v-if="showRoom" class="one-line">
                    {{ toShoterRoom(courses[course.number].room) }}
                  </span>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
      <v-layout pb-5 v-if="$store.state.selectCourses.phase !== 'current'">
        <v-flex xs12>
          <v-container>
            <span class="">條紋背景</span>
            ：待亂數，目前未選上；或亂數失敗，沒有選上。<br />
          </v-container>
        </v-flex>
      </v-layout>

      <div style="display: none;">
        <table class="time-table-print" id="time-table-print">
          <thead>
            <tr>
              <td colspan="7" style="font-size: 24px; padding: 6px;">
                課表
              </td>
            </tr>
            <tr>
              <td></td>
              <td v-for="w in weekdayName" :key="w">
                {{ $t(`SelectCourses.timeTable.weekday.${w.toLowerCase()}`) }}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="timeSection in timeSectionName" :key="timeSection.name">
              <td>
                <span class="time-section-time">
                  {{ timeSection.startTime }}
                </span>
                {{ timeSection.name }}
                <span class="time-section-time">
                  {{ timeSection.endTime }}
                </span>
              </td>

              <td v-for="weekday in weekdayName" :key="weekday">
                <div
                  v-for="course in timeTable[weekday][timeSection.name]"
                  :key="course.number"
                  class="course"
                  :style="
                    showColor &&
                      course.color &&
                      `background-color: ${course.color[0]}; color: ${
                        course.color[1]
                      };`
                  "
                >
                  <div class="vertical-middle-wrapper">
                    <span>
                      {{ courses[course.number].title }}
                    </span>
                    <span v-if="showProfessor" class="sub">
                      {{
                        toReadableProfessor(courses[course.number].professor)
                      }}
                    </span>
                    <span v-if="showRoom" class="sub">
                      {{ toShoterRoom(courses[course.number].room) }}
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
import { Printd } from 'printd'
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
      showColor: true,
      zoom: 1,
      scrollTop: 0,

      /**
       * These color is from
       * https://www.schemecolor.com/new-meaning-to-life.php
       */
      colorPair: [
        ['#addc78', '#000'],
        ['#D0E534', '#000'],
        ['#E5EFB2', '#000'],
        ['#E5C695', '#000'],
        ['#DDAD82', '#000'],
        ['#D2956B', '#3e0505'],

        ['#C2BCBE', '#201f42'],
        ['#CBC7C6', '#000'],
        ['#E1DCDE', '#000'],
        ['#BECFDD', '#000'],
        ['#AEC4D7', '#000'],
        ['#A1BACF', '#000']
      ],
      colorPairCount: 0
    }
  },
  watch: {
    phase() {
      this.colorPairCount = 0
    },
    isMobile(nv) {
      if (nv) {
        this.zoom = 0.75
      } else {
        this.zoom = 1
      }
    }
  },
  computed: {
    ...mapState('ui', ['isMobile']),
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
    },
    toShoterRoom(room) {
      const reg = /^[a-zA-Z0-9\s]*(.*)$/
      return (room && reg.exec(room)[1]) || ''
    },
    print() {
      const d = new Printd()
      d.print(document.getElementById('time-table-print'), [
        `
.time-table-print {
  border: 2px solid #000;
  width: 100%;
  border-collapse: collapse;
  font-family: -apple-system, '微軟正黑體', 'Microsoft JhengHei',
    BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
}
.time-table-print tr {
  padding: 0;
  margin: 0;
}
.time-table-print td {
  text-align: center;
  border: 1px solid #000;
  padding: 3px;
  margin: 0;
}
.time-table-print tbody td {
  width: 15.5%;
  text-align: center;
  border: 1px solid #000;
  padding: 3px;
  margin: 0;
  vertical-align: middle;
  height: 66px;
}
.course {
  text-align: center;
  white-space: initial;
  min-height: 58px;
  line-height: 58px;
  padding: 3px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.vertical-middle-wrapper {
  display: inline-block;
  vertical-align: middle;
  line-height: 18px;
}
.vertical-middle-wrapper span {
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.vertical-middle-wrapper span:nth-child(1) {
}
.vertical-middle-wrapper span:nth-child(2) {
  margin-top: 8px;
}

.time-table-print td:nth-child(1) {
  width: 7%;
  text-align: center;
  border: 1px solid #000;
  padding: 0;
  margin: 0;
}
.time-table-print td:nth-child(1) span {
  display: block;
  padding: 0;
  margin: 0;
}
.time-table-print td:nth-child(1) span.time-section-time {
  font-size: 9px;
  color: #666;
}
      `
      ])
    }
  }
}
</script>

<style lang="scss">
.time-table {
  $row-head-width: 40px;
  $col-width: 70px;
  $col-height: 16px * 3;

  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 64px;

  .table-head {
    position: sticky;
    top: 0px;
    width: 100%;
    height: 30px;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 2;
    line-height: 30px;
    transition-property: box-shadow;
    transition-duration: 0.2s;

    &.shadow {
      box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
        0px 4px 5px 0px rgba(0, 0, 0, 0.14),
        0px 1px 10px 0px rgba(0, 0, 0, 0.12);
    }
  }

  .table-row {
    min-width: $row-head-width + $col-width * 6;
    border-bottom: 0.5px solid #ccc;

    > .flex {
      border-right: 0.5px solid #ccc;
      font-size: 14px;

      .layout {
        padding: 3px 0 0 0;
      }
    }
  }

  .table-row:nth-child(5),
  .table-row:nth-child(6),
  .table-row:nth-child(11) {
    border-bottom: 3px double #ccc;
  }

  .table-row-head {
    width: $row-head-width;
    text-align: center;
    position: sticky;
    left: 0px;
    background-color: rgba(255, 255, 255, 0.9);
    // z-index: -1;

    span {
      font-size: 16px;

      .time-section-time {
        font-size: 9px;
        color: rgba(0, 0, 0, 0.6);
        display: block;
      }
    }
  }

  .preview {
    background-color: rgba(0, 0, 0, 0.3);
  }

  .course-cell {
    text-align: center;
    white-space: initial;
    min-height: $col-height;
    line-height: $col-height;
    margin: 0 3px 3px 3px;
    padding: 0 3px 3px 3px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    overflow: hidden;

    .vertical-middle-wrapper {
      display: inline-block;
      vertical-align: middle;
      line-height: 18px;

      span {
        text-overflow: ellipsis;
        width: 100%;
        /**
          FIXME: firefox doesnot support!
        */
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      span.one-line {
        -webkit-line-clamp: 1;
      }

      span.two-line {
        -webkit-line-clamp: 2;
      }
    }

    &.highlight {
      background: repeating-linear-gradient(
        -45deg,
        rgba(255, 255, 255, 0.3),
        rgba(255, 255, 255, 0.3) 6px,
        transparent 6px,
        transparent 12px
      );
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
}

.theme--dark {
  .time-table {
    .table-head {
      background-color: #424242;
    }
    .table-row-head {
      background-color: #424242;
    }

    span {
      .time-section-time {
        color: rgba(255, 255, 255, 0.3);
      }
    }

    .preview {
      background-color: rgba(255, 255, 255, 0.3);
    }

    .course-cell {
      background-color: rgba(255, 255, 255, 0.4);
    }
  }
}
</style>
