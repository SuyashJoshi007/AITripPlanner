import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MasonryImageList from "./MasonryImageList";
import CountUp from "react-countup";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y } from "swiper/modules";
import "swiper/css";

function Hero() {
  const handleScrollToHighlights = () => {
    const el = document.getElementById("highlights");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* decorative gradient + noise */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -inset-[20%] bg-[radial-gradient(60%_40%_at_50%_-10%,rgba(245,101,81,0.25),rgba(255,255,255,0)_60%),radial-gradient(35%_35%_at_80%_20%,rgba(56,189,248,0.20),rgba(255,255,255,0)_65%),radial-gradient(30%_30%_at_20%_30%,rgba(134,239,172,0.18),rgba(255,255,255,0)_70%)]" />
        <div className="absolute inset-0 mix-blend-multiply opacity-[0.06] [background-image:url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="w-full py-12 md:py-16 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200/60 bg-white/70 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10 dark:text-gray-200">
              <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-[#f56551]" />
              AI-powered trip planner
            </div>

            <h1 className="font-extrabold leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl">
              <span className="mb-3 block bg-gradient-to-r from-[#f56551] via-[#fb923c] to-[#06b6d4] bg-clip-text text-transparent">
                Discover Your Next Adventure with AI
              </span>
              <span className="text-gray-800 dark:text-gray-100">
                Personalized Itineraries at Your Fingertips
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-base text-gray-600 sm:text-lg md:text-xl dark:text-gray-300">
              Your personal trip planner and travel curator, crafting day-by-day
              routes, stays, and activities tuned to your interests and budget.
            </p>

            {/* CTA group */}
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/create-trip" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#f56551] hover:bg-[#e25744]"
                  aria-label="Get started creating your trip"
                >
                  ✈️ Get Started
                </Button>
              </Link>
              <button
                onClick={handleScrollToHighlights}
                className="group inline-flex items-center gap-2 rounded-lg border border-gray-300/70 bg-white/70 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-md transition hover:border-gray-400 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-gray-200"
              >
                Preview destinations
                <svg
                  className="h-4 w-4 transition group-hover:translate-x-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10.293 15.707a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414L11.707 5.121a1 1 0 0 0-1.414 1.414L12.586 9H4a1 1 0 1 0 0 2h8.586l-2.293 2.293a1 1 0 0 0 0 1.414Z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Stats – glass cards */}
          <div className="mx-auto mt-10 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Trips Planned", end: 500, suffix: "+" },
              { label: "Happy Travelers", end: 1200, suffix: "+" },
              { label: "Destinations Covered", end: 50, suffix: "+" },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/60 bg-white/70 p-5 text-center shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10"
              >
                <div className="text-3xl font-extrabold text-[#f56551] md:text-4xl">
                  <CountUp end={s.end} duration={2} enableScrollSpy scrollSpyOnce />
                  {s.suffix}
                </div>
                <p className="mt-1 text-sm text-gray-600 md:text-base dark:text-gray-300">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Circular down arrow */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleScrollToHighlights}
              aria-label="View more content below"
              className="motion-safe:animate-bounce rounded-full border border-gray-200/60 bg-white/80 p-3 text-[#f56551] shadow-sm ring-1 ring-inset ring-white/60 backdrop-blur-md transition hover:shadow-md dark:border-white/10 dark:bg-white/10"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 111.04 1.08l-4.24 3.36a.75.75 0 01-.94 0L5.25 8.31a.75.75 0 01-.02-1.1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Divider title */}
        <div className="mb-3 mt-2 w-full max-w-7xl px-1">
          <div className="mx-auto flex max-w-2xl items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300/70 to-transparent dark:via-white/20" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-300">
              Explore Highlights
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300/70 to-transparent dark:via-white/20" />
          </div>
        </div>

        {/* Highlights / Masonry */}
        <div id="highlights" className="w-full pb-8">
          <MasonryImageList />
        </div>

        {/* Testimonials */}
        <div className="w-full py-12 md:py-16">
          <h2 className="mb-6 text-center text-2xl font-bold md:mb-8 md:text-3xl">
            <span className="bg-gradient-to-r from-[#f56551] to-[#fb923c] bg-clip-text text-transparent">
              What Our Users Say
            </span>
          </h2>

          <Swiper
            modules={[Autoplay, A11y]}
            a11y={{ enabled: true }}
            spaceBetween={20}
            slidesPerView={1}
            loop
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 1.5, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 28 },
            }}
            style={{ paddingBottom: "8px" }}
          >
            {TESTIMONIALS.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="h-full rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg dark:border-white/10 dark:bg-white/10">
                  <p className="mb-4 text-sm text-gray-700 sm:text-base dark:text-gray-200">
                    “{t.quote}”
                  </p>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    — {t.author}
                  </h3>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

const TESTIMONIALS = [
  { quote: "TravelGenie made planning my trip so easy! I had a personalized itinerary ready in minutes.", author: "Sarah J." },
  { quote: "Loved the budget controls and local suggestions. It felt like a friend guiding me.", author: "Pranav K." },
  { quote: "We covered so much without feeling rushed. The day-by-day pacing was perfect.", author: "Mira D." },
  { quote: "Great for spontaneous weekend getaways—booked activities right inside the plan.", author: "Akash S." },
];

export default Hero;
