import { post, get } from './request'
/**
 * 根据_id获取用户信息
 * @param String _id 
 * @return Object userInfo
 */
async function getUserInfo (_id) {
  let userInfo = {}
  await get('/jsEncoder/users/getUserInfo', {
    params: { _id }
  }).then(res => {
    userInfo = res
  }).catch(err=>{
    console.log(err)
  })
  return userInfo
}
/**
 * 根据userId获取用户所有项目信息
 * @param String userId 
 * @return Array projectInfo
 */
async function getProjectInfo (userId, status) {
  let projectInfo = []
  await get('/jsEncoder/project/projectInfo', {
    params: { userId, status }
  }).then(res => {
    projectInfo = res
  })
  return projectInfo
}
/**
 * 根据查询条件获取项目列表
 * @param Object searchItem 
 * @return Array projectInfo
 */
async function getProjectBySearch (searchItem) {
  let projectInfo = []
  await get('/jsEncoder/project/search', {
    params: searchItem
  }).then(res => {
    projectInfo = res
  })
  return projectInfo
}
/**
 * 将项目详情储存到数据库
 * @param Object projectInfo 
 */
async function updateProjectDetail (projectInfo) {
  let result = {}
  await post('/jsEncoder/project/updatePoster', projectInfo, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).then(res => {
    result = res
  })
  return result
}
async function createProjectDetail (projectDetail) {
  let result = {}
  await post('/jsEncoder/project/saveDetail', projectDetail, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).then(res => {
    result = res
  })
  return result
}
/**
 * 创建项目
 * @param Object projectInfo 
 */
async function createProject (projectInfo) {
  let result = ''
  await post('/jsEncoder/project/save', projectInfo, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).then(res => {
    result = res
  })
  return result
}
/**
 * 更新项目名
 * @param String id 项目id
 * @param String name 项目名
 */
async function updateProjectName (id, name) {
  let result = ''
  await post('/jsEncoder/project/updateName', { id, name }, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).then(res => {
    result = res
  })
  return result
}
/**
 * 获取所有项目标签
 * @param String userId 用户id
 */
async function getAllTags (userId) {
  let result = ''
  await get('/jsEncoder/project/allTags', {
    params: { userId }
  }).then(res => {
    result = res
  })
  return result
}
/**
 * 更新项目标签
 * @param String projectId 
 */
async function updateTags (projectId, tags) {
  let result = ''
  await get('/jsEncoder/project/updateTags', {
    params: { id: projectId, tags: JSON.stringify(tags) }
  }).then(res => {
    result = res
  })
  return result
}
/**
 * 将项目移入回收站
 * @param String userId 用户id
 * @param String id 项目id
 */
async function removeProject (userId, id) {
  let result = ''
  await get('/jsEncoder/project/remove', {
    params: { userId, id }
  }).then(res => {
    result = res
  })
  return result
}
/**
 * 恢复项目状态为未回收
 * @param String id 
 */
async function recoverProject (id) {
  let result = ''
  await get('/jsEncoder/project/recover', {
    params: { id }
  }).then(res => {
    result = res
  })
  return result
}
/**
 * 根据项目id获取项目详情
 * @param String id 
 */
async function getProjectDetail (id) {
  let result = ''
  await get('/jsEncoder/project/getDetail', {
    params: { id }
  }).then(res => {
    result = res
  })
  return result
}
/**
 * 获取用户项目数量
 * @param String userId 
 */
async function getProjectsCount (userId, status) {
  let result = ''
  await get('/jsEncoder/project/getProjectsCount', {
    params: { userId, status }
  }).then(count => {
    result = count
  })
  return result
}

export default {
  getUserInfo,
  getProjectInfo,
  updateProjectDetail,
  getProjectBySearch,
  createProject,
  createProjectDetail,
  updateProjectName,
  getAllTags,
  removeProject,
  getProjectDetail,
  updateTags,
  recoverProject,
  getProjectsCount
}