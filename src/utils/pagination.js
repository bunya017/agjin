function generateQueryString(filterObj, routeQuery) {
  let queryString = ''
  const KEYS = Object.keys(filterObj)

  for (let i = 0; i < KEYS.length; i++) {
    if (!!filterObj[KEYS[i]] || !!routeQuery[KEYS[i]]) {
      if (!!filterObj[KEYS[i]] && typeof(filterObj[KEYS[i]]) === 'object') {
        queryString += `&${KEYS[i]}=${
          !!filterObj[KEYS[i]]
            ? filterObj[KEYS[i]].value
            : !!routeQuery[KEYS[i]]
              ? routeQuery[KEYS[i]]
              : ''
        }`
      } else {
        queryString += `&${KEYS[i]}=${
          !!filterObj[KEYS[i]]
            ? filterObj[KEYS[i]]
            : !!routeQuery[KEYS[i]]
              ? routeQuery[KEYS[i]]
              : ''
        }`
      }
    }
  }

  return queryString
}

function generateQueryObj(filterObj) {
  let queryObj = {}
  const KEYS = Object.keys(filterObj)

  for (let i = 0; i < KEYS.length; i++) {
    if (!!filterObj[KEYS[i]]) {
      if (typeof(filterObj[KEYS[i]]) === 'object') {
        queryObj[KEYS[i]] = filterObj[KEYS[i]].value
      } else {
        queryObj[KEYS[i]] = filterObj[KEYS[i]]
      }
    }
  }

  return queryObj
}

export {
  generateQueryString,
  generateQueryObj
}