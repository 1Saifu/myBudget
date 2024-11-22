"use client";

import React, {useState} from "react";
import ExpenseModal from "../expense/expenseModal"; 

interface CategoryCardProps {
  id: string;
  name: string;
  bgColor: string;
  onOpenModal: (categoryId: string) => void;
}

const categoryCard: React.FC<CategoryCardProps> = ({ id, name, onOpenModal, bgColor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleExpenseAdded = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div
      className={`${bgColor} text-white p-6 rounded-md shadow-md flex flex-col justify-between items-center h-[180px] w-72`}
    >
      <h3 className="text-4xl font-light mb-4 text-center">{name}</h3>
      <button
         onClick={handleOpenModal}
        className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-[30px] w-[190px] font-light hover:bg-white hover:text-gray-300  transition duration-300"
      >
        Add Expense
      </button>
      {isModalOpen && (
        <ExpenseModal
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onExpenseAdded={handleExpenseAdded}
          categoryId={id} 
        />
      )}
    </div>
  );
};

export default categoryCard;
