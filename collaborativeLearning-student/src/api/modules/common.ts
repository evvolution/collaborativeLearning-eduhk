import axios from 'axios'

/**
 * 上传文件
 * @param params 
 * @returns  
 */
export const uploadFileCom = (param: any) => {
  return axios.post('/student/upload/notoken', param)
}

/**
 * 获取Survey
 * @param params 
 * @returns  
 */
export const getSurvey = () => {
  return axios.post('/student/getSurvey')
}