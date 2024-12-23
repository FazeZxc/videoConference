import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import Meeting from './pages/Meeting';
import { LoginForm } from './components/auth/LoginForm';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : children ;
};

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />}/>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
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
    </AuthProvider>
  );
}

export default App;