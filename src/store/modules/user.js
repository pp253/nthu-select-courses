import * as api from '@/api'
import error from '@/lib/error'

const TEMP_ID = '105034009'
const TEMP_SESSION_TOKEN = '9uhi0os1gu4upovajf82hbt9j4'

export default {
  namespaced: true,
  state: {
    isLogin: TEMP_SESSION_TOKEN !== '' ? true : false,
    loginToken: '',
    authImg: '',
    ID: TEMP_ID || '',
    sessionToken: TEMP_SESSION_TOKEN || '',

    OID: '',
    NAME: { C: '', E: '', X: '' },
    SEX: '',
    PRE_SCH: '',
    PRE_DEPT: '',
    PRE_STATUS: '',
    DIV: '',
    DEPT: '',
    E_YEAR: '',
    CATEGORY: '',
    CLASS: '',
    GROUP: '',
    GRADE: '',
    SEC_DEPT: '',
    MINR: '',
    ENG_LEVEL: '',
    STATUS: '',
    EXG: {
      START: '',
      ENG: ''
    },
    CAMPUS: '',
    TE: '',
    CURR_SCHE: '',
    MAJOR: '',
    IDL_SEL: ''
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
      state.ID = ''
      state.sessionToken = ''
    },
    SET_ID(state, options) {
      state.ID = options.ID
    },
    SET_SESSION_TOKEN(state, options) {
      state.sessionToken = options.sessionToken
    },
    SET_USER(state, options) {
      state.isLogin = options.isLogin !== undefined ? options.isLogin : true
      state.ID = options.ID !== undefined ? options.ID : true
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
     * Pass the ID and user password to server and get the session token.
     * @param {Object} loginInfo Login Info should include `ID`,
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
            ID: loginInfo.ID,
            userpass: loginInfo.userpass,
            authCheckCode: loginInfo.authCheckCode,
            loginToken: context.state.loginToken
          })
          .then(data => {
            context.commit('SET_USER', {
              isLogin: true,
              ID: data.ID,
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
