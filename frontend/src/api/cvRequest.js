import axios, { jwt } from "./axios.js";
export const getAllProfessionalExperience = async () =>
  await axios.get("/cv/getAllProfessionalExperience", {
    headers: {
      Authorization: jwt(),
    },
  });


export const addProfessionalExperience = async (data) =>
  await axios.post("/cv/addProfessionalExperience", data, {
    headers: {
      Authorization: jwt(),
    },
  });
export const editProfessionalExperience = async (id, data) =>
  await axios.put(`/cv/editProfessionalExperience/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });
export const deleteProfessionalExperience = async (data) =>
  await axios.delete(`/cv/deleteProfessionalExperience/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getProfessionalExperienceById = async (data) =>
  await axios.get(`/cv/getProfessionalExperienceById/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });

  export const getAllLanguages = async () =>
  await axios.get("/cv/getAllLanguages", {
    headers: {
      Authorization: jwt(),
    },
  });
export const addLanguages = async (data) =>
  await axios.post("/cv/addLanguages", data, {
    headers: {
      Authorization: jwt(),
    },
  });
export const editLanguages = async (id, data) =>
  await axios.put(`/cv/editLanguages/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getLanguagesById = async (data) =>
  await axios.get(`/cv/getLanguagesById/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const deleteLanguages = async (data) =>
  await axios.delete(`/cv/deleteLanguages/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });

  export const getAllAcademicProfessionalMerits = async () =>
  await axios.get("/cv/getAllAcademicProfessionalMerits", {
    headers: {
      Authorization: jwt(),
    },
  });
export const addAcademicProfessionalMerits = async (data) =>
  await axios.post("/cv/addAcademicProfessionalMerits", data, {
    headers: {
      Authorization: jwt(),
    },
  });
export const editAcademicProfessionalMerits = async (id, data) =>
  await axios.put(`/cv/editAcademicProfessionalMerits/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getAcademicProfessionalMeritsById = async (data) =>
  await axios.get(`/cv/getAcademicProfessionalMeritsById/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const deleteAcademicProfessionalMerits = async (data) =>
  await axios.delete(`/cv/deleteAcademicProfessionalMerits/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });

export const getAllAcademicTraining = async () =>
  await axios.get("/cv/getAllAcademicTraining", {
    headers: {
      Authorization: jwt(),
    },
  });
export const addAcademicTraining = async (data) =>
  await axios.post("/cv/addAcademicTraining", data, {
    headers: {
      Authorization: jwt(),
    },
  });
export const editAcademicTraining = async (id, data) =>
  await axios.put(`/cv/editAcademicTraining/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getAcademicTrainingById = async (data) =>
  await axios.get(`/cv/getAcademicTrainingById/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const deleteAcademicTraining = async (data) =>
  await axios.delete(`/cv/deleteAcademicTraining/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getAllTeachingExperience = async () =>
  await axios.get("/cv/getAllTeachingExperience", {
    headers: {
      Authorization: jwt(),
    },
  });
export const addTeachingExperience = async (data) =>
  await axios.post("/cv/addTeachingExperience", data, {
    headers: {
      Authorization: jwt(),
    },
  });
export const editTeachingExperience = async (id, data) =>
  await axios.put(`/cv/editTeachingExperience/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getTeachingExperienceById = async (data) =>
  await axios.get(`/cv/getTeachingExperienceById/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const deleteTeachingExperience = async (data) =>
  await axios.delete(`/cv/deleteTeachingExperience/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getAllCoursesWorkshops = async () =>
  await axios.get("/cv/getAllCoursesWorkshops", {
    headers: {
      Authorization: jwt(),
    },
  });
export const addCoursesWorkshops = async (data) =>
  await axios.post("/cv/addCoursesWorkshops", data, {
    headers: {
      Authorization: jwt(),
    },
  });
export const editCoursesWorkshops = async (id, data) =>
  await axios.put(`/cv/editCoursesWorkshops/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getCoursesWorkshopsById = async (data) =>
  await axios.get(`/cv/getCoursesWorkshopsById/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const deleteCoursesWorkshops = async (data) =>
  await axios.delete(`/cv/deleteCoursesWorkshops/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });

export const getAllBooks = async () =>
await axios.get("/cv/getAllBooks", {
  headers: {
    Authorization: jwt(),
  },
});
export const addBooks = async (data) =>
await axios.post("/cv/addBooks", data, {
  headers: {
    Authorization: jwt(),
  },
});
export const editBooks = async (id, data) =>
await axios.put(`/cv/editBooks/${id}`, data, {
  headers: {
    Authorization: jwt(),
  },
});
  export const getIntellectualProductionById = async (data) =>
  await axios.get(`/cv/getIntellectualProductionById/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });
export const deleteBooks = async (data) =>
await axios.delete(`/cv/deleteBooks/${data}`, {
  headers: {
    Authorization: jwt(),
  },
});




export const getAllIntellectualProduction = async () =>
  await axios.get("/cv/getAllIntellectualProduction", {
    headers: {
      Authorization: jwt(),
    },
  });
export const editIntellectualProduction = async (id, data) =>
  await axios.put(`/cv/editIntellectualProduction/${id}`, data, {
    headers: {
      Authorization: jwt(),
    },
  });
export const addIntellectualProduction = async (data) =>
  await axios.post("/cv/addIntellectualProduction", data, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const getBooksById = async (data) =>
  await axios.get(`/cv/getBooksById/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });
  export const deleteIntellectualProduction = async (data) =>
  await axios.delete(`/cv/deleteIntellectualProduction/${data}`, {
    headers: {
      Authorization: jwt(),
    },
  });

