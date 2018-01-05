<template>
  <v-container fluid class="entry">
    <v-layout row wrap>
      <v-flex xs12>
        <v-text-field
          name="input-username"
          :label="$t('login.username')"
          value=""
        ></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-text-field
          type="password"
          name="input-userpass"
          :label="$t('login.userpass')"
          value=""
        ></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-text-field
          name="input-auth_img"
          :label="$t('login.auth_img')"
          value=""
        ></v-text-field>
      </v-flex>
      <v-flex xs12 text-xs-right>
        <v-btn
          name="input-login"
          @click="login()"
        >{{ $t('login.login') }}</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Entry',
  data () {
    return {
    }
  },
  methods: {
    login () {
      this.$router.push({ name: 'SelectCourses' })
    }
  }
}
</script>

<style scoped>

</style>

