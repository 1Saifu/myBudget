"use client";

import React, { useState,useEffect } from "react";
import BudgetModal from "./BudgetModal"; 
import LocalStorageKit from "@/utils/localStorageKit";


const addBudget: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [budgetCreated, setBudgetCreated] = useState(false);


  useEffect(() => {
    const savedBudgetCreated = LocalStorageKit.get("@library/budgetData");
    if (savedBudgetCreated) {
      setBudgetCreated(true);
    } else {
      setBudgetCreated(false);
    }
  }, []);


  const handleBudgetCreationSuccess = () => {
    setBudgetCreated(true);
    setIsModalOpen(false);  
  };

  const openModal = () => {
    setIsModalOpen(true);
    checkUserBudget(); 
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

//This checks if a user has a budget which will be used when you have a budget then the add budget button will not be needed
  const checkUserBudget = async () => {
    const userId = LocalStorageKit.get("@library/userId");

    if (!userId) {
      console.log("No user ID found.");
      return;
    }

    try {
      const response = await fetch(`/api/budget`, {
        method: 'GET',
        headers: {
          'user-id': userId,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Fetched Budget:', data);

      if (response.ok && data && data.length > 0) {
        LocalStorageKit.set('@library/budgetData', data); 
        setBudgetCreated(true); 
      } else {
        LocalStorageKit.remove('@library/budgetData'); 
        setBudgetCreated(false); 
      }
    } catch (error) {
      console.error("Error fetching budget details:", error);
    }
};

  return (
    <div className="flex justify-center items-center">
      {!budgetCreated && (
        <button
          onClick={openModal}
          className="bg-transparent border-2 my-5 border-white text-white px-6 py-2 rounded-[30px] w-[300px] font-light w-[200px] hover:bg-purple-600 hover:text-gray-300 hover:border-gray-600 transition duration-300"
        >
          Add Budget
        </button>
      )}

      <BudgetModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onBudgetCreated={handleBudgetCreationSuccess} 
      />
    </div>
  );
};

export default addBudget;
