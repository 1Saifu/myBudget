"use client";

import React, {useState} from "react";
import ExpenseModal from "../expense/expenseModal"; 
import CategoryEdit from "./categoryEdit";

interface CategoryCardProps {
  id: string;
  name: string;
  bgColor: string;
  onOpenModal: (categoryId: string) => void;
  onCategoryUpdated: (updatedCategory: { id: string; name: string }) => void;
  onCategoryDeleted: (id: string) => void;
}

const categoryCard: React.FC<CategoryCardProps> = ({ id, name, onOpenModal, bgColor, onCategoryDeleted, onCategoryUpdated, }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleExpenseAdded = () => {
    setIsModalOpen(false);
  };

  const handleDeleteCategory = async () => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          onCategoryDeleted(id);
          window.location.reload();
          alert("Category deleted successfully");
        } else {
          const error = await response.json();
          alert(`Error: ${error.message}`);
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };
  
  return (
    <div
      className={`${bgColor} text-white p-6 rounded-md shadow-md flex flex-col justify-between items-center h-[220px] w-72`}
    >
      <h3 className="text-4xl font-light mb-4 text-center">{name}</h3>
      
      <button
        onClick={handleOpenModal}
        className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-[30px] w-[190px] font-light hover:bg-white hover:text-gray-300 transition duration-300"
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

      <div className="mt-4 flex gap-4">
        <button
          onClick={handleOpenEditModal}
          className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-[30px] font-light hover:bg-white hover:text-gray-300 transition duration-300"
        >
          Edit
        </button>

        <button
          onClick={handleDeleteCategory}
          className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-[30px] font-light hover:bg-white hover:text-gray-300 transition duration-300"
        >
          Delete
        </button>
      </div>

      {isEditModalOpen && (
        <CategoryEdit
          categoryId={id}
          categoryName={name}
          onClose={handleCloseEditModal}
          onCategoryUpdated={onCategoryUpdated}
        />
      )}
    </div>
  );
};

export default categoryCard;
