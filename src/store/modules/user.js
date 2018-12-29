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
  mutations: {
    SET_LOGIN_TOKEN(state, options) {
      state.loginToken = options.loginToken
    },
    SET_AUTH_IMG(state, options) {
      state.authImg = options.authImg
    },
    SET_LOGIN(state, options) {
      state.isLogin = options.isLogin
    },
    LOGOUT(state) {
      state.isLogin = false
      state.loginToken = ''
      state.authImg = ''
      state.username = ''
      state.sessionToken = ''
    },
    SET_USERNAME(state, options) {
      state.username = options.username
    },
    SET_SESSION_TOKEN(state, options) {
      state.sessionToken = options.sessionToken
    },
    SET_USER(state, options) {
      state.isLogin = options.isLogin !== undefined ? options.isLogin : true
      state.username = options.username !== undefined ? options.username : true
      state.sessionToken =
        options.sessionToken !== undefined ? options.sessionToken : true
    }
  },
  actions: {
    /**
     * Get login token and auth img for user to login.
     * @return {Promise}
     */
    getLoginToken(context) {
      return new Promise((resolve, reject) => {
        api
          .getLoginToken()
          .then(data => {
            context.commit('SET_LOGIN_TOKEN', { loginToken: data.loginToken })
            context.commit('SET_AUTH_IMG', { authImg: data.authImg })
            resolve(data)
          })
          .catch(err => {
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
    getSessionToken(context, loginInfo) {
      context.dispatch('loading/start', 'user.getSessionToken', {
        root: true
      })

      return new Promise((resolve, reject) => {
        if (context.state.loginToken === '') {
          reject(error.ResponseErrorMsg.InvalidLoginToken())
          return
        }

        api
          .getSessionToken({
            username: loginInfo.username,
            userpass: loginInfo.userpass,
            authCheckCode: loginInfo.authCheckCode,
            loginToken: context.state.loginToken
          })
          .then(data => {
            context.commit('SET_USER', {
              isLogin: true,
              username: data.username,
              sessionToken: data.sessionToken
            })

            context.dispatch('loading/end', 'user.getSessionToken', {
              root: true
            })
            resolve(data)
          })
          .catch(err => {
            context.dispatch('loading/end', 'user.getSessionToken', {
              root: true
            })
            reject(err)
          })
      })
    },
    logout(context) {
      return new Promise((resolve, reject) => {
        api
          .logout(context.rootState.user.sessionToken)
          .then(() => {
            context.commit('LOGOUT')
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
