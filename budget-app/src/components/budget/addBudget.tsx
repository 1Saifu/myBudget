"use client";

import React, { useState } from "react";
import LocalStorageKit from "../../utils/localStorageKit";

const addBudget: React.FC = () => {

    const [amount, setAmount] = useState<number | "">("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const userId = LocalStorageKit.get("@library/userId");
        console.log("User ID:", userId);
    
        if (!userId) {
          alert("User ID is required. Please log in.");
          return;
        }
    
        const budgetData = {
            amount: Number(amount),
            userId,
          };
    
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/budgets", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(budgetData),
            });
      
            if (response.ok) {
                alert("Budget created successfully!");
                setAmount("");
              } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
              }
            } catch (error) {
              console.error("Error creating budget:", error);
            } finally {
              setIsSubmitting(false);
            }
          };

          return (
            <div className="bg-[rgb(38, 0, 77)] p-6 rounded-md max-w-sm w-full">
              <h2 className="text-lg font-light text-white mb-4">Add Budget Amount</h2>
        
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-light text-white">
                    Budget Amount
                  </label>
                  <input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value) || "")}
                    placeholder="Enter budget amount"
                    className="w-full px-4 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 bg-transparent text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={`inline-flex justify-center py-1 px-3 text-sm font-light rounded-[80px] text-white bg-transparent border-2 border-white hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Add Budget"}
                </button>
              </form>
            </div>
          );
}

export default addBudget;