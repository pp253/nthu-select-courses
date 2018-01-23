<template>
  <v-app
    :class="'app' + ` mode-${store.isNotMobile ? 'pc' : 'mobile'}`"
    v-resize="onResize"
  >
    <v-container fluid pa-0 ma-0>
      <v-layout row class="full-height">
        <v-flex
          :class="store.ui.common.hideDrawer ? 'display-none' : 'navdrawer'"
        >
          <v-navigation-drawer
            permanent
            light
            :mini-variant="true"
            v-model="store.isNotMobile"
            :class="store.ui.common.hideDrawer ? 'display-none' : ''"
          >
            <v-list pt-0>
              <v-list-tile
                @click="$router.push('/service')"
                ripple
                class="mb-3"
              >
                <v-list-tile-action>
                  <v-icon>arrow_back</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-tooltip
                v-for="item in menu"
                :key="item.title"
                right
              >
                <v-list-tile
                  slot="activator"
                  @click="store.ui.pc[item.attr] = !store.ui.pc[item.attr]"
                  ripple
                >
                  <v-list-tile-action>
                    <v-icon
                      :class="store.ui.pc[item.attr] ? 'blue--text' : ''"
                    >{{item.icon}}</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
                <span>{{ $t(item.title) }}</span>
              </v-tooltip>
            </v-list>
          </v-navigation-drawer>
        </v-flex>

        <v-flex class="main">
          <router-view />
        </v-flex>
      </v-layout>
      <v-bottom-nav
        fixed
        v-model="store.isMobile"
        :class="store.ui.common.hideDrawer ? 'display-none' : ''"
        :active="bottomDrawerActive"
        color="white"
      >
        <v-btn
          v-for="item in menu"
          :key="item.title + '-btn'"
          @click="uiMobileClearShowing(); store.ui.mobile[item.attr] = !store.ui.mobile[item.attr]"
          flat
        >
          <span>{{ $t(item.title) }}</span>
          <v-icon>{{ item.icon }}</v-icon>
        </v-btn>
      </v-bottom-nav>
    </v-container>

    <v-dialog v-model="store.ui.common.loading" max-width="250px" persistent>
      <v-card>
        <v-card-text>
          <v-layout>
            <v-flex xs3 class="loading-icon"><v-progress-circular indeterminate color="primary" :size="50"></v-progress-circular></v-flex>
            <v-flex xs9 class="loading-text">Now loading...</v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="store.ui.common.dialog" max-width="250px" persistent>
      <v-card>
        <v-card-title class="headline">{{ store.ui.common.dialogTitle }}</v-card-title>
        <v-card-text>{{ store.ui.common.dialogText }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="store.ui.common.dialog = false"
          >好</v-btn>
        </v-card-actions>
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
      store: store,
      menu: [
        {
          attr: 'showCoursesList',
          icon: 'list',
          title: 'coursesList.title'
        },
        {
          attr: 'showSelectedCoursesList',
          icon: 'playlist_add_check',
          title: 'selectedCoursesList.title'
        },/*
        {
          attr: 'showFavoriteCoursesList',
          icon: 'favorite',
          title: 'favoriteCoursesList.title'
        },*/
        {
          attr: 'showTimeTable',
          icon: 'grid_on',
          title: 'timeTable.title'
        }
      ]
    }
  },
  computed: {
    bottomDrawerActive () {
      let idx = this.menu.findIndex((item) => {return store.ui.mobile[item.attr] === true})
      return idx
    }
  },
  methods: {
    onResize () {
      this.store.ui.windowSize = { x: window.innerWidth, y: window.innerHeight }
    },
    uiMobileClearShowing () {
      store.ui.mobile.showCoursesList = false
      store.ui.mobile.showSelectedCoursesList = false
      store.ui.mobile.showFavoriteCoursesList = false
      store.ui.mobile.showTimeTable = false
    }
  },
  mounted (){
    this.store.ui.common.loading = false
  }
}
</script>

<style lang="scss">
html {
  overflow-y: hidden;
  font-family: -apple-system, 'Microsoft JhengHei', BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  user-select: none;
}

.app {
  .navdrawer {
    display: none;
    z-index: 1;
    aside.navigation-drawer--mini-variant {
      width: 64px !important;

      .list__tile {
        padding: 0 8px;
      }
    }
  }

  .main {
    width: 100vw;
    height: 100vh;
  }

  .loading-icon {
    margin-top: 6px;
  }
  .loading-text {
    padding-top: 20px;
    padding-left: 10px;
  }

  .display-none, .hidden {
    display: none;
  }

  .full-height {
    height: 100%;
  }
}

.app.mode-pc {
  .navdrawer {
    display: block;
  }
  .main {
    width: calc(100vw - 64px);
  }
}

.app.mode-mobile {
  
  .main {
    height: calc(100vh - 56px);
  }
}
</style>
