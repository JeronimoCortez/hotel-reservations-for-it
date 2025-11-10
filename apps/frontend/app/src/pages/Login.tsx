import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { authService } from "../features/auth/services/AuthService";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/UserStore";

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setToken, setUser } = useUserStore();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Please enter both email and password"),
      password: Yup.string().required("Please enter both email and password"),
    }),
    onSubmit: async (values) => {
      setError(null);
      try {
        const { token, user } = await authService.login(values.email, values.password);
        localStorage.setItem("token", token);
        setToken(token);
        setUser(user);
        navigate("/");
      } catch (err: any) {
        if (err?.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Invalid credentials or server error");
        }
      }
    },
  });

  return (
    <div className="flex flex-col justify-center items-center p-4 h-[80vh]">
      <form
        onSubmit={formik.handleSubmit}
        className="flex justify-center flex-col min-w-[300px] max-w-[400px] border p-4 rounded"
      >
        <h4 className="text-center mb-2 text-lg font-semibold text-[#134074]">Login</h4>

        <label htmlFor="email">Email</label>
        <input
          className="border border-[#134074] p-1 rounded mb-2"
          type="text"
          id="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        <label htmlFor="password">Password</label>
        <input
          className="border border-[#134074] p-1 rounded mb-3"
          type="password"
          id="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        {error && <p className="text-red-600 text-sm mb-2 text-center">{error}</p>}

        <button
          type="submit"
          className="bg-[#134074] py-1 text-white rounded cursor-pointer hover:bg-[#0e2e57]"
        >
          Sign In
        </button>
      </form>

      <p className="mt-3">
        Don’t have an account?{" "}
        <a href="/register" className="text-[#134074] font-semibold hover:underline">
          Register here
        </a>
      </p>
    </div>
  );
};

export default Login;
