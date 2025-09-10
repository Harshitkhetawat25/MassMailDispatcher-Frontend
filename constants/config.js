const serverUrl = import.meta.env.VITE_SERVER_URL;

// Remove trailing slash if present and handle undefined/empty values
export const API_URL = serverUrl
  ? serverUrl.replace(/\/$/, "")
  : "http://localhost:8000";
