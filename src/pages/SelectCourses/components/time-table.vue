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
              ripple
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
          <v-card-text class="pt-0">
            <v-checkbox
              v-model="showRoom"
              :label="`顯示地點`"
              color="primary"
              hide-details
            />
            <v-checkbox
              v-model="showProfessor"
              :label="`顯示授課教師`"
              color="primary"
              hide-details
            />
            <v-checkbox
              v-model="showColor"
              :label="`為課堂上色`"
              color="primary"
              hide-details
            />
          </v-card-text>
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
      pa-0
      fluid
      class="time-table"
      :style="
        `zoom: ${zoom}; padding-top: ${48 /
          zoom}px !important; padding-bottom: ${64 / zoom}px !important;`
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
            'table-col' +
              (previewTime && previewTime.includes(weekday + timeSection.name)
                ? ' purple lighten-4 preview'
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
                <span
                  class="vertical-middle-wrapper"
                  :title="
                    `${courses[course.number].title} ${
                      courses[course.number].time
                    }\n${toReadableProfessor(
                      courses[course.number].professor
                    )} ${course.number}\n${courses[course.number].room}`
                  "
                >
                  <span class="two-line">
                    {{ courses[course.number].title }}
                  </span>
                  <span v-if="showProfessor" class="one-line">
                    {{ toReadableProfessor(courses[course.number].professor) }}
                  </span>
                  <span v-if="showRoom" class="one-line">
                    {{ courses[course.number].room }}
                  </span>
                </span>
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
      showColor: true,
      zoom: 1,
      scrollTop: 0,

      /**
       * These color is from
       * https://www.schemecolor.com/new-meaning-to-life.php
       */
      colorPair: [
        ['#74A73A', '#fff'],
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
        ['#A1BACF', '#043b3e']
      ],
      colorPairCount: 0
    }
  },
  watch: {
    phase() {
      this.colorPairCount = 0
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

    .course-cell {
      background-color: rgba(255, 255, 255, 0.4);
    }
  }
}
</style>
