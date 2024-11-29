"use client";

import React, { useState } from "react";
import LocalStorageKit from "../../utils/localStorageKit";
import DatePicker from "../ui/datePicker";

interface BudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBudgetCreated: () => void; 
  }

  const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, onBudgetCreated }) => {
    const [amount, setAmount] = useState<number | "">("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dateRange, setDateRange] = useState({
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const userId = LocalStorageKit.get("@library/userId");
        console.log("User ID:", userId);
    
        if (!userId) {
          alert("User ID is required. Please log in.");
          return;
        }

        if (!(dateRange.startDate instanceof Date) || !(dateRange.endDate instanceof Date)) {
          alert("Please select a valid date range.");
          return;
        }
    
        const budgetData = {
          amount: Number(amount),
          startDate: dateRange.startDate.toISOString(), 
          endDate: dateRange.endDate.toISOString(),
          userId,
        };

        console.log("Budget data being sent to the backend:", budgetData);
    
        setIsSubmitting(true);
    
        try {
          const response = await fetch("/api/budget", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(budgetData),
          });

          console.log("Response status:", response.status);
    
          if (response.ok) {
            alert("Budget created successfully!");
            LocalStorageKit.set("@library/budgetData", budgetData);
            setAmount("");
            window.location.reload();
            onBudgetCreated();
            onClose();          
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
    
      if (!isOpen) return null; 


      return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative bg-[rgb(38, 0, 77)] p-6 rounded-md max-w-sm w-full shadow-lg">
            <button
              onClick={onClose}
              className="absolute top-0 right-0 p-2 text-white hover:text-gray-500"
            >
              X
            </button>
    
            <h2 className="text-lg font-light text-white mb-4">Add Budget Amount</h2>
    
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label htmlFor="date-range" className="block text-sm font-light text-white">
                  Select Date Range
                </label>
                <DatePicker dateRange={dateRange} onChange={(range) => setDateRange(range)} />
              </div>

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
        </div>
      );
};

export default BudgetModal;
