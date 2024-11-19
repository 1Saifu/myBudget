"use client"

import React, { useState } from "react";
import CreateCategory from "./createCategory";


  const CreateCategoryModal: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="inline-flex flex-col justify-center items-center py-10 px-10 text-lg font-light rounded-lg text-white bg-transparent border-2 border-gray-400 focus:outline-none mb-6 w-48 h-48 transition-transform transform hover:scale-110 hover:shadow-lg focus:shadow-none z-10"
                style={{ position: 'relative', zIndex: 1 }}
            >
                <img
                    src="/add_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
                    alt="Add Category"
                    className="w-12 h-12"
                />
                <span className="mt-2 text-sm">Add Category</span>
            </button>

            {showModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-[rgba(41, 41, 41, 0.9)] z-50">
                    <div className="bg-gray-950 p-6 rounded-md shadow-[0_4px_10px_rgba(200,200,200,0.1)] max-w-sm w-full z-60">
                        <CreateCategory />
                        <div className="mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-light rounded-full text-white bg-transparent border-2 border-white hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateCategoryModal;
