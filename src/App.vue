<template>
  <v-app
    :class="'app' + ` mode-${store.isNotMobile ? 'pc' : 'mobile'}`"
    v-resize="onResize"
  >
    <router-view />

    <v-dialog v-model="store.ui.common.loading" max-width="250px" persistent>
      <v-card>
        <v-card-text>
          <v-layout>
            <v-flex xs3 class="loading-icon"><v-progress-circular indeterminate color="primary" :size="50"></v-progress-circular></v-flex>
            <v-flex
              xs9
              class="loading-text"
              v-text="$t('common.nowLoading')"
            ></v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="store.ui.common.dialog" max-width="350px" persistent>
      <v-card>
        <v-card-title class="headline">{{ store.ui.common.dialogTitle }}</v-card-title>
        <v-card-text v-html="store.ui.common.dialogText"></v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="store.ui.common.dialog = false"
            flat
            v-text="$t('dialog.OK')"
          ></v-btn>
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
      store: store
    }
  },
  methods: {
    onResize () {
      this.store.ui.windowSize = { x: window.innerWidth, y: window.innerHeight }
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
  -webkit-overflow-scrolling: auto;
}

input[type='number'] {
  -moz-appearance:textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.app {
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
</style>
