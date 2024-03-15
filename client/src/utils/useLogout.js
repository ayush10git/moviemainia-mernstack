import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

  const logout = async () => {
    // setLoading(true);
    // setError(null);

    try {
        await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
        );
        localStorage.removeItem("accessToken");
        
    //   setSuccess(true);
    } catch (error) {
        console.log(error);
    } finally {
    //   setLoading(false);
    }
  };
  return { logout };
};

export default useLogout;
