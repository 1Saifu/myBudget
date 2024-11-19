import React from 'react';
import Navbar from '../../components/layout/Navbar';
import CreateCategoryModal from '../../components/category/createCategoryModal';
import AddBudget from '../../components/budget/addBudget';
import CategoryList from "../../components/category/CategoryList"; 
import BudgetDisplay from "../../components/budget/BudgetDisplay";

const Dashboard: React.FC = () => {
    return (
        <div>
          <Navbar />
          <main className="p-4">
            <div className="flex flex-wrap gap-6 items-start">
              <div className="flex-shrink-0">
                <CreateCategoryModal />
              </div>
              
              <div className="flex-grow">
                <CategoryList />
              </div>

              <div className="mt-6 flex justify-center w-full"> 
              <div className="w-full max-w-4xl">              
              <BudgetDisplay />
              </div>
              </div>

            </div>
            <AddBudget />
          </main>
        </div>
      );
};

export default Dashboard;