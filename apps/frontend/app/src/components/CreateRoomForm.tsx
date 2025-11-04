
import { useFormik } from "formik";
import * as Yup from "yup";
import type { ICreateRoom } from "../features/rooms/types/ICreateRoom";
import { useRoomStore } from "../store/RoomStore";

const CreateRoomForm = () => {
  const { createRoom } = useRoomStore();

  const formik = useFormik<ICreateRoom>({
    initialValues: {
      number: 0,
      type: "single",
      price: 0,
    },
    validationSchema: Yup.object({
      number: Yup.number().required("Room number is required").min(1),
      type: Yup.string().oneOf(["single", "double", "suite"]).required("Type is required"),
      price: Yup.number().required("Price is required").min(0),
    }),
    onSubmit: async (values, { resetForm }) => {
      await createRoom(values);
      resetForm();
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="max-w-md mx-auto bg-white p-4 rounded shadow flex flex-col gap-4"
    >
      <h3 className="text-center text-xl font-bold mb-2">Create Room</h3>

      <div className="flex flex-col">
        <label htmlFor="number">Room Number</label>
        <input
          id="number"
          name="number"
          type="number"
          onChange={formik.handleChange}
          value={formik.values.number}
          className="border border-gray-300 p-1 rounded"
        />
        {formik.touched.number && formik.errors.number ? (
          <div className="text-red-600 text-sm">{formik.errors.number}</div>
        ) : null}
      </div>

      <div className="flex flex-col">
        <label htmlFor="type">Room Type</label>
        <select
          id="type"
          name="type"
          onChange={formik.handleChange}
          value={formik.values.type}
          className="border border-gray-300 p-1 rounded"
        >
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="suite">Suite</option>
        </select>
        {formik.touched.type && formik.errors.type ? (
          <div className="text-red-600 text-sm">{formik.errors.type}</div>
        ) : null}
      </div>

      <div className="flex flex-col">
        <label htmlFor="price">Price</label>
        <input
          id="price"
          name="price"
          type="number"
          onChange={formik.handleChange}
          value={formik.values.price}
          className="border border-gray-300 p-1 rounded"
        />
        {formik.touched.price && formik.errors.price ? (
          <div className="text-red-600 text-sm">{formik.errors.price}</div>
        ) : null}
      </div>


      <button
        type="submit"
        className="bg-[#134074] text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Create Room
      </button>
    </form>
  );
};

export default CreateRoomForm;
