import "server-only";
import axios from "axios";

export const apiPublic = axios.create({
  baseURL: process.env.NEXT_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
