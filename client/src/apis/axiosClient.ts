import axios from "axios";

const LOCAL_API_ORIGIN = "http://localhost:3000";
const PROD_API_ORIGIN = "/api";
const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  (import.meta.env.PROD ? PROD_API_ORIGIN : LOCAL_API_ORIGIN);

// Configure axios once so existing API code can keep using localhost URLs.
axios.interceptors.request.use((config) => {
  if (typeof config.url === "string" && config.url.startsWith(LOCAL_API_ORIGIN)) {
    config.url = config.url.replace(LOCAL_API_ORIGIN, "");
  }

  if (!config.baseURL) {
    config.baseURL = API_BASE_URL;
  }

  return config;
});

export { API_BASE_URL };
