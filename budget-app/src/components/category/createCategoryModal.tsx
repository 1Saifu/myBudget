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
                <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
                        <CreateCategory />
                        <div className="mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-0 right-2 p-2 text-white hover:text-gray-500"
                                >
                                x
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateCategoryModal;
