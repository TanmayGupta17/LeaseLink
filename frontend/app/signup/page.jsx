"use client";
import React from 'react';

const Page = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    try {
      const response = await fetch("http://localhost:8000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      console.log("Raw response:", response);
      const data = await response.json();
      console.log("Parsed response data:", data);
  
      if (response.ok) {
        console.log("Signup successful", data);
        // Redirect to the login page
        window.location.href = "/login";
      } else {
        console.error("Signup failed", data);
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred during signup");
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white">Create Account</h2>
        
        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-200">Full Name</label>
            <input 
              id="name"
              type="text" 
              className="w-full px-3 py-2 text-black bg-gray-100 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="John Doe"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
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
            <p className="text-xs text-gray-400">Must be at least 8 characters</p>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-200'>Already have an Account?<a href='/login' className='text-blue-500 underline'>Login</a></label>
          </div>
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;