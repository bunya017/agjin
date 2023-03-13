import { createMetaMixin } from 'quasar'
import packageInfo from '../../package.json'

function getMetaData(pageTitle) {
  const metaData = {
    title: `${pageTitle}`,
    titleTemplate: title => `${title} | ${packageInfo.productName}`
  }
  return createMetaMixin(metaData)
}

export {
  getMetaData
}