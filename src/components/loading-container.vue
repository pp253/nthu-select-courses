<template>
  <v-container ma-0
               pa-0
               fill-height
               justify-center>
    <v-progress-circular indeterminate
                         color="primary"
                         :size="50"></v-progress-circular>
  </v-container>
</template>

<script>
import { VProgressCircular } from 'vuetify/lib'

export default {
  name: 'LoadingContainer',
  components: {
    VProgressCircular
  }
}
</script>
