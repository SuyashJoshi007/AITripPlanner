import React from "react";
import { Clock, Ticket } from "lucide-react";

function Itinerary({ trip }) {
  const itinerary = trip?.tripData?.travelPlan?.suggestedItinerary || [];

  if (!itinerary.length) return null;

  const getGoogleMapsUrl = (placeName) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      placeName
    )}`;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Places to Visit</h2>

      {itinerary.map((dayItem, dayIndex) => (
        <div key={dayIndex} className="mb-10">
          <h3 className="text-xl font-semibold mb-6">Day {dayItem.day}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dayItem.activities.map((activity, index) => (
              <a
                key={index}
                href={getGoogleMapsUrl(activity.placeName)}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border p-4 shadow-sm hover:shadow-md transition-transform transform hover:scale-[1.02] hover:bg-gray-50"
              >
                {/* Time */}
                <p className="text-sm text-orange-600 font-semibold mb-2">
                  {activity.startTime || `${10 + index * 2}:00 AM`}
                </p>

                <div className="flex gap-4">
                  {/* Image */}
                  <img
                    src={ "https://plus.unsplash.com/premium_photo-1671620314206-03ad720f203e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDIyfEZ6bzN6dU9ITjZ3fHxlbnwwfHx8fHw%3D"
                    }
                    alt={activity.placeName}
                    className="w-28 h-28 object-cover rounded-md flex-shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://dummyimage.com/200x140/ccc/000&text=No+Image";
                    }}
                  />

                  {/* Content */}
                  <div className="flex flex-col justify-between w-full">
                    <div>
                      <h4 className="font-semibold text-lg">
                        {activity.placeName}
                      </h4>
                      <p className="text-gray-500 text-sm mb-2">
                        {activity.placeDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-700 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {activity.duration || "2 hours"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Ticket className="w-4 h-4 text-pink-500" />
                        {activity.ticketPrice || "Varies"}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Itinerary;
