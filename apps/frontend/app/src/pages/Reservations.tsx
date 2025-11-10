
import { useNavigate } from "react-router-dom";
import ListRoom from "../components/ListRoom"
import { useEffect } from "react";
import Swal from "sweetalert2";

const Reservations = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Access denied",
        text: "You must log in to view your reservations.",
        confirmButtonColor: "#134074",
        confirmButtonText: "Go to login",
      }).then(() => {
        navigate("/login");
      });
    }
  }, [navigate]);

  return (
    <div>
      <ListRoom/>
    </div>
  )
}

export default Reservations
