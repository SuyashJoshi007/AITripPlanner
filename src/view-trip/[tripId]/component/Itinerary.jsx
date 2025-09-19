import React from "react";
import { Clock, Ticket, MapPin } from "lucide-react";

function Itinerary({ trip }) {
  const itinerary = trip?.tripData?.travelPlan?.suggestedItinerary || [];
  if (!Array.isArray(itinerary) || itinerary.length === 0) return null;

  const mapsUrl = (q) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q || "")}`;

  const fallbackImg =
    "https://dummyimage.com/400x260/e5e7eb/111827.png&text=See+on+Maps";

  return (
    <section aria-labelledby="itinerary-title" className="mt-10 w-full">
      <header className="mb-7">
        <h2 id="itinerary-title" className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Places to Visit
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Tap any card to open it in Google Maps.
        </p>
      </header>

      <div className="space-y-12">
        {itinerary.map((dayItem, dayIdx) => {
          const dayNumber = dayItem?.day ?? dayIdx + 1;
          const acts = Array.isArray(dayItem?.activities) ? dayItem.activities : [];
          if (acts.length === 0) return null;

          return (
            <section
              key={dayIdx}
              aria-labelledby={`day-${dayNumber}-title`}
              className="relative"
            >
              {/* Day header chip (sticky on lg for quick context) */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-1.5 text-sm shadow-sm backdrop-blur-md lg:sticky lg:top-20">
                <span className="inline-block h-2 w-2 rounded-full bg-[#f56551]" />
                <h3 id={`day-${dayNumber}-title`} className="font-semibold">
                  Day {dayNumber}
                </h3>
              </div>

              {/* Vertical rail (timeline) */}
              <div className="relative pl-5 sm:pl-6">
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-2 top-0 h-full w-px bg-gradient-to-b from-[#f56551]/30 via-gray-200 to-transparent sm:left-2.5"
                />

                <ul className="space-y-5">
                  {acts.map((activity, i) => {
                    const title = activity?.placeName || "Point of Interest";
                    const desc = activity?.placeDescription || "Explore this attraction.";
                    const start = activity?.startTime || `${Math.max(9, 9 + i * 2)}:00`;
                    const duration = activity?.duration || "2 hours";
                    const ticket = activity?.ticketPrice || "Varies";
                    const img = activity?.image || activity?.thumbnail || null;

                    return (
                      <li key={`${title}-${i}`} className="relative">
                        {/* Rail node */}
                        <div className="absolute left-0 top-3 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-gradient-to-br from-[#f56551] to-[#fb923c] shadow-sm sm:left-0.5" />

                        {/* Card */}
                        <a
                          href={mapsUrl(title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={[
                            "block rounded-2xl border border-white/60 bg-white/80 shadow-sm backdrop-blur-md",
                            "transition hover:-translate-y-0.5 hover:shadow-md",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f56551]/50",
                          ].join(" ")}
                        >
                          {/* Accent line */}
                          <div className="h-[3px] w-full rounded-t-2xl bg-gradient-to-r from-[#f56551] via-[#fb923c] to-[#06b6d4]" />

                          <div className="p-4 sm:p-5">
                            {/* Top row: time + small maps chip */}
                            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                              <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 font-medium text-orange-700">
                                {start}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-gray-700">
                                <MapPin className="h-3.5 w-3.5" />
                                Open in Maps
                              </span>
                            </div>

                            <div className="flex gap-4">
                              {/* Image */}
                              <div className="relative">
                                <img
                                  src={
                                    img ||
                                    "https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=640&auto=format&fit=crop&q=60"
                                  }
                                  alt={title}
                                  className="h-28 w-28 flex-shrink-0 rounded-lg object-cover sm:h-32 sm:w-40"
                                  onError={(e) => {
                                    e.currentTarget.src = fallbackImg;
                                  }}
                                  loading="lazy"
                                  decoding="async"
                                />
                                {/* soft ring */}
                                <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-white/50" />
                              </div>

                              {/* Content */}
                              <div className="flex min-w-0 flex-1 flex-col justify-between">
                                <div>
                                  <h4 className="truncate text-base font-semibold sm:text-lg">
                                    {title}
                                  </h4>
                                  <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                                    {desc}
                                  </p>
                                </div>

                                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                                  <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-gray-700">
                                    <Clock className="h-3.5 w-3.5" />
                                    {duration}
                                  </span>
                                  <span className="inline-flex items-center gap-1 rounded-full border border-pink-200 bg-pink-50 px-2.5 py-0.5 text-pink-700">
                                    <Ticket className="h-3.5 w-3.5" />
                                    {ticket}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

export default Itinerary;
