/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";

const AuthContext = createContext(null);
const backendURL = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(backendURL + "/api/users/me", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.log(error);
        setUser(null);
        navigate("/login")
      } finally {
        setLoading(false);
        navigate("/")
      }
    };
  
    fetchUser();
  }, []);
  
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        backendURL + "/api/users/login",
        { email, password },
        { withCredentials: true }
      );

      const userData = response.data;
      setUser(userData);
      navigate("/")
    } catch (error) {
      console.error("Login error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(
        backendURL + "/api/users/register",
        { username, email, password },
        { withCredentials: true }
      );

      const userData = response.data;
      setUser(userData);
    } catch (error) {
      console.error("Registration error:", error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post(backendURL + "/api/users/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login"); 
    } catch (error) {
      console.error("Logout error:", error.response?.data?.message || error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout , loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
