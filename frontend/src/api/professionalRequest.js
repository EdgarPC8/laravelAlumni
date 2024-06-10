import axios, { jwt } from "./axios.js";

export const getProfessionalsById = async (data) =>
  await axios.get(`/professionals/getProfessionalsById/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });

export const getAllProfessionals = async () =>
  await axios.get("/professionals/getAllProfessionals", {
    headers: {
      Authorization: jwt(),
    },
  });

export const addProfessional = async (data) =>
  await axios.post("/professionals/addProfessionals", data, {
    headers: {
      Authorization: jwt(),
    },
  });

export const editProfessional = async (id, data) =>
  await axios.put(`/professionals/editProfessionals/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });

export const deleteProfessional = async (data) =>
  await axios.delete(`/professionals/deleteProfessionals/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });
