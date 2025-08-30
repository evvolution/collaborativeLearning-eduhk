import axios from "axios"

export const getPast30DaysChat = () => {
  return axios.get(`/student/chart/post`);
}

export const getLinks = () => {
  return axios.get(`/student/chart/links`);
}

export const wordsInGroup = (caseId: any) => {
  return axios.get(`/student/chart/wordsInGroup?caseId=${caseId}`);
}

export const wordsInPerson = (caseId: any) => {
  return axios.get(`/student/chart/wordsInPerson?caseId=${caseId}`);
}