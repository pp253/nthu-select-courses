<template>
  <v-container class="entry" fluid pa-0 style="transform: translateZ(0);">
    <v-layout wrap align-center justify-center>
      <v-flex xs12 class="header">
        <v-layout align-center justify-center row fill-height>
          <v-flex xs12>
            <v-container>
              <v-layout justify-space-between wrap>
                <v-flex xs12 sm7 md6>
                  <v-card class="transparent elevation-0">
                    <v-card-text class="pt-5 hidden-sm-and-down"></v-card-text>
                    <v-card-text class="text-xs-center text-sm-left">
                      <v-layout class="logo-wrapper">
                        <v-flex class="logo">
                          <img
                            class="logo"
                            src="/logo-circle.png"
                            style="display: inline-block;"
                          />
                        </v-flex>
                        <v-flex xs12>
                          <h1>清大簡易選課</h1>
                          <h3 style="color: #444;">選課，就是這麼簡單</h3>
                        </v-flex>
                      </v-layout>
                    </v-card-text>

                    <v-card-actions class="hidden-sm-and-up mt-0 pt-0">
                      <v-btn
                        block
                        flat
                        href="https://www.facebook.com/nthu.courses"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src="/facebook-box.png"
                          style="width: 28px;"
                          class="mr-1"
                        />清大簡易選課
                      </v-btn>
                    </v-card-actions>

                    <v-card-text class="hidden-xs-only">
                      <v-card
                        class="text-xs-center elevation-0"
                        style="background-color: rgba(255, 255, 255, 0.6);"
                      >
                        <v-card-text>
                          <v-layout>
                            <v-flex xs4 pa-3>
                              <div class="pb-1">
                                <v-icon>playlist_add</v-icon>
                              </div>
                              <div>簡易選課</div>
                            </v-flex>
                            <v-flex xs4 pa-3>
                              <div class="pb-1">
                                <v-icon>assessment</v-icon>
                              </div>
                              <div>簡易成績查詢</div>
                            </v-flex>
                            <v-flex xs4>
                              <a
                                target="_blank"
                                rel="noreferrer"
                                href="https://www.facebook.com/nthu.courses"
                                style="display: block;"
                                v-ripple
                                class="pa-3"
                              >
                                <div>
                                  <img
                                    src="/facebook-box.png"
                                    style="width: 24px;"
                                  />
                                </div>
                                <div>清大簡易選課</div>
                              </a>
                            </v-flex>
                          </v-layout>
                        </v-card-text>
                      </v-card>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 sm5 md4>
                  <form>
                    <v-card ref="form">
                      <v-card-title>
                        <div>
                          <div class="headline" v-t="'login.login'"></div>
                          <div class="grey--text darken-1">
                            請使用你在校務資訊系統登入的帳號。常見問題請見頁底。
                          </div>
                          <div class="red--text">
                            本系統還在測試階段，選完課請至原選課系統確認！
                          </div>
                        </div>
                      </v-card-title>
                      <v-window v-model="usingACIXSTORE" vertical>
                        <v-window-item :value="false">
                          <v-card-text>
                            <v-text-field
                              name="input-ID"
                              :label="$t('login.ID')"
                              value=""
                              autocomplete="on"
                              v-model="ID"
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
                              <v-flex mr-3>
                                <img
                                  :src="
                                    'data:image/png;base64,' +
                                      $store.state.user.authImg
                                  "
                                  class="auth-img"
                                />
                              </v-flex>
                              <v-flex xs12>
                                <v-text-field
                                  name="input-authCheckCode"
                                  :label="$t('login.auth_img')"
                                  value=""
                                  v-model="authCheckCode"
                                  autocomplete="off"
                                  :rules="[
                                    () =>
                                      authCheckCode.length === 6 ||
                                      $t('login.authCodeFormatError')
                                  ]"
                                  validate-on-blur
                                  type="number"
                                  required
                                  @keyup.native="
                                    e => {
                                      e.key === 'Enter' &&
                                        (ID && userpass && authCheckCode) &&
                                        submit()
                                    }
                                  "
                                ></v-text-field>
                              </v-flex>
                            </v-layout>
                          </v-card-text>
                        </v-window-item>
                        <v-window-item :value="true">
                          <v-card-text>
                            <p>
                              你可以先從校務資訊系統登入後，將網址列中的
                              <code>ACIXSTORE=XXX</code> 中的
                              <code>XXX</code> 貼過來登入
                            </p>
                            <v-text-field
                              name="input-ACIXSTORE-ID"
                              :label="$t('login.ID')"
                              value=""
                              autocomplete="on"
                              v-model="ID"
                              required
                            ></v-text-field>
                            <v-text-field
                              name="input-ACIXSTORE"
                              :label="$t('login.ACIXSTORE')"
                              value=""
                              autocomplete="off"
                              :rules="[
                                () =>
                                  ACIXSTORE.length === 26 ||
                                  $t('login.ACIXSTOREFormatError')
                              ]"
                              v-model="ACIXSTORE"
                              required
                            ></v-text-field>
                          </v-card-text>
                        </v-window-item>
                      </v-window>
                      <v-card-actions v-if="$store.state.user.isLogin">
                        <v-spacer></v-spacer>
                        <v-btn @click="$router.push('/service')">
                          {{ $t('login.directLogin') }}
                        </v-btn>
                      </v-card-actions>
                      <v-card-actions>
                        <v-btn @click="usingACIXSTORE = !usingACIXSTORE" flat>
                          {{
                            $t(
                              usingACIXSTORE
                                ? 'login.usingPassword'
                                : 'login.usingACIXSTORE'
                            )
                          }}
                        </v-btn>
                        <v-spacer />
                        <v-btn
                          @click="submit"
                          :disabled="
                            (!usingACIXSTORE &&
                              (!ID || !userpass || !authCheckCode)) ||
                              (usingACIXSTORE &&
                                (!(ACIXSTORE.length === 26) || !ID))
                          "
                          color="primary"
                        >
                          {{ $t('login.login') }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </form>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 class="intro-block">
        <v-layout align-center justify-center row fill-height>
          <v-flex xs12 class="intro-block-wrapper">
            <v-container>
              <v-layout align-center wrap>
                <v-flex xs12 sm6 class="text-xs-center">
                  <img src="@/assets/entry-pc-mobile-compare.png" alt="" />
                </v-flex>
                <v-flex xs12 sm6 lg4>
                  <v-card class="transparent elevation-0">
                    <v-card-title>
                      <h2 class="headline">電腦、手機，無縫接軌</h2>
                    </v-card-title>
                    <v-card-text>
                      簡易選課正是專為解決電腦、手機的操作問題而設計的，試著解決現在的選課系統難以在手機上操作的問題。
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex lg2 hidden-md-and-down></v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 class="intro-block">
        <v-layout align-center justify-center row fill-height>
          <v-flex xs12 class="intro-block-wrapper">
            <v-container>
              <v-layout align-center wrap row>
                <v-flex xs12 sm6 order-sm3 class="text-xs-center">
                  <img src="@/assets/entry-score-dist.png" alt="" />
                </v-flex>
                <v-flex lg2 hidden-md-and-down order-sm1></v-flex>
                <v-flex xs12 sm6 lg4 order-sm2>
                  <v-card class="transparent elevation-0">
                    <v-card-title>
                      <h2 class="headline">整合歷屆成績分布*</h2>
                    </v-card-title>
                    <v-card-text>
                      感謝<a
                        href="https://chrome.google.com/webstore/detail/nthuscoresharing/fbbgchnopppgncdjbckkjehfchncghdf"
                        target="_blank"
                      >
                        NTHU ScoreSharing
                      </a>
                      ，簡易選課整合歷屆成績分布，讓你在選課的時候如魚得水。
                    </v-card-text>
                    <v-card-text style="font-size: 14px;" class="grey--text">
                      * 您必須曾經在電腦版 Chrome 安裝過<a
                        href="https://chrome.google.com/webstore/detail/nthuscoresharing/fbbgchnopppgncdjbckkjehfchncghdf"
                        target="_blank"
                      >
                        NTHU ScoreSharing </a
                      >套件，方可使用此功能。資料由 NTHU ScoreSharing 提供。
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 class="intro-block">
        <v-layout align-center justify-center row fill-height>
          <v-flex xs12 class="intro-block-wrapper">
            <v-container>
              <v-layout align-center wrap>
                <v-flex xs12 sm6 class="text-xs-center">
                  <img src="@/assets/entry-edit-order.png" alt="" />
                </v-flex>
                <v-flex xs12 sm6 lg4>
                  <v-card class="transparent elevation-0">
                    <v-card-title class="headline">
                      排序志願序更直觀
                    </v-card-title>
                    <v-card-text>
                      在原有的選課系統，重排志願序實在不輕鬆。<br />為了將志願6的通識調至志願1，你需要耗費一番工夫，反覆的加退選正考驗著你的耐性。今天開始，讓簡易選課為你代勞吧！
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex lg2 hidden-md-and-down></v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 class="mt-5">
        <v-container>
          <v-layout wrap>
            <v-flex xs12 md4>
              <v-container>
                <v-card>
                  <v-card-title>
                    <div>
                      <span class="headline">最新資訊</span>
                    </div>
                  </v-card-title>
                  <v-card-text class="pl-0 pr-0">
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-container pt-0 pl-3 pr-3 pb-0>
                          <h3>進修英文、商用英文課無法選填志願</h3>
                          <p>
                            目前簡易選課系統無法選填「進修英文」、「商用英文」等志願！感謝同學回報，我們會盡速修復
                          </p>
                        </v-container>
                      </v-flex>
                      <v-flex xs12>
                        <v-container pt-0 pl-3 pr-3 pb-0>
                          <h3>通識向度、學分學程課程課表</h3>
                          <p>
                            請在「選擇科系」按鈕選擇通識向度、學分學程的課表。另外雙專長的課表目前是舊版的，所以先不開放
                          </p>
                        </v-container>
                      </v-flex>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-container>
            </v-flex>

            <v-flex xs12 md4>
              <v-container>
                <v-card>
                  <v-card-title>
                    <span class="headline">常見問題</span>
                  </v-card-title>
                  <v-expansion-panel class="mb-3 underline">
                    <v-expansion-panel-content>
                      <div slot="header">這個網站會記錄我的帳號和密碼嗎？</div>
                      <v-card>
                        <v-card-text class="grey lighten-3">
                          不會。你可以把這個網站想成是矇了眼的銀行櫃員，他在你和清大校務資訊系統間傳遞資訊，但他看不到上面寫什麼，所以你的資訊在這個網站上並不會有紀錄。<br />
                          若有任何疑慮，我們有提供這個網站的
                          <a href="https://github.com/pp253/nthu-select-courses"
                            >所有程式碼</a
                          >（以及
                          <a
                            href="https://github.com/pp253/nthu-select-courses-server"
                            >伺服器程式碼</a
                          >）。如果這樣還是無法讓你安心的話，請左轉
                          <a href="https://www.ccxp.nthu.edu.tw/ccxp/COURSE/"
                            >清大校務資訊系統</a
                          >。
                        </v-card-text>
                      </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                      <div slot="header">這是清大官方的選課系統嗎？</div>
                      <v-card>
                        <v-card-text class="grey lighten-3">
                          不是。這個是由
                          <a @click="$router.push('/about')">在校學生</a
                          >自發架設的簡易選課系統，旨在提供更提供清爽、直覺和方便的選課系統。目前簡易選課正在與本校校務資訊組研討合併至官方選課系統的可能性。
                        </v-card-text>
                      </v-card>
                    </v-expansion-panel-content>
                    <v-expansion-panel-content>
                      <div slot="header">我發現問題了，可以怎麼反應？</div>
                      <v-card>
                        <v-card-text class="grey lighten-3">
                          太棒了！你有兩種方式可以告訴清大簡易選課，<br />
                          一、填寫
                          <a href="https://goo.gl/forms/TgC3zCe5iYkQ6tyb2"
                            >回饋表單</a
                          ><br />
                          二、直接在GitHub上面開個issue
                        </v-card-text>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-card>
              </v-container>
            </v-flex>

            <v-flex xs12 md4>
              <v-container>
                <v-card>
                  <v-card-title>
                    <span class="headline">連結</span>
                  </v-card-title>
                  <v-card-text class="py-0 underline">
                    <v-list>
                      <v-list-tile>
                        <a
                          href="https://www.facebook.com/nthu.courses/"
                          target="_blank"
                          rel="noreferrer"
                          >清大簡易選課</a
                        >
                      </v-list-tile>
                      <v-divider></v-divider>
                      <v-list-tile>
                        <a
                          href="https://ge-helper.github.io/"
                          target="_blank"
                          rel="noreferrer"
                          >清大通識小幫手</a
                        >
                      </v-list-tile>
                      <v-divider></v-divider>
                      <v-list-tile>
                        <a
                          href="https://program-helper.github.io/"
                          target="_blank"
                          rel="noreferrer"
                          >清大學程小幫手</a
                        >
                      </v-list-tile>
                      <v-divider></v-divider>
                      <v-list-tile>
                        <a
                          href="https://www.facebook.com/nthu.course.keeper/"
                          target="_blank"
                          rel="noreferrer"
                          >清大選課管家</a
                        >
                      </v-list-tile>
                      <v-divider></v-divider>
                      <v-list-tile>
                        <a
                          href="https://www.facebook.com/poke.course/"
                          target="_blank"
                          rel="noreferrer"
                          >戳戳課</a
                        >
                      </v-list-tile>
                      <v-divider></v-divider>
                      <v-list-tile>
                        <a
                          href="http://nthu-course.cf/"
                          target="_blank"
                          rel="noreferrer"
                          >向第一個清大簡易預排系統致敬！（失效）</a
                        >
                      </v-list-tile>
                      <v-divider></v-divider>
                      <v-list-tile>
                        <a
                          href="https://nthu-plus.com/"
                          target="_blank"
                          rel="noreferrer"
                          >向第一個清大課程評價網站致敬！（失效）</a
                        >
                      </v-list-tile>
                      <v-divider></v-divider>
                      <v-list-tile>
                        <a
                          href="https://www.ccxp.nthu.edu.tw/ccxp/COURSE/"
                          target="_blank"
                          rel="noreferrer"
                          >清大校務資訊系統</a
                        >
                      </v-list-tile>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-container>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
    <v-layout>
      <layout-footer />
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
import { mapState } from 'vuex'

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
      ID: '',
      userpass: '',
      authCheckCode: '',
      usingACIXSTORE: false,
      ACIXSTORE: ''
    }
  },
  computed: {
    ...mapState('ui', ['isMobile'])
  },
  methods: {
    submit() {
      //this.$store.commit('ui/START_LOADING')
      if (this.usingACIXSTORE) {
        this.$store.commit('user/SET_USER', {
          isLogin: true,
          ID: this.ID,
          sessionToken: this.ACIXSTORE
        })
        this.$router.push('/service')
      } else {
        let loginInfo = {
          ID: this.ID,
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
    this.$store.commit('ui/SET_THEME_COLOR', {
      color: '#64B4F6'
    })
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
  transform: translateZ(0);
  height: 100vh;
  -webkit-overflow-scrolling: touch;

  form {
    .auth-img {
      margin-top: 18px;
    }
  }

  .header {
    height: 80vh;
    min-height: 700px;

    background-color: rgb(162, 213, 255);

    .flex.logo {
      min-width: 108px + 16px;
    }
    img.logo {
      width: 108px;
    }
    h1 {
      font-size: 40px;
    }
    h3 {
      font-size: 20px;
      margin-left: 2px;
    }
  }

  @media screen and (min-width: 961px) {
    .header {
      .flex.logo {
        min-width: 108px + 16px;
      }
      img.logo {
        width: 108px;
      }
      h1 {
        font-size: 40px;
      }
      h3 {
        font-size: 20px;
        margin-left: 2px;
      }
    }

    .intro-block {
      $height: 400px;
      height: $height;
      padding: 16px 0;

      .intro-block-wrapper,
      .intro-block-wrapper .container,
      .intro-block-wrapper .container .layout {
        height: 100%;
      }

      .intro-block-wrapper .container .layout .flex {
        max-height: 100%;
      }

      .v-card__text {
        font-size: 16px;
      }
      img {
        max-width: 85%;
        max-height: $height * 0.8;
      }
    }
  }

  @media screen and (max-width: 600px) {
    .header {
      .logo-wrapper {
        margin-top: 0px;
        width: 250px;
        margin: 0 auto;
      }
    }
  }

  @media screen and (min-width: 601px) and (max-width: 960px) {
    .logo-wrapper {
      margin-top: 72px;
    }
  }

  @media screen and (max-width: 960px) {
    .header {
      .flex.logo {
        min-width: 72px;
      }
      img.logo {
        width: 64px;
      }
      h1 {
        font-size: 24px;
      }
      h3 {
        font-size: 16px;
        margin-left: 2px;
      }
    }

    .intro-block {
      $height: 400px;
      padding: 16px 0;

      .intro-block-wrapper,
      .intro-block-wrapper .container,
      .intro-block-wrapper .container .layout {
        height: 100%;
      }

      .intro-block-wrapper .container .layout .flex {
        max-height: 100%;
      }

      .v-card__text {
        font-size: 16px;
      }
      img {
        max-width: 85%;
        max-height: 40vh;
        height: auto;
      }
    }
  }
}
</style>
