import React from 'react';
import Navbar from '../../components/layout/Navbar';
import CreateCategoryModal from '../../components/category/createCategoryModal';
import AddBudget from '../../components/budget/addBudget';

const Dashboard: React.FC = () => {
    return (
        <div>
            <Navbar />
            <main className="p-4">
                <CreateCategoryModal />
                <AddBudget />
            </main>        
            </div>
    );
};

export default Dashboard;