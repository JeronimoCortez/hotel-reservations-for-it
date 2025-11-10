import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { CircleX } from "lucide-react";
import { useRoomStore } from "../store/RoomStore";
import { useUserStore } from "../store/UserStore";
import { useReservationStore } from "../store/ReservationStore";

type User = { id: string; name: string };
type Room = { id: string; number: number };

type ICreateReservationFormProps = {
  onClose: VoidFunction;
};

const CreateReservationForm: React.FC<ICreateReservationFormProps> = ({ onClose }) => {
  const { fetchUsers, users } = useUserStore();
  const { fetchRooms, rooms } = useRoomStore();
  const { createReservation } = useReservationStore();

  useEffect(() => {
    fetchUsers();
    fetchRooms();
  }, []);

  const formik = useFormik({
    initialValues: {
      userId: "",
      roomId: "",
      startDate: "",
      endDate: "",
    },
    validationSchema: Yup.object({
      userId: Yup.string().required("User is required"),
      roomId: Yup.string().required("Room is required"),
      startDate: Yup.string().required("Start date is required"),
      endDate: Yup.string()
        .required("End date is required")
        .test("end-after-start", "End date must be the same or after start date", function (value) {
          const start = this.parent.startDate;
          if (!value || !start) return false;
          return new Date(value).getTime() >= new Date(start).getTime();
        }),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const body = {
          userId: values.userId,
          roomId: values.roomId,
          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString(),
        };

        Swal.fire({
          title: "Creating reservation...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        await createReservation(body);

        Swal.close();
        Swal.fire({
          icon: "success",
          title: "Reservation created",
          showConfirmButton: false,
          timer: 1500,
        });

        resetForm();
        onClose();
      } catch (err: any) {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err?.message || "Could not create reservation",
        });
        onClose();
      }
    },
  });

  const todayMin = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  })();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[999]">
      <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto bg-white p-4 rounded shadow flex flex-col gap-4">
        <CircleX onClick={onClose} className="cursor-pointer" />
        <h3 className="text-center text-xl font-bold mb-2">Create Reservation</h3>

        <div className="flex flex-col">
          <label htmlFor="userId">User</label>
          <select
            id="userId"
            name="userId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.userId}
            className="border border-gray-300 p-1 rounded"
          >
            <option value="">Select user</option>
            {users.map((u: User) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          {formik.touched.userId && formik.errors.userId ? (
            <div className="text-red-600 text-sm">{formik.errors.userId}</div>
          ) : null}
        </div>

        <div className="flex flex-col">
          <label htmlFor="roomId">Room</label>
          <select
            id="roomId"
            name="roomId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.roomId}
            className="border border-gray-300 p-1 rounded"
          >
            <option value="">Select room</option>
            {rooms.map((r: Room) => (
              <option key={r.id} value={r.id}>
                Number: {r.number}
              </option>
            ))}
          </select>
          {formik.touched.roomId && formik.errors.roomId ? (
            <div className="text-red-600 text-sm">{formik.errors.roomId}</div>
          ) : null}
        </div>

        <div className="flex gap-2">
          <div className="flex flex-col w-1/2">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              min={todayMin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.startDate}
              className="border border-gray-300 p-1 rounded"
            />
            {formik.touched.startDate && formik.errors.startDate ? (
              <div className="text-red-600 text-sm">{formik.errors.startDate}</div>
            ) : null}
          </div>

          <div className="flex flex-col w-1/2">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              min={formik.values.startDate || todayMin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.endDate}
              className="border border-gray-300 p-1 rounded"
            />
            {formik.touched.endDate && formik.errors.endDate ? (
              <div className="text-red-600 text-sm">{formik.errors.endDate}</div>
            ) : null}
          </div>
        </div>

        <button type="submit" className="bg-[#134074] text-white py-2 px-4 rounded hover:bg-blue-700">
          Create Reservation
        </button>
      </form>
    </div>
  );
};

export default CreateReservationForm;
