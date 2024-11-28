"use client";

import React, { useState } from "react";

interface ExpenseEditProps {
    expense: {
      id: string;
      description: string;
      amount: string;
      categoryId: string;
    };
    onSave: (updatedExpense: { id: string; description: string; amount: string; categoryId: string; }) => void;
    onCancel: () => void;
}

const expenseEdit: React.FC<ExpenseEditProps> = ({ expense, onSave, onCancel }) => {
    const [description, setDescription] = useState(expense.description);
    const [amount, setAmount] = useState(expense.amount);
    const [categoryId, setCategoryId] = useState(expense.categoryId || ""); 
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async () => {
        if (!description || !amount) {
          setError("Description and amount are required.");
          return;
        }

        try {
            setIsSaving(true);
            setError("");
      
            const response = await fetch(`/api/expenses/${expense.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                description,
                amount: parseFloat(amount),
                categoryId,
              }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || "Error updating expense.");
                return;
              }
        
              const updatedExpense = await response.json();
              onSave(updatedExpense);
              window.location.reload();
            } catch (err: any) {
              setError("An error occurred while saving.");
              console.error(err);
            } finally {
              setIsSaving(false);
            }
          };

return(
    <div className="flex flex-col gap-4">
    {error && <div className="text-red-500 text-sm">{error}</div>}
    <div>
      <label className="block text-sm text-white">Description</label>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-4 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 bg-transparent text-white"
        />
    </div>
    <div>
      <label className="block text-sm text-white">Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 bg-transparent text-white"
      />
    </div>
    <div className="flex gap-2">
      <button
        onClick={handleSave}
        className={`bg-transparent border-2 border-white text-white px-4 py-2 rounded-[30px] hover:bg-white hover:text-black transition duration-300 ${
          isSaving ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>
      <button
        onClick={onCancel}
        className="bg-transparent border-2 border-gray-300 text-gray-300 px-4 py-2 rounded-[30px] hover:bg-gray-300 hover:text-black transition duration-300"
      >
        Cancel
      </button>
    </div>
  </div>
    );
}
export default expenseEdit;