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
  return axios.get(`/student/getResourcesList`, { params: params})
}

/**
 * 添加资源
 * @param params
 * @returns 
 */
export const addResources = (params: any) => {
  return axios.post(`/student/addResources`, params)
}

/**
 * 更新资源
 * @param params
 * @returns 
 */
export const updateResources = (params: any) => {
  return axios.post(`/student/updateResources`, params)
}


/**
 * 获取小组作业
 * @param caseId
 * @param current 
 * @param size 
 * @param type
 * @returns list 
 */
export const getHomeworkList = (params: any) => {
	return axios.get(`/student/getHomeworkList`, { params: params})
}

/**
 * 添加小组作业
 * @param params
 * @returns 
 */
export const addHomework = (params: any) => {
  return axios.post(`/student/addHomework`, params)
}

/**
 * 删除资源
 * @param params
 * @returns 
 */
export const cancelResources = (params: any) => {
  return axios.post(`/student/cancelResources?resourceId=${params.resourceId}&type=${params.type}`)
}

/**
 * 删除资源-聊天
 * @param params
 * @returns 
 */
export const cancelResourcesFromChat = (params: any) => {
  return axios.post(`/student/cancelResourcesFromChat?chatId=${params.chatId}&type=${params.type}`)
}

/**
 * 物理删除！！！
 * @param params
 * @returns 
 */
export const deleteResources = (id: any) => {
  return axios.post(`/student/deleteResources?id=${id}`)
}