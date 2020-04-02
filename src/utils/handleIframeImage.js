import html2canvas from 'html2canvas'
import axios from 'axios'
import Canvg from 'canvg'
import { get } from './request'

function getIframeImage (dom, callback) {
  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 333
  const content = canvas.getContext("2d")
  // content.translate(-4, 0) // 画布偏移量
  content.fillStyle = getComputedStyle(dom, null).backgroundColor
  content.fillRect(0, 0, canvas.width, canvas.height)
  // 处理svg,将svg转换成canvas
  const svgList = dom.getElementsByTagName('svg')
  // console.log(Array.from(svgList))
  Array.from(svgList).forEach((index, node) => {
    const parentNode = node.parentNode
    const svg = node.outerHTML.trim()
    Canvg(canvas, svg)
    if (node.style.position) {
      canvas.style.position += node.style.position
      canvas.style.left += node.style.left
      canvas.style.top += node.style.top
    }
    nodesToRecover.push({
      parent: parentNode,
      child: node
    })
    parentNode.removeChild(node)
    nodesToRemove.push({
      parent: parentNode,
      child: canvas
    })
    parentNode.appendChild(canvas)
  })


  html2canvas(dom, {
    backgroundColor: null,
    useCORS: true,
    allowTaint: true,
    scale: 0.5,
    canvas,
    logging: true,
    allowTaint: false
  }).then(canvas => {
    callback(canvas.toDataURL("image/jpg"))
  })
}

async function getToken () {
  let token = ''
  await get('/jsEncoder/project/token', {}).then(res => {
    token = res
  })
  return token
}

async function sendImageToQiNiuYun (dataURL, token) {
  const file = dataURLtoFile(dataURL)
  const param = new FormData()
  let imageUrl = ''
  param.append("file", file)
  param.append("token", token)
  await axios({
    method: 'post',
    url: '/qiNiu',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'UpToken ' + token
    }
  }).then(res => {
    imageUrl = res.data.key
  })
  return imageUrl
}

async function deleteOldPoster (key) {
  let result = ''
  await get('/jsEncoder/project/delFile', {
    params: { key }
  }).then(res => {
    result = res
  })
  return result
}

function dataURLtoFile (dataURL, filename = 'file') {
  let arr = dataURL.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let suffix = mime.split('/')[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  })
}

export default {
  getIframeImage,
  getToken,
  sendImageToQiNiuYun,
  deleteOldPoster
}