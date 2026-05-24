import { useState } from "react";

import {
  signInWithEmailAndPassword
} from "firebase/auth";

import { auth } from "../firebase";

import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin() {

    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    try {

      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/");

    } catch (error) {

      alert(error.message);

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="min-h-screen bg-[#f6f5f2] flex items-center justify-center p-6">

      <div className="bg-white w-full max-w-md rounded-[32px] p-10 shadow-sm">

        <div className="mb-10">

          <h1 className="text-5xl font-semibold tracking-tight mb-3">
            Lovelle
          </h1>

          <p className="text-gray-500">
            Luxury clinic CRM platform
          </p>

        </div>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-200 rounded-2xl p-4 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-200 rounded-2xl p-4 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white rounded-2xl p-4 mt-4"
          >

            {loading ? "Signing In..." : "Sign In"}

          </button>

        </div>

      </div>

    </div>

  );

}