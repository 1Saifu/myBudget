import React, { useState, useEffect } from "react";
import DatePicker from "../../components/ui/datePicker";

interface BudgetEditProps {
    isOpen: boolean;
    onClose: () => void;
    budget: { id: string; amount: number; startDate: string; endDate: string };
    onBudgetUpdated: () => void;
  }
  

const budgetEdit: React.FC<BudgetEditProps> = ({ isOpen, onClose, budget, onBudgetUpdated, }) => {
    const [amount, setAmount] = useState<number>(budget.amount);
    const [dateRange, setDateRange] = useState({
      startDate: new Date(budget.startDate),
      endDate: new Date(budget.endDate),
      key: "selection",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/budget/${budget.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount,
                startDate: dateRange.startDate.toISOString(),
                endDate: dateRange.endDate.toISOString(),
              }),
            });
      
            if (!response.ok) throw new Error("Failed to update budget");
            onBudgetUpdated();
            window.location.reload()
            onClose();
          } catch (err: any) {
            alert(`Error: ${err.message}`);
          } finally {
            setIsSubmitting(false);
          }
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
      <h2 className="text-lg font-light text-white mb-4">Edit Budget</h2>
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
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 bg-transparent text-white"
            required
          />
        </div>
        <button
          type="submit"
          className={`inline-flex justify-center py-1 px-3 text-sm font-light rounded-[80px] text-white bg-transparent border-2 border-white hover:bg-white hover:text-black focus:outline-none focus:ring-2 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Update Budget"}
        </button>
      </form>
    </div>
  </div>
)
}
export default budgetEdit;
