import axios from 'axios'

/**
 * 获取通知
 * @param current 
 * @param size 
 * @returns list 
 */
export const getNotices = (current: number, size: number) => {
  return axios.get('/teacher/getNoticeList', { params: { current, size }})
}

/**
 * 已读通知
 * @param id 
 * @returns 
 */
export const readNotice = (id: number) => {
  return axios.post(`/teacher/readNotice?id=${id}`)
}

/**
 * 已读全部通知 
 * @returns 
 */
export const readAllNotice = () => {
  return axios.post('/teacher/readAllNotice')
}

/**
 * 获取系统通知
 * @param current 
 * @param size 
 * @returns list 
 */
export const getSysNotices = (current: number, size: number) => {
  return axios.get('/teacher/getSysMsgList', { params: { current, size }})
}

/**
 * 已读系统通知
 * @param id 
 * @returns 
 */
export const readSysNotice = (id: number) => {
  return axios.post(`/teacher/readSysMsg?id=${id}`)
}

/**
 * 已读全部系统通知 
 * @returns 
 */
export const readAllSysNotice = () => {
  return axios.post('/teacher/readAllSysMsg')
}

/**
 * 新建通知
 * @returns 
 */
export const addNotice =  (params: any) => {
  return axios.post(`/teacher/addNotice`, params)
}
