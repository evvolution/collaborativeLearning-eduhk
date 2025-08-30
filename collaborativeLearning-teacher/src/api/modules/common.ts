import axios from 'axios'

/**
 * 上传文件到oss
 * @param params 
 * @returns  
 */
export const uploadFileCom = (param: any) => {
  return axios.post('/teacher/upload/notoken', param)
}

/**
 * 更新Survey
 * @param params 
 * @returns  
 */
export const updateSurvey = (name: any) => {
  return axios.post(`/teacher/updateSurvey?name=${name}`)
}

/**
 * 获取Survey
 * @param params 
 * @returns  
 */
export const getSurvey = () => {
  return axios.post('/teacher/getSurvey')
}