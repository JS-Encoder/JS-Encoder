/* eslint-disable */
import axios from 'axios'
import qs from 'qs'

axios.defaults.withCredentials = true

function post(url = '', params = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(params))
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
  })
}

function get(url = '', config = {}) {
  return new Promise((resolve, reject) => {
    axios.get(
      url,
      config
    ).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

export {
  post,
  get
}