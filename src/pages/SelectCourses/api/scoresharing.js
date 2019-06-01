import axios from 'axios'

export const SERVER_BASE = 'https://www.leporidae.ml/v2/'

export function query(username, query_key) {
  return axios.get(
    SERVER_BASE + `query?user_id=${username}&query_key=${query_key}`
  )
}

export function validate(username) {
  return axios.get(SERVER_BASE + `validate?user_id=${username}`)
}
