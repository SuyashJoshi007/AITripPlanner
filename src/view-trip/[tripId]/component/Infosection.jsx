import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, Wallet, User, Share2 } from "lucide-react";

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

function Infosection({ trip }) {
  const [imageUrl, setImageUrl] = useState("/ticket-list.jpg");
  const [loadingImg, setLoadingImg] = useState(true);
  const [copied, setCopied] = useState(false);

  const locationLabel = trip?.userSelection?.selectedLocation?.label || "";
  const tripDays = trip?.userSelection?.tripDays ?? "—";
  const budget = trip?.userSelection?.selectedBudget ?? "—";
  const companion = trip?.userSelection?.selectedCompanion ?? "—";

  const searchQuery = useMemo(() => {
    // Prefer city if available inside tripData; fall back to label
    const city = trip?.tripData?.travelPlan?.locationDetails?.city;
    return city || locationLabel || "travel";
  }, [trip, locationLabel]);

  useEffect(() => {
    let canceled = false;
    async function fetchCityImage() {
      if (!ACCESS_KEY || !searchQuery) {
        setLoadingImg(false);
        return;
      }
      try {
        const res = await fetch(
          `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
            searchQuery
          )}&client_id=${ACCESS_KEY}&orientation=landscape&content_filter=high`
        );
        const data = await res.json();
        if (!canceled && data?.urls?.regular) {
          setImageUrl(data.urls.regular);
        }
      } catch (err) {
        // Fail silently, keep fallback
        // console.warn("Unsplash fetch failed:", err);
      } finally {
        if (!canceled) setLoadingImg(false);
      }
    }
    fetchCityImage();
    return () => {
      canceled = true;
    };
  }, [searchQuery]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      // Fallback: open native share (if available)
      if (navigator.share) {
        try {
          await navigator.share({ title: document.title, url: window.location.href });
        } catch {
          /* user canceled */
        }
      }
    }
  };

  return (
    <section className="w-full">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl">
        {/* shimmer skeleton while loading */}
        {loadingImg && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 to-gray-200" />
        )}

        <img
          src={imageUrl}
          alt={locationLabel ? `${locationLabel} banner` : "Trip banner"}
          className="h-[260px] w-full object-cover sm:h-[320px] md:h-[360px]"
          onLoad={() => setLoadingImg(false)}
          onError={(e) => {
            e.currentTarget.src = "/ticket-list.jpg";
            setLoadingImg(false);
          }}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />

        {/* Gradient overlays for readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-white/40" />

        {/* Title & chips pinned to bottom-left */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
          <h1 className="max-w-3xl truncate text-2xl font-extrabold text-white drop-shadow-sm sm:text-3xl">
            {locationLabel || "Your Destination"}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
              <CalendarDays className="h-4 w-4" />
              {tripDays} {Number(tripDays) === 1 ? "Day" : "Days"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
              <Wallet className="h-4 w-4" />
              {budget}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
              <User className="h-4 w-4" />
              {companion}
            </span>
          </div>
        </div>

        {/* Share button pinned to top-right */}
        <div className="absolute right-3 top-3">
          <button
            onClick={handleShare}
            className="group inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm backdrop-blur-md transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f56551]/60"
            aria-label="Copy link to share"
            title="Copy link"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>

          {/* Copied tooltip */}
          <div
            className={[
              "pointer-events-none absolute right-0 mt-2 origin-top-right rounded-md bg-black/80 px-2 py-1 text-xs text-white backdrop-blur-sm transition",
              copied ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
            ].join(" ")}
          >
            Copied!
          </div>
        </div>
      </div>

      {/* Info row (optional extra line below banner) */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-gray-600">
          Tailored by your preferences — hotels, sights, food & pacing.
        </div>
        {/* space reserved for future actions (download, print, etc.) */}
      </div>
    </section>
  );
}

export default Infosection;
