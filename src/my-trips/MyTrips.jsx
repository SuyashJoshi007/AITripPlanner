import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/service/fireBaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ArrowRight,
  MapPin,
  DollarSign,
  Clock,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTrips() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/");
        return;
      }

      const q = query(
        collection(db, "AITrips"),
        where("userEmail", "==", user.email)
      );
      const querySnapshot = await getDocs(q);

      const tripsData = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        tripsData.push({
          id: docSnap.id,
          budget: data.tripData?.travelPlan?.budget || "N/A",
          duration: data.tripData?.travelPlan?.duration || "N/A",
          city: data.tripData?.travelPlan?.locationDetails?.city || "N/A",
        });
      });
      setTrips(tripsData);
    }

    fetchTrips();
  }, [navigate]);

  const handleViewTrip = (tripId) => {
    navigate(`/view-trip/${tripId}`);
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await deleteDoc(doc(db, "AITrips", tripId));
      setTrips((prev) => prev.filter((trip) => trip.id !== tripId));
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">My Previous Trips</h1>

      {trips.length === 0 ? (
        <p className="text-gray-500">No trips found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="group relative border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition duration-300 cursor-pointer hover:scale-[1.01] transform"
            >
              {/* Full-card redirect */}
              <div
                onClick={() => handleViewTrip(trip.id)}
                className="absolute inset-0 z-10"
              />

              {/* Arrow icon */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                <ArrowRight size={18} className="text-gray-600" />
              </div>

              <div className="relative z-20 space-y-2">
                <p className="flex items-center gap-2 text-gray-700">
                  <MapPin size={16} />{" "}
                  <span className="text-gray-900">{trip.city}</span>
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <DollarSign size={16} />{" "}
                  <span className="text-gray-900">{trip.budget}</span>
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <Clock size={16} />{" "}
                  <span className="text-gray-900">{trip.duration}</span>
                </p>

                {/* Delete with confirmation */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-red-500 text-sm mt-2 hover:underline hover:text-red-600 transition"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your trip.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTrips;
