export function htmlEncode(str) {
  if (typeof str !== 'string') {
    return ''
  }

  let result = str
  result = result.replace(/&/g, '&amp;')
  result = result.replace(/</g, '&lt;')
  result = result.replace(/>/g, '&gt;')
  result = result.replace(/ /g, '&nbsp;')
  result = result.replace(/'/g, '&#39;')
  result = result.replace(/"/g, '&quot;')
  return result
}

export function toArray(obj) {
  if (typeof obj !== 'object') {
    throw new Error('toArray: obj should be an object.')
  }

  let arr = []
  for (let key in obj) {
    arr.push(obj[key])
  }
  return arr
}

export function getCourseSemester(courseNumber) {
  return courseNumber.slice(0, 5)
}

export function toReadableProfessor(professorList) {
  if (!professorList) {
    return ''
  }
  let name = ''
  for (let p of professorList) {
    name += p.split('\t')[0] + ' '
  }
  return name
}
