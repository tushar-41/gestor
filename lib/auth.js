"use client";

const API_BASE = "https://devpathtracker-prod.up.railway.app";

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  window.location.href = "/";
};

export const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        return null;
      }

      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      const errorMessage =
        errorData.message || errorData.error || `API Error: ${response.status}`;
      throw new Error(errorMessage);
    }

    // Try to parse as JSON first, fall back to plain text
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    } else {
      // Handle plain text responses
      return response.text();
    }
  } catch (error) {
    console.error(`API call error for ${endpoint}:`, error);
    throw error;
  }
};
