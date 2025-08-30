import axios from 'axios'

/**
 * 获取不同类型资源
 * @param caseId
 * @param current 
 * @param size 
 * @param type
 * @returns list 
 */
export const getGroupResByCaseId = (params: any) => {
  return axios.get(`/teacher/getResourcesList`, { params: params})
}

/**
 * 添加资源
 * @param params
 * @returns 
 */
export const addResources = (params: any) => {
  return axios.post(`/teacher/addResources`, params)
}

/**
 * 更新资源
 * @param params
 * @returns 
 */
export const updateResources = (params: any) => {
  return axios.post(`/teacher/updateResources`, params)
}

/**
 * 删除资源
 * @param params
 * @returns 
 */
export const cancelResources = (params: any) => {
  return axios.post(`/teacher/cancelResources?resourceId=${params.resourceId}&type=${params.type}`)
}

/**
 * 物理删除！！！
 * @param params
 * @returns 
 */
export const deleteResources = (id: any) => {
  return axios.post(`/teacher/deleteResources?id=${id}`)
}