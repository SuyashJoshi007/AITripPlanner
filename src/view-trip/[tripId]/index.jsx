import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "@/service/fireBaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import Infosection from "./component/Infosection";
import Hotels from "./component/Hotels";
import Itinerary from "./component/Itinerary";

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null); // Changed from [] to null for object

  useEffect(() => {
    const getTripData = async () => {
      try {
        const docRef = doc(db, "AITrips", tripId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setTrip(docSnap.data());
        } else {
          console.log("No such document!");
          toast("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        toast("Error fetching trip data.");
      }
    };

    if (tripId) {
      getTripData();
    }
  }, [tripId]);

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      <Infosection trip={trip} />
      <Hotels trip={trip} />
      <Itinerary trip={trip} />
      

    </div>
  );
}

export default Viewtrip;
