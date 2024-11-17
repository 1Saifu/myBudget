"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LocalStorageKit from "@/utils/localStorageKit";

const registerForm: React.FC = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter(); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log("New registered user:", data);

                LocalStorageKit.set('@library/token', data.token);
                LocalStorageKit.set('@library/userId', data.userId);


                console.log('Token stored:', data.token); 
                console.log('User ID stored:', data.userId);

                router.push('/dashboard');
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return(
        <div className="flex justify-center items-center min-h-screen bg-cover bg-center">
            <form onSubmit={handleSubmit} className="p-6 bg-transparent">
                <h2 className="text-2xl font-light mb-4 text-white">Register</h2>
                <div className="mb-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Email Address"
                        className="w-full px-4 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 bg-transparent text-white"
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                        className="w-full px-4 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 bg-transparent text-white"
                    />
                </div>
                <button 
                    type="submit" 
                    className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-[30px] w-[300px] font-light hover:bg-purple-600 hover:text-gray-300 hover:border-gray-600 transition duration-300"
                >
                    Register
                </button>
                <p className="mt-4 text-center font-light text-white">
                    Already have an account? <Link href="/login" className="text-purple-600 hover:text-purple-800">Login here</Link>
                </p>
            </form>
        </div>
    );
}

export default registerForm;