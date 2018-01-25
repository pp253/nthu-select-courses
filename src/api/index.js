import axios from 'axios'

const SERVER_BASE = 'http://localhost/'

function legalRequest (apiPath, data) {
  return new Promise((resolve, reject) => {
    axios.post(SERVER_BASE + apiPath, data)
    .then((res) => {
      if (res.data.error) {
        reject(res.data)
      }
      resolve(res.data)
    })
    .catch(function (err) {
      reject(err)
    })
  })
}

export function getLoginToken () {
  return legalRequest('api/user/getLoginToken')
}

export function getSessionToken (loginInfo) {
  return legalRequest('api/user/getSessionToken', loginInfo)
}

export function getScores (sessionToken) {
  let data = {
    sessionToken: sessionToken
  }
  return legalRequest('api/scores/getScores', data)
}

export function getCurrentSelectedCourses (sessionToken) {
  let data = {
    sessionToken: sessionToken
  }
  return legalRequest('api/select_course/getCurrentSelectedCourses', data)
}

export function editOrder (sessionToken, newOrder, oldOrder) {
  let data = {
    sessionToken: sessionToken,
    newOrder: newOrder,
    oldOrder: oldOrder
  }
  return legalRequest('api/select_course/editOrder', data)
}

export function addCourse (sessionToken, courseNumber, order) {
  let data = {
    sessionToken: sessionToken,
    courseNumber: courseNumber,
    order: order
  }
  return legalRequest('api/select_course/addCourse', data)
}

export function quitCourse (sessionToken, courseNumber) {
  let data = {
    sessionToken: sessionToken,
    courseNumber: courseNumber
  }
  return legalRequest('api/select_course/quitCourse', data)
}

export function getSyllabus (sessionToken, courseNumber) {
  let data = {
    sessionToken: sessionToken,
    courseNumber: courseNumber
  }
  return legalRequest('api/select_course/getSyllabus', data)
}

export function getDistribution (sessionToken, courseNumber) {
  let data = {
    sessionToken: sessionToken,
    courseNumber: courseNumber
  }
  return legalRequest('api/scores/getDistribution', data)
}
