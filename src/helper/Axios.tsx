import axios from "axios";

const ApiAxios = axios.create({
  baseURL: "https://69f3-2405-201-37-21d9-7929-7cc7-1985-ed1b.ngrok-free.app",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "ngrok-skip-browser-warning": "true",
    "Access-Control-Allow-Origin": "*"
  }
});

export default ApiAxios;