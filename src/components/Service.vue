<template>
  <v-container class="service">
    <v-layout pt-5 wrap>
      <v-flex xs12 sm12>
        <v-container :pa-0="$vuetify.breakpoint.xsOnly" pb-3>
          <v-card>
            <v-card-title>
              <span class="headline">你已成功登入，請選擇服務</span>
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn
                flat
                class="red--text"
                @click="store.user.isLogin = false; $router.push('/')"
              >登出</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-flex>
      <v-flex
        v-for="service in services"
        :key="service.title"
        xs12
        sm6
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
              >{{ '進入' + service.title }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import store from '../lib/store'

export default {
  name: 'Service',
  data () {
    return {
      store: store,
      services: [
        {
          title: '簡易選課系統',
          content: '重新設計的選課系統，目標是提供清爽、直覺和方便的選課系統！',
          icon: 'playlist_add',
          path: '/select_courses'
        },
        {
          title: '簡易成績查詢',
          content: '簡易成績查詢讓你用更好的介面，看到更好的成績！',
          icon: 'assessment',
          path: '/scores'
        },
        {
          title: '簡易教學評鑑調查',
          content: '開發中，敬請期待！',
          icon: 'face',
          path: '/',
          disabled: true
        }
      ]
    }
  },
  mounted () {
    this.store.ui.common.hideDrawer = true
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
