import { createMetaMixin, LocalStorage } from 'quasar'
import packageInfo from '../../package.json'
// eslint-disable-next-line
import jwt_decode from 'jwt-decode'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'



function getMetaData(pageTitle) {
  const metaData = {
    title: `${pageTitle}`,
    titleTemplate: title => `${title} | ${packageInfo.productName}`
  }
  return createMetaMixin(metaData)
}

function hasPermission (token, permission) {
  const permsList = LocalStorage.getItem('permissionList')
  let hasPerm = -1
  // eslint-disable-next-line
  const authPayload = jwt_decode(token)
  const now = new Date()
  // Delete expired tokem
  if (Math.floor(now.getTime() / 1000) > authPayload.exp) {
    LocalStorage.remove('permissionList')
    LocalStorage.remove('authToken')
    window.location.replace('/')
  } else if (permsList === null) {
    LocalStorage.remove('authToken')
    window.location.replace('/')
  }
  if (permsList !== null) {
    hasPerm = permsList.indexOf(permission)
  }
  return hasPerm > -1
}

function validateEmail (val) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return (re.test(val) || 'Please enter a valid email.')
}

function formatDate (date) {
  const dateFromAPI = new Date(date)
  dayjs.extend(advancedFormat)
  const formattedDate = dayjs(dateFromAPI).format('Do MMM, YYYY')
  return formattedDate.toUpperCase()
}

function fmtDate (date, format) {
  const dateFromAPI = new Date(date)
  dayjs.extend(advancedFormat)
  const formattedDate = dayjs(dateFromAPI).format(format)
  return formattedDate.toUpperCase()
}

function relativeDate (date) {
  dayjs.extend(relativeTime)
  const dateFromAPI = new Date(date)
  const relatedDate = dayjs(dateFromAPI).from(Date.now())
  return relatedDate.toUpperCase()
}

function objectToUpper (payload, exclude=[]) {
  const payloadCopy = {...payload}
  // Convert copied payload to upper-case
  for (var key of Object.keys(payloadCopy)) {
    if ((exclude.indexOf(key) === -1) && (payloadCopy[key] !== null)) {
      payloadCopy[key] = payloadCopy[key].toUpperCase()
    }
  }
  return payloadCopy
}

export {
  getMetaData,
  hasPermission,
  validateEmail,
  formatDate,
  relativeDate,
  objectToUpper,
  fmtDate
}

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
// export default async (/* { app, router, ... } */) => {
//   something to do
// }
