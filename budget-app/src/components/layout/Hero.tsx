"use client"

import Link from "next/link";
import React from "react";


const Hero: React.FC = () => {

    return (
        <div className="hero-container flex flex-col items-center justify-center min-h-screen text-center bg-cover bg-center">
            <h1 className="text-4xl font-light text-white mb-20">MyBudget</h1>
            <div className="flex gap-4 mb-4">
                <Link href="/login">
                    <button 
                        className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-[30px] font-light w-[200px] hover:bg-purple-600 hover:text-gray-300 hover:border-gray-600 transition duration-300"
                    >
                        Log In
                    </button>
                </Link>
                <Link href="/register">
                    <button 
                        className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-[30px] font-light w-[200px] hover:bg-purple-600 hover:text-gray-300 hover:border-gray-600 transition duration-300"
                    >
                        Register
                    </button>
                </Link>
            </div>
            <p className="text-lg font-light text-white">Please log in or register</p>
        </div>
    );
}

export default Hero;