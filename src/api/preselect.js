import axios from 'axios'

const NTHU_HOST_NAME = 'https://www.ccxp.nthu.edu.tw/ccxp/COURSE/JH/7/7.6/7.6.1/'

export function getCoursesListByClass (deptAbbr) {
  axios.post(NTHU_HOST_NAME + 'JH761004.php?toChk=2&amp;ACIXSTORE=d55vagkdq46f9iifv2945ttlc5', {
    ACIXSTORE: 'd55vagkdq46f9iifv2945ttlc5',
    toChk: 1,
    new_dept: 'IEEM',
    new_class: 'ESS 104BA',
    keyword: '',
    chks: 'dept',
    ckey: '',
    chkbtn: ''
  }).then(function (result) {
    console.log(result)
  })
}

export function getCoursesListByDept (deptAbbr) {
  axios.post(NTHU_HOST_NAME + 'JH761004.php?toChk=2&amp;ACIXSTORE=d55vagkdq46f9iifv2945ttlc5', {
    ACIXSTORE: 'd55vagkdq46f9iifv2945ttlc5',
    toChk: 2,
    new_dept: 'IEEM',
    new_class: 'ESS 104BA',
    keyword: '',
    chks: 'code',
    ckey: '',
    chkbtn: ''
  }).then(function (result) {
    console.loh(result)
  })
}

export function getDepts () {
  return {

  }
}
