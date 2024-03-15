import { useEffect } from 'react';
import axios from 'axios';

const useTokenRefresh = () => {
  const refreshToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (!storedRefreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await axios.post("http://localhost:5000/api/users/refresh-token", {
        refreshToken: storedRefreshToken,
      });

      const { accessToken, newRefreshToken } = response.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
    } catch (error) {
      console.error("Error refreshing access token:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh the token every, e.g., 15 minutes
      refreshToken();
    }, 1 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return refreshToken;
};

export default useTokenRefresh;