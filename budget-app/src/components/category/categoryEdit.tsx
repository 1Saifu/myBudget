"use client";

import React, { useState } from "react";

interface CategoryEditProps {
    categoryId: string;
    categoryName: string;
    onClose: () => void;
    onCategoryUpdated: (updatedCategory: { id: string; name: string }) => void;
  }

  const categoryEdit: React.FC<CategoryEditProps> = ({ categoryId, categoryName, onClose, onCategoryUpdated, }) => {
    const [name, setName] = useState<string>(categoryName);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!name) {
          alert("Name is required");
          return;
        }
    
        setIsSubmitting(true);
    
        try {
          const response = await fetch(`/api/categories/${categoryId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
          });
    
          if (response.ok) {
            const updatedCategory = await response.json();
            onCategoryUpdated(updatedCategory);
            window.location.reload();
            onClose();
          } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
          }
        } catch (error) {
          console.error("Error updating category:", error);
        } finally {
          setIsSubmitting(false);
        }
      };
      

      return (
        <div className="fixed inset-0 flex justify-center items-center bg-[rgba(41, 41, 41, 0.9)] z-50 backdrop-blur-sm">
        <div className="relative bg-[rgb(38, 0, 77)] p-6 rounded-md max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-light text-white mb-4">Update Category</h2>
    
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="categoryName" className="block text-sm font-light text-white">
                  Category Name
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category name"
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
                {isSubmitting ? "Submitting..." : "Update Category"}
              </button>
            </form>
    
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-2 text-white hover:text-gray-500"
            >
              x
            </button>
          </div>
        </div>
      );
};

export default categoryEdit;
