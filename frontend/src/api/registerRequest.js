import axios, { jwt } from "./axios.js";

// const jwt = `Bearer ${window.localStorage.getItem("jwt")}`;



export const registerUser = async (data) =>
  await axios.post("/register", data, {});

