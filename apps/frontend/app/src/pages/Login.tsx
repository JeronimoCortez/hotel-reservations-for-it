import { useState } from "react";
import { authService } from "../features/auth/services/AuthService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await authService.login(email, password);
      localStorage.setItem("token", token);
      alert("Login successful!");
      window.location.href = "/"; 
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 h-[80vh]">
      <form
        onSubmit={handleLogin}
        className="flex justify-center flex-col min-w-[300px] max-w-[400px]  border-[1px] p-4 rounded"
      >
        <h4 className="text-center">Login</h4>
        <label htmlFor="email">Email</label>
        <input
          className="border border-[#134074] p-1"
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          className="border border-[#134074] p-1"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-[#134074] py-1 mt-4 text-[#fff] cursor-pointer">
          Sign In
        </button>
      </form>
      <p>
        Don’t have an account?{" "}
        <a href="" className="text-[#134074] mt-2">
          Register here
        </a>
      </p>
    </div>
  );
};

export default Login;
