import { useState } from "react";

import {
  signInWithEmailAndPassword
} from "firebase/auth";

import { auth } from "../firebase";

import { useNavigate } from "react-router-dom";

const demoEmail = "demo@lovelleclinic.com";

const demoPassword = "LovelleDemo123!";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  function fillDemoLogin() {

    setEmail(demoEmail);
    setPassword(demoPassword);

  }

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

      <div className="bg-white w-full max-w-md rounded-[32px] p-8 sm:p-10 shadow-sm">

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
            disabled={loading}
            className="
              w-full
              bg-black
              text-white
              rounded-2xl
              p-4
              mt-4
              disabled:opacity-50
              disabled:pointer-events-none
            "
          >

            {loading ? "Signing In..." : "Sign In"}

          </button>

        </div>

        <div
          className="
            mt-8
            rounded-[24px]
            border
            border-black/[0.05]
            bg-[#fafaf8]
            p-5
          "
        >

          <p className="text-sm font-semibold mb-2">
            Portfolio Demo
          </p>

          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            Use the demo account to explore clients,
            appointments, notes, and treatment history.
          </p>

          <div className="space-y-2 text-sm text-gray-700">

            <p>
              Email: {demoEmail}
            </p>

            <p>
              Password: {demoPassword}
            </p>

          </div>

          <button
            type="button"
            onClick={fillDemoLogin}
            className="
              w-full
              mt-5
              rounded-2xl
              border
              border-black/[0.08]
              bg-white
              p-3
              text-sm
              font-medium
              hover:bg-black
              hover:text-white
            "
          >
            Use Demo Login
          </button>

        </div>

      </div>

    </div>

  );

}
