import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

function Header() {
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

  const initials = useMemo(() => {
    if (!user || !user.name) return "U";
    const parts = String(user.name).trim().split(" ");
    return (parts[0]?.[0] + (parts[1]?.[0] || "")).toUpperCase();
  }, [user]);

  useEffect(() => {
    setErr(""); // clear any past error when user state changes
  }, [user]);

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
    // ux_mode: "popup" // default; uncomment if you changed it elsewhere
  });

  return (
    <header
      className="
        sticky top-0 z-50 w-full
        backdrop-blur-md
        border-b border-white/50 dark:border-white/10
        bg-white/60 dark:bg-white/10
        shadow-[0_2px_20px_rgba(0,0,0,0.06)]
        relative
      "
    >
      {/* gradient + noise strip */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_10%_-40%,rgba(245,101,81,0.20),rgba(255,255,255,0)_60%),radial-gradient(80%_50%_at_90%_-30%,rgba(6,182,212,0.15),rgba(255,255,255,0)_65%)]" />
        <div className="absolute inset-0 mix-blend-multiply opacity-[0.04] [background-image:url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="mx-auto flex h-16 items-center justify-between gap-3 px-3 sm:h-18 sm:px-5 lg:max-w-7xl">
        {/* Brand */}
        <Link
          to="/"
          className="group flex items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-white/50 dark:hover:bg-white/5"
          aria-label="Nomadic Nest home"
        >
          <img src="/logo.svg" alt="" className="h-9 w-9" />
          <h1 className="text-sm font-semibold opacity-90 transition group-hover:opacity-100">
            Nomadic Nest
          </h1>
        </Link>

        {/* Right cluster */}
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
                    className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/70 bg-white/70 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-md transition hover:shadow dark:border-white/10 dark:bg-white/10 dark:text-gray-200"
                  >
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-56 rounded-2xl border border-white/70 bg-white/80 p-3 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/10"
                >
                  <div className="flex items-center gap-3 p-2">
                    <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/60 bg-white/70 text-sm font-semibold text-gray-700 dark:border-white/10 dark:bg-white/10 dark:text-gray-200">
                      {user.picture ? (
                        <img
                          src={user.picture}
                          alt={user.name || "User"}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {user.name || "Traveler"}
                      </div>
                      <div className="truncate text-xs text-gray-600 dark:text-gray-300">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 grid gap-1 p-1">
                    <Link
                      to="/my-trips"
                      className="rounded-md px-2 py-1.5 text-sm text-gray-700 transition hover:bg-white hover:text-gray-900 dark:text-gray-200 dark:hover:bg-white/10"
                    >
                      My Trips
                    </Link>
                    <button
                      className="rounded-md px-2 py-1.5 text-left text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
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
                <DialogContent className="max-w-md rounded-2xl border border-white/60 bg-white/85 p-0 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
                  <DialogHeader className="p-0">
                    <DialogTitle className="sr-only">Sign in</DialogTitle>
                    <DialogDescription asChild>
                      {/* Card body */}
                      <div className="flex flex-col gap-0">
                        {/* Header strip */}
                        <div className="flex items-center justify-between gap-3 rounded-t-2xl border-b border-white/60 bg-gradient-to-r from-[#fff7f6] to-white px-5 py-4 dark:from-white/5 dark:to-white/10">
                          <div className="flex items-center gap-3">
                            <img src="/logo.svg" alt="" className="h-9 w-9" />
                            <div>
                              <h2 className="text-base font-bold">Nomadic Nest</h2>
                              <p className="text-xs text-gray-500">AI trip planner</p>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="px-5 py-4">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Sign in to sync your trips across devices and unlock smart suggestions.
                          </p>

                          {/* Benefits */}
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

                          {/* Divider */}
                          <div className="my-4 flex items-center gap-3">
                            <span className="h-px flex-1 bg-gray-200 dark:bg-white/20" />
                            <span className="text-[11px] uppercase tracking-wider text-gray-400">
                              Continue with
                            </span>
                            <span className="h-px flex-1 bg-gray-200 dark:bg-white/20" />
                          </div>

                          {/* Google-branded button */}
                          <Button
                            disabled={isBusy}
                            onClick={() => login()}
                            className="flex w-full items-center justify-center gap-3 border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:border-white/20 dark:bg-white/10 dark:text-gray-100"
                          >
                            {isBusy ? (
                              <span className="flex items-center gap-2">
                                <svg
                                  className="h-4 w-4 animate-spin"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                  />
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

                          {/* Error message */}
                          {err && (
                            <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                              {err}
                            </div>
                          )}

                          {/* Secondary actions */}
                          <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                              By continuing, you agree to our{" "}
                              <a href="/terms" className="underline underline-offset-2">Terms</a>{" "}
                              and{" "}
                              <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a>.
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

export default Header;
