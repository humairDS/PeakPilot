import { useState } from "react";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const login = async () => {
  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    console.log("LOGIN RESPONSE:", res.data);

    localStorage.setItem("token", res.data.data.access_token);

    window.location.href = "/";
  } catch (err) {
    console.error(err);
    alert("Login Failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card p-8 w-[400px]">
        <h1 className="text-3xl font-bold mb-6">Login</h1>

        <input
          className="input mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="input mb-6"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn-primary w-full"
          onClick={login}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;