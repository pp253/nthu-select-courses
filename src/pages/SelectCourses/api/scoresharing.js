import axios from 'axios'

export const SERVER_BASE = 'https://www.nthuscoresharing.ml/api/v1/'

export function query(username, query_key) {
  return axios.get(
    SERVER_BASE + `getPastCourse?userID=${username}&courseNumber=${query_key}`
  )
}

export function validate(username) {
  return axios.post(SERVER_BASE + `login`, { userId: username })
}
