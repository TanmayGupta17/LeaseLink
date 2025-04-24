"use client";
import React, { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

const Page = () => {
  const {login} = useContext(AuthContext);
  const [email,setEmail] = React.useState("");
  const [password,setPassword] = React.useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:8000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Login successful", data);
        login({ name: data.name, token: data.token }); // Call login from AuthContext
        window.location.href = "/allProperties"; // Redirect to the properties page
      } else {
        console.error("Login failed", data);
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login", error);
      alert("An error occurred during login");
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">Login</h2>
        
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email Address</label>
            <input 
              id="email" 
              type="email" 
              className="w-full px-3 py-2 text-black bg-gray-100 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="you@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
            <input 
              id="password" 
              type="password" 
              className="w-full px-3 py-2 text-black bg-gray-100 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Enter Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-200'>Don't have an Account?<a href='/signup' className='text-blue-500 underline'>SignUp</a></label>
          </div>
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;