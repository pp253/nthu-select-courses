<template>
  <v-container class="service">
    <v-layout pt-5>
      <v-flex xs12
              xl8
              offset-xl2>
        <v-layout wrap>
          <v-flex xs12
                  sm12>
            <v-container :pa-0="$vuetify.breakpoint.xsOnly"
                         pb-3>
              <v-card>
                <v-card-title>
                  <span class="headline"
                        v-t="'Service.title'"></span>
                </v-card-title>
                <v-card-actions>
                  <v-spacer />
                  <v-btn flat
                         class="error--text"
                         @click="logout"
                         v-t="'login.logout'"></v-btn>
                </v-card-actions>
              </v-card>
            </v-container>
          </v-flex>
          <v-flex v-for="service in services"
                  :key="service.title"
                  xs12
                  sm6
                  lg4>
            <v-container :pa-0="$vuetify.breakpoint.xsOnly"
                         pb-3>
              <v-card>
                <v-card-title>
                  <v-icon>{{ service.icon }}</v-icon>
                  <span class="headline"
                        v-t="service.title"></span>
                </v-card-title>
                <v-card-text v-t="service.content"></v-card-text>
                <v-card-actions>
                  <v-btn @click="$router.push(service.path)"
                         outline
                         block
                         :disabled="service.disabled"
                         v-text="$t('Service.into', [$t(service.title)])"></v-btn>
                </v-card-actions>
              </v-card>
            </v-container>
          </v-flex>
        </v-layout>
        <v-layout>
          <layout-footer />
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { VIcon } from 'vuetify/lib'
import LayoutFooter from '@/components/layout-footer'

export default {
  name: 'Service',
  components: {
    LayoutFooter,
    VIcon
  },
  data() {
    return {
      services: [
        {
          title: 'Scores.name',
          content: 'Scores.description',
          icon: 'assessment',
          path: '/scores'
        },
        {
          title: 'SelectCourses.name',
          content: 'SelectCourses.description',
          icon: 'playlist_add',
          path: '/select_courses',
          disabled: false
        } /*,
        {
          title: 'AdvisorPassword.name',
          content: 'AdvisorPassword.description',
          icon: 'https',
          path: '/advisor_password'
        },
        {
          title: 'commentsAboutCourses.name',
          content: 'commentsAboutCourses.description',
          icon: 'face',
          path: '/',
          disabled: true
        }
        */
      ]
    }
  },
  methods: {
    logout() {
      this.$store.commit('ui/START_LOADING')
      this.$store
        .dispatch('user/logout')
        .then(() => {
          this.$router.push('/')
          this.$store.commit('ui/STOP_LOADING')
          this.$store.dispatch('ui/openSnackbar', {
            snackbarText: '已成功登出！'
          })
        })
        .catch(err => {
          console.error(err)
          this.$store.commit('ui/STOP_LOADING')
        })
    }
  },
  mounted() {
    if (!this.$store.state.user.isLogin) {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
.service {
  overflow: auto;
  height: 100vh;
  -webkit-overflow-scrolling: touch;
}
</style>
