export function htmlEncode (str) {
  if (!str) {
    return ''
  }
  let s = str
  s = s.replace(/&/g, '&amp;')
  s = s.replace(/</g, '&lt;')
  s = s.replace(/>/g, '&gt;')
  s = s.replace(/ /g, '&nbsp;')
  s = s.replace(/'/g, '&#39;')
  s = s.replace(/"/g, '&quot;')
  return s
}

export function toArray (obj) {
  let arr = []
  for (let key in obj) {
    arr.push(obj[key])
  }
  return arr
}

export function toReadableSemester (semester) {
  
}
