import { backendURL } from "./Constant"

export const api = async (url: string, options: RequestInit = {}) => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`, // Include access token in headers
    };
  
    try {
      const response = await fetch(url, { ...options, headers });
  
      if (response.status === 401) {
        // If access token is expired, refresh it
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          // Retry the original request with the new access token
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          return handleResponse(retryResponse);
        }
      }
  
      return handleResponse(response);
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  
  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API Error");
    }
    return await response.json();
  };
  
  const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.error("No refresh token available.");
      return null;
    }
  
    try {
      const response = await fetch(backendURL + "/api/users/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
  
      if (!response.ok) {
        console.error("Failed to refresh access token.");
        return null;
      }
  
      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken); // Update access token
      return data.accessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return null;
    }
  };
  