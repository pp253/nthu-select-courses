<template>
  <v-flex xs12 class="layout-footer">
    <v-container :pa-0="$store.state.ui.isMobile" mb-5>
      <v-card class="transparent elevation-0">
        <v-card-text>
          <p>在 {{beWithText[beWithIndex]}} 的陪伴下製作 — <a href="https://github.com/pp253">pp253</a></p>
          <p><a @click="$router.push('/about')">關於</a> ． <a href="https://github.com/pp253/nthu-select-courses">程式碼 GitHub</a> ． <a href="">條款與聲明</a></p>
        </v-card-text>
      </v-card>
    </v-container>
  </v-flex>
</template>

<script>
export default {
  name: 'LayoutFooter',
  data () {
    return {
      beWithText: [
        '🍺',
        'Node.js',
        'Vue',
        'Vuetify',
        'NTHU'
      ],
      beWithIndex: 0
    }
  },
  methods: {
    updateBeWithText () {
      if (this) {
        this.beWithIndex = (++this.beWithIndex % this.beWithText.length)
        setTimeout(() => {
          this.updateBeWithText()
        }, 2500)
      }
    }
  },
  mounted () {
    this.updateBeWithText()
  }
}
</script>

<style>

</style>
