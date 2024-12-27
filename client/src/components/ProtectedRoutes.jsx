import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// eslint-disable-next-line react/prop-types
export const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  return user ? (
    children
  ) : (
    <>
      <p>You need to login in again.</p>
      <button onClick={() => navigate("/login")}>Login</button>
    </>
  );
};
