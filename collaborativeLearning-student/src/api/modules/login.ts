import axios from 'axios'

/**
 * 获取验证码
 * @returns captcha
 * @returns uuid
 */
export const getCaptcha = () => {
  return axios.post('/student/generateValidateCode')
}

/**
 * 登录
 */
export const loginSys = (username: string, password: string, uuid: string, code: string) => {
  return axios.post(`/student/login?username=${username}&password=${password}&uuid=${uuid}&code=${code}`)
}

/**
 * 登出
 */
export const logoutSys = () => {
  return axios.get('/student/logout')
}

/**
 * 获取用户信息
 * @returns 
 */
export const getStuInfo = () => {
  return axios.get('/student/getInfo')
}
