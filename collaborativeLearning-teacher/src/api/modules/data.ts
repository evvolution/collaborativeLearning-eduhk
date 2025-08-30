import axios from "axios"

/** 
 * 查看学生-汇总
 * @param {string} groupNum groupNum
  * @returns
 */
export const info = () => {
  return axios.get(`/teacher/chart/info`);
}

/** 
 * emoji
  * @returns
 */
export const emoji = () => {
  return axios.get(`/teacher/chart/emoji`);
}

/** 
 * 查看学生-个人行为统计
 * @param {string} groupNum groupNum
  * @returns
 */
export const personal = (groupNum: any) => {
  return axios.get(`/teacher/chart/personal?groupNum=${groupNum}`);
}


export const getPast30DaysChat = (groupNum: any) => {
  return axios.get(`/teacher/chart/post?groupNum=${groupNum}`);
}

export const getLinks = (groupNum: any) => {
  return axios.get(`/teacher/chart/links?groupNum=${groupNum}`);
}

export const wordsInGroup = (groupNum: any, caseId: any) => {
  return axios.get(`/teacher/chart/wordsInGroup?caseId=${caseId}&groupNum=${groupNum}`);
}
