import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "@/service/fireBaseConfig";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ArrowRight, MapPin, DollarSign, Clock, Trash2, Plus } from "lucide-react";

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

function TripCardSkeleton() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="h-2 w-full bg-gray-100 rounded" />
      <div className="mt-3 h-2 w-2/3 bg-gray-100 rounded" />
      <div className="mt-3 h-2 w-1/2 bg-gray-100 rounded" />
      <div className="mt-4 h-8 w-24 bg-gray-100 rounded" />
    </div>
  );
}

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    async function fetchTrips() {
      if (!user) {
        navigate("/");
        return;
      }
      setLoading(true);
      try {
        const q = query(collection(db, "AITrips"), where("userEmail", "==", user.email));
        const snap = await getDocs(q);
        const rows = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          rows.push({
            id: docSnap.id,
            budget: data?.tripData?.travelPlan?.budget || "N/A",
            duration: data?.tripData?.travelPlan?.duration || "N/A",
            city: data?.tripData?.travelPlan?.locationDetails?.city || "N/A",
          });
        });
        setTrips(rows);
      } catch (e) {
        console.error("Failed to fetch trips:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, [navigate, user]);

  const handleViewTrip = (id) => navigate(`/view-trip/${id}`);

  const handleDeleteTrip = async (id) => {
    try {
      await deleteDoc(doc(db, "AITrips", id));
      setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">My Trips</h1>
            <p className="text-sm text-gray-600">
              Revisit your AI-crafted itineraries or start a new one.
            </p>
          </div>
          <Link
            to="/create-trip"
            className="inline-flex items-center gap-2 rounded-lg bg-[#f56551] px-4 py-2 text-white transition hover:bg-[#e25744]"
          >
            <Plus className="h-4 w-4" />
            Create trip
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <TripCardSkeleton key={i} />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="mt-10 grid place-items-center">
            <div className="max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100" />
              <h2 className="text-xl font-semibold">No trips yet</h2>
              <p className="mt-1 text-gray-600">
                When you generate an itinerary, it will show up here.
              </p>
              <Link
                to="/create-trip"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#f56551] px-4 py-2 text-white transition hover:bg-[#e25744]"
              >
                <Plus className="h-4 w-4" />
                Plan your first trip
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="group relative overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Arrow on hover */}
                <div className="absolute right-3 top-3 z-20 opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowRight size={18} className="text-gray-600" />
                </div>

                {/* Click-through overlay */}
                <button
                  onClick={() => handleViewTrip(trip.id)}
                  className="absolute inset-0 z-10"
                  aria-label={`Open trip ${trip.city}`}
                  title="Open"
                />

                {/* Content */}
                <div className="relative z-20 space-y-4">
                  <div className="inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1 text-sm">
                    <MapPin className="h-4 w-4 text-[#f56551]" />
                    <span className="truncate font-semibold">{trip.city}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium">{trip.budget}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{trip.duration}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Click card to view details</span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Your itinerary will be permanently removed.
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTrips;
