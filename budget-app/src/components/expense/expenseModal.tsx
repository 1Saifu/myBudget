"use client";

import React, { useState, useEffect } from "react";
import LocalStorageKit from "@/utils/localStorageKit";
import ExpenseEdit from "./expenseEdit";

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExpenseAdded: () => void; 
    categoryId: string; 
  }

  interface Expense {
    id: string;
    description: string;
    amount: string;
    categoryId: string; 
  }

 const expenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onExpenseAdded, categoryId, }) => {
    const [expenses, setExpenses] = useState<Expense[]>([{ id: "", description: "", amount: "", categoryId: categoryId }]);
    const [fetchedExpenses, setFetchedExpenses] = useState<Expense[]>([]);
    const [isEditing, setIsEditing] = useState<string | null>(null); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
      if (isOpen) {
        fetchExpenses();
      }
    }, [isOpen]);
  
    const fetchExpenses = async () => {
      const userId = LocalStorageKit.get("@library/userId");
      if (!userId) {
        setError("User ID is required. Please log in.");
        return;
      }
  
      try {
        const response = await fetch(`/api/expenses?categoryId=${categoryId}`, {
          method: "GET",
          headers: {
            "user-id": userId,
          },
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setFetchedExpenses(data);
        } else {
          setError(data.message || "Error fetching expenses.");
        }
      } catch (error: any) {
        setError("An error occurred while fetching expenses.");
        console.error(error);
      }
    };
    

    const handleInputChange = (index: number, field: 'description' | 'amount', value: string) => {
        const newExpenses = [...expenses];
        newExpenses[index][field] = value;
        setExpenses(newExpenses);
      };
    
      const addExpenseInput = () => {
        setExpenses([...expenses, {id: "", description: "", amount: "", categoryId: categoryId }]);
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const budgetData = LocalStorageKit.get("@library/budgetData");
        if (!budgetData) {
          setError("No budget found. Please create a budget first.");
          return;
        }
    
        const availableBudget = budgetData.amount;
        const totalExpense = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || "0"), 0);
    
        if (totalExpense > availableBudget) {
          setError("Total expenses exceed available budget.");
          return;
        }
    
    
        const userId = LocalStorageKit.get("@library/userId");
        if (!userId) {
          setError("User ID is required. Please log in.");
          return;
        }

        try {
            setIsSubmitting(true);
            setError("");
      
            for (const expense of expenses) {
              const { description, amount } = expense;

              if (!description || !amount) {
                setError("Both description and amount are required.");
                return;
              }

              console.log("Submitting Expense:", {
                description,
                amount: parseFloat(amount),
                categoryId,
              });
      
              
              const response = await fetch("/api/expenses", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "user-id": userId, 
                },
                body: JSON.stringify({
                  description,
                  amount: parseFloat(amount),
                  categoryId,
                }),
              });

              const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Error creating expense.");
          return;
        }
      }
      onExpenseAdded();
      window.location.reload();
    } catch (error: any) {
      setError("An error occurred while creating the expense.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (expenseId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this expense?");
      if (confirmed) {
    try {
      const response = await fetch(`/api/expenses/${expenseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Error deleting expense.");
        return;
      }

      setFetchedExpenses((prev) => prev.filter((expense) => expense.id !== expenseId));
      window.location.reload();
    } catch (err: any) {
      setError("An error occurred while deleting the expense.");
      console.error(err);
    }
  }
  };

  const handleEditSave = (updatedExpense: Expense) => {
    setFetchedExpenses((prev) =>
      prev.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense))
    );
    setIsEditing(null);
  };


  const handleCancelEdit = () => {
    setIsEditing(null);
  };

  if (!isOpen) return null;
      
return(
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="relative bg-[rgb(38, 0, 77)] p-6 rounded-md max-w-sm w-full shadow-lg">
    <button
      onClick={onClose}
      className="absolute top-0 right-0 p-2 text-white hover:text-gray-500"
    >
    X
    </button>

    <h2 className="text-lg font-light text-white mb-4">Add Expense</h2>

  {fetchedExpenses.length > 0 && (
  <div className="mb-4">
    <h3 className="text-md font-light text-white mb-2">Previous Expenses</h3>
    <ul className="text-white text-sm space-y-2">
      {fetchedExpenses.map((expense, index) => (
        <li key={index} className="border-b border-gray-500 pb-1 flex justify-between items-center">
          {isEditing === expense.id ? (
            <ExpenseEdit
              expense={expense}
              onSave={handleEditSave}
              onCancel={handleCancelEdit}
            />
          ) : (
            <>
              <div className="flex flex-grow gap-2">
                <span>{expense.description} - {expense.amount}kr</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(expense.id)}
                  className="text-yellow-500 hover:text-yellow-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  </div>
)}

  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    {expenses.map((expense, index) => (
    <div key={index} className="flex gap-2">
    <div>
      <label
      htmlFor={`description-${index}`}
      className="block text-sm font-light text-white"
      >
      Description
      </label>
      <input
      id={`description-${index}`}
      type="text"
      value={expense.description}
      onChange={(e) =>
        handleInputChange(index, "description", e.target.value)
      }
      placeholder="Enter description"
      className="w-full px-4 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 bg-transparent text-white"
      required
      />
      </div>


      <div>
        <label htmlFor={`amount-${index}`} className="block text-sm font-light text-white">
          Amount
        </label>
        <input
          id={`amount-${index}`}
          type="number"
          value={expense.amount}
          onChange={(e) =>
            handleInputChange(index, "amount", e.target.value)
          }
          placeholder="Enter amount"
          className="w-full px-4 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 bg-transparent text-white"
          required
          />
        </div>
      </div>
  ))}

      <button
        type="button"
        onClick={addExpenseInput}
        className="bg-transparent border-2 border-white text-white px-4 py-2 rounded-[30px] mt-2 hover:bg-white hover:text-black transition duration-300"
      >
        Add More
      </button>

      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}

      <button
        type="submit"
        className={`inline-flex justify-center py-1 px-3 text-sm font-light rounded-[80px] text-white bg-transparent border-2 border-white hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
          disabled={isSubmitting}
        >
        {isSubmitting ? "Submitting..." : "Add Expense"}
      </button>
    </form>
  </div>
</div>
)
}
export default expenseModal;
