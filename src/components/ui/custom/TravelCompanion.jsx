import React from "react";
import { FaPlane, FaGlassCheers, FaHome, FaShip } from "react-icons/fa";

function TravelCompanionSelector({ selectedCompanion, setSelectedCompanion }) {
  const companions = [
    {
      id: "solo",
      label: "Just Me",
      description: "A sole traveler in exploration",
      icon: <FaPlane className="h-5 w-5" />,
      hue: "from-[#f56551] to-[#fb923c]", // warm
    },
    {
      id: "couple",
      label: "A Couple",
      description: "Two travel in tandem",
      icon: <FaGlassCheers className="h-5 w-5" />,
      hue: "from-[#06b6d4] to-[#67e8f9]", // aqua
    },
    {
      id: "family",
      label: "Family",
      description: "A group of fun-loving adventurers",
      icon: <FaHome className="h-5 w-5" />,
      hue: "from-[#22c55e] to-[#a7f3d0]", // green
    },
    {
      id: "friends",
      label: "Friends",
      description: "A bunch of thrill-seekers",
      icon: <FaShip className="h-5 w-5" />,
      hue: "from-[#8b5cf6] to-[#c4b5fd]", // purple
    },
  ];

  return (
    <section
      aria-labelledby="companion-title"
      className="relative w-full"
    >
      {/* subtle background echo */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]">
        <div className="absolute -inset-[20%] bg-[radial-gradient(60%_40%_at_50%_-10%,rgba(245,101,81,0.25),rgba(255,255,255,0)_60%),radial-gradient(35%_35%_at_80%_20%,rgba(6,182,212,0.2),rgba(255,255,255,0)_65%)]" />
      </div>

      <div className="px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <header className="mb-4">
            <h2
              id="companion-title"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              Who’s traveling?
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Choose a companion type to tailor your itinerary.
            </p>
          </header>

          <div
            role="radiogroup"
            aria-label="Travel companion"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
          >
            {companions.map((c) => {
              const selected = selectedCompanion === c.id;
              return (
                <button
                  key={c.id}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setSelectedCompanion(c.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedCompanion(c.id);
                    }
                  }}
                  className={[
                    "group relative w-full rounded-2xl p-5 text-left transition",
                    "border backdrop-blur-md shadow-sm",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#f56551]/70 focus-visible:ring-offset-white dark:focus-visible:ring-offset-transparent",
                    selected
                      ? "border-white/70 bg-white/80 ring-1 ring-[#f56551]/30 dark:border-white/10 dark:bg-white/10"
                      : "border-white/60 bg-white/60 hover:bg-white/80 dark:border-white/10 dark:bg-white/10",
                  ].join(" ")}
                >
                  {/* gradient icon chip */}
                  <span
                    aria-hidden
                    className={[
                      "mb-3 inline-grid h-10 w-10 place-items-center rounded-full text-white shadow-sm",
                      "bg-gradient-to-br", c.hue,
                      "transition motion-safe:group-hover:scale-105",
                    ].join(" ")}
                  >
                    {c.icon}
                  </span>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-gray-900 dark:text-gray-100">
                      {c.label}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {c.description}
                    </p>
                  </div>

                  {/* selection ring / tick */}
                  <span
                    className={[
                      "pointer-events-none absolute right-3 top-3 inline-flex items-center justify-center rounded-full border text-xs",
                      selected
                        ? "border-[#f56551]/30 bg-[#f56551]/10 px-2 py-0.5 text-[#f56551]"
                        : "border-transparent bg-transparent px-0 py-0 text-transparent",
                    ].join(" ")}
                  >
                    Selected
                  </span>

                  {/* subtle bottom gradient line */}
                  <span
                    aria-hidden
                    className={[
                      "pointer-events-none absolute inset-x-0 bottom-0 h-[3px] rounded-b-2xl",
                      selected
                        ? "bg-gradient-to-r from-[#f56551] via-[#fb923c] to-[#06b6d4]"
                        : "bg-transparent group-hover:bg-gradient-to-r group-hover:from-black/10 group-hover:to-black/0 dark:group-hover:from-white/10",
                    ].join(" ")}
                  />
                </button>
              );
            })}
          </div>

          {/* helper text */}
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            You can change this later—plans will adapt automatically.
          </p>
        </div>
      </div>
    </section>
  );
}

export default TravelCompanionSelector;
