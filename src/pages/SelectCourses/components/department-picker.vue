<template>
  <v-dialog v-model="dialog"
            :fullscreen="$store.state.ui.isMobile"
            max-width="500px"
            persistent
            scrollable>
    <v-card class="department-picker dialog-full-scrollable">
      <v-card-title>
        <v-container class="ma-0 pa-0">
          <v-layout>
            <v-flex xs12
                    class="headline">{{ $t('SelectCourses.departmentPicker.title') }}</v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex xs12
                    v-if="activeTabs === 'department'">
              <v-text-field v-model="searchText"
                            type="text"
                            value=""
                            prepend-icon="search"
                            clearable
                            hide-details />
            </v-flex>
            <v-flex xs12
                    v-else-if="activeTabs === 'class'"
                    class="toolbar__content">
              <v-btn icon
                     flat
                     @click="activeTabs = 'department'"
                     class="ml-0 mb-0"
                     style="margin-top: 14px;">
                <v-icon>arrow_back</v-icon>
              </v-btn>
              <span class="toolbar__title ml-0"
                    style="margin-top: 14px;">{{choosedDepartment}} {{getDepartmentDetail(choosedDepartment).chineseName || getDepartmentDetail(choosedDepartment).name}}</span>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-title>
      <v-card-text class="vh-100 pa-0">
        <v-tabs v-model="activeTabs"
                class="h-100">
          <v-tabs-items class="h-100">
            <v-tabs-content class="h-100"
                            id="department">
              <v-list class="h-100 overflow-auto">
                <v-subheader>先選科系，再選班級</v-subheader>
                <v-subheader v-if="!searchText">常用</v-subheader>
                <template v-if="!searchText"
                          v-for="(department, departmentAbbr) in preallocate">
                  <v-list-tile ripple
                               :key="departmentAbbr + '-popular'"
                               @click="choosedDepartment = departmentAbbr; choosedClass = ''; activeTabs = 'class'">
                    <v-list-tile-content :class="choosedDepartment === departmentAbbr ? 'primary--text' : ''">
                      <v-container px-0>
                        <v-layout>
                          <v-flex xs3
                                  md2>{{ department.abbr }}</v-flex>
                          <v-flex xs9
                                  md10>{{ department.chineseName }}</v-flex>
                        </v-layout>
                      </v-container>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider :key="departmentAbbr + '-popular-divider'" />
                </template>

                <v-subheader>全部</v-subheader>
                <template v-for="(department, departmentAbbr) in searchList">
                  <v-list-tile ripple
                               :key="departmentAbbr"
                               @click="choosedDepartment = departmentAbbr; choosedClass = ''; activeTabs = 'class'">
                    <v-list-tile-content :class="choosedDepartment === departmentAbbr ? 'primary--text' : ''">
                      <v-container px-0>
                        <v-layout>
                          <v-flex xs3
                                  md2>{{ department.abbr }}</v-flex>
                          <v-flex xs9
                                  md10>{{ department.chineseName }}</v-flex>
                        </v-layout>
                      </v-container>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider :key="departmentAbbr + '-divider'" />
                </template>
              </v-list>
            </v-tabs-content>
            <v-tabs-content class="h-100"
                            id="class">
              <v-list class="h-100 overflow-auto"
                      v-if="choosedDepartment !== ''">
                <v-list-tile ripple
                             :key="choosedDepartment"
                             @click="choosedClass = ''">
                  <v-list-tile-content :class="choosedClass === '' ? 'primary--text' : ''">總錄</v-list-tile-content>
                </v-list-tile>
                <v-divider />
                <template v-for="cls in departments[choosedDepartment].classes">
                  <v-list-tile ripple
                               :key="cls.abbr"
                               @click="choosedClass = cls.abbr">
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
      activeTabs: 'department',
      preallocate: {
        GE: {
          abbr: 'GE',
          chineseName: '通識中心',
          englishName: 'General Education Center',
          classes: []
        },
        GEC: {
          abbr: 'GEC',
          chineseName: '通識核心',
          englishName: 'General Education Core Courses',
          classes: []
        },
        PE: {
          abbr: 'PE',
          chineseName: '體育',
          englishName: 'Physical Education',
          classes: []
        },
        LANG: {
          abbr: 'LANG',
          chineseName: '語言中心',
          englishName: 'Language Center',
          classes: []
        }
      }
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
}
</style>
