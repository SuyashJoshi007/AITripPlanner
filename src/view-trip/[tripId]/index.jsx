import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/service/fireBaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import Infosection from "./component/Infosection";
import Hotels from "./component/Hotels";
import Itinerary from "./component/Itinerary";

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  // smooth scroll for in-page anchors
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  useEffect(() => {
    async function getTripData() {
      try {
        setLoading(true);
        const docRef = doc(db, "AITrips", tripId);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setTrip(snap.data());
        } else {
          toast("No such trip was found.");
        }
      } catch (err) {
        console.error("Error fetching trip:", err);
        toast("Error fetching trip data.");
      } finally {
        setLoading(false);
      }
    }
    if (tripId) getTripData();
  }, [tripId]);

  const locationLabel = useMemo(
    () => trip?.userSelection?.selectedLocation?.label || "",
    [trip]
  );

  return (
    <div className="relative min-h-screen w-full overflow-x-clip">
      {/* Background: gradients + subtle grain to match hero */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_-10%,rgba(245,101,81,0.18),rgba(255,255,255,0)_70%),radial-gradient(70%_55%_at_85%_0%,rgba(6,182,212,0.14),rgba(255,255,255,0)_75%),radial-gradient(60%_50%_at_10%_10%,rgba(134,239,172,0.14),rgba(255,255,255,0)_80%)]" />
        <div className="absolute inset-0 mix-blend-multiply opacity-[0.04] [background-image:url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* Sticky quick-nav */}
      <div className="sticky top-16 z-30 mx-auto mt-2 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="rounded-2xl border border-white/60 bg-white/70 p-2 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10">
          <ul className="flex flex-wrap items-center gap-2 text-sm">
            <li>
              <a
                href="#hotels"
                className="inline-flex items-center rounded-full px-3 py-1 text-gray-700 hover:bg-white"
              >
                Hotels
              </a>
            </li>
            <li>
              <a
                href="#itinerary"
                className="inline-flex items-center rounded-full px-3 py-1 text-gray-700 hover:bg-white"
              >
                Itinerary
              </a>
            </li>
            {locationLabel ? (
              <li className="ml-auto hidden sm:block">
                <span className="inline-flex max-w-[50vw] items-center truncate rounded-full border border-white/60 bg-white/80 px-3 py-1 text-gray-700 backdrop-blur-md">
                  {locationLabel}
                </span>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>

      {/* Main container */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Banner / Info */}
        <div className="rounded-2xl border border-white/60 bg-white/70 p-2 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10">
          {loading ? (
            /* skeleton for Infosection */
            <div className="animate-pulse">
              <div className="h-[260px] sm:h-[320px] md:h-[360px] w-full rounded-xl bg-gray-200" />
              <div className="mt-5 space-y-2 px-2 pb-4">
                <div className="h-6 w-1/3 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl">
              <Infosection trip={trip} />
            </div>
          )}
        </div>

        {/* Hotels */}
        <section id="hotels" className="mt-8">
          <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10">
            {loading ? (
              /* simple skeleton grid */
              <div>
                <div className="mb-5 h-7 w-64 rounded bg-gray-200" />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-sm">
                      <div className="h-48 w-full bg-gray-200" />
                      <div className="p-4 space-y-2">
                        <div className="h-5 w-3/4 rounded bg-gray-200" />
                        <div className="h-4 w-1/2 rounded bg-gray-200" />
                        <div className="h-4 w-1/3 rounded bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Hotels trip={trip} />
            )}
          </div>
        </section>

        {/* Itinerary */}
        <section id="itinerary" className="mt-8">
          <div className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10">
            {loading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-7 w-64 rounded bg-gray-200" />
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm">
                    <div className="mb-3 h-4 w-24 rounded bg-gray-200" />
                    <div className="flex gap-4">
                      <div className="h-28 w-28 rounded-lg bg-gray-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/2 rounded bg-gray-200" />
                        <div className="h-4 w-3/4 rounded bg-gray-200" />
                        <div className="h-4 w-2/3 rounded bg-gray-200" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Itinerary trip={trip} />
            )}
          </div>
        </section>

        {/* bottom spacer */}
        <div className="h-8" />
      </div>
    </div>
  );
}

export default Viewtrip;
