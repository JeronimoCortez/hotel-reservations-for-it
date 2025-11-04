import { useState } from "react";
import { authService } from "../features/auth/services/AuthService";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authService.register(name, email, password);
      alert(res.message || "Account created successfully!");

      // Después de registrarse, hacemos login automáticamente:
      const { token } = await authService.login(email, password);
      localStorage.setItem("token", token);

      window.location.href = "/admin"; // redirección a donde quieras
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center p-4 h-[80vh]">
        <form
          onSubmit={handleRegister}
          className="flex justify-center flex-col min-w-[300px] max-w-[400px] border-[1px] p-4 rounded"
        >
          <h4 className="text-center">Register Your Account</h4>
          <label htmlFor="name">Name</label>
          <input
            className="border border-[#134074] p-1"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            Sign Up
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <a href="/login" className="text-[#134074] mt-2">
            Sign in here
          </a>
        </p>
      </div>
    </>
  );
};

export default Register;
