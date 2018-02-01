<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$store.state.ui.isMobile"
    max-width="500px"
  >
    <v-btn
      icon
      slot="activator"
    >
      <v-icon>list</v-icon>
    </v-btn>
    <v-card
      class="choose-department"
    >
      <v-card-title class="headline">{{ $t('chooseDepartment.title') }}</v-card-title>
      <v-card-text>
        <v-layout>
          <!--
          <v-flex xs4 class="limit-height flex-college">
            <v-list>
              <template
                v-for="(collegeAbbr, college) in departments"
              >
                <v-list-tile
                  ripple
                  :key="collegeAbbr"
                  @click="choosedCollege = collegeAbbr, choosedDepartment = '', choosedClass = ''"
                  :class="choosedCollege === collegeAbbr ? 'list__tile--active' : ''"
                >
                  <v-list-tile-content>{{ college.chineseName }}</v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
          </v-flex>
          -->
          <v-flex xs4 class="limit-height flex-department">
            <v-list
            >
              <template
                v-for="(department, departmentAbbr) in departments"
              >
                <v-list-tile
                  ripple
                  :key="departmentAbbr"
                  @click="choosedDepartment = departmentAbbr, choosedClass = ''"
                  :class="choosedDepartment === departmentAbbr ? 'list__tile--active' : ''"
                >
                  <v-list-tile-content>{{ department.chineseName }}</v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
          </v-flex>
          <v-flex xs4 class="limit-height flex-class">
            <v-list
              v-if="/*choosedCollege !== '' && */choosedDepartment !== ''"
            >
              <template
                v-for="(cls, _) in departments[choosedDepartment].classes"
              >
                <v-list-tile
                  ripple
                  :key="cls.abbr"
                  @click="choosedClass = cls.abbr"
                  :class="choosedClass === cls.abbr ? 'list__tile--active' : ''"
                >
                  <v-list-tile-content>{{ cls.name }}</v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click="dialog = false">{{ $t('dialog.Cancel') }}</v-btn>
        <v-btn color="primary" flat @click="done(), dialog = false">{{ $t('dialog.Apply') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ChooseDepartment',
  data () {
    return {
      departments: {},
      choosedCollege: '',
      choosedDepartment: '',
      choosedClass: '',
      dialog: false
    }
  },
  methods: {
    done () {
      if (this.choosedDepartment !== '') {
        console.log('Select', this.choosedClass || this.choosedDepartment)
        this.$emit('update-department', this.choosedClass || this.choosedDepartment)
      }
    }
  },
  mounted () {
    this.departments = this.$store.state.selectCourses.departments
  }
}
</script>

<style lang="scss">
.choose-department {
  .flex-college, .flex-department, .flex-class {
    li.list__tile--active a div {
      color: #1976D2 !important;
    }
  }

  .layout {
    overflow-x: auto;
  }

  .limit-height {
    min-width: 156px;
    max-height: 65vh;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>


