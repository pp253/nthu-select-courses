<template>
  <v-container pa-0 ma-0 class="selection-result">
    <v-toolbar dense>
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

export default {
  name: 'SelectionList',
  components: {
    CoursesList
  }
}
</script>

<style lang="scss">
.selection-result {
  .list {
    height: calc(100% - 48px);
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 64px;
  }
}
</style>
