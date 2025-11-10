import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { authService } from "../features/auth/services/AuthService";
import { CircleX } from "lucide-react";

type ICreateUserProps = {
    onClose: VoidFunction;
}

const CreateUser: React.FC<ICreateUserProps> = ({onClose}) => {

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
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await authService.register(values.name, values.email, values.password);
        await Swal.fire({
          icon: "success",
          title: "User created",
          text: res?.message || "User created successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        resetForm();
        onClose();
      } catch (err: any) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: err?.response?.data?.message || err?.message || "User creation failed. Please try again.",
        });
      }
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[999]">
      <form onSubmit={formik.handleSubmit} className="w-[25vw] mx-auto bg-white p-4 rounded shadow flex flex-col gap-4">
        <CircleX onClick={onClose} className="cursor-pointer" />
        <h4 className="text-center mb-2 text-lg font-semibold text-[#134074]">
          Create New User
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

        <button
          type="submit"
          className="bg-[#134074] py-1 text-white rounded cursor-pointer hover:bg-[#0e2e57]"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
