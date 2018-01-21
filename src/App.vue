<template>
  <v-app class="app">
    <v-container fluid pa-0 ma-0>
      <v-layout row>
        <v-flex :class="store.ui.pc.navDrawer ? 'navdrawer' : 'display-none'">
          <v-navigation-drawer temporary light :mini-variant="true" v-model="store.ui.pc.navDrawer">
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
        </v-flex>

        <v-flex class="main">
          <v-layout wrap>
            <v-flex xs12>
              <router-view
                @start-loading="loading = true"
                @stop-loading="loading = false"
              />
            </v-flex>
            <v-flex xs12>
              <v-bottom-nav fixed v-model="store.ui.mobile.navDrawer">
                <v-btn flat value="recent">
                  <span>Recent</span>
                  <v-icon>history</v-icon>
                </v-btn>
                <v-btn flat value="favorites">
                  <span>Favorites</span>
                  <v-icon>favorite</v-icon>
                </v-btn>
                <v-btn flat value="nearby">
                  <span>Nearby</span>
                  <v-icon>place</v-icon>
                </v-btn>
              </v-bottom-nav>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog class="loading-dialog" v-model="store.ui.common.loading" max-width="250px" persistent>
      <v-card>
        <v-card-text>
          <v-layout>
            <v-flex xs3 class="loading-icon"><v-progress-circular indeterminate color="primary" :size="50"></v-progress-circular></v-flex>
            <v-flex xs9 class="loading-text">Now loading...</v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import store from "./lib/store";

export default {
  name: 'app',
  data () {
    return {
      store: store
    }
  },
  computed: {
    showNavDrawer () {
      return this.store.ui.mode === 'pc'
    }
  }
}
</script>

<style lang="scss">
.display-none {
  display: none;
}

.app {
  .navdrawer {
    z-index: 1;
    aside.navigation-drawer--mini-variant {
      width: 64px !important;

      .list__tile {
        padding: 0 8px;
      }
    }
  }

  .main {
    width: 100%;
  }

  .loading-icon {
    margin-top: 6px;
  }
  .loading-text {
    padding-top: 20px;
    padding-left: 10px;
  }
}
</style>
