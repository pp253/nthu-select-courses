export function ResponseJSON (obj) {
  return Object.assign({
    error: 0,
    time: Date.now()
  }, obj)
}

export function ResponseSuccessJSON (obj) {
  return Object.assign(ResponseJSON({
    success: 1
  }), obj)
}

export function ResponseErrorJSON (obj) {
  return Object.assign(ResponseJSON({
    error: 1,
    id: 0,
    msg: 'Unknown error.'
  }), obj)
}

export const ResponseErrorMsg = {
  // store/user/
  UserNotLogin () {
    return ResponseErrorJSON({
      id: 1000,
      msg: `User has not logged in.`
    })
  },
  InvalidLoginToken () {
    return ResponseErrorJSON({
      id: 1001,
      msg: `Login Token is invalid.`
    })
  }
  // store/score/

}

export default {
  ResponseJSON,
  ResponseSuccessJSON,
  ResponseErrorJSON,
  ResponseErrorMsg
}
