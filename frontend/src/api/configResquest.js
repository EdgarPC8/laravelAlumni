import axios, { jwt } from "./axios.js";

export const backup = async () =>
  await axios.get("/config/backup", {
    headers: {
      Authorization: jwt(),
    },
  });

export const updateDataBaseRequest = async () =>
  await axios.put("/config/updateDatabase", null, {
    headers: {
      Authorization: jwt(),
      "Content-Type": "multipart/form-data",
    },
  });

export const getAllTutorials = async () =>
  await axios.get("/config/getAllTutorials", {
    headers: {
      Authorization: jwt(),
    },
  });

export const addTutorials = async (data) =>
  await axios.post("/config/addTutorials", data, {
    headers: {
      Authorization: jwt(),
    },
  });

export const editTutorials = async (id, data) =>
  await axios.put(`/config/editTutorials/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });
export const deleteTutorials = async (tutorialsId) =>
  await axios.delete(`/config/${tutorialsId}`, {
    headers: {
      Authorization: jwt(),
    },
  });
