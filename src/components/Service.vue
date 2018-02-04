<template>
  <v-container class="service">
    <v-layout pt-5 wrap>
      <v-flex xs12 sm12>
        <v-container :pa-0="$vuetify.breakpoint.xsOnly" pb-3>
          <v-card>
            <v-card-title>
              <span class="headline" v-text="$t('service.title')"></span>
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn
                flat
                class="red--text"
                @click="$store.commit('user/logout'); $router.push('/')"
                v-text="$t('login.logout')"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-flex>
      <v-flex
        v-for="service in services"
        :key="service.title"
        xs12
        sm6
        lg4
      >
        <v-container :pa-0="$vuetify.breakpoint.xsOnly" pb-3>
          <v-card>
            <v-card-title><v-icon>{{ service.icon }}</v-icon><span class="headline">{{ service.title }}</span></v-card-title>
            <v-card-text>{{ service.content }}</v-card-text>
            <v-card-actions>
              <v-btn
                @click="$router.push(service.path)"
                outline
                block
                :disabled="service.disabled"
                v-text="$t('service.into').replace('{0}', service.title)"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex xs12>
        <v-container :pa-0="$store.state.ui.isMobile" mt-5 mb-5>
          <v-card class="transparent elevation-0">
            <v-card-text>
              Made with 🍺 by <a href="https://github.com/pp253">pp253</a>. <a href="https://github.com/pp253/nthu-select-courses">GitHub</a>
            </v-card-text>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Service',
  data () {
    return {
      services: [
        {
          title: this.$t('scores.name'),
          content: this.$t('scores.description'),
          icon: 'assessment',
          path: '/scores'
        },
        {
          title: this.$t('selectCourses.name'),
          content: this.$t('selectCourses.description') + '現在不是選課期間，系統未開放！',
          icon: 'playlist_add',
          path: '/select_courses',
          disabled: false
        },
        {
          title: '輸入教師密碼',
          content: '這雖然沒有特別簡易，但至少讓你不用為了輸入密碼而重新登入至原校務資訊系統。',
          icon: 'https',
          path: '/teacher_password',
          disabled: true
        },
        {
          title: this.$t('commentsAboutCourses.name'),
          content: this.$t('commentsAboutCourses.description'),
          icon: 'face',
          path: '/',
          disabled: true
        }
      ]
    }
  },
  mounted () {
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
