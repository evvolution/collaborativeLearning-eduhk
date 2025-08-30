import axios from "axios"

/** 
 * 老师-添加问卷
 * @param {object} params universityQuestionnaire
 * @returns
 */
export const addQuestionnaire = (params: any) => {
  return axios.post(`/teacher/addQuestionnaire`, params)
}

/** 
 * 老师-更新问卷
 * @param {object} params universityQuestionnaire
 * @returns
 */
export const updateQuestionnaire = (params: any) => {
  return axios.post(`/teacher/updateQuestionnaire`, params)
}

/** 
 * 老师-获取问卷列表
 * @param {string} current 
  * @param {string} size 
  * @returns
 */
export const getQuestionnaireList = (params: any) => {
  return axios.get(`/teacher/getQuestionnaireList`, { params: params})
}

/** 
 * 老师-获取问卷详情
 * @param {string} id id
  * @returns
 */
export const getQuestionnaireDetail = (id: any) => {
  return axios.get(`/teacher/getQuestionnaireDetail?id=${id}`)
}

/** 
 * 老师-获取问卷结果
 * @param {string} questionnaireId 
  * @returns
 */
export const getQuestionnaireAnswer = (questionnaireId: any) => {
  return axios.get(`/teacher/getQuestionnaireAnswer?questionnaireId=${questionnaireId}`)
}