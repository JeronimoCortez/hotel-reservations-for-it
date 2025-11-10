import { useState } from "react";

const images = [
  { src: "/SingleRoom.png", name: "Single Room" },
  { src: "/DoubleRoom.png", name: "Double Room" },
  { src: "/Suite.png", name: "Suite" },
];

const Rooms = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h4 className=" text-2xl font-bold mb-4 text-center">Our Rooms</h4>
      <div className="relative">
        <img
          src={images[current].src}
          alt={images[current].name}
          className="w-full h-[60vh] object-cover rounded"
        />
        <p className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-2 rounded-b">
          {images[current].name}
        </p>

        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full cursor-pointer"
        >
          &#10094;
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full cursor-pointer"
        >
          &#10095;
        </button>
      </div>

      <div className="flex justify-center mt-2 space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full ${
              current === index ? "bg-blue-700" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
      <a href="/rooms" className="block mx-auto bg-[#134074] py-2 px-4 mt-4 text-white cursor-pointer rounded text-center">
        Reserve
      </a>
    </div>
  );
};

export default Rooms;
