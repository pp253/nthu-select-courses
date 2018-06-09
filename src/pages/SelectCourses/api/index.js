import { legalRequest } from '@/api'

export function getCurrentSelectedCourses(sessionToken) {
  let data = {
    sessionToken: sessionToken
  }
  return legalRequest('api/select_course/getCurrentSelectedCourses', data)
}

export function editOrder(sessionToken, newOrder, oldOrder) {
  let data = {
    sessionToken: sessionToken,
    newOrder: newOrder,
    oldOrder: oldOrder
  }
  return legalRequest('api/select_course/editOrder', data)
}

export function addCourse(sessionToken, courseNumber, order) {
  let data = {
    sessionToken: sessionToken,
    courseNumber: courseNumber,
    order: order
  }
  return legalRequest('api/select_course/addCourse', data)
}

export function quitCourse(sessionToken, courseNumber) {
  let data = {
    sessionToken: sessionToken,
    courseNumber: courseNumber
  }
  return legalRequest('api/select_course/quitCourse', data)
}

export function getSyllabus(sessionToken, courseNumber) {
  let data = {
    sessionToken: sessionToken,
    courseNumber: courseNumber
  }
  return legalRequest('api/select_course/getSyllabus', data)
}

export function getAvailableSelectionResult(sessionToken) {
  let data = {
    sessionToken: sessionToken
  }
  return legalRequest('api/select_course/getAvailableSelectionResult', data)
}

export function getSelectionResult(sessionToken, semester, phase) {
  let data = {
    sessionToken: sessionToken,
    semester: semester,
    phase: phase
  }
  return legalRequest('api/select_course/getSelectionResult', data)
}
