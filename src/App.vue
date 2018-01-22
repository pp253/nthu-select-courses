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
            <v-toolbar flat class="transparent">
              <v-list class="pa-0">
                <v-list-tile avatar>
                  <v-list-tile-avatar>
                  </v-list-tile-avatar>
                </v-list-tile>
              </v-list>
            </v-toolbar>
            <v-list pt-0>
              <v-tooltip
                v-for="item in menu"
                :key="item.title"
                right
              >
                <v-list-tile
                  ripple
                  slot="activator"
                  @click="item.onclickDesktop"
                >
                  <v-list-tile-action><v-icon>{{item.icon}}</v-icon></v-list-tile-action>
                </v-list-tile>
                <span>{{ $t(item.title) }}</span>
              </v-tooltip>
            </v-list>
          </v-navigation-drawer>
        </v-flex>

        <v-flex class="main">
          <keep-alive>
            <router-view />
          </keep-alive>
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
          @click="item.onclickMobile"
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
          onclickDesktop: ()=>{store.ui.pc.showCoursesList = !store.ui.pc.showCoursesList},
          onclickMobile: ()=>{this.uiMobileClearShowing(); store.ui.mobile.showCoursesList = !store.ui.mobile.showCoursesList},
          icon: 'list',
          title: 'coursesList.title'
        },
        {
          onclickDesktop: ()=>{store.ui.pc.showSelectedCoursesList = !store.ui.pc.showSelectedCoursesList},
          onclickMobile: ()=>{this.uiMobileClearShowing(); store.ui.mobile.showSelectedCoursesList = !store.ui.mobile.showSelectedCoursesList},
          icon: 'playlist_add_check',
          title: 'selectedCoursesList.title'
        },
        {
          onclickDesktop: ()=>{store.ui.pc.showFavoriteCoursesList = !store.ui.pc.showFavoriteCoursesList},
          onclickMobile: ()=>{this.uiMobileClearShowing(); store.ui.mobile.showFavoriteCoursesList = !store.ui.mobile.showFavoriteCoursesList},
          icon: 'favorite',
          title: 'favoriteCoursesList.title'
        },
        {
          onclickDesktop: ()=>{store.ui.pc.showTimeTable = !store.ui.pc.showTimeTable},
          onclickMobile: ()=>{this.uiMobileClearShowing(); store.ui.mobile.showTimeTable = !store.ui.mobile.showTimeTable},
          icon: 'grid_on',
          title: 'timeTable.title'
        }
      ]
    }
  },
  computed: {
    bottomDrawerActive () {
      let idx = [
        store.ui.mobile.showCoursesList,
        store.ui.mobile.showSelectedCoursesList,
        store.ui.mobile.showFavoriteCoursesList,
        store.ui.mobile.showTimeTable
      ].findIndex((val) => {return val === true})
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
  }
}
</script>

<style lang="scss">
html {
  overflow-y: hidden;
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

  .display-none {
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
