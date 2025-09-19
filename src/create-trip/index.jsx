import React, { useState, useEffect, useMemo } from "react";
import Select from "react-select";
import BudgetSelector from "@/components/ui/custom/buget";
import TravelCompanionSelector from "@/components/ui/custom/TravelCompanion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generatePrompt } from "@/components/ui/custom/options";
import { chatSession } from "@/service/AIModel";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { db } from "@/service/fireBaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [formData, setFormData] = useState({
    selectedLocation: null,
    tripDays: "",
    selectedBudget: null,
    selectedCompanion: null,
  });

  const navigate = useNavigate();

  const steps = useMemo(
    () => [
      { key: "selectedLocation", label: "Destination" },
      { key: "tripDays", label: "Days" },
      { key: "selectedBudget", label: "Budget" },
      { key: "selectedCompanion", label: "Companion" },
    ],
    []
  );

  const isValidDays =
    formData.tripDays !== "" &&
    Number(formData.tripDays) >= 1 &&
    Number(formData.tripDays) <= 30;

  const allValid =
    formData.selectedLocation &&
    isValidDays &&
    formData.selectedBudget &&
    formData.selectedCompanion;

  const handleInputChange = (name, value) =>
    setFormData((p) => ({ ...p, [name]: value }));

  // Google login
  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: () => setErr("Google sign-in popup was closed or blocked."),
  });

  const GetUserProfile = async (tokenInfo) => {
    setErr("");
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      );
      localStorage.setItem("user", JSON.stringify(data));
      setOpenDialog(false);
      OnGenerateTrip();
    } catch {
      setErr("Couldn’t complete sign-in. Please try again.");
    }
  };

  const SaveAiTrip = async (tripData) => {
    setLoading(true);
    const docId = Date.now().toString();
    const user = JSON.parse(localStorage.getItem("user"));
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(tripData),
      userEmail: user.email,
      docId,
    });
    setLoading(false);
    navigate("/view-trip/" + docId);
  };

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }
    const errors = [];
    if (!formData.selectedLocation) errors.push("destination");
    if (!isValidDays) errors.push("trip days (1–30)");
    if (!formData.selectedBudget) errors.push("budget");
    if (!formData.selectedCompanion) errors.push("companion");

    if (errors.length) {
      toast.error(`Please complete: ${errors.join(", ")}.`);
      return;
    }

    setLoading(true);
    const Final_Prompt = generatePrompt({
      location: formData.selectedLocation.label,
      noOfDays: formData.tripDays,
      travelType: formData.selectedCompanion,
      budgetType: formData.selectedBudget,
    });

    try {
      const result = await chatSession.sendMessage(Final_Prompt);
      await SaveAiTrip(result?.response?.text());
    } catch {
      toast.error("Something went wrong while generating your trip.");
      setLoading(false);
    }
  };

  // Places lookup
  useEffect(() => {
    const fetchPlaces = async () => {
      if (inputValue.length < 3) return;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            inputValue
          )}`
        );
        const data = await response.json();
        setOptions(
          data.map((place) => ({
            value: place,
            label: place.display_name,
          }))
        );
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };
    const t = setTimeout(fetchPlaces, 400);
    return () => clearTimeout(t);
  }, [inputValue]);

  // react-select styles (glass + clear focus)
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      background: "rgba(255,255,255,0.75)",
      backdropFilter: "blur(10px)",
      borderRadius: 14,
      borderColor: state.isFocused ? "rgba(245,101,81,0.5)" : "rgba(255,255,255,0.7)",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(245,101,81,0.18)" : "none",
      minHeight: 48,
      paddingLeft: 4,
    }),
    menu: (base) => ({
      ...base,
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(10px)",
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 16px 36px rgba(0,0,0,0.08)",
    }),
    option: (base, state) => ({
      ...base,
      background: state.isFocused ? "rgba(245,101,81,0.08)" : "transparent",
      color: "#111827",
      cursor: "pointer",
    }),
    valueContainer: (b) => ({ ...b, paddingLeft: 8 }),
    singleValue: (b) => ({ ...b, color: "#111827" }),
    placeholder: (b) => ({ ...b, color: "#6B7280" }),
    input: (b) => ({ ...b, color: "#111827" }),
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-clip">
      {/* background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -inset-[20%] bg-[radial-gradient(60%_40%_at_50%_-10%,rgba(245,101,81,0.22),rgba(255,255,255,0)_60%),radial-gradient(35%_35%_at_80%_20%,rgba(6,182,212,0.18),rgba(255,255,255,0)_65%),radial-gradient(30%_30%_at_20%_30%,rgba(134,239,172,0.16),rgba(255,255,255,0)_70%)]" />
        <div className="absolute inset-0 mix-blend-multiply opacity-[0.05] [background-image:url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 md:px-10 lg:px-12 py-8">
        {/* Step ribbon */}
        <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10">
          <div className="flex flex-wrap items-center gap-2">
            {steps.map((s, i) => {
              const done =
                !!formData[s.key] && (s.key !== "tripDays" || isValidDays);
              return (
                <span
                  key={s.key}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm border ${
                    done
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      done ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  />
                  {i + 1}. {s.label}
                </span>
              );
            })}
          </div>
          <h2 className="mt-4 text-2xl md:text-3xl font-extrabold">
            Plan your next escape
          </h2>
          <p className="text-gray-600">
            A few quick choices and we’ll craft a tailored itinerary for you.
          </p>
        </div>

        {/* Top grid: Destination + Days only */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Destination */}
          <div className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10">
            <h3 className="text-lg font-semibold">Destination</h3>
            <p className="mb-3 text-sm text-gray-600">City, region, or landmark</p>
            <Select
              options={options}
              value={formData.selectedLocation}
              onInputChange={(v) => setInputValue(v)}
              onChange={(opt) => handleInputChange("selectedLocation", opt)}
              placeholder="Search for a destination…"
              isClearable
              styles={selectStyles}
            />
            {formData.selectedLocation && (
              <p className="mt-3 text-sm">
                Selected:{" "}
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700">
                  {formData.selectedLocation.label}
                </span>
              </p>
            )}
          </div>

          {/* Days */}
          <div className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10">
            <h3 className="text-lg font-semibold">Trip length</h3>
            <p className="mb-3 text-sm text-gray-600">Between 1 and 30 days</p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={30}
                value={formData.tripDays}
                onChange={(e) => handleInputChange("tripDays", e.target.value)}
                className={`w-40 rounded-xl border bg-white/80 p-2.5 outline-none transition ${
                  formData.tripDays === ""
                    ? "border-white/70"
                    : isValidDays
                    ? "border-emerald-300 ring-2 ring-emerald-100"
                    : "border-red-300 ring-2 ring-red-100"
                }`}
                placeholder="e.g., 5"
              />
              <span className="text-xs text-gray-500">
                Tip: shorter trips get tighter pacing.
              </span>
            </div>
            {!isValidDays && formData.tripDays !== "" && (
              <div className="mt-2 text-xs text-red-600">
                Enter a value from 1 to 30.
              </div>
            )}
          </div>
        </div>

        {/* Budget + Companion stacked vertically */}
        <div className="mt-8 flex flex-col gap-8">
          {/* Budget */}
          <div className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10">
            <h3 className="text-lg font-semibold">Budget</h3>
            <p className="mb-3 text-sm text-gray-600">
              We’ll balance hotels, activities, and transit to match this.
            </p>
            <BudgetSelector
              selectedBudget={formData.selectedBudget}
              setSelectedBudget={(v) => handleInputChange("selectedBudget", v)}
            />
          </div>

          {/* Companion */}
          <div className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10">
            <h3 className="text-lg font-semibold">Companion</h3>
            <p className="mb-3 text-sm text-gray-600">
              Tunes pacing and suggestions for your group.
            </p>
            <TravelCompanionSelector
              selectedCompanion={formData.selectedCompanion}
              setSelectedCompanion={(v) =>
                handleInputChange("selectedCompanion", v)
              }
            />
          </div>
        </div>

        {/* Spacer for sticky bar */}
        <div className="h-24" />
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40">
        <div className="mx-auto mb-4 w-[95%] max-w-5xl rounded-2xl border border-white/60 bg-white/80 p-3 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-white/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Summary */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full border px-3 py-1 text-gray-700">
                {formData.selectedLocation?.label || "Destination"}
              </span>
              <span className="rounded-full border px-3 py-1 text-gray-700">
                {formData.tripDays || "—"} days
              </span>
              <span className="rounded-full border px-3 py-1 text-gray-700">
                {formData.selectedBudget || "Budget"}
              </span>
              <span className="rounded-full border px-3 py-1 text-gray-700">
                {formData.selectedCompanion || "Companion"}
              </span>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2">
              <Button
                onClick={OnGenerateTrip}
                disabled={loading || !allValid}
                className={`relative overflow-hidden ${
                  allValid ? "bg-[#f56551] hover:bg-[#e25744]" : "opacity-60"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <AiOutlineLoading3Quarters className="h-5 w-5 animate-spin" />
                    Generating…
                  </span>
                ) : (
                  "Generate Trip"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sign-in dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md rounded-2xl border border-white/60 bg-white/85 p-0 backdrop-blur-md dark:border-white/10 dark:bg-white/10">
          <DialogHeader className="p-0">
            <DialogTitle className="sr-only">Sign in</DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col">
                <div className="flex items-center gap-3 rounded-t-2xl border-b border-white/60 bg-gradient-to-r from-[#fff7f6] to-white px-5 py-4 dark:from-white/5 dark:to-white/10">
                  <img src="/logo.svg" alt="" className="h-9 w-9" />
                  <div>
                    <h2 className="text-base font-bold">Nomadic Nest</h2>
                    <p className="text-xs text-gray-500">AI trip planner</p>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <p className="text-sm text-gray-600">
                    Sign in to sync trips, share with friends, and get personalized picks.
                  </p>

                  <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#f56551]" />
                      Save & revisit itineraries anytime
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#06b6d4]" />
                      Invite collaborators to your plan
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-[#22c55e]" />
                      Smarter recommendations over time
                    </li>
                  </ul>

                  <div className="my-4 flex items-center gap-3">
                    <span className="h-px flex-1 bg-gray-200" />
                    <span className="text-[11px] uppercase tracking-wider text-gray-400">
                      Continue with
                    </span>
                    <span className="h-px flex-1 bg-gray-200" />
                  </div>

                  <Button
                    onClick={login}
                    className="flex w-full items-center justify-center gap-3 border border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                  >
                    <FcGoogle className="h-5 w-5" />
                    Sign in with Google
                  </Button>

                  {err && (
                    <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                      {err}
                    </div>
                  )}

                  <p className="mt-4 text-[11px] text-gray-500">
                    By continuing, you agree to our{" "}
                    <a href="/terms" className="underline underline-offset-2">
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="underline underline-offset-2">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
