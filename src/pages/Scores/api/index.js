import { legalRequest } from '@/api'
export * from '@/api'

export function getScores(sessionToken) {
  let data = {
    sessionToken: sessionToken
  }
  return legalRequest('api/scores/getScores', data)
}

export function getDistribution(sessionToken, courseNumber) {
  let data = {
    sessionToken: sessionToken,
    courseNumber: courseNumber
  }
  return legalRequest('api/scores/getDistribution', data)
}
