import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

export default function Header() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [err, setErr] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const initials = useMemo(() => {
    if (!user || !user.name) return "U";
    const parts = String(user.name).trim().split(" ");
    return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase();
  }, [user]);

  useEffect(() => {
    setErr("");
  }, [user]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function GetUserProfile(tokenResponse) {
    setIsBusy(true);
    setErr("");
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      if (!res.ok) throw new Error("Google userinfo error");
      const profile = await res.json();
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      setErr("Couldn’t complete sign-in. Please try again.");
    } finally {
      setIsBusy(false);
    }
  }

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => GetUserProfile(tokenResponse),
    onError: () => setErr("Google sign-in popup was closed or blocked."),
    flow: "implicit",
  });

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full",
        "backdrop-blur-md",
        "border-b border-transparent",
        "bg-white/60 dark:bg-white/10",
        "transition-shadow",
        scrolled
          ? "shadow-[0_6px_30px_-10px_rgba(0,0,0,0.2)] ring-1 ring-black/5 dark:ring-white/10"
          : "shadow-[0_2px_20px_rgba(0,0,0,0.06)]",
      ].join(" ")}
      role="banner"
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 60% at 10% -40%, rgba(245,101,81,0.20), rgba(255,255,255,0) 60%), radial-gradient(80% 50% at 90% -30%, rgba(6,182,212,0.15), rgba(255,255,255,0) 65%)",
          }}
        />
        <div
          className="absolute inset-0 mix-blend-multiply opacity-10"
          style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#f56551]/40 via-transparent to-[#06b6d4]/40" />
      </div>

      <div className="mx-auto flex h-16 items-center justify-between gap-3 px-3 sm:h-16 md:h-20 sm:px-5 lg:max-w-7xl">
        <Link
          to="/"
          className="group flex min-w-0 items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f56551]/50 dark:hover:bg-white/5"
          aria-label="Nomadic Nest home"
        >
          <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl bg-white/70 shadow-sm ring-1 ring-black/5 backdrop-blur md:h-12 md:w-12 dark:bg-white/10 dark:ring-white/10">
            <img
              src="/logo.svg"
              alt="Nomadic Nest logo"
              className="h-6 w-6 md:h-7 md:w-7 select-none"
              draggable={false}
            />
            <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/60 dark:ring-white/10" />
            <span className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-[#f56551]/30 to-[#06b6d4]/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </span>

          <h1
            className="truncate bg-gradient-to-br from-gray-800 to-gray-500 bg-clip-text font-semibold text-transparent opacity-90 transition group-hover:opacity-100 dark:from-gray-100 dark:to-gray-300"
            style={{ fontSize: "clamp(1.1rem, 2.5vw, 2rem)" }}
          >
            Nomadic Nest
          </h1>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/create-trip" className="hidden sm:block">
            <Button
              size="sm"
              className="bg-[#f56551] hover:bg-[#e25744] shadow-sm motion-safe:transition-transform motion-safe:duration-200 hover:-translate-y-0.5"
            >
              ✈️ Create Trip
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/my-trips" className="sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/60 bg-white/70 backdrop-blur-md hover:bg-white dark:border-white/10 dark:bg-white/10"
                >
                  My Trips
                </Button>
              </Link>

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    aria-label="Account menu"
                    className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-2xl border border-white/70 bg-white/70 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-md transition hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4]/50 md:h-11 md:w-11 dark:border-white/10 dark:bg-white/10 dark:text-gray-200"
                  >
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>{initials}</span>
                    )}
                    <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/60 transition dark:ring-white/10 group-hover:ring-[#06b6d4]/40" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-64 rounded-2xl border border-white/70 bg-white/80 p-3 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-white/10"
                >
                  <div className="flex items-center gap-3 p-2">
                    <div className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl border border-white/60 bg-white/70 text-sm font-semibold text-gray-700 dark:border-white/10 dark:bg-white/10 dark:text-gray-200">
                      {user.picture ? (
                        <img
                          src={user.picture}
                          alt={user.name || "User"}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span>{initials}</span>
                      )}
                      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/60 dark:ring-white/10" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name || "Traveler"}</div>
                      <div className="truncate text-xs text-gray-600 dark:text-gray-300">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-2 grid gap-1 p-1">
                    <Link
                      to="/my-trips"
                      className="rounded-md px-2 py-1.5 text-sm text-gray-700 transition hover:bg-white hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 dark:text-gray-200 dark:hover:bg-white/10"
                    >
                      My Trips
                    </Link>
                    <button
                      className="rounded-md px-2 py-1.5 text-left text-sm text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 dark:hover:bg-red-500/10"
                      onClick={() => {
                        googleLogout();
                        localStorage.removeItem("user");
                        setUser(null);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <>
              <Button
                className="shadow-sm motion-safe:transition-transform motion-safe:duration-200 hover:-translate-y-0.5"
                onClick={() => {
                  setErr("");
                  setOpenDialog(true);
                }}
              >
                Sign In
              </Button>

              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-md rounded-2xl border border-white/60 bg-white/80 p-0 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
                  <DialogHeader className="p-0">
                    <DialogTitle className="sr-only">Sign in</DialogTitle>
                    <DialogDescription asChild>
                      <div className="flex flex-col gap-0">
                        <div className="flex items-center justify-between gap-3 rounded-t-2xl border-b border-white/60 bg-gradient-to-r from-[#fff7f6] to-white px-5 py-4 dark:from-white/5 dark:to-white/10">
                          <div className="flex items-center gap-3">
                            <img src="/logo.svg" alt="" className="h-9 w-9" />
                            <div>
                              <h2 className="text-base font-bold">Nomadic Nest</h2>
                              <p className="text-xs text-gray-500">AI trip planner</p>
                            </div>
                          </div>
                        </div>

                        <div className="px-5 py-4">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Sign in to sync your trips across devices and unlock smart suggestions.
                          </p>

                          <ul className="mt-3 space-y-1.5 text-sm text-gray-700 dark:text-gray-200">
                            <li className="flex items-start gap-2">
                              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#f56551]" />
                              Save & revisit itineraries anytime
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#06b6d4]" />
                              Share plans with friends
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#fb923c]" />
                              Get tailored recommendations
                            </li>
                          </ul>

                          <div className="my-4 flex items-center gap-3">
                            <span className="h-px flex-1 bg-gray-200 dark:bg-white/20" />
                            <span className="text-[11px] uppercase tracking-wider text-gray-400">Continue with</span>
                            <span className="h-px flex-1 bg-gray-200 dark:bg-white/20" />
                          </div>

                          <Button
                            disabled={isBusy}
                            onClick={() => login()}
                            className="flex w-full items-center justify-center gap-3 border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 dark:border-white/20 dark:bg-white/10 dark:text-gray-100"
                          >
                            {isBusy ? (
                              <span className="flex items-center gap-2">
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                Signing in…
                              </span>
                            ) : (
                              <>
                                <FcGoogle className="h-5 w-5" />
                                <span>Sign in with Google</span>
                              </>
                            )}
                          </Button>

                          {err && (
                            <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                              {err}
                            </div>
                          )}

                          <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                              By continuing, you agree to our <a href="/terms" className="underline underline-offset-2">Terms</a> and <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a>.
                            </p>
                          </div>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </header>
  );
}