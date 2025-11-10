import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Reservations from "./pages/Reservations";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">   {/* <- important */}
      <Header />
      <main className="flex-grow">                  {/* <- important */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Reservations />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
