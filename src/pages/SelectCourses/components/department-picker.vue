<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$store.state.ui.isMobile"
    max-width="500px"
    persistent
  >
    <v-card class="department-picker">
      <v-card-title class="headline">
        {{ $t('departmentPicker.title') }}
      </v-card-title>
      <v-card-text class="pt-0">
        <v-tabs v-model="activeTabs">
          <v-tabs-items>
            <v-tabs-content id="department">
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="searchText"
                    type="text"
                    value=""
                    prepend-icon="search"
                    clearable
                    hide-details
                    class="pl-3 pr-3 pb-3"
                  />
                </v-flex>
                <v-flex xs12 class="limit-height flex-department">
                  <v-list>
                    <template
                      v-for="(department, departmentAbbr) in searchList"
                    >
                      <v-list-tile
                        ripple
                        :key="departmentAbbr"
                        @click="choosedDepartment = departmentAbbr; choosedClass = ''; activeTabs = 'class'"
                        :class="choosedDepartment === departmentAbbr ? 'list__tile--active' : ''"
                      >
                        <v-list-tile-content>{{ department.chineseName }} {{ department.abbr }}</v-list-tile-content>
                      </v-list-tile>
                      <v-divider :key="departmentAbbr + '-divider'" />
                    </template>
                  </v-list>
                </v-flex>
              </v-layout>
            </v-tabs-content>
            <v-tabs-content id="class">
              <v-layout wrap>
                <v-flex xs12 class="toolbar__content">
                  <v-btn icon flat @click="activeTabs = 'department'">
                    <v-icon>arrow_back</v-icon>
                  </v-btn>
                  <span class="toolbar__title ml-0">{{choosedDepartment}} {{getDepartmentDetail(choosedDepartment).chineseName || getDepartmentDetail(choosedDepartment).name}}</span>
                </v-flex>
                <v-flex xs12 class="limit-height flex-class">
                  <v-list
                    v-if="choosedDepartment !== ''"
                  >
                    <v-list-tile
                      ripple
                      :key="choosedDepartment"
                      @click="choosedClass = ''"
                      :class="choosedClass === '' ? 'list__tile--active' : ''"
                    >
                      <v-list-tile-content>總錄</v-list-tile-content>
                    </v-list-tile>
                    <template
                      v-for="cls in departments[choosedDepartment].classes"
                    >
                      <v-list-tile
                        ripple
                        :key="cls.abbr"
                        @click="choosedClass = cls.abbr"
                        :class="choosedClass === cls.abbr ? 'list__tile--active' : ''"
                      >
                        <v-list-tile-content>{{ cls.abbr }} {{ cls.name }}</v-list-tile-content>
                      </v-list-tile>
                    </template>
                  </v-list>
                </v-flex>
              </v-layout>
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
  .flex-college,
  .flex-department,
  .flex-class {
    li.list__tile--active a div {
      color: #1976d2 !important;
    }
  }

  .layout {
    overflow-x: auto;
  }

  .limit-height {
    min-width: 156px;
    height: 50vh;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .flex-class.limit-height {
    height: calc(50vh + 18px);
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
