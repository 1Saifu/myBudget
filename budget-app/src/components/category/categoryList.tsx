"use client";

import React, { useState, useEffect } from "react";
import CategoryCard from "./categoryCard";
import LocalStorageKit from "@/utils/localStorageKit";

interface Category {
  id: string;
  name: string;
}

const getRandomColor = (): string => {
  const colors = [
    "bg-violet-700",
    "bg-rose-600",
    "bg-indigo-800",
    "bg-teal-600",
    "bg-yellow-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const categoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryColors, setCategoryColors] = useState<{ [key: string]: string }>({}); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setError(null);

      const userId = LocalStorageKit.get("@library/userId");
      if (!userId) {
        setError("User ID is required. Please log in.");
        return;
      }

      try {
        const response = await fetch("/api/categories", {
          headers: {
            "user-id": userId,
          },
        });

        if (response.ok) {
          const data: Category[] = await response.json();
          setCategories(data);

          const newCategoryColors: { [key: string]: string } = {};
          data.forEach((category) => {
            if (!categoryColors[category.id]) {
              newCategoryColors[category.id] = getRandomColor();
            }
          });
          setCategoryColors((prevColors) => ({
            ...prevColors,
            ...newCategoryColors,
          }));
        } else {
          const error = await response.json();
          setError(error.message);
        }
      } catch (err) {
        setError("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryUpdated = (updatedCategory: Category) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };


  const handleCategoryDeleted = (categoryId: string) => {
    setCategories((prevCategories) =>
      prevCategories.filter((category) => category.id !== categoryId)
    );
  };

  const handleOpenModal = (categoryId: string) => {
    console.log("Open modal for category:", categoryId);
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          id={category.id}
          name={category.name}
          bgColor={categoryColors[category.id]}
          onOpenModal={handleOpenModal}
          onCategoryUpdated={handleCategoryUpdated}
          onCategoryDeleted={handleCategoryDeleted}
        />
      ))}
    </div>
  );
};

export default categoryList;
