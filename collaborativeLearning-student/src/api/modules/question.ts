import axios from "axios"
/** 
 * 学生-获取问卷列表
 * @param {string} current 
  * @param {string} size 
  * @returns
 */
export const getQuestionnaireList = (caseId: any) => {
  return axios.get(`/student/getQuestionnaireList?current=1&size=100&caseId=${caseId}`)
}

/** 
 * 学生-获取问卷详情
 * @param {string} id id
  * @returns
 */
export const getQuestionnaireDetail = (id: any) => {
  return axios.get(`/student/getQuestionnaireDetail?id=${id}`)
}

/** 
 * 学生-填写问卷
 * @param {string} id id
  * @returns
 */
export const answerQuestionnaire = (param: any) => {
  return axios.post(`/student/answerQuestionnaire`, param)
}