<template>
  <v-dialog v-model="dialog" :fullscreen="$store.state.ui.isMobile" max-width="500px" persistent scrollable>
    <v-card class="department-picker dialog-full-scrollable">
      <v-card-title>
        <v-container class="ma-0 pa-0">
          <v-layout>
            <v-flex xs12 class="headline">{{ $t('SelectCourses.departmentPicker.title') }}</v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs12 v-if="activeTabs === 'department'">
              <v-text-field v-model="searchText" type="text" value="" prepend-icon="search" clearable hide-details />
            </v-flex>
            <v-flex xs12 v-else-if="activeTabs === 'class'" class="toolbar__content">
              <v-btn icon flat @click="activeTabs = 'department'" class="ml-0 mb-0" style="margin-top: 14px;">
                <v-icon>arrow_back</v-icon>
              </v-btn>
              <span class="toolbar__title ml-0" style="margin-top: 14px;">{{choosedDepartment}} {{getDepartmentDetail(choosedDepartment).chineseName || getDepartmentDetail(choosedDepartment).name}}</span>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-title>
      <v-card-text class="limit-height pa-0">
        <v-tabs v-model="activeTabs">
          <v-tabs-items>
            <v-tabs-content id="department">
              <v-list>
                <template v-for="(department, departmentAbbr) in searchList">
                  <v-list-tile ripple :key="departmentAbbr" @click="choosedDepartment = departmentAbbr; choosedClass = ''; activeTabs = 'class'">
                    <v-list-tile-content :class="choosedDepartment === departmentAbbr ? 'primary--text' : ''">
                      <v-container px-0>
                        <v-layout>
                          <v-flex xs3 md2>{{ department.abbr }}</v-flex>
                          <v-flex xs9 md10>{{ department.chineseName }}</v-flex>
                        </v-layout>
                      </v-container>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider :key="departmentAbbr + '-divider'" />
                </template>
              </v-list>
            </v-tabs-content>
            <v-tabs-content id="class">
              <v-list v-if="choosedDepartment !== ''">
                <v-list-tile ripple :key="choosedDepartment" @click="choosedClass = ''">
                  <v-list-tile-content :class="choosedClass === '' ? 'primary--text' : ''">總錄</v-list-tile-content>
                </v-list-tile>
                <v-divider />
                <template v-for="cls in departments[choosedDepartment].classes">
                  <v-list-tile ripple :key="cls.abbr" @click="choosedClass = cls.abbr">
                    <v-list-tile-content :class="choosedClass === cls.abbr ? 'primary--text' : ''">{{ cls.name }} {{ cls.abbr }}</v-list-tile-content>
                  </v-list-tile>
                  <v-divider :key="cls.abbr + '-divider'" />
                </template>
              </v-list>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="close()">{{ $t('dialog.Cancel') }}</v-btn>
        <v-btn color="primary" flat @click="done()">{{ $t('dialog.Apply') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DepartmentPicker',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      departments: this.$store.state.selectCourses.departments,
      choosedDepartment: '',
      choosedClass: '',
      searchText: '',
      dialog: false,
      activeTabs: 'department'
    }
  },
  watch: {
    value(newVal) {
      this.dialog = newVal
    }
  },
  computed: {
    searchList() {
      if (!this.searchText) {
        return this.departments
      }

      let searchText = this.searchText.toLowerCase()
      let list = {}
      for (let deptAbbr in this.departments) {
        let department = this.departments[deptAbbr]
        if (
          (department.chineseName &&
            department.chineseName.toLowerCase().includes(searchText)) ||
          (department.name &&
            department.name.toLowerCase().includes(searchText)) ||
          // (department.englishName && department.englishName.toLowerCase().includes(searchText)) ||
          department.abbr.toLowerCase().includes(searchText)
        ) {
          list[deptAbbr] = this.departments[deptAbbr]
        }
      }
      return list
    }
  },
  methods: {
    done() {
      this.dialog = false
      this.$emit('close')
      if (this.choosedDepartment !== '') {
        this.$emit(
          'update-department',
          this.choosedClass || this.choosedDepartment
        )
      }
    },
    getDepartmentDetail(abbr) {
      if (abbr.length <= 4 && abbr in this.departments) {
        // Department
        return this.departments[abbr]
      } else {
        // Class
        for (let deptAbbr in this.departments) {
          for (let cls of this.departments[deptAbbr].classes) {
            if (cls.abbr === abbr) {
              return cls
            }
          }
        }
      }
      return {}
    },
    close() {
      this.dialog = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.department-picker {
  .layout {
    overflow-x: auto;
  }

  .limit-height {
    min-width: 156px;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}

.mode-mobile {
  .department-picker {
    .flex-department.limit-height {
      height: calc(100vh - 52px - 48px - 64px - 18px - 16px - 64px);
    }

    .flex-class.limit-height {
      height: calc(100vh - 52px - 48px - 64px - 16px - 64px);
    }
  }
}
</style>
