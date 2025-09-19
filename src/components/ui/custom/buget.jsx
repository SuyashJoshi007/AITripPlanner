import React from "react";
import { DollarSign, Wallet, BadgeDollarSign } from "lucide-react";

function BudgetSelector({ selectedBudget, setSelectedBudget }) {
  const budgets = [
    {
      id: "cheap",
      value: "cheap",
      title: "Budget",
      description: "Stay conscious of costs",
      icon: <Wallet className="h-5 w-5" />,
      hue: "from-[#22c55e] to-[#a7f3d0]", // green
    },
    {
      id: "moderate",
      value: "moderate",
      title: "Moderate",
      description: "Keep cost on the average side",
      icon: <DollarSign className="h-5 w-5" />,
      hue: "from-[#06b6d4] to-[#67e8f9]", // aqua
    },
    {
      id: "luxury",
      value: "luxury",
      title: "Luxury",
      description: "Don't worry about cost",
      icon: <BadgeDollarSign className="h-5 w-5" />,
      hue: "from-[#f56551] to-[#fb923c]", // warm
    },
  ];

  return (
    <section aria-labelledby="budget-title" className="relative w-full">
      {/* subtle gradient echo */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]">
        <div className="absolute -inset-[20%] bg-[radial-gradient(60%_40%_at_50%_-10%,rgba(245,101,81,0.25),rgba(255,255,255,0)_60%),radial-gradient(35%_35%_at_80%_20%,rgba(6,182,212,0.2),rgba(255,255,255,0)_65%)]" />
      </div>

      <div className="px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <header className="mb-4">
            <h2 id="budget-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              What’s your budget?
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We’ll balance hotels, activities, and transit to match this.
            </p>
          </header>

          <div
            role="radiogroup"
            aria-label="Trip budget"
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {budgets.map((b) => {
              const selected = selectedBudget === b.id;
              return (
                <button
                  key={b.id}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setSelectedBudget(b.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedBudget(b.id);
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
                      "bg-gradient-to-br", b.hue,
                      "transition motion-safe:group-hover:scale-105",
                    ].join(" ")}
                  >
                    {b.icon}
                  </span>

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-gray-900 dark:text-gray-100">
                      {b.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {b.description}
                    </p>
                  </div>

                  {/* selection badge */}
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

                  {/* bottom gradient accent */}
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

          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            You can refine costs later per day or per activity.
          </p>
        </div>
      </div>
    </section>
  );
}

export default BudgetSelector;
