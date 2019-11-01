/* eslint-disable */
import axios from 'axios'
axios.defaults.withCredentials = true

function post(url = '', params = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, {
      params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}

function get(url = '', params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params
    }).then(res => {
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