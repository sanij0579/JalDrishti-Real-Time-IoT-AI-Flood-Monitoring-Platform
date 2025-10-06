import axios from "axios";

const api = axios.create({
  baseURL: "http://10.13.230.81:8000/api", // apne backend ka IP
   headers: { "Content-Type": "multipart/form-data" },
});

export default api;