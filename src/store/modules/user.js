import * as api from '@/api'
import error from '@/lib/error'

export default {
  namespaced: true,
  state: {
    isLogin: false,
    loginToken: '',
    authImg: '',
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
    logout (state) {
      state.isLogin = false
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
    /**
     * Get login token and auth img for user to login.
     * @return {Promise}
     */
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
    /**
     * Pass the username and user password to server and get the session token.
     * @param {Object} loginInfo Login Info should include `username`,
     * `userpass`, `authCheckCode`.
     * @return {Promise}
     */
    getSessionToken (context, loginInfo) {
      return new Promise((resolve, reject) => {
        if (context.state.loginToken === '') {
          reject(error.ResponseErrorMsg.InvalidLoginToken())
          return
        }

        api.getSessionToken({
          username: loginInfo.username,
          userpass: loginInfo.userpass,
          authCheckCode: loginInfo.authCheckCode,
          loginToken: context.state.loginToken
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
