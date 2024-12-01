"use client";

import React, { useState, useEffect } from "react";
import LocalStorageKit from "@/utils/localStorageKit";
import BudgetEdit from "./budgetEdit"

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
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);


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

          const handleDelete = async (id: string) => {
          const confirmed = window.confirm("Are you sure you want to delete this budget?");
          if (confirmed) {
          try {
            const response = await fetch(`/api/budget/${id}`, { 
              method: "DELETE" 
            });

            if (!response.ok) throw new Error("Failed to delete budget");
            alert("Budget deleted successfully!");
            window.location.reload()
            LocalStorageKit.remove("@library/budgetData");
            setBudgets(budgets.filter((budget) => budget.id !== id));
            } 
            catch (err: any) {
            alert(`Error: ${err.message}`);
            }
            };
          }
        
          const handleEdit = (budget: Budget) => {
            setSelectedBudget(budget);
            setIsEditModalOpen(true);
          };
      
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
                      <p className="text-2xl font-light">
                      Amount: {budget.amount} <span className="font-light">kr</span>
                      </p>
                      <p className="text-2xl font-light">
                      Remaining: {budget.remaining} <span className="font-light">kr</span>
                      </p>

                      <button
                onClick={() => handleEdit(budget)}
                className="bg-transparent border-2 my-4 border-white text-white px-6 py-2 rounded-[30px] w-[300px] font-light w-[200px] hover:bg-purple-600 hover:text-gray-300 hover:border-gray-600 transition duration-300 mr-4"
                >
                Edit
              </button>
              <button
                onClick={() => handleDelete(budget.id)}
                className="bg-transparent border-2 mt-1 border-white text-white px-6 py-2 rounded-[30px] w-[300px] font-light w-[200px] hover:bg-purple-600 hover:text-gray-300 hover:border-gray-600 transition duration-300"
                >
                Delete
              </button>
                    </div>
                  ))}
                </div>
              )}
              {isEditModalOpen && selectedBudget && (
              <BudgetEdit
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              budget={selectedBudget}
              onBudgetUpdated={() => {
              setBudgets((prev) =>
              prev.map((b) => (b.id === selectedBudget.id ? selectedBudget : b))
              );
              setIsEditModalOpen(false);
              }}
              />
              )}
            </div>
          );
  
}
export default budgetDisplay;
