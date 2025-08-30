import axios from 'axios'

/**
 * 获取通知
 * @param current 
 * @param size 
 * @returns list 
 */
export const getNotices = (current: number, size: number) => {
  return axios.get('/student/getNoticeList', { params: { current, size }})
}

/**
 * 已读通知
 * @param id 
 * @returns 
 */
export const readNotice = (id: number) => {
  return axios.post(`/student/readNotice?id=${id}`)
}

/**
 * 已读全部通知 
 * @returns 
 */
export const readAllNotice = () => {
  return axios.post('/student/readAllNotice')
}

/**
 * 获取系统通知
 * @param current 
 * @param size 
 * @returns list 
 */
export const getSysNotices = (current: number, size: number) => {
  return axios.get('/student/getSysMsgList', { params: { current, size }})
}

/**
 * 已读系统通知
 * @param id 
 * @returns 
 */
export const readSysNotice = (id: number) => {
  return axios.post(`/student/readSysMsg?id=${id}`)
}

/**
 * 已读全部系统通知 
 * @returns 
 */
export const readAllSysNotice = () => {
  return axios.post('/student/readAllSysMsg')
}