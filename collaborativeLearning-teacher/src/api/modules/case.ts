import axios from 'axios'

/**
 * 获取案例
 * @param current 
 * @param size 
 * @returns list 
 */
export const getCaseList = (current: number, size: number) => {
  return axios.get('/teacher/getCaseList', { params: { current, size } })
}

/**
 * 获取案例详情
 * @param id 
 * @returns  
 */
export const getCaseDetail = (id: number) => {
  return axios.get('/teacher/getCaseDetail', { params: { id }})
}

/**
 * 创建案例
 * @param params
 * @returns 
 */
export const createNewCase = (params: any) => {
  return axios.post(`/teacher/addCase`, params)
}

/**
 * 更新案例
 * @param params
 * @returns 
 */
export const updateNewCase = (params: any) => {
  return axios.post(`/teacher/updateCase`, params)
}

/**
 * 删除案例
 * @param id 
 * @returns  
 */
export const deleteCase = (id: number) => {
  return axios.post('/teacher/deleteCase?id=' + id, {})
}


/**
 * 获取案例作业
 * @param id 
 * @returns  
 */
export const getHomeworkList = (pararm: any) => {
  return axios.get('/teacher/getHomeworkList', { params: pararm})
}