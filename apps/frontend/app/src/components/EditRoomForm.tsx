import { useFormik } from "formik";
import type { IUpdateRoom } from "../features/rooms/types/IUpdateRoom";
import * as Yup from "yup";
import { useRoomStore } from "../store/RoomStore";
import type { FC } from "react";
import { CircleX } from "lucide-react";
import Swal from "sweetalert2";
import type { Room } from "../features/rooms/types/Room.interface";

type IEditRoomFormProps = {
  onClose: VoidFunction;
  room: Room;
};

const EditRoomForm: FC<IEditRoomFormProps> = ({ onClose, room }) => {
  const { updateRoom } = useRoomStore();

  const formik = useFormik<IUpdateRoom>({
    enableReinitialize: true,
    initialValues: {
      number: room.number ?? 0,
      type: room.type ?? "single",
      price: room.price ?? 0,
      available: room.available ?? true,
    },
    validationSchema: Yup.object({
      number: Yup.number().required("Room number is required").min(1),
      type: Yup.string()
        .oneOf(["single", "double", "suite"])
        .required("Type is required"),
      price: Yup.number().required("Price is required").min(0),
      available: Yup.boolean(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await updateRoom(room.id, values);
        resetForm();
        Swal.fire({
          icon: "success",
          title: "Room updated!",
          text: "The room was updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        onClose();
      } catch (error) {
        onClose();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was a problem updating the room.",
        });
      }
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[999]">
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-md mx-auto bg-white p-4 rounded shadow flex flex-col gap-4"
      >
        <CircleX onClick={onClose} className="cursor-pointer" />
        <h3 className="text-center text-xl font-bold mb-2">Edit Room</h3>

        <div className="flex flex-col">
          <label htmlFor="number">Room Number</label>
          <input
            id="number"
            name="number"
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            onBlur={formik.handleBlur}
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
            onBlur={formik.handleBlur}
            value={formik.values.price}
            className="border border-gray-300 p-1 rounded"
          />
          {formik.touched.price && formik.errors.price ? (
            <div className="text-red-600 text-sm">{formik.errors.price}</div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="available"
            name="available"
            type="checkbox"
            onChange={formik.handleChange}
            checked={!!formik.values.available}
            className="w-4 h-4"
          />
          <label htmlFor="available">Available</label>
        </div>

        <button
          type="submit"
          className="bg-[#134074] text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Update Room
        </button>
      </form>
    </div>
  );
};

export default EditRoomForm;
