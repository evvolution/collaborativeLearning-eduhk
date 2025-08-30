import axios from 'axios'

/**
 * 获取案例
 * @param current 
 * @param size 
 * @returns list 
 */
export const getCaseList = (current: number, size: number) => {
  return axios.get('/student/getCaseList', { params: { current, size } })
}

/**
 * 获取案例详情
 * @param id 
 * @returns  
 */
export const getCaseDetail = (id: number) => {
  return axios.get('/student/getCaseDetail', { params: { id }})
}


//==============================================================================================================
/**
 * 获取聊天
 * @param current 
 * @param size 
 * @returns list 
 */
// export const getChatList = (current: number, size: number, latest: boolean, startId: number, caseId: number) => {
//   return axios.get('/student/getChatList', { params: { current, size, latest, startId, caseId }})
// }

export const getChatList = ( param: any ) => {
  return axios.get('/student/getChatList', { params: param })
}


/**
 * 发送聊天
 * @returns 
 */
export const addNewChat = (params: any) => {
  return axios.post(`/student/addChat`, params)
}

/**
 * 点赞聊天
 * @returns 
 */
export const loveChat = (params: any) => {
  return axios.post(`/student/loveChat?id=${params.id}&love=${params.love}`)
}

/**
 * 获取案例作业
 * @param id 
 * @returns  
 */
export const getHomeworkList = (pararm: any) => {
  return axios.get('/student/getHomeworkList', { params: pararm})
}


/**
 * 提交案例作业
 * @param id 
 * @returns  
 */
export const addHomework = (pararm: any) => {
  return axios.post('/student/addHomework', pararm)
}