// import axios from "./axios.js";
import axios, { jwt } from "./axios.js";



export const getProfesionalsCareers = async () =>
  await axios.get("/charts/getProfesionalsCareers",{
    headers: {
      Authorization: jwt(),
    },
  });
export const getAllResponses = async (data) =>
  await axios.get(`/charts/getAllResponses/${data}`,{
    headers: {
      Authorization: jwt(),
    },
  });
