<template>
  <v-container class="entry">
    <v-layout wrap pt-5>
      <v-flex xs12 order-xs1 md6 order-md2 lg4 xl4 class="login">
        <v-container :pa-0="store.isMobile" mb-5>
          <form>
            <v-card ref="form">
              <v-card-title >
                <div>
                  <div class="headline">登入</div>
                  <div class="grey--text darken-1">請使用你在校務資訊系統登入的帳號。常見問題請見頁底。</div>
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
                      type="number"
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
        </v-container>
      </v-flex>

      <v-flex xs12 order-xs2 md6 order-md1 lg8 xl8 class="introduction">
        <v-container :pa-0="store.isMobile" mb-5>
          <v-card class="mb-3">
            <v-card-title>
              <div>
                <span class="headline">清大簡易選課系統 Beta</span><br />
                <span class="subheading">重新設計的選課系統，目標是提供清爽、直覺和方便的選課系統！</span>
              </div>
            </v-card-title>
            <v-card-text>
              <v-layout wrap>
                <v-flex xs12 sm6>
                  <v-container :pa-0="$vuetify.breakpoint.xsOnly">
                    <h2>📱手機也能選課</h2>
                    <p>從此，選課不再是電腦的專利了。清大簡易選課系統提供適合手機瀏覽的介面，讓你隨時隨地都能選課。</p>
                  </v-container>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-container :pa-0="$vuetify.breakpoint.xsOnly">
                    <h2>💨快速的排志願序</h2>
                    <p>你不再需要為了調整志願序而重複的退選又加選，改用更直覺的方式排志願序吧！</p>
                  </v-container>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-container :pa-0="$vuetify.breakpoint.xsOnly">
                    <h2>🔍聰明搜尋</h2>
                    <p>有了搜尋功能後，選課變得更快樂了呢～你除了能搜尋課程名稱、教師以外，還可以搜尋時段。</p>
                  </v-container>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-container :pa-0="$vuetify.breakpoint.xsOnly">
                    <h2>👁一目瞭然的課表</h2>
                    <p>濃縮不必要的資訊後，清爽的課表讓你能更專注在選課上。</p>
                  </v-container>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>

          <v-card>
            <v-card-title>常見問題</v-card-title>
            <v-expansion-panel class="mb-3">
              <v-expansion-panel-content>
                <div slot="header">這個網站會記錄我的帳號和密碼嗎？</div>
                <v-card>
                  <v-card-text class="grey lighten-3">
                    不會。你可以把這個網站想成是矇了眼的銀行櫃員，他在你和清大校務資訊系統間傳遞資訊，但他看不到上面寫什麼，所以你的資訊在這個網站上並不會有紀錄。<br>
                    若有任何疑慮，我們有提供這個網站的<a href="https://github.com/pp253/nthu-select-courses">所有程式碼</a>（以及<a href="https://github.com/pp253/nthu-select-courses-server">伺服器程式碼</a>）。如果這樣還是無法讓你安心的話，請左轉<a href="https://www.ccxp.nthu.edu.tw/ccxp/COURSE/">清大校務資訊系統</a>。
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
              <v-expansion-panel-content>
                <div slot="header">這是清大官方的選課系統嗎？</div>
                <v-card>
                  <v-card-text class="grey lighten-3">
                    不是。這個是由<a href="https://github.com/pp253">在校學生</a>自發架設的簡易選課系統，旨在提供更提供清爽、直覺和方便的選課系統。
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
              <v-expansion-panel-content>
                <div slot="header">我發現問題了，可以怎麼反應？</div>
                <v-card>
                  <v-card-text class="grey lighten-3">
                    太棒了！你有兩種方式可以告訴清大簡易選課系統，<br>
                    一、填寫<a href="https://goo.gl/forms/TgC3zCe5iYkQ6tyb2">回饋表單</a><br>
                    二、直接在GitHub上面開個issue<br>
                    感恩你，讚嘆你！
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-card>

          <v-card>
            <v-card-title>
              連結
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-list-tile>
                  <a href="http://nthu-course.cf/">向第一個清大簡易預排系統致敬！</a>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile>
                  <a href="https://nthu-plus.com/">向第一個清大課程評價網站致敬！</a>
                </v-list-tile>
                <v-divider></v-divider>
                <v-list-tile>
                  <a href="https://www.ccxp.nthu.edu.tw/ccxp/COURSE/">清大校務資訊系統</a>
                </v-list-tile>
              </v-list>
            </v-card-text>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex xs12>
        <v-container :pa-0="store.isMobile" mb-5>
          <v-card class="transparent elevation-0">
            <v-card-text>
              Made with 🍺 by <a href="https://github.com/pp253">pp253</a>. <a href="https://github.com/pp253/nthu-select-courses">GitHub</a>
            </v-card-text>
          </v-card>
        </v-container>
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
        this.store.ui.common.hideDrawer = false
        this.$router.push({ name: 'Service' })
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
  mounted () {
    this.store.ui.common.hideDrawer = true
    this.reload()
  }
}
</script>

<style lang="scss">
.entry {
  overflow: auto;
  height: 100vh;
  -webkit-overflow-scrolling: touch;

  form {
    .auth-img {
      margin-top: 18px;
    }
  }
}
</style>

