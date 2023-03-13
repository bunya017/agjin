import { LocalStorage } from 'quasar'
import jwt_decode from 'jwt-decode'

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

export {
  hasPermission
}