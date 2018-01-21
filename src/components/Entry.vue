<template>
  <v-container fluid class="entry">
    <v-layout justify-center class="login" pt-5>
      <v-flex xs12 sm8 md6 lg4>
        <form>
          <v-card ref="form">
            <v-card-title >
              <div>
                <div class="headline">登入</div>
                <div class="grey--text darken-1">請使用您在校務資訊系統登入的帳號。<a href="">隱私權Q&A</a></div>
              </div>
            </v-card-title>
            <v-card-text>
              <v-text-field
                name="input-username"
                :label="$t('login.username')"
                value=""
                autocomplete="on"
                v-model="username"
                required
              ></v-text-field>
              <v-text-field
                type="password"
                name="input-userpass"
                :label="$t('login.userpass')"
                value=""
                autocomplete="on"
                v-model="userpass"
                required
              ></v-text-field>
              <v-layout>
                <v-flex xs5 sm3>
                  <img :src="'data:image/png;base64,' + authImg" class="auth-img">
                </v-flex>
                <v-flex xs7 sm9>
                  <v-text-field
                    name="input-authCheckCode"
                    :label="$t('login.auth_img')"
                    value=""
                    v-model="authCheckCode"
                    autocomplete="off"
                    :rules="[() => authCheckCode.length === 6 || $t('login.authCodeFormatError')]"
                    validate-on-blur
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="submit"
                :disabled="!username || !userpass || !authCheckCode"
              >{{ $t('login.login') }}</v-btn>
            </v-card-actions>
          </v-card>
        </form>
      </v-flex>
    </v-layout>

    <v-layout class="introduction">
      <v-flex xs12>

      </v-flex>
    </v-layout>

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
    submit () {
      this.store.ui.common.loading = true
      let loginInfo = {
        username: this.username,
        userpass: this.userpass,
        authCheckCode: this.authCheckCode,
        loginToken: this.loginToken
      }


      store.login(loginInfo)
      .then((data) => {
        this.store.ui.common.loading = false
        this.$router.push({ name: 'SelectCourses' })
      })
      .catch((err) => {
        this.store.ui.common.loading = false
        console.log(err)
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

<style lang="scss">
.entry {
  form {
    .auth-img {
      margin-top: 18px;
    }
  }
}
</style>

