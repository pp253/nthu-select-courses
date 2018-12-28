<template>
  <v-dialog v-model="dialog"
            :fullscreen="$store.state.ui.isMobile"
            max-width="300px"
            scrollable
            persistent>
    <v-card class="period-picker dialog-full-scrollable">
      <v-card-title class="headline">{{ $t('SelectCourses.periodPicker.title') }}</v-card-title>
      <v-card-text>
        <v-layout>
          <v-flex v-for="weekday in weekdayName"
                  :key="weekday">
            <v-layout wrap
                      text-xs-center>
              <v-flex xs12
                      pb-2
                      class="weekday">
                {{ $t(`SelectCourses.timeTable.weekday.${weekday.toLowerCase()}`) }}
                <v-divider />
              </v-flex>

              <v-flex v-for="timeSection in timeSectionName"
                      :key="timeSection"
                      xs12>
                <v-btn @click="togglePeriod(weekday + timeSection)"
                       :flat="!periods.includes(weekday + timeSection)"
                       :color="periods.includes(weekday + timeSection) ? 'primary' : ''"
                       icon
                       small>
                  {{timeSection}}
                </v-btn>
                <v-divider v-if="['4', 'n', '9'].includes(timeSection)" />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-btn flat
               @click="clearPeriods"
               color="error">{{ $t('dialog.Clear') }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn flat
               @click="close()">{{ $t('dialog.Cancel') }}</v-btn>
        <v-btn color="primary"
               flat
               @click="done()">{{ $t('dialog.Apply') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { VDialog, VBtn } from 'vuetify/lib'

export default {
  name: 'PeriodPicker',
  components: {
    VDialog,
    VBtn
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
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
      periods: []
    }
  },
  watch: {
    value(newVal) {
      this.dialog = newVal
    }
  },
  methods: {
    done() {
      this.dialog = false
      this.$emit('close')
      this.$emit('update-periods', this.periods.slice())
    },
    togglePeriod(period) {
      if (this.periods.includes(period)) {
        this.periods.splice(this.periods.indexOf(period), 1)
      } else {
        this.periods.push(period)
        this.periods.sort((a, b) => {
          if (a[0] !== b[0]) {
            return (
              this.weekdayName.indexOf(a[0]) - this.weekdayName.indexOf(b[0])
            )
          } else {
            return (
              this.timeSectionName.indexOf(a[1]) -
              this.timeSectionName.indexOf(b[1])
            )
          }
        })
      }
    },
    clearPeriods() {
      this.periods = []
    },
    close() {
      this.dialog = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.period-picker {
  .v-card__text {
    max-height: calc(100vh - 64px - 52px);
    overflow-y: auto;

    .weekday {
      hr {
        margin-top: 12px;
      }
    }

    .v-btn {
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
