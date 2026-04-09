import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/UserStore";

const Register: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { registerUser } = useUserStore();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      setError(null);
      setSuccess(null);
      try {
        await registerUser({ name: values.name, email: values.email, password: values.password });
        setSuccess("Account created successfully!");
        navigate("/");
      } catch (err: any) {
        if (err?.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Registration failed. Please try again.");
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
        <h4 className="text-center mb-2 text-lg font-semibold text-[#134074]">
          Register Your Account
        </h4>

        <label htmlFor="name">Name</label>
        <input
          className="border border-[#134074] p-1 rounded mb-2"
          type="text"
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-red-600 text-sm mb-1">{formik.errors.name}</div>
        ) : null}

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
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-600 text-sm mb-1">{formik.errors.email}</div>
        ) : null}

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
        {formik.touched.password && formik.errors.password ? (
          <div className="text-red-600 text-sm mb-1">{formik.errors.password}</div>
        ) : null}

        {error && <p className="text-red-600 text-sm mb-2 text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2 text-center">{success}</p>}

        <button
          type="submit"
          className="bg-[#134074] py-1 text-white rounded cursor-pointer hover:bg-[#0e2e57]"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-3">
        Already have an account?{" "}
        <a href="/login" className="text-[#134074] font-semibold hover:underline">
          Sign in here
        </a>
      </p>
    </div>
  );
};

export default Register;
