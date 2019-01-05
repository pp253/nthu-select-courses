<template>
  <v-container class="entry"
               style="transform: translateZ(0);">
    <v-layout wrap
              justify-center>
      <v-flex xs12
              xl8>
        <v-layout>
          <v-flex xs12>
            <v-container :pa-0="$store.state.ui.isMobile"
                         mb-3>
              <v-card class="transparent elevation-0">
                <v-card-text>
                  <v-layout>
                    <v-flex style="min-width: 88px;">
                      <img src="/logo.png"
                           style="width: 72px; display: inline-block; -webkit-clip-path: circle(50% at 50% 50%); clip-path: circle(50% at 50% 50%);">
                    </v-flex>
                    <v-flex xs12>
                      <h1>清大簡易選課</h1>
                      <h3 style="color: #444;">選課，就是這麼簡單</h3>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-container>
          </v-flex>
        </v-layout>

        <v-layout wrap>
          <v-flex xs12
                  order-xs1
                  md5
                  order-md2
                  lg4
                  xl4
                  class="login">
            <v-container :pa-0="$store.state.ui.isMobile"
                         mb-3>
              <form>
                <v-card ref="form">
                  <v-card-title>
                    <div>
                      <div class="headline"
                           v-t="'login.login'"></div>
                      <div class="grey--text darken-1">請使用你在校務資訊系統登入的帳號。常見問題請見頁底。</div>
                      <div class="red--text darken-1">本系統目前尚處測試階段，選課完請前往校務資訊系統確認！</div>
                    </div>
                  </v-card-title>
                  <v-window v-model="usingACIXSTORE"
                            vertical>
                    <v-window-item :value="false">
                      <v-card-text>
                        <v-text-field name="input-username"
                                      :label="$t('login.username')"
                                      value=""
                                      autocomplete="on"
                                      v-model="username"
                                      required></v-text-field>
                        <v-text-field type="password"
                                      name="input-userpass"
                                      :label="$t('login.userpass')"
                                      value=""
                                      autocomplete="on"
                                      v-model="userpass"
                                      required></v-text-field>
                        <v-layout>
                          <v-flex mr-3>
                            <img :src="'data:image/png;base64,' + $store.state.user.authImg"
                                 class="auth-img">
                          </v-flex>
                          <v-flex xs12>
                            <v-text-field name="input-authCheckCode"
                                          :label="$t('login.auth_img')"
                                          value=""
                                          v-model="authCheckCode"
                                          autocomplete="off"
                                          :rules="[() => authCheckCode.length === 6 || $t('login.authCodeFormatError')]"
                                          validate-on-blur
                                          type="number"
                                          required
                                          @keyup.native="(e) => {e.key === 'Enter' && (username && userpass && authCheckCode) && submit()}"></v-text-field>
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                    </v-window-item>
                    <v-window-item :value="true">
                      <v-card-text>
                        <p>你可以先從校務資訊系統登入後，將網址列中的 <code>ACIXSTORE=XXX</code> 中的 <code>XXX</code> 貼過來登入</p>
                        <v-text-field name="input-ACIXSTORE"
                                      :label="$t('login.ACIXSTORE')"
                                      value=""
                                      autocomplete="off"
                                      :rules="[() => ACIXSTORE.length === 26 || $t('login.ACIXSTOREFormatError')]"
                                      v-model="ACIXSTORE"
                                      required></v-text-field>
                      </v-card-text>
                    </v-window-item>
                  </v-window>
                  <v-card-actions v-if="$store.state.user.isLogin">
                    <v-spacer></v-spacer>
                    <v-btn @click="$router.push('/service')">{{ $t('login.directLogin') }}</v-btn>
                  </v-card-actions>
                  <v-card-actions>
                    <v-btn @click="usingACIXSTORE = !usingACIXSTORE"
                           flat>{{ $t(usingACIXSTORE ? 'login.usingPassword' : 'login.usingACIXSTORE') }}</v-btn>
                    <v-spacer />
                    <v-btn @click="submit"
                           :disabled="(!usingACIXSTORE && (!username || !userpass || !authCheckCode)) || (usingACIXSTORE && !(ACIXSTORE.length === 26))"
                           color="primary">{{ $t('login.login') }}</v-btn>
                  </v-card-actions>
                </v-card>
              </form>
            </v-container>
          </v-flex>

          <v-flex xs12
                  order-xs2
                  md7
                  order-md1
                  lg8
                  xl8
                  class="introduction">
            <v-container :pa-0="$store.state.ui.isMobile"
                         mb-5>
              <v-card class="mb-3">
                <v-card-title>
                  <div>
                    <span class="headline">清大簡易選課</span><br />
                    <span class="subheading">重新設計的選課系統，目標是提供清爽、直覺和方便的選課系統！</span>
                  </div>
                </v-card-title>
                <v-card-text class="pl-0 pr-0">
                  <v-layout wrap>
                    <v-flex xs12
                            sm6>
                      <v-container pt-0
                                   pl-3
                                   pr-3
                                   pb-3>
                        <h2>📱手機也能輕鬆選課</h2>
                        <p>從此，選課不再是電腦的專利了。清大簡易選課提供適合手機瀏覽的介面，讓你隨時隨地都能選課。</p>
                      </v-container>
                    </v-flex>
                    <v-flex xs12
                            sm6>
                      <v-container pt-0
                                   pl-3
                                   pr-3
                                   pb-3>
                        <h2>💨快速排志願序</h2>
                        <p>你不再需要為了調整志願序而重複的退選又加選，改用更直覺的方式排志願序吧！</p>
                      </v-container>
                    </v-flex>
                    <v-flex xs12
                            sm6>
                      <v-container pt-0
                                   pl-3
                                   pr-3
                                   pb-3>
                        <h2>🔍聰明搜尋</h2>
                        <p>有了搜尋功能後，選課變得更快樂了呢～你除了能搜尋課程名稱、教師以外，還可以搜尋時段。</p>
                      </v-container>
                    </v-flex>
                    <v-flex xs12
                            sm6>
                      <v-container pt-0
                                   pl-3
                                   pr-3
                                   pb-3>
                        <h2>👁一目瞭然的課表</h2>
                        <p>濃縮不必要的資訊後，清爽的課表讓你能更專注在選課上。</p>
                      </v-container>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>

              <v-card class="mb-3">
                <v-card-title>
                  <div>
                    <span class="headline">最新資訊</span>
                  </div>
                </v-card-title>
                <v-card-text class="pl-0 pr-0">
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-container pt-0
                                   pl-3
                                   pr-3
                                   pb-0>
                        <h3>進修英文、商用英文課無法選填志願</h3>
                        <p>目前簡易選課系統無法選填「進修英文」、「商用英文」等志願！感謝同學回報，我們會盡速修復</p>
                      </v-container>
                    </v-flex>
                    <v-flex xs12>
                      <v-container pt-0
                                   pl-3
                                   pr-3
                                   pb-0>
                        <h3>通識向度、學分學程課程課表</h3>
                        <p>請在「選擇科系」按鈕選擇通識向度、學分學程的課表。另外雙專長的課表目前是舊版的，所以先不開放</p>
                      </v-container>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>

              <v-card class="mb-3">
                <v-card-title>
                  <div>
                    <span class="headline">其他服務</span>
                  </div>
                </v-card-title>
                <v-card-text class="pl-0 pr-0">
                  <v-layout wrap>
                    <v-flex xs12
                            sm6>
                      <v-container pt-0
                                   pl-3
                                   pr-3
                                   pb-3>
                        <h2>簡易成績查詢</h2>
                        <p>簡易成績查詢讓你用更好的介面，看到更好的成績！</p>
                      </v-container>
                    </v-flex>
                    <v-flex xs12
                            sm6>
                      <v-container pt-0
                                   pl-3
                                   pr-3
                                   pb-3>
                        <h2>簡易教學評量</h2>
                        <p>未來開放。</p>
                      </v-container>
                    </v-flex>
                    <v-flex xs12
                            sm6>
                      <v-container pt-0
                                   pl-3
                                   pr-3
                                   pb-3>
                        <h2>問題回報與回饋</h2>
                        <p>如果你有任何想說的話，請透過<a href="https://goo.gl/forms/TgC3zCe5iYkQ6tyb2">回饋表單</a>留言！</p>
                      </v-container>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>

              <v-card>
                <v-card-title>
                  <span class="headline">常見問題</span>
                </v-card-title>
                <v-expansion-panel class="mb-3 underline">
                  <v-expansion-panel-content>
                    <div slot="header">這個網站會記錄我的帳號和密碼嗎？</div>
                    <v-card>
                      <v-card-text class="grey lighten-3">
                        不會。你可以把這個網站想成是矇了眼的銀行櫃員，他在你和清大校務資訊系統間傳遞資訊，但他看不到上面寫什麼，所以你的資訊在這個網站上並不會有紀錄。<br> 若有任何疑慮，我們有提供這個網站的
                        <a href="https://github.com/pp253/nthu-select-courses">所有程式碼</a>（以及
                        <a href="https://github.com/pp253/nthu-select-courses-server">伺服器程式碼</a>）。如果這樣還是無法讓你安心的話，請左轉
                        <a href="https://www.ccxp.nthu.edu.tw/ccxp/COURSE/">清大校務資訊系統</a>。
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                  <v-expansion-panel-content>
                    <div slot="header">這是清大官方的選課系統嗎？</div>
                    <v-card>
                      <v-card-text class="grey lighten-3">
                        不是。這個是由
                        <a @click="$router.push('/about')">在校學生</a>自發架設的簡易選課系統，旨在提供更提供清爽、直覺和方便的選課系統。目前簡易選課系統正在與本校校務資訊組研討合併至官方選課系統的可能性。
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                  <v-expansion-panel-content>
                    <div slot="header">我發現問題了，可以怎麼反應？</div>
                    <v-card>
                      <v-card-text class="grey lighten-3">
                        太棒了！你有兩種方式可以告訴清大簡易選課，<br> 一、填寫
                        <a href="https://goo.gl/forms/TgC3zCe5iYkQ6tyb2">回饋表單</a><br> 二、直接在GitHub上面開個issue
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-card>

              <v-card>
                <v-card-title>
                  <span class="headline">連結</span>
                </v-card-title>
                <v-card-text class="py-0 underline">
                  <v-list>
                    <v-list-tile>
                      <a href="https://www.facebook.com/nthu.courses/"
                         target="_blank"
                         rel="noreferrer">清大簡易選課</a>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile>
                      <a href="https://ge-helper.github.io/"
                         target="_blank"
                         rel="noreferrer">清大通識小幫手</a>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile>
                      <a href="https://program-helper.github.io/"
                         target="_blank"
                         rel="noreferrer">清大學程小幫手</a>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile>
                      <a href="https://www.facebook.com/nthu.course.keeper/"
                         target="_blank"
                         rel="noreferrer">清大選課管家</a>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile>
                      <a href="https://www.facebook.com/poke.course/"
                         target="_blank"
                         rel="noreferrer">戳戳課</a>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile>
                      <a href="http://nthu-course.cf/"
                         target="_blank"
                         rel="noreferrer">向第一個清大簡易預排系統致敬！（失效）</a>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile>
                      <a href="https://nthu-plus.com/"
                         target="_blank"
                         rel="noreferrer">向第一個清大課程評價網站致敬！（失效）</a>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile>
                      <a href="https://www.ccxp.nthu.edu.tw/ccxp/COURSE/"
                         target="_blank"
                         rel="noreferrer">清大校務資訊系統</a>
                    </v-list-tile>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-container>
          </v-flex>
        </v-layout>

        <v-layout>
          <v-flex xs12>
            <div id="disqus_thread"></div>
            <noscript>Please enable JavaScript to view the
              <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
            </noscript>
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
import {
  VTextField,
  VList,
  VListTile,
  VExpansionPanel,
  VExpansionPanelContent,
  VWindow,
  VWindowItem
} from 'vuetify/lib'
import LayoutFooter from '@/components/layout-footer'

export default {
  name: 'Entry',
  components: {
    LayoutFooter,
    VTextField,
    VList,
    VListTile,
    VExpansionPanel,
    VExpansionPanelContent,
    VWindow,
    VWindowItem
  },
  data() {
    return {
      username: '',
      userpass: '',
      authCheckCode: '',
      usingACIXSTORE: false,
      ACIXSTORE: ''
    }
  },
  methods: {
    submit() {
      //this.$store.commit('ui/START_LOADING')
      if (this.usingACIXSTORE) {
        this.$store.commit('user/SET_USER', {
          isLogin: true,
          username: 'UNKNOWN',
          sessionToken: this.ACIXSTORE
        })
        this.$router.push('/service')
      } else {
        let loginInfo = {
          username: this.username,
          userpass: this.userpass,
          authCheckCode: this.authCheckCode
        }
        this.$store
          .dispatch('user/getSessionToken', loginInfo)
          .then(() => {
            //this.$store.commit('ui/STOP_LOADING')
            this.$store.dispatch('ui/openSnackbar', {
              snackbarText: '已成功登入！'
            })
            this.$router.push({ name: 'Service' })
          })
          .catch(err => {
            console.error(err)
            //this.$store.commit('ui/STOP_LOADING')
            this.reload()
          })
      }
    },
    reload() {
      this.userpass = ''
      this.authCheckCode = ''

      this.$store.commit('ui/START_LOADING')

      this.$store
        .dispatch('user/getLoginToken')
        .then(() => {
          this.$store.commit('ui/STOP_LOADING')
        })
        .catch(err => {
          console.error(err)
          this.$store.commit('ui/STOP_LOADING')
        })
    }
  },
  mounted() {
    this.reload()

    /**
     *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
     *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables */
    /*
    var disqus_config = function () {
    this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    */
    /*
    (function() { // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = 'https://nthu-easy-course.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    })();
    */
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
