import axios, { jwt } from "./axios.js";

const getLogs = async () =>
  await axios.get("/logs", {
    headers: {
      Authorization: jwt(),
    },
  });

export { getLogs };
