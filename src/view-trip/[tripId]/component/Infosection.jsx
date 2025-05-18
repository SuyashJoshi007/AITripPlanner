import React, { useEffect, useState } from "react";
import { CalendarDays, Wallet, User } from "lucide-react";
import { LuShare2 } from "react-icons/lu";

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

function Infosection({ trip }) {
  const [imageUrl, setImageUrl] = useState("/ticket-list.jpg");

  useEffect(() => {
    const fetchCityImage = async () => {
      const location = trip?.userSelection?.selectedLocation?.label;

      if (!location) return;

      try {
        const res = await fetch(
          `https://api.unsplash.com/photos/random?query=${encodeURIComponent(location)}&client_id=${ACCESS_KEY}&orientation=landscape`
        );
        const data = await res.json();
        if (data?.urls?.regular) {
          setImageUrl(data.urls.regular);
        }
      } catch (err) {
        console.error("Failed to load Unsplash image:", err);
      }
    };

    fetchCityImage();
  }, [trip?.userSelection?.selectedLocation?.label]);

  return (
    <div>
      <img
        src={imageUrl}
        className="w-full h-[300px] object-cover rounded-xl"
        alt="Trip Banner"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/ticket-list.jpg"; // fallback if image fails
        }}
      />
      <div className="my-5 flex flex-col gap-2">
        <h2 className="font-bold text-2xl">
          {trip?.userSelection?.selectedLocation?.label}
        </h2>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 mt-3">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-stone-900 font-semibold flex items-center gap-1">
              <CalendarDays size={16} /> {trip?.userSelection?.tripDays} Days
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-stone-900 font-semibold flex items-center gap-1">
              <Wallet size={16} /> {trip?.userSelection?.selectedBudget}
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-stone-900 font-semibold flex items-center gap-1">
              <User size={16} /> {trip?.userSelection?.selectedCompanion}
            </h2>
          </div>
          <button className="p-2 px-3 rounded-full text-stone-900 font-semibold flex items-center gap-1">
            <LuShare2 />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Infosection;
