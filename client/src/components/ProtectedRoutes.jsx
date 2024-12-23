import { useRecoilValue } from "recoil";
import { userAtom } from "../store/Index";
import { useNavigate } from "react-router";

// eslint-disable-next-line react/prop-types
export const ProtectedRoute = ({ children }) => {
  const user = useRecoilValue(userAtom);
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
