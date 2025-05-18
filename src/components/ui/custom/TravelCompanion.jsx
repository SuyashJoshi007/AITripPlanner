import { FaPlane, FaGlassCheers, FaHome, FaShip } from "react-icons/fa";

function TravelCompanionSelector({ selectedCompanion, setSelectedCompanion }) {
    const companions = [
      {
        id: "solo",
        label: "Just Me",
        description: "A sole traveler in exploration",
        icon: <FaPlane size={30} />,
      },
      {
        id: "couple",
        label: "A Couple",
        description: "Two travel in tandem",
        icon: <FaGlassCheers size={30} />,
      },
      {
        id: "family",
        label: "Family",
        description: "A group of fun-loving adventurers",
        icon: <FaHome size={30} />,
      },
      {
        id: "friends",
        label: "Friends",
        description: "A bunch of thrill-seekers",
        icon: <FaShip size={30} />,
      },
    ];
  
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {companions.map((companion) => (
            <div
              key={companion.id}
              onClick={() => setSelectedCompanion(companion.id)}
              className={`p-5 border rounded-lg flex flex-col items-center text-center cursor-pointer transition-all duration-300
                ${
                  selectedCompanion === companion.id
                    ? "border-black shadow-lg "
                    : "border-gray-300 hover:border-black"
                }`}
            >
              <div className="mb-2 text-black">{companion.icon}</div>
              <h3 className="text-lg font-bold">{companion.label}</h3>
              <p className="text-gray-500">{companion.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default TravelCompanionSelector;
  