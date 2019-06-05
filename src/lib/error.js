export function ResponseJSON(obj) {
  return Object.assign(
    {
      error: 0,
      time: Date.now()
    },
    obj
  )
}

export function ResponseSuccessJSON(obj) {
  return Object.assign(
    ResponseJSON({
      success: 1
    }),
    obj
  )
}

export function ResponseErrorJSON(obj) {
  return Object.assign(
    ResponseJSON({
      error: 1,
      id: 0,
      msg: 'Unknown error.'
    }),
    obj
  )
}

export const ResponseErrorMsg = {
  // store/user/
  UserNotLogin() {
    return ResponseErrorJSON({
      id: 1000,
      msg: `User has not logged in.`
    })
  },
  InvalidLoginToken() {
    return ResponseErrorJSON({
      id: 1001,
      msg: `Login Token is invalid.`
    })
  },
  DepartmentAbbrNotFound() {
    return ResponseErrorJSON({
      id: 1010,
      msg: `Department's abbr was not found.`
    })
  },
  NotInSelectionPhase() {
    return ResponseErrorJSON({
      id: 1011,
      msg: `We are not in selection phase right now.`
    })
  },
  NotSupport() {
    return ResponseErrorJSON({
      id: 1012,
      msg: `We are not support to add this course right now.`
    })
  }
}

export default {
  ResponseJSON,
  ResponseSuccessJSON,
  ResponseErrorJSON,
  ResponseErrorMsg
}
