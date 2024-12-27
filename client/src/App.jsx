import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Meeting from "./pages/Meeting";
import { LoginForm } from "./components/auth/LoginForm";
import { AuthContext } from "./context/AuthContext";
import { useContext, useEffect } from "react";
import UserAuth from "./auth/UserAuth";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userAtom } from "./store/Index";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : children;
};

function App() {
  const { setUser } = useContext(AuthContext);
  const setUserRecoil = useSetRecoilState(userAtom);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(backendURL + "/api/users/me", {
          withCredentials: true,
        });
        setUser(response.data);
        setUserRecoil(response.data);
      } catch (error) {
        console.log(error);
        setUser(null);
        setUserRecoil(null);
      }
    };

    fetchUser();
  }, []);
  return (
    <UserAuth>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/"
          element={
            <UserAuth>
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            </UserAuth>
          }
        />
        <Route
          path="/meeting/:id"
          element={
            <PrivateRoute>
              <Meeting />
            </PrivateRoute>
          }
        />
      </Routes>
    </UserAuth>
  );
}

export default App;
