import React from 'react';

// You can use a library like react-icons, or use SVGs directly
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa';

const PropertyCard = ({
  img,
  title,
  location,
  price,
  bedrooms,
  bathrooms,
  area,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-2xl max-w-sm">
      <img
        src={img}
        alt={title}
        className="w-full h-48 object-cover"
        onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }}
      />
      <div className="p-5">
        <div className="flex items-center mb-2 text-gray-500 text-sm">
          <FaMapMarkerAlt className="mr-1" />
          <span>{location}</span>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
        <div className="text-lg font-semibold text-indigo-600 mb-4">₹{price.toLocaleString()}</div>
        <div className="flex justify-between text-gray-600 text-sm">
          <div className="flex items-center">
            <FaBed className="mr-1" /> {bedrooms} Beds
          </div>
          <div className="flex items-center">
            <FaBath className="mr-1" /> {bathrooms} Baths
          </div>
          <div className="flex items-center">
            <FaRulerCombined className="mr-1" /> {area} sqft
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
