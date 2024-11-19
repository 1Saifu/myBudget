"use client";

import React, { useState, useEffect } from "react";
import LocalStorageKit from "@/utils/localStorageKit";

interface Budget {
    id: string;
    amount: number;
    startDate: string;
    endDate: string;
    remaining: number;
  }

const budgetDisplay: React.FC = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchBudgets = async () => {
          setLoading(true);
          setError(null);

          try {
            const userId = LocalStorageKit.get("@library/userId");
            console.log("Fetched User ID:", userId);

            if (!userId) {
              throw new Error("User ID is not available");
            }

            const response = await fetch(`/api/budget`, {
                method: "GET", 
                headers: {
                  "Content-Type": "application/json",
                  "user-id": userId, 
                },
              });

              console.log("Response Status:", response.status);  

              if (!response.ok) {
                throw new Error("Failed to fetch budgets");
              }
              const data = await response.json();
              setBudgets(data); 
            } catch (err: any) {
              setError(err.message); 
            } finally {
              setLoading(false); 
            }
          };

          fetchBudgets();
        }, []);
      
        if (loading) return <div className="text-center text-white">Loading...</div>;
        if (error) return <div className="text-center text-white">Error: {error}</div>;      

        return (
            <div className="budget-display flex flex-col items-center justify-center text-white">
              <h2 className="text-4xl font-light mb-8">Your Budgets</h2>
              {budgets.length === 0 ? (
                <p className="text-2xl font-light">No budgets available</p>
              ) : (
                <div className="space-y-6">
                  {budgets.map((budget) => (
                    <div key={budget.id} className="text-center">
                      <h3 className="text-2xl font-light mb-2">
                        Budget from{" "}
                        {new Date(budget.startDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        to{" "}
                        {new Date(budget.endDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </h3>
                      <p className="text-xl font-light">Amount: ${budget.amount}</p>
                      <p className="text-xl font-light">Remaining: ${budget.remaining}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
  
}
export default budgetDisplay;
