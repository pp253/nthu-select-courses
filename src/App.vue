<template>
  <v-app :class="`app mode-${$store.state.ui.isMobile ? 'mobile' : 'pc'}`">
    <router-view />

    <v-dialog v-model="$store.state.ui.loading" max-width="250px" persistent>
      <v-card>
        <v-card-text>
          <v-layout>
            <v-flex xs3 class="loading-icon">
              <v-progress-circular indeterminate color="primary" :size="50"></v-progress-circular>
            </v-flex>
            <v-flex xs9 class="loading-text" v-text="$t('common.nowLoading')"></v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="$store.state.ui.dialog" max-width="350px" persistent>
      <v-card>
        <v-card-title class="headline">{{ $t($store.state.ui.dialogTitle) }}</v-card-title>
        <v-card-text>
          <div v-html="$t($store.state.ui.dialogText)"></div>
          <div v-html="$store.state.ui.dialogMore"></div>
        </v-card-text>
        <v-card-actions v-if="$store.state.ui.dialogMode === 'info'">
          <v-spacer />
          <v-btn @click="$store.commit('ui/CLOSE_DIALOG')" flat v-text="$t('dialog.OK')"></v-btn>
        </v-card-actions>
        <v-card-actions v-if="$store.state.ui.dialogMode === 'request'">
          <v-spacer />
          <v-btn @click="$bus.$emit('dialog-return', 'No'), $store.commit('ui/CLOSE_DIALOG')" flat v-text="$t('dialog.No')"></v-btn>
          <v-btn color="primary" @click="$bus.$emit('dialog-return', 'Yes'), $store.commit('ui/CLOSE_DIALOG')" flat v-text="$t('dialog.Yes')"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar :timeout="6000" bottom :value="$store.state.ui.snackbar">
      {{ $store.state.ui.snackbarText }}
      <v-btn color="primary" flat dark @click.native="$store.commit('ui/CLOSE_SNACKBAR')" v-t="'dialog.Close'"></v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  methods: {
    updateIsMobile(newVal) {
      // Fix Vuetify's bug
      if (
        this.$vuetify.breakpoint.name === 'xs' ||
        this.$vuetify.breakpoint.name === 'sm'
      ) {
        this.$store.commit('ui/SET_MOBILE', { isMobile: true })
        return true
      } else {
        this.$store.commit('ui/SET_MOBILE', { isMobile: false })
        return false
      }
    }
  },
  mounted() {
    this.updateIsMobile(this.$vuetify.breakpoint.name)
    this.$watch('$vuetify.breakpoint.name', this.updateIsMobile)

    this.$store.commit('ui/STOP_LOADING')

    /**
     * You can pass the AXICSTORE by /#/?session_token=???&username=???
     */
    if (this.$route.query.session_token) {
      console.log('PRELOAD Session Token:', this.$route.query.session_token)
      this.$store.commit('user/SET_USER', {
        isLogin: true,
        username: this.$route.query.username || 'UNKNOWN',
        sessionToken: this.$route.query.session_token
      })
      this.$router.push('/service')
    }
  }
}
</script>

<style lang="scss">
html {
  overflow-y: hidden;
  user-select: none;
}

.selectable {
  user-select: text;
}

* {
  font-family: -apple-system, 'Microsoft JhengHei', BlinkMacSystemFont,
    'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    sans-serif;
}

body {
  -webkit-overflow-scrolling: auto;
}

.application--wrap {
  height: 100vh;
}

input[type='number'] {
  -moz-appearance: textfield;
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

  .display-none,
  .hidden {
    display: none;
  }

  .full-height {
    height: 100%;
  }

  a {
    text-decoration: none;
  }

  a.underline,
  .underline a {
    text-decoration: underline;
  }

  a {
    .avatar {
      text-decoration: none;
    }
  }

  .dialog .card.dialog-full-scrollable {
    .card__title {
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
      z-index: 100000;
    }

    .card__text {
      -webkit-overflow-scrolling: touch;
    }

    .card__actions {
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
      z-index: 100000;
    }
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
