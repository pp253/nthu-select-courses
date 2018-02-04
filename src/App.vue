<template>
  <v-app
    :class="'app' + ` mode-${!$store.state.ui.isMobile ? 'pc' : 'mobile'}`"
  >
    <router-view />

    <v-dialog v-model="$store.state.ui.loading" max-width="250px" persistent>
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

    <v-dialog v-model="$store.state.ui.dialog" max-width="350px" persistent>
      <v-card>
        <v-card-title class="headline">{{ $t($store.state.ui.dialogTitle) }}</v-card-title>
        <v-card-text>
          <div
            v-html="$t($store.state.ui.dialogText)"
          ></div>
          <div
            v-html="$store.state.ui.dialogMore"
          ></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="$store.commit('ui/closeDialog')"
            flat
            v-text="$t('dialog.OK')"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      :timeout="6000"
      bottom
      multi-line
      :value="$store.state.ui.snackbar"
    >
      {{ $store.state.ui.snackbarText }}
      <v-btn flat dark @click.native="$store.commit('ui/closeSnackbar')">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  methods: {
    updateIsMobile (newVal) {
      // Fix Vuetify's bug
      if (this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm') {
        this.$store.commit('ui/setMobile', {isMobile: true})
        return true
      } else {
        this.$store.commit('ui/setMobile', {isMobile: false})
        return false
      }
    }
  },
  mounted () {
    this.updateIsMobile(this.$vuetify.breakpoint.name)
    this.$watch('$vuetify.breakpoint.name', this.updateIsMobile)
    
    this.$store.commit('ui/stopLoading')
  }
}
</script>

<style lang="scss">
html {
  overflow-y: hidden;
  user-select: none;
}

* {
  font-family: -apple-system, 'Microsoft JhengHei', BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

body {
  -webkit-overflow-scrolling: auto;
}

.application--wrap {
  height: 100vh;
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
