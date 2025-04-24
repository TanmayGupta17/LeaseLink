"use client";
import Propertycard from "@/Components/Propertycard";
import React, { useEffect, useState } from "react";

const AllPropertiesPage = () => {
  const [properties, setProperties] = useState([]); // State to store properties
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  // Fetch properties from the backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log("Fetching properties...");
  
        // Retrieve the token from localStorage or cookies
        const token = await localStorage.getItem("token"); // Replace with your token storage method
  
        const response = await fetch("http://localhost:8000/property/allproperty", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch properties: ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log("Fetched properties:", data); // Log the response
        setProperties(data.allProperties); // Access the correct array
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false
      }
    };
  
    fetchProperties();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
        <div className="loader"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
        <h1 className="text-red-500">Error: {error}</h1>
      </div>
    );
  }

  // Render no properties state
  if (properties.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
        <h1 className="text-red-500">No properties found</h1>
      </div>
    );
  }

  // Render properties
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">All Properties</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property._id} className="bg-white shadow-md rounded-lg p-4">
              <Propertycard
                img={property.images?.[0] || "https://via.placeholder.com/300"}
                title={property.title || "No Title"}
                location={property.location || "No Location"}
                price={property.price || "N/A"}
                type={property.type || "N/A"}
                bedrooms={property.bedrooms || 0}
                bathrooms={property.bathrooms || 0}
                area={property.area || "N/A"}
                leaseDuration={property.leaseDuration || "N/A"}
                />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default AllPropertiesPage;