import * as scoresharing from '../api/scoresharing'

export default {
  namespaced: true,
  state: {
    valid: false,

    /**
     * @type {courseNO => ScoreDist[] | null}
     */
    scores: {}
  },
  mutations: {
    /**
     * @param {boolean} valid
     */
    SET_VALID(state, options) {
      state.valid = options.valid
    },

    /**
     *
     * @param {string} queryKey
     * @param {ScoreDist[]} scoresDist
     */
    SET_SCORE(state, options) {
      let queryKey = options.queryKey
      let scoresDist = options.scoresDist || null
      if (!queryKey) {
        throw new Error('[scoresharing/SET_SCORE] queryKey must exist.')
      }
      state.scores = Object.assign({}, state.scores, {
        [queryKey]: scoresDist
      })
    }
  },
  actions: {
    async validate(context) {
      context.dispatch('loading/start', 'scoresharing/validate', {
        root: true
      })

      let username = context.rootState.user.ID
      let { data } = await scoresharing.validate(username)
      let valid = data === 'true' || data === true
      context.commit('SET_VALID', { valid: valid })

      context.dispatch('loading/end', 'scoresharing/validate', {
        root: true
      })
      return valid
    },
    async query(context, options) {
      if (context.state.valid === false) {
        return null
      }

      if (
        !options.NAME ||
        !options.TEACHER ||
        !(options.TEACHER instanceof Array)
      ) {
        return null
      }
      let name = options.NAME
      let teacher = options.TEACHER
        ? options.TEACHER.map(v => v.split('\t')[0]).join(';')
        : ''
      let queryKey = `${name}:${teacher}`
      if (context.state.scores.hasOwnProperty(queryKey)) {
        return context.state.scores[queryKey]
      }

      context.dispatch('loading/start', 'scoresharing/query', {
        root: true
      })

      let username = context.rootState.user.ID
      let { data } = await scoresharing.query(username, queryKey)
      let scoresDist = data

      context.dispatch('loading/end', 'scoresharing/query', {
        root: true
      })

      if (typeof scoresDist !== 'object' || !(scoresDist instanceof Array)) {
        context.commit('SET_SCORE', {
          queryKey: queryKey,
          scoresDist: null
        })
        return null
      }

      context.commit('SET_SCORE', {
        queryKey: queryKey,
        scoresDist: scoresDist.reverse()
      })

      return scoresDist
    }
  }
}
