<template>
  <v-container pa-0 pt-5 class="about" text-xs-center>
    <v-layout wrap justify-center>
      <v-flex xs12 xl8>
        <v-layout wrap>
          <v-flex xs12>
            <v-container :pa-0="$store.state.ui.isMobile" pb-3 mb-3>
              <v-card class="transparent elevation-0">
                <v-card-text>
                  <h1>關於清大簡易選課系統</h1>
                </v-card-text>
              </v-card>
            </v-container>
          </v-flex>
          <v-flex xs12>
            <v-container :pa-0="$store.state.ui.isMobile" pt-3 pb-3 mb-3>
              <v-card>
                <v-card-text>
                  <p>阿，事實上根本稱不上是製作團隊，因為只有我一個。「兄弟齊力，其利斷金」、「一根筷子折的斷，三根筷子就折不斷拉」之類的名言各位也都有聽過，反正就是說只有一個人的話，就只能燒一個肝，有三個人的話，就能燒三個肝呢！</p>
                  <p>講這麼多，只是希望各位有志之士能夠與我聯繫，讓這個製作團隊變成真正的製作團隊。</p>
                  <v-btn icon flat large @click="$router.push('/')">
                    <v-icon>home</v-icon>
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-container>
          </v-flex>
          <v-flex xs12>
            <v-container :pa-0="$store.state.ui.isMobile" pt-3 mb-3>
              <v-card>
                <v-card-text>
                  <v-layout
                    v-for="(category, categoryName) in list"
                    :key="categoryName"
                    wrap
                    pb-5
                    justify-center
                  >
                    <v-flex xs12 pb-3><h2>{{ categoryName }}</h2></v-flex>
                    <template
                      v-for="people in category"
                    >
                      <v-flex
                        v-if="people.text"
                        :key="people.text"
                        xs12
                      >
                        <p v-html="people.text"></p>
                      </v-flex>
                      <v-flex
                        v-else
                        :key="people.name"
                        xs6 sm3 md3 lg2
                      >
                        <v-container>
                          <a :href="people.link">
                            <v-avatar
                              size="64px"
                              class="grey lighten-4"
                            >
                              <img
                                v-if="people.img"
                                :src="people.img"
                              />
                              <v-icon
                                v-else
                              >person</v-icon>
                            </v-avatar>
                            <p class="mb-2">{{ people.name }}</p>
                          </a>
                          <p v-html="people.description"></p>
                        </v-container>
                      </v-flex>
                    </template>
                  </v-layout>
                  <v-btn icon flat large @click="$router.push('/')">
                    <v-icon>home</v-icon>
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-container>
          </v-flex>
          <v-flex xs12>
            <v-container :pa-0="$store.state.ui.isMobile" mb-3>
              <v-card>
                <v-card-text>
                  <h2 class="pb-3">依賴組件</h2>
                  <v-layout wrap justify-center>
                    <v-flex
                      v-for="dependency in dependencies"
                      :key="dependency.name"
                      xs4 sm3 md2 lg1
                    >
                      <v-container>
                        <a :href="dependency.link">
                          <v-avatar
                            size="64px"
                            class="grey lighten-4"
                          >
                            <img
                              v-if="dependency.img"
                              :src="dependency.img"
                            />
                            <v-icon
                              v-else
                            >extension</v-icon>
                          </v-avatar>
                          <p class="mb-2">{{ dependency.name }}</p>
                        </a>
                      </v-container>
                    </v-flex>
                  </v-layout>
                  <p>更多請參考<a href="https://github.com/pp253/nthu-select-courses/blob/master/package.json">package.json</a>。</p>
                  <v-btn icon flat large @click="$router.push('/')">
                    <v-icon>home</v-icon>
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-container>
          </v-flex>
          <v-flex xs12>
            <v-container :pa-0="$store.state.ui.isMobile" mb-3>
              <v-card>
                <v-card-text>
                  <h2 class="pb-3">條款</h2>
                  <p><a href="http://www.apache.org/licenses/">Apache-2.0</a></p>
                  <v-btn icon flat large @click="$router.push('/')">
                    <v-icon>home</v-icon>
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-container>
          </v-flex>
          <layout-footer />
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import LayoutFooter from './layout-footer'

export default {
  name: 'About',
  components: {
    LayoutFooter
  },
  data () {
    return {
      list: {
        '開發者': [
          {
            name: 'pp253',
            link: 'https://github.com/pp253',
            description: '清大工工20級。雖然腦袋不太好，但還是很喜歡動動他。',
            img: '/static/img/about/pp253.jpg'
          },
          {
            text: '<b>如何成為開發者？</b>請前往<a href="https://github.com/pp253/nthu-select-courses">GitHub</a>，然後commit個、或是PR，你就成為了開發者！'
          }
        ],
        '測試者': [
          {
            name: '王子齊',
            link: '',
            description: '第一次封測，清大工工20級',
            img: ''
          },
          {
            name: '賴朱頎',
            link: '',
            description: '第一次封測，清大工工20級',
            img: ''
          },
          {
            name: '黃提道',
            link: '',
            description: '第一次封測，清大工工20級',
            img: ''
          },
          {
            name: '王冠勛',
            link: '',
            description: '第一次封測，清大工工20級',
            img: ''
          },
          {
            text: '<b>如何成為測試者？</b>你可以透過表單申請成為新功能的測試者，只要試過任何測試版本，你都會出現在上面。'
          }
        ],
        '特別感謝': [
          {
            text: '<b>如何成為特別感謝者？</b>提供建議，或是發現並回報錯誤的人，只要你同意，就可以成為特別感謝的人。'
          }
        ]
      },
      dependencies: [
        {
          name: 'Vue',
          link: '',
          img: ''
        },
        {
          name: 'Vuex',
          link: '',
          img: ''
        },
        {
          name: 'Vuetify',
          link: '',
          img: ''
        },
        {
          name: 'vue-router',
          link: '',
          img: ''
        },
        {
          name: 'vue-i18n',
          link: '',
          img: ''
        },
        {
          name: 'chart.js',
          link: '',
          img: ''
        },
        {
          name: 'vue-draggable',
          link: '',
          img: ''
        },
        {
          name: 'axios',
          link: '',
          img: ''
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.about {
  overflow: auto;
  height: 100vh;
  -webkit-overflow-scrolling: touch;
}
</style>
