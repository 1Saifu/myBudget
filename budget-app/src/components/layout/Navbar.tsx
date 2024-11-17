"use client"; 

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import LocalStorageKit from "@/utils/localStorageKit";
import Logout from '../auth/logout';

const Navbar: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = LocalStorageKit.get('@library/token');
        setToken(storedToken);
    }, []);

    return (
        <nav className="navbar">
            <div className="flex justify-between items-center text-white text-xl font-light font-bold m-7">
                <div className="flex gap-4">
                    {!token && (
                        <Link href="/" className="mr-4 hover:text-gray-300">Home</Link>
                    )}
                    {token && (
                        <>
                            <Link href="/dashboard" className="mr-4 hover:text-gray-300">Dashboard</Link>
                            <Link href="/expense-summary" className="mr-4 hover:text-gray-300">View Chart</Link>
                        </>
                    )}
                </div>                
                <div className="ml-auto flex gap-4">
                    {!token ? (
                        <>
                            <Link href="/login" className="mr-4 hover:text-gray-300">Login</Link>
                            <Link href="/register" className="mr-4 hover:text-gray-300">Register</Link>
                        </>
                    ) : (
                        <>
                            <Logout />
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;