import axios from 'axios'
import store from '@/store'

const SERVER_BASE = 'http://localhost/'
const ERR_MSG = {
  20: {
    title: 'entry.UserInfoNotCorrectTitle',
    text: 'entry.UserInfoNotCorrectText'
  },
  21: {
    title: 'entry.AuthCheckCodeNotCorrectTitle',
    text: 'entry.AuthCheckCodeNotCorrectText'
  },
  22: {
    title: 'entry.NTHUServerErrorTitle',
    text: 'entry.NTHUServerErrorText'
  },
  23: {
    title: '請重新載入頁面以重新登入',
    text: ''
  },
  30: {
    title: '沒有該課程',
    text: ''
  },
  31: {
    title: '課程已停開',
    text: ''
  },
  32: {
    title: '你已經修過這堂課了',
    text: ''
  },
  33: {
    title: '衝堂',
    text: ''
  },
  34: {
    title: '你已經選過這堂課了',
    text: ''
  }
}

function legalRequest (apiPath, data) {
  return new Promise((resolve, reject) => {
    axios.post(SERVER_BASE + apiPath, data)
    .then((res) => {
      if (res.data.error) {
        let err = res.data
        if (err.id) {
          store.commit('ui/openDialog', {
            title: (err.id in ERR_MSG) ? ERR_MSG[err.id].title : '對不起，系統發生錯誤了！',
            text: ((err.id in ERR_MSG) && (ERR_MSG[err.id].text.length !== 0) ? ERR_MSG[err.id].text + '<br>' : '') + '如果你覺得這不應該發生，請試著向清大簡易選課反映。' + '<br>' + htmlEncode(err.more)
          })
        } else if (err.name) {
          store.commit('ui/openDialog', {
            title: err.name,
            text: err.message
          })
        }
        reject(res.data)
        return
      }
      resolve(res.data)
    })
    .catch(function (err) {
      store.commit('ui/openDialog', {
        title: err.name,
        text: err.message
      })
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

export function getScores (sessionToken) {
  let data = {
    sessionToken: sessionToken
  }
  return legalRequest('api/scores/getScores', data)
}

export function getDistribution (sessionToken, courseNumber) {
  let data = {
    sessionToken: sessionToken,
    courseNumber: courseNumber
  }
  return legalRequest('api/scores/getDistribution', data)
}
