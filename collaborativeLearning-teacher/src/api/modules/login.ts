import axios from 'axios'

/**
 * 获取验证码-同学生
 * @returns captcha
 * @returns uuid
 */
export const getCaptcha = () => {
  return axios.post('/student/generateValidateCode')
}

/**
 * 老师登录
 * @param username 
 * @param password 
 * @param uuid 
 * @param code 
 * @returns 
 */
export const loginSys = (username: string, password: string, uuid: string, code: string) => {
  return axios.post(`/teacher/login?username=${username}&password=${password}&uuid=${uuid}&code=${code}`)
}

/**
 * 老师登出
 * @returns 
 */
export const logoutSys = () => {
  return axios.get('/teacher/logout')
}

/**
 * 老师获取用户信息
 * @returns 
 */
export const getStuInfo = () => {
  return axios.get('/teacher/getInfo')
}
