import axios, { jwt } from "./axios.js";

// const jwt = `Bearer ${window.localStorage.getItem("jwt")}`;

const loginRequest = async (data) => await axios.post("/auth/login", data);

const verifyTokenRequest = async () =>
  await axios.get("/auth/verifytoken", {
    headers: {
      Authorization: jwt(),
    },
  });

const getRoles = async () => await axios.get("/users/roles");

const getOneUser = async (userId) =>
  await axios.get(`/users/${userId}`, {
    headers: {
      Authorization: jwt(),
    },
  });

const updateUserProfile = async (userId, userData) =>
  await axios.put(`/users/profile/${userId}`, userData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: jwt(),
    },
  });

const updateUserData = async (userId, userData) =>
  await axios.put(`/users/${userId}`, userData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: jwt(),
    },
  });

const changePassword = async (userId, data) =>
  await axios.put(`/users/changePassword/${userId}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });

const getUsers = async () =>
  await axios.get("/users", {
    headers: {
      Authorization: jwt(),
    },
  });

const addUser = async (data) =>
  await axios.post("/users", data, {
    headers: {
      Authorization: jwt(),
      "Content-Type": "multipart/form-data",
    },
  });

const removeUser = async (userId) =>
  await axios.delete(`/users/${userId}`, {
    headers: {
      Authorization: jwt(),
    },
  });

export {
  loginRequest,
  verifyTokenRequest,
  changePassword,
  getRoles,
  getOneUser,
  updateUserData,
  updateUserProfile,
  getUsers,
  addUser,
  removeUser,
};
