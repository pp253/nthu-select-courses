<template>
  <v-container pa-0 pt-5>
    <v-layout>
      <v-flex>
        <v-container :pa-0="store.isMobile" mb-3>
          <v-card>
            <v-card-title>
              <span class="headline">關於製作團隊</span>
            </v-card-title>
            <v-card-text>
              <p>阿，事實上根本稱不上是製作團隊，因為只有我一個。「兄弟齊力，其利斷金」、「一根筷子折的斷，三根筷子就折不斷拉」之類的名言各位也都有聽過，反正就是說只有一個人的話，就只能燒一個肝，有三個人的話，就能燒三個肝呢！</p>
              <p>講這麼多，只是希望各位有志之士能夠與我聯繫，讓這個製作團隊變成真正的製作團隊。</p>
              <v-layout wrap>
                <v-flex xs12>
                  pp253
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import store from '@/lib/store'

export default {
  name: 'About',
  data () {
    return {
      store: store
    }
  }
}
</script>

<style>

</style>
