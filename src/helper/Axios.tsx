import axios from "axios";

const ApiAxios = axios.create({
  // baseURL: "https://8d5d-2405-201-37-21d9-ddb1-f334-79cb-63ef.ngrok-free.app",
  baseURL: "https://ai.neovis.co.in/assistant/",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "ngrok-skip-browser-warning": "true",
    "Access-Control-Allow-Origin": "*"
  }
});

export default ApiAxios;