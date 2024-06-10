// import axios from "./axios.js";
import axios, { jwt } from "./axios.js";


  export const getQuizByMatrizProfessional = async (data) =>
    await axios.get(`/matriz/getQuizByMatrizProfessional/${data}`,{
      headers: {
        Authorization: jwt(),
      },
    });
  export const getAllMatriz = async () =>
    await axios.get("/matriz/getAllMatriz",{
      headers: {
        Authorization: jwt(),
      },
    });
  export const getAllCareers = async () =>
    await axios.get("/matriz/getAllCareers",{
      headers: {
        Authorization: jwt(),
      },
    });
  export const getAllPeriods = async () =>
    await axios.get("/matriz/getAllPeriods",{
      headers: {
        Authorization: jwt(),
      },
    });

  export const addMatriz = async (data) =>
  await axios.post("/matriz/addMatriz", data, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const addCareer = async (data) =>
  await axios.post("/matriz/addCareer", data, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const addPeriod = async (data) =>
  await axios.post("/matriz/addPeriod", data, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const addMatrizQuiz = async (data) =>
  await axios.post("/matriz/addMatrizQuiz", data, {
    headers: {
      Authorization: jwt(),
    },
  });

  export const getMatrizFilter = async (data) =>
  await axios.post("/matriz/getMatrizFilter", data, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getMatrizQuizFilter = async (data) =>
  await axios.get(`/matriz/getMatrizQuizFilter/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const removeMatriz = async (matrizId) =>
  await axios.delete(`/matriz/${matrizId}`, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const deleteMatrizQuiz = async (matrizId, quizId) =>
  await axios.delete(`/matriz/${matrizId}/${quizId}`, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const completedQuiz = async (data) =>
  await axios.put(`/matriz/completedQuiz`,data, {
    headers: {
      Authorization: jwt(),
    },
  });
  // export const completedQuiz = async (matrizId, quizId) =>
  // await axios.put(`/matriz/completedQuiz/${matrizId}/${quizId}`, {
  //   headers: {
  //     Authorization: jwt(),
  //   },
  // });

export const editCareer = async (id, data) =>
await axios.put(`/matriz/editCareer/${id}`, data, {
  headers: {
    Authorization: jwt(),
  },
});
export const editPeriod = async (id, data) =>
await axios.put(`/matriz/editPeriod/${id}`, data, {
  headers: {
    Authorization: jwt(),
  },
});
