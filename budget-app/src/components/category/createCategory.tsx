"use client";

import React, { useState } from "react";
import LocalStorageKit from "../../utils/localStorageKit";

const createCategory: React.FC = () => {

    const [name, setName] = useState<string>(""); 
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userId = LocalStorageKit.get("@library/userId");
        console.log("User ID:", userId);

        if (!userId) {
          alert("User ID is required. Please log in.");
          return;
        }

        setIsSubmitting(true);

        try {
          const response = await fetch("/api/categories", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "user-id": userId, 
            },
            body: JSON.stringify({ name }),          
          });
    
          if (response.ok) {
            alert("Category created successfully!");
            setName("");
            window.location.reload();
          } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
          }
        } catch (error) {
          console.error("Error creating category:", error);
        } finally {
          setIsSubmitting(false);
        }
      };

        return (
                <div className="bg-[rgb(38, 0, 77)] p-6 rounded-md max-w-sm w-full">
                <h2 className="text-lg font-light text-white mb-4">Create a New Category</h2>
    
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
                    {isSubmitting ? "Submitting..." : "Create Category"}
                    </button>
                </form>
            </div>
        );
}

export default createCategory;