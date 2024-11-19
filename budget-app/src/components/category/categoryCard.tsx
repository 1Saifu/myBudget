"use client";

import React from "react";

interface CategoryCardProps {
  id: string;
  name: string;
  bgColor: string;
  onOpenModal: (categoryId: string) => void;
}

const categoryCard: React.FC<CategoryCardProps> = ({ id, name, onOpenModal, bgColor }) => {
  
  return (
    <div
      className={`${bgColor} text-white p-6 rounded-md shadow-md flex flex-col justify-between items-center h-[180px] w-72`}
    >
      <h3 className="text-4xl font-light mb-4 text-center">{name}</h3>
      <button
        onClick={() => onOpenModal(id)}
        className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-[30px] w-[190px] font-light hover:bg-white hover:text-gray-300  transition duration-300"
      >
        Add Expense
      </button>
    </div>
  );
};

export default categoryCard;
