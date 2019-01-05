<template>
  <v-dialog v-model="dialog"
            :fullscreen="$store.state.ui.isMobile"
            max-width="500px"
            persistent
            scrollable>
    <v-card class="department-picker dialog-full-scrollable">
      <v-card-title primary-title
                    class="pt-0">
        <div style="width: 100%;">
          <v-tabs v-model="activeTab"
                  centered
                  grow>
            <v-tab ripple>
              總錄/必選修
            </v-tab>
            <v-tab ripple>
              通識
            </v-tab>
            <v-tab ripple>
              學分學程
            </v-tab>
            <v-tab ripple
                   disabled>
              雙專長
            </v-tab>
          </v-tabs>
        </div>
        <template>
          <div v-if="activeTab !== 0 || activeWin === 0"
               style="display: block; width: 100%;">
            <v-text-field v-model="searchText"
                          type="text"
                          value=""
                          prepend-icon="search"
                          clearable
                          hide-details />
          </div>
          <div v-else
               style="display: block; width: 100%;">
            <v-btn icon
                   flat
                   @click="activeWin = 0"
                   class="ml-0 mb-0"
                   style="margin-top: 12px;">
              <v-icon>arrow_back</v-icon>
            </v-btn>
            <span class="v-toolbar__title ml-0"
                  style="position: relative; top: 9px;">
              {{choosedDepartment}}
              {{getDepartmentDetail(choosedDepartment).chineseName || getDepartmentDetail(choosedDepartment).name}}
            </span>
          </div>
        </template>
      </v-card-title>

      <v-card-text class="vh-100 pa-0"
                   style="transform: translateZ(0);">

        <v-window v-if="activeTab === 0"
                  v-model="activeWin"
                  class="h-100">
          <v-window-item class="h-100"
                         key="department">
            <v-list class="h-100 overflow-auto">
              <v-subheader v-if="!searchText && popularList">常用</v-subheader>
              <template v-if="!searchText">
                <template v-for="department in popularList">
                  <v-list-tile ripple
                               :key="department.abbr + '-popular'"
                               @click="choosedDepartment = department.abbr; choosedClass = ''; activeWin = 1">
                    <v-list-tile-content :class="choosedDepartment === department.abbr ? 'primary--text' : ''">
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
                  <v-divider :key="department.abbr + '-popular-divider'" />
                </template>
              </template>

              <v-subheader>全部</v-subheader>
              <template v-for="(department, departmentAbbr) in searchList">
                <v-list-tile ripple
                             :key="departmentAbbr"
                             @click="choosedDepartment = departmentAbbr; choosedClass = ''; activeWin = 1">
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
          </v-window-item>

          <v-window-item class="h-100"
                         key="class">
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
                  <v-list-tile-content :class="choosedClass === cls.abbr ? 'primary--text' : ''">
                    {{ cls.name }} {{ cls.abbr }}
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider :key="cls.abbr + '-divider'" />
              </template>
            </v-list>
          </v-window-item>
        </v-window>

        <v-list v-if="activeTab !== 0"
                class="h-100 overflow-auto">
          <v-subheader v-if="!searchText && popularList && popularList.length > 0">常用</v-subheader>
          <template v-if="!searchText">
            <template v-for="item in popularList">
              <v-list-tile ripple
                           :key="item + '-popular'"
                           @click="choosedTab = activeTab; choosedItem = item">
                <v-list-tile-content :class="choosedTab === activeTab && item === choosedItem ? 'primary--text' : ''">
                  {{ item }}
                </v-list-tile-content>
              </v-list-tile>
              <v-divider :key="item + '-popular-divider'" />
            </template>
          </template>

          <v-subheader>全部</v-subheader>
          <template v-for="(item) in searchList">
            <v-list-tile ripple
                         :key="item"
                         @click="choosedTab = activeTab; choosedItem = item">
              <v-list-tile-content :class="choosedTab === activeTab && choosedItem === item ? 'primary--text' : ''">
                {{ item }}
              </v-list-tile-content>
            </v-list-tile>
            <v-divider :key="item + '-divider'" />
          </template>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat
               @click="close()">{{ $t('dialog.Cancel') }}</v-btn>
        <v-btn color="primary"
               flat
               @click="submit()">{{ $t('dialog.Apply') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  VDialog,
  VWindow,
  VWindowItem,
  VTextField,
  VBtn,
  VList,
  VListTile,
  VListTileContent,
  VIcon,
  VTab,
  VTabs
} from 'vuetify/lib'
import { mapState } from 'vuex'

export default {
  name: 'DepartmentPicker',
  components: {
    VDialog,
    VWindow,
    VWindowItem,
    VTextField,
    VBtn,
    VList,
    VListTile,
    VListTileContent,
    VIcon,
    VTab,
    VTabs
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      choosedDepartment: '',
      choosedClass: '',
      choosedTab: '',
      choosedItem: '',
      searchText: '',
      dialog: false,
      activeTab: 0,
      activeWin: 0,
      activeTabCode: {
        0: 'departments',
        1: 'geDegree',
        2: 'program',
        3: 'double'
      }
    }
  },
  watch: {
    value(newVal) {
      this.dialog = newVal
    },
    activeTab() {
      this.searchText = ''
    }
  },
  computed: {
    ...mapState('selectCourses', [
      'departments',
      'geDegreeTypes',
      'doubleTypes',
      'programTypes',
      'popular'
    ]),
    popularList() {
      switch (this.activeTab) {
        case 0:
          return this.popular.departments
        default:
          return this.popular[this.activeTabCode[this.activeTab]]
      }
    },
    searchList() {
      if (!this.searchText) {
        switch (this.activeTab) {
          case 0:
            return this.departments
          default:
            return this[`${this.activeTabCode[this.activeTab]}Types`]
        }
      }
      if (this.activeTab === 0) {
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
      } else {
        let searchText = this.searchText.toLowerCase()
        let list = []
        let rawList = this[`${this.activeTabCode[this.activeTab]}Types`]
        for (let item of rawList) {
          if (item.toLowerCase().includes(searchText)) {
            list.push(item)
          }
        }
        return list
      }
    }
  },
  methods: {
    submit() {
      this.close()
      if (this.activeTab === 0) {
        if (this.choosedDepartment !== '') {
          this.$emit(
            'update-department',
            this.choosedClass || this.choosedDepartment
          )
        }
        this.pushToPopular(this.departments[this.choosedDepartment])
      } else {
        this.search(this.choosedItem)
        this.pushToPopular(this.choosedItem)
      }
    },
    getDepartmentDetail(abbr) {
      if (abbr && abbr.length <= 4 && abbr in this.departments) {
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
      this.activeWin = 0
      this.dialog = false
      this.searchText = ''
      this.$emit('close')
    },
    search(text) {
      let searchPrefix = {
        1: 'ge_degree',
        2: 'program',
        3: 'double'
      }
      this.$emit('search', `${searchPrefix[this.activeTab]}:${text}`)
    },
    pushToPopular(item) {
      this.$store.commit('selectCourses/SET_POPULAR', {
        type: this.activeTabCode[this.activeTab],
        item: item
      })
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
