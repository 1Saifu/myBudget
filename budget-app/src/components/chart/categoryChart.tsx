"use client";

import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2"; 
import LocalStorageKit from "@/utils/localStorageKit";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"; 

ChartJS.register(ArcElement, Tooltip, Legend);

interface Expense {
    categoryId: string;
    amount: string;
  }
  
  interface Category {
    id: string;
    name: string;
  }

const categoryChart: React.FC = () => {
    const [chartData, setChartData] = useState<any>(null);
    const [error, setError] = useState<string>("");
    const [categories, setCategories] = useState<Record<string, string>>({});

    useEffect(() => {
      fetchCategoryNames();
      fetchExpenseData();
    }, []);

    useEffect(() => {
        if (categories && Object.keys(categories).length > 0) {
          fetchExpenseData();
        }
      }, [categories]); 
    

    const fetchCategoryNames = async () => {

        const userId = LocalStorageKit.get("@library/userId");
        if (!userId) {
          setError("User ID is required. Please log in.");
          return;
        }

        try {
        const response = await fetch(`/api/categories`, {
            method: "GET",
            headers: {
              "user-id": userId, 
              "Content-Type": "application/json",
            },
          }); 
          const categoryData = await response.json();
  
          if (response.ok) {
            const categoryMap = categoryData.reduce((acc: Record<string, string>, category: Category) => {
                acc[category.id] = category.name;  
                return acc;
            }, {});

            console.log("Mapped categories:", categoryMap);

            setCategories(categoryMap);
          } else {
            setError("Error fetching categories.");
          }
        } catch (error) {
          console.error("Error fetching category names:", error);
          setError("An error occurred while fetching category names.");
        }
      };

    const fetchExpenseData = async () => {
        const userId = LocalStorageKit.get("@library/userId");
        if (!userId) {
          setError("User ID is required. Please log in.");
          return;
        }
    
        try {
          const response = await fetch(`/api/expenses`, {
            method: "GET",
            headers: {
              "user-id": userId,
              "Content-Type": "application/json",
            },
          });

          const expenses = await response.json();

      if (response.ok) {
        aggregateData(expenses);
      } else {
        setError(expenses.message || "Error fetching expenses.");
      }
    } catch (error) {
      console.error("Error fetching expense data:", error);
      setError("An error occurred while fetching expense data.");
    }
  };

  const aggregateData = (expenses: Expense[]) => {
    const categoryTotals: Record<string, number> = {};

    expenses.forEach((expense) => {
        const { categoryId, amount } = expense;
        if (!categoryTotals[categoryId]) {
          categoryTotals[categoryId] = 0;
        }
        categoryTotals[categoryId] += parseFloat(amount);
      });

    const labels = Object.keys(categoryTotals).map((id) => {
        return categories[id] || `Unknown Category: ${id}`; 
        });
    const data = Object.values(categoryTotals);


    setChartData({
        labels,
        datasets: [
          {
            label: "Spending by Category",
            data,
            backgroundColor: [
              "rgba(75, 192, 192, 0.5)",
              "rgba(153, 102, 255, 0.5)",
              "rgba(255, 159, 64, 0.5)",
              "rgba(255, 99, 132, 0.5)",
              "rgba(54, 162, 235, 0.5)",
              "rgba(255, 205, 86, 0.5)",
              "rgba(201, 203, 207, 0.5)"
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 205, 86, 1)",
              "rgba(201, 203, 207, 1)"
            ],
            borderWidth: 1,
          },
        ],
      });
    };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="w-full max-w-lg mx-auto mt-8 p-4"> 
      <h2 className="text-2xl font-light text-white mb-8 text-center">Spending by Category</h2>
      {chartData ? (
        <div className="w-full max-w-s mx-auto">
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    padding: 20, 
                    font: {
                      size: 14,  
                    }
                  }
                },
              },
              cutout: "70%",
            }}
          />
        </div>
      ) : (
        <p className="text-white">Loading chart...</p>
      )}
    </div>
  );
  
  
}

export default categoryChart;
