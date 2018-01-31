<template>
  <v-container pa-0 ma-0 class="courses-catalog">
    <v-toolbar dense extended>
      <v-menu :nudge-width="100">
        <v-toolbar-title slot="activator">
          {{ (departmentName ? departmentName : title) }}
          <v-icon>arrow_drop_down</v-icon>
        </v-toolbar-title>
        <v-list>
          <v-list-tile
            v-if="list"
            v-for="item in availableSelectionResult"
            :key="item.value"
            ripple
          >
            <v-list-tile-title v-text="item.text"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-spacer></v-spacer>
      <choose-department
        v-if="!list"
        @update-department="updateCourses"
      ></choose-department>

      <v-text-field
        slot="extension"
        v-if="!list"
        v-model="searchText"
        type="text"
        value=""
        prepend-icon="search"
        clearable
      ></v-text-field>
    </v-toolbar>

    <v-container pa-0 ma-0 class="list">
      <courses-list
        :courses=""
        :courses-list=""
      />
    </v-container>
  </v-container>
</template>

<script>
import CoursesList from './courses-list'
import ChooseDepartment from './choose-department'

export default {
  name: 'CoursesCatalog',
  components: {
    ChooseDepartment,
    CoursesList
  }
}
</script>

<style lang="scss">
.courses-catalog {
  .list {
    height: calc(100% - 96px);
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 64px;
  }
}
</style>
