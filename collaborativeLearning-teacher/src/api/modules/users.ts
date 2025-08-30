import axios from "axios"

/** 
 * 查看学生-汇总
  * @returns
 */
export const getStudentList = (params: any) => {
  return axios.get(`/teacher/getStudentList`, { params: params});
}

/** 
 * 新增学生
  * @returns
 */
export const addStudent = (param: any) => {
  return axios.post(`/teacher/addStudent`, param);
}

/** 
 * 更新学生
  * @returns
 */
export const updateStudent = (param: any) => {
  return axios.post(`/teacher/updateStudent`, param);
}

/** 
 * 获取学生分组列表
  * @returns
 */
export const getGroupList = () => {
  return axios.get(`/teacher/getGroupList`);
}

/** 
 * 新增组别
  * @returns
 */
export const addGroup = (name: any) => {
  return axios.post(`/teacher/addGroup?name=${name}`);
}

/** 
 * 组别详情
  * @returns
 */
export const getGroupDetail = (id: any) => {
  return axios.get(`/teacher/getGroupDetail?id=${id}`);
}

/** 
 * 更新信息
  * @returns
 */
export const updateInfo = (param: any) => {
  return axios.post(`/teacher/updateInfo`, param);
}

/** 
 * 更新信息
  * @returns
 */
export const resetStudentPassword = (id: any) => {
  return axios.post(`/teacher/resetStudentPassword?studentId=${id}`);
}