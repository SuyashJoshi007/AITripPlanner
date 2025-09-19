import React, { useEffect, useState } from 'react';
import { MapPin, Star, DollarSign, Hotel } from 'lucide-react';

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

  if (!hotels.length) return null;

  return (
    <section className="mt-10 w-full">
      {/* Section header */}
      <div className="mb-6 flex items-center gap-2">
        <Hotel className="h-6 w-6 text-[#f56551]" />
        <h2 className="text-2xl font-extrabold">Hotel Recommendations</h2>
      </div>

      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel, index) => {
          const imageUrl =
            images[hotel.hotelName] ||
            'https://dummyimage.com/800x500/e5e7eb/111827.png&text=View+on+Maps';

          return (
            <a
              key={index}
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                hotel.hotelAddress
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "group relative block overflow-hidden rounded-2xl",
                "border border-white/60 bg-white/80 shadow-sm backdrop-blur-md",
                "transition hover:-translate-y-0.5 hover:shadow-md",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f56551]/50",
              ].join(" ")}
              title={`Open ${hotel.hotelName} in Google Maps`}
            >
              {/* Gradient accent bar */}
              <div className="h-[3px] w-full bg-gradient-to-r from-[#f56551] via-[#fb923c] to-[#06b6d4]" />

              {/* Media */}
              <div className="relative h-48 w-full sm:h-52">
                <img
                  src={imageUrl}
                  alt={hotel.hotelName}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                {/* Readability overlay + soft ring */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-90 transition-opacity group-hover:opacity-80" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-white/50" />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="line-clamp-1 text-lg font-semibold text-gray-900 group-hover:text-[#f56551]">
                    {hotel.hotelName}
                  </h3>

                  {/* Rating chip */}
                  <span className="inline-flex items-center gap-1 rounded-full border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700">
                    <Star className="h-3.5 w-3.5" />
                    {hotel.rating ?? "—"}
                  </span>
                </div>

                <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1 align-middle">
                    <MapPin className="h-4 w-4 text-[#f56551]" />
                    {hotel.hotelAddress}
                  </span>
                </p>

                {/* Meta chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    <DollarSign className="h-3.5 w-3.5" />
                    {hotel.pricePerNightApprox}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs text-gray-700">
                    Open in Maps
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 line-clamp-2 text-sm text-gray-500">
                  {hotel.shortDescription}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

export default Hotels;
