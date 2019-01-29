import { legalRequest } from './index'

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
