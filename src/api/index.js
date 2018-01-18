import axios from 'axios'

const SERVER_BASE = 'http://127.0.0.1/'

function legalPromise (apiPath, data) {
  return new Promise((resolve, reject) => {
    axios.post(SERVER_BASE + apiPath, data)
    .then((res) => {
      if (res.data.error) {
        reject(res)
      }
      resolve(res.data)
    })
    .catch(function (err) {
      reject(err)
    })
  })
}

export function getLoginToken () {
  return legalPromise('api/user/getLoginToken')
}

export function getSessionToken (loginInfo) {
  return legalPromise('api/user/getSessionToken', loginInfo)
}

export function getSyllabus (courseNumber) {
  let data = {
    courseNumber: courseNumber
  }
  return legalPromise('api/user/getSyllabus', data)
}

export function getScores (sessionToken) {
  let data = {
    sessionToken: sessionToken
  }
  return legalPromise('api/scores/getScores', data)
}
