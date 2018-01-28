import * as api from '@/api'

export default {
  namespaced: true,
  state: {
    loginToken: '',
    authImg: '',
    isLogin: false,
    username: '',
    sessionToken: ''
  },
  getters: {

  },
  mutations: {
    setLoginToken (state, options) {
      state.loginToken = options.loginToken
    },
    setAuthImg (state, options) {
      state.authImg = options.authImg
    },
    setLogin (state, options) {
      state.isLogin = options.isLogin
    },
    setUsername (state, options) {
      state.username = options.username
    },
    setSessionToken (state, options) {
      state.sessionToken = options.sessionToken
    },
    setUser (state, options) {
      state.isLogin = options.isLogin !== undefined ? options.isLogin : true
      state.username = options.username !== undefined ? options.username : true
      state.sessionToken = options.sessionToken !== undefined ? options.sessionToken : true
    }
  },
  actions: {
    getLoginToken (context) {
      return new Promise((resolve, reject) => {
        api.getLoginToken()
        .then((data) => {
          context.commit('setLoginToken', {loginToken: data.loginToken})
          context.commit('setAuthImg', {authImg: data.authImg})
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
      })
    },
    getSessionToken (context, loginInfo) {
      return new Promise((resolve, reject) => {
        if (context.state.user.loginToken === '') {
          reject()
          return
        }

        api.getSessionToken({
          username: loginInfo.username,
          userpass: loginInfo.userpass,
          authCheckCode: loginInfo.authCheckCode,
          loginToken: context.state.user.loginToken
        })
        .then((data) => {
          context.commit('setUser', {
            isLogin: true,
            username: data.username,
            sessionToken: data.sessionToken
          })
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
      })
    }
  }
}
