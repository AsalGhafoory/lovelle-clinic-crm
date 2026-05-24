import {
  useEffect,
  useState
} from "react";

import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import {
  onAuthStateChanged
} from "firebase/auth";

import App from "../App";

import ClientProfile from "../pages/ClientProfile";

import Login from "../pages/Login";

import Clients from "../pages/Clients";

import Appointments from "../pages/Appointments";

import Settings from "../pages/Settings";

import { auth } from "../firebase";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {

        setUser(currentUser);

        setLoading(false);

      }
    );

    return () => unsubscribe();

  }, []);

  if (loading) {

    return (

      <div className="min-h-screen bg-[#f6f5f2] flex items-center justify-center">

        <p className="text-gray-500 text-lg">
          Loading Lovelle...
        </p>

      </div>

    );

  }

  return (

    <Routes>

      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/" />
            : <Login />
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute user={user}>
            <App />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clients"
        element={
          <ProtectedRoute user={user}>
            <Clients />
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <ProtectedRoute user={user}>
            <Appointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute user={user}>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/:id"
        element={
          <ProtectedRoute user={user}>
            <ClientProfile />
          </ProtectedRoute>
        }
      />

    </Routes>

  );

}
