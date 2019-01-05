import axios from 'axios'
import store from '@/store'
import { htmlEncode } from '@/lib/utils'

export const SERVER_BASE = 'https://nthu-course.ddns.net/' // 'http://localhost/'
export const ERR_MSG = {
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
  },
  35: {
    title: '擋修',
    text: ''
  },
  36: {
    title: '其他的錯誤',
    text: ''
  },
  37: {
    title: '現在不是選課期間',
    text: ''
  },
  38: {
    title: '此課程代碼不正確',
    text: ''
  },
  39: {
    title: 'New order cannot more than old order',
    text: ''
  },
  40: {
    title: '順位不得為零',
    text: ''
  },
  41: {
    title: 'Old order must includes all elements in new order',
    text: ''
  },
  42: {
    title: '違反課堂限制',
    text: '請查閱本堂課的課堂限制'
  },
  43: {
    title: '通識課最多只能選三堂',
    text: ''
  }
}

export function legalRequest(apiPath, data) {
  return new Promise((resolve, reject) => {
    axios
      .post(SERVER_BASE + apiPath, data)
      .then(res => {
        if (res.data.error || res.data.warning) {
          let err = res.data
          if (err.id) {
            store.commit('ui/OPEN_DIALOG', {
              title:
                (err.id in ERR_MSG && ERR_MSG[err.id].title) ||
                err.msg ||
                '對不起，系統發生錯誤了！',
              text:
                err.id in ERR_MSG && ERR_MSG[err.id].text.length !== 0
                  ? ERR_MSG[err.id].text + '<br>'
                  : '',
              more:
                (err.more ? '<br>' + htmlEncode(err.more) : '') +
                '如果你覺得這不應該發生，請試著向清大簡易選課反映。'
            })
          } else if (err.name) {
            store.commit('ui/OPEN_DIALOG', {
              title: err.name || err.title || err.msg,
              text: err.message || err.more || err.msg,
              more:
                (err.more ? '<br>' + htmlEncode(err.more) : '') +
                '如果你覺得這不應該發生，請試著向清大簡易選課反映。'
            })
          }
          reject(res.data)
          return
        }
        resolve(res.data)
      })
      .catch(function(err) {
        store.commit('ui/OPEN_DIALOG', {
          title: err.name,
          text: err.message,
          more:
            '如果你覺得這不應該發生，請試著向清大簡易選課反映。' +
            '<br>' +
            htmlEncode(err.more)
        })
        reject(err)
      })
  })
}

export function getLoginToken() {
  return legalRequest('api/user/getLoginToken')
}

export function getSessionToken(loginInfo) {
  return legalRequest('api/user/getSessionToken', loginInfo)
}

export function logout(sessionToken) {
  let data = {
    sessionToken: sessionToken
  }
  return legalRequest('api/user/logout', data)
}

export function getSyllabus(sessionToken, courseNumber) {
  let data = {
    sessionToken: sessionToken,
    courseNumber: courseNumber
  }
  return legalRequest('api/select_course/getSyllabus', data)
}
