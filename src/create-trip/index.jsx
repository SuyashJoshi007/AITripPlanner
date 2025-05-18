import React, { useState, useEffect } from "react";
import Select from "react-select";
import BudgetSelector from "@/components/ui/custom/buget";
import TravelCompanionSelector from "@/components/ui/custom/TravelCompanion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generatePrompt } from "@/components/ui/custom/options"; // Adjust the import path as necessary
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { set } from "mongoose";
import { useNavigate } from "react-router-dom";

// Adjust the import path as necessary
function CreateTrip() {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [formData, setFormData] = useState({
    selectedLocation: null,
    tripDays: "",
    selectedBudget: null,
    selectedCompanion: null,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (name, value) => {
    if (name === "tripDays" && value < 0) {
      console.log("Trip days cannot be negative.");
      return;
    }
    if (name === "tripDays" && value > 30) {
      console.log("Trip days cannot exceed 30.");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log("Form Data Updated:", formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const GetUserProfile = async (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        setOpenDialog(false);
        OnGenerateTrip();
      });
  };

  const SaveAiTrip = async (tripData) => {
    setLoading(true);
    const docId = Date.now().toString();
    const user = JSON.parse(localStorage.getItem("user"));
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(tripData),
      userEmail: user.email,
      docId: docId,
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
    if (formData.tripDays < 0 || formData.tripDays > 30) {
      console.log("Trip days should be between 0 and 30.");
      toast("Please fill all fields before generating a trip.");
      return;
    }
    if (
      !formData.selectedLocation ||
      !formData.tripDays ||
      !formData.selectedBudget ||
      !formData.selectedCompanion
    ) {
      console.log("Please fill all fields before generating a trip.");
      toast("Please fill all fields before generating a trip.");

      return;
    }
    setLoading(true)
    const Final_Prompt = generatePrompt({
      location: formData.selectedLocation.label,
      noOfDays: formData.tripDays,
      travelType: formData.selectedCompanion,
      budgetType: formData.selectedBudget,
    });
    console.log("Final Prompt:", Final_Prompt);

    const result = await chatSession.sendMessage(Final_Prompt);
    console.log(result?.response?.text());
  
    SaveAiTrip(result?.response?.text());
    setLoading(false);
  };
  useEffect(() => {
    const fetchPlaces = async () => {
      if (inputValue.length < 3) return;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${inputValue}`
        );
        const data = await response.json();

        const formattedOptions = data.map((place) => ({
          value: place,
          label: place.display_name,
        }));

        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchPlaces();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        {/* Location Selection */}
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is the destination of your choice?
          </h2>
          <Select
            options={options}
            value={formData.selectedLocation}
            onInputChange={(value) => setInputValue(value)}
            onChange={(selectedOption) =>
              handleInputChange("selectedLocation", selectedOption)
            }
            placeholder="Search for a destination..."
            isClearable
          />
          {formData.selectedLocation && (
            <p className="mt-3 text-lg">
              Selected: {formData.selectedLocation.label} 
            </p>
          )}
        </div>

        {/* Trip Duration */}
        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip?
          </h2>
          <input
            type="number"
            value={formData.tripDays}
            onChange={(e) => handleInputChange("tripDays", e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Enter number of days"
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
          <BudgetSelector
            selectedBudget={formData.selectedBudget}
            setSelectedBudget={(value) =>
              handleInputChange("selectedBudget", value)
            }
          />
        </div>

        <div>
          <h2 className="text-xl my-3 pb-6 font-medium">
            Who do you plan on traveling with on your next adventure?
          </h2>
          <TravelCompanionSelector
            selectedCompanion={formData.selectedCompanion}
            setSelectedCompanion={(value) =>
              handleInputChange("selectedCompanion", value)
            }
          />
        </div>
      </div>

      <div className="my-10 flex justify-end">
  <Button onClick={OnGenerateTrip} disabled={loading}>
    {loading ? (
      <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
    ) : (
      "Generate Trip"
    )}
  </Button>
</div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.png" alt="App Logo" className="w-15 h-auto" />
              <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
              Sign in to google authentication securly
              <Button
                onClick={login}
                className="w-full mt-5 flex gap-4 items-center"
              >
            
                  <FcGoogle className="h-7 w-7" />
                  Sign In With Google
            
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
