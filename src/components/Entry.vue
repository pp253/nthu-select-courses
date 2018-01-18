<template>
  <v-container fluid class="entry">
    <v-form>
      <v-layout row wrap>
        <v-flex xs12>
          <v-text-field
            name="input-username"
            :label="$t('login.username')"
            value=""
            autocomplete="on"
            v-model="username"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-text-field
            type="password"
            name="input-userpass"
            :label="$t('login.userpass')"
            value=""
            autocomplete="on"
            v-model="userpass"
          ></v-text-field>
        </v-flex>
        <v-flex xs12>
          <v-layout>
            <v-flex>
              <img :src="'data:image/png;base64,' + authImg">
            </v-flex>
            <v-flex>
              <v-text-field
                name="input-authCheckCode"
                :label="$t('login.auth_img')"
                value=""
                v-model="authCheckCode"
                autocomplete="off"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 text-xs-right>
          <v-btn
            name="input-login"
            @click="login()"
            :disabled="!username || !userpass || !authCheckCode"
          >{{ $t('login.login') }}</v-btn>
        </v-flex>
      </v-layout>
    </v-form>
    <v-dialog v-model="dialog.open" max-width="290">
      <v-card>
        <v-card-title class="headline">{{ $t(dialog.title) }}</v-card-title>
        <v-card-text>{{ $t(dialog.text) }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat="flat" @click.native="dialog.open = false">{{ $t('dialog.OK') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import * as api from '../api'
import store from '../lib/store'

export default {
  name: 'Entry',
  data () {
    return {
      store: store,
      loginToken: '',
      authImg: null,
      username: '',
      userpass: '',
      authCheckCode: '',
      dialog: {
        open: false,
        text: '',
        title: ''
      }
    }
  },
  methods: {
    login () {
      let loginInfo = {
        username: this.username,
        userpass: this.userpass,
        authCheckCode: this.authCheckCode,
        loginToken: this.loginToken
      }

      this.store.login(loginInfo)
      .then((data) => {
        this.$router.push({ name: 'SelectCourses' })
      })
      .catch((err) => {
        switch (err.id) {
          case 20:
            // Err: UserInfoNotCorrect
            this.dialog.open = true
            this.dialog.title = 'entry.UserInfoNotCorrectTitle'
            this.dialog.text = 'entry.UserInfoNotCorrectText'
            break
        
          case 21:
            // Err: AuthCheckCodeNotCorrect
            this.dialog.open = true
            this.dialog.title = 'entry.AuthCheckCodeNotCorrectTitle'
            this.dialog.text = 'entry.AuthCheckCodeNotCorrectText'
            break
          
          case 22:
          default:
            // Err: NTHUServerError
            this.dialog.open = true
            this.dialog.title = 'entry.NTHUServerErrorTitle'
            this.dialog.text = 'entry.NTHUServerErrorText'
            break
        }
        this.reload()
      })
    },
    reload () {
      this.userpass = ''
      this.authCheckCode = ''

      api.getLoginToken()
      .then((data) => {
        this.loginToken = data.loginToken
        this.authImg = data.authImg
      })
    }
  },
  created () {
    this.reload()
  }
}
</script>

<style scoped>

</style>

