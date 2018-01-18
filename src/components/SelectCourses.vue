<template>
  <v-container fluid pa-0 class="select-courses">
    <v-layout row>
      <div class="flex-drawer">
        <v-navigation-drawer permanent light :mini-variant="true">
          <v-toolbar flat class="transparent">
            <v-list class="pa-0">
              <v-list-tile avatar>
                <v-list-tile-avatar>
                </v-list-tile-avatar>
              </v-list-tile>
            </v-list>
          </v-toolbar>
          <v-list class="pt-0">
            <v-tooltip right>
              <v-list-tile
                ripple
                slot="activator"
                @click="store.ui.common.showCoursesList = !store.ui.common.showCoursesList"
              >
                <v-list-tile-action><v-icon>list</v-icon></v-list-tile-action>
              </v-list-tile>
              <span>{{ $t('coursesList.title') }}</span>
            </v-tooltip>
            <v-tooltip right>
              <v-list-tile
                ripple
                slot="activator"
                @click="store.ui.common.showSelectedCoursesList = !store.ui.common.showSelectedCoursesList"
              >
                <v-list-tile-action><v-icon>playlist_add_check</v-icon></v-list-tile-action>
              </v-list-tile>
              <span>{{ $t('selectedCoursesList.title') }}</span>
            </v-tooltip>
            <v-tooltip right>
              <v-list-tile
                ripple
                slot="activator"
                @click="store.ui.common.showFavoriteCoursesList = !store.ui.common.showFavoriteCoursesList"
              >
                <v-list-tile-action><v-icon>favorite</v-icon></v-list-tile-action>
              </v-list-tile>
              <span>{{ $t('favoriteCoursesList.title') }}</span>
            </v-tooltip>
            <v-tooltip right>
              <v-list-tile
                ripple
                slot="activator"
                @click="store.ui.common.showTimeTable = !store.ui.common.showTimeTable"
              >
                <v-list-tile-action><v-icon>grid_on</v-icon></v-list-tile-action>
              </v-list-tile>
              <span>{{ $t('timeTable.title') }}</span>
            </v-tooltip>
          </v-list>
        </v-navigation-drawer>

      </div>
      <v-flex>
        <v-layout>
          <v-flex xs3 v-if="store.ui.common.showCoursesList">
            <courses-list
              :title="$t('coursesList.title')"
              @update-preview-time="updatePreviewTime"
              :empty-text="$t('coursesList.pleaseSelect')"
            ></courses-list>
          </v-flex>

          <v-flex xs3 v-if="store.ui.common.showSelectedCoursesList">
            <courses-list
              :title="$t('selectedCoursesList.title')"
              :list="store.user.selectedCoursesDetail"
              @update-preview-time="updatePreviewTime"
            ></courses-list>
          </v-flex>


          <v-flex xs6 v-if="!store.ui.common.showCourseDetail && store.ui.common.showTimeTable">
            <time-table
              :preview-time="previewTime"
            ></time-table>
          </v-flex>

          <v-flex xs6 v-if="store.ui.common.showCourseDetail">
            <course-detail
              :title="$t('courseDetail.title')"
              :course-number="store.ui.common.courseDetailNumber"
            ></course-detail>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import store from "../lib/store";

export default {
  name: "SelectCourses",
  data() {
    return {
      store: store,
      previewTime: ""
    };
  },
  methods: {
    updatePreviewTime(previewTime) {
      this.previewTime = previewTime;
    }
  }
};
</script>

<style lang="scss">
.select-courses {
  .flex-drawer {
    z-index: 1;

    aside.navigation-drawer--mini-variant {
      width: 64px !important;

      .list__tile {
        padding: 0 8px;
      }
    }
  }

  .memo {
    // text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

