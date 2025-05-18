import { DollarSign, Wallet, BadgeDollarSign } from "lucide-react";
import React from "react";
function BudgetSelector({ selectedBudget, setSelectedBudget }) {
    const budgets = [
      {
        id: "cheap",
        value: "cheap",
        title: "Budget",
        description: "Stay conscious of costs",
        icon: <Wallet size={32} />,
      },
      {
        id: "moderate",
        value: "moderate",
        title: "Moderate",
        description: "Keep cost on the average side",
        icon: <DollarSign size={32} />,
      },
      {
        id: "luxury",
        value: "luxury",
        title: "Luxury",
        description: "Don't worry about cost",
        icon: <BadgeDollarSign size={32} />,
      },
    ];
  
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <div
              key={budget.id}
              onClick={() => setSelectedBudget(budget.id)}
              className={`p-5 border rounded-lg flex flex-col items-center text-center cursor-pointer transition-all duration-300
                ${
                  selectedBudget === budget.id
                    ? "border-black shadow-lg"
                    : "border-gray-300 hover:border-black"
                }`}
            >
              <div className="mb-2 text-black">{budget.icon}</div>
              <h3 className="text-lg font-bold">{budget.title}</h3>
              <p className="text-gray-500">{budget.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default BudgetSelector;
  