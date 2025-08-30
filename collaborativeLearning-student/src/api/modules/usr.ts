import axios from 'axios'

/**
 * 更新用户信息
 * @param params 
 * @returns  
 */
export const updateUsrInfo = (param: any) => {
  return axios.post('/student/updateInfo', param)
}