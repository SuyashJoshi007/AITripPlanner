import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Star,
  DollarSign,
  Hotel,
} from 'lucide-react';

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

function Hotels({ trip }) {
  const hotels = trip?.tripData?.travelPlan?.hotelOptions || [];
  const [images, setImages] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};

      await Promise.all(
        hotels.map(async (hotel, index) => {
          const query = `${hotel.hotelName} hotel`;
          const sig = Math.floor(Math.random() * 100000) + index;

          try {
            const res = await fetch(
              `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${ACCESS_KEY}&sig=${sig}`
            );
            const data = await res.json();
            newImages[hotel.hotelName] = data?.urls?.small || null;
          } catch (err) {
            newImages[hotel.hotelName] = null;
          }
        })
      );

      setImages(newImages);
    };

    if (hotels.length) {
      fetchImages();
    }
  }, [hotels]);

  return (
    <div className="mt-6">
      <h2 className="font-bold text-2xl mb-4 flex items-center gap-2">
        <Hotel className="w-6 h-6" /> Hotel Recommendations
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel, index) => {
          const imageUrl =
            images[hotel.hotelName] ||
            'https://dummyimage.com/400x200/ccc/000&text=No+Image';

          return (
            <a
              key={index}
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                hotel.hotelAddress
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block border rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <img
                src={imageUrl}
                alt={hotel.hotelName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-sm space-y-1">
                <h3 className="font-semibold text-lg">{hotel.hotelName}</h3>
                <p className="text-gray-600 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {hotel.hotelAddress}
                </p>
                <p className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" /> {hotel.pricePerNightApprox}
                </p>
                <p className="flex items-center gap-1">
                  <Star className="w-4 h-4" /> {hotel.rating}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  {hotel.shortDescription}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default Hotels;
