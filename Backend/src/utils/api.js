const API_BASE = "http://localhost:5000";

export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  return fetch(API_BASE + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });
};