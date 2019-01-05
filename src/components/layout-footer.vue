<template>
  <v-flex xs12
          class="layout-footer">
    <v-container :pa-0="$store.state.ui.isMobile"
                 mb-5>
      <v-card class="transparent elevation-0">
        <v-card-text>
          <v-select :items="availableLangs"
                    :label="$t('Service.selectLanguege')"
                    item-value="value"
                    @change="setLocale"
                    :value="$i18n.locale"
                    hide-details></v-select>
        </v-card-text>
      </v-card>
      <v-card class="transparent elevation-0">
        <v-card-text>
          <p v-if="$store.state.user.isLogin"
             class="selectable">Session Token: {{ $store.state.user.sessionToken }}</p>
          <p>在 {{beWithText[beWithIndex]}} 的陪伴下製作 —
            <a href="https://github.com/pp253"
               target="_blank"
               rel="noreferrer">工工20 pp253</a>
          </p>
          <p class="underline">
            <a href="https://www.facebook.com/nthu.courses/"
               target="_blank"
               rel="noreferrer">粉絲專頁</a> ．
            <a @click="$router.push('/about')"
               target="_blank"
               rel="noreferrer">關於</a> ．
            <a href="https://github.com/pp253/nthu-select-courses-server"
               target="_blank"
               rel="noreferrer">程式碼</a> ．
            <a href="http://www.apache.org/licenses/LICENSE-2.0"
               target="_blank"
               rel="noreferrer">條款與聲明</a>
          </p>
        </v-card-text>
      </v-card>
    </v-container>
  </v-flex>
</template>

<script>
import { VSelect } from 'vuetify/lib'
import { availableLangs, setI18nLanguage } from '@/locale'

export default {
  name: 'LayoutFooter',
  components: {
    VSelect
  },
  data() {
    return {
      beWithText: [
        'You',
        'NTHU',
        'Node.js',
        'Webpack',
        'Babel',
        'Vue',
        'Vuetify',
        'JavaScript',
        '🔥',
        '🏩',
        '🎻',
        '👾',
        '🎲',
        '🎹',
        '🏫',
        '🗼',
        '🌅',
        '🍺'
      ],
      beWithIndex: 0
    }
  },
  computed: {
    availableLangs() {
      return availableLangs
    }
  },
  methods: {
    updateBeWithText() {
      if (this) {
        this.beWithIndex = parseInt(Math.random() * this.beWithText.length)
        setTimeout(() => {
          this.updateBeWithText()
        }, 2000)
      }
    },
    setLocale(lang) {
      setI18nLanguage(lang)
    }
  },
  mounted() {
    this.updateBeWithText()
  }
}
</script>

<style lang="scss">
.layout-footer {
  .input-group[role='combobox'] {
    max-width: 150px;
  }
}
</style>
