"use client";
import React, { useContext, useState, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import {
  Search,
  Filter,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Bell,
  Home,
  FileText,
  Shield,
  BarChart,
  Users,
  Database,
  AlertTriangle,
  Menu,
  X,
} from "lucide-react";


const PrivateNavbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext); // Consume AuthContext
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  
  // Filter state variables
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [propertyTypes, setPropertyTypes] = useState({
    apartment: false,
    house: false,
    condo: false,
    townhouse: false
  });
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [squareFootage, setSquareFootage] = useState({ min: '', max: '' });
  const [amenities, setAmenities] = useState({
    parking: false,
    pool: false,
    gym: false,
    petFriendly: false,
    furnished: false,
    airConditioning: false
  });
  const [virtualOptions, setVirtualOptions] = useState({
    virtualTour: false,
    virtualOpenHouse: false,
    videoAvailable: false
  });

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
    setIsFilterOpen(false);
    setIsAdminMenuOpen(false);
  }, []);

  const toggleFilter = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
    setIsDropdownOpen(false);
    setIsAdminMenuOpen(false);
  }, []);

  const toggleAdminMenu = useCallback(() => {
    setIsAdminMenuOpen((prev) => !prev);
    setIsDropdownOpen(false);
    setIsFilterOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    logout(); // Call logout from AuthContext
    window.location.href = "/login"; // Redirect to login page
    localStorage.removeItem('token'); // Remove token from local storage
    setIsDropdownOpen(false); // Close dropdown
    setIsFilterOpen(false); // Close filter
    setIsAdminMenuOpen(false); // Close admin menu
    setIsMobileMenuOpen(false); // Close mobile menu
  }, [logout]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value); // Update search query state
  }, []);

  const handleSearchSubmit = useCallback(() => {
    console.log("Search query:", searchQuery); // Handle search logic here
  }, [searchQuery]);

  // Filter handler functions
  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({ ...prev, [type]: value }));
  };

  const handlePropertyTypeChange = (type) => {
    setPropertyTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleBedroomsChange = (value) => {
    setBedrooms(value);
  };

  const handleBathroomsChange = (value) => {
    setBathrooms(value);
  };

  const handleSquareFootageChange = (type, value) => {
    setSquareFootage(prev => ({ ...prev, [type]: value }));
  };

  const handleAmenityChange = (amenity) => {
    setAmenities(prev => ({ ...prev, [amenity]: !prev[amenity] }));
  };

  const handleVirtualOptionChange = (option) => {
    setVirtualOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const clearAllFilters = () => {
    setPriceRange({ min: '', max: '' });
    setPropertyTypes({
      apartment: false,
      house: false,
      condo: false,
      townhouse: false
    });
    setBedrooms('');
    setBathrooms('');
    setSquareFootage({ min: '', max: '' });
    setAmenities({
      parking: false,
      pool: false,
      gym: false,
      petFriendly: false,
      furnished: false,
      airConditioning: false
    });
    setVirtualOptions({
      virtualTour: false,
      virtualOpenHouse: false,
      videoAvailable: false
    });
  };

  const applyFilters = () => {
    // Here you would implement the logic to filter properties based on the selected criteria
    console.log('Applying filters:', {
      priceRange,
      propertyTypes,
      bedrooms,
      bathrooms,
      squareFootage,
      amenities,
      virtualOptions
    });
    
    // Close the filter dropdown after applying
    setIsFilterOpen(false);
  };

  const isAdmin = user?.role === "Admin"; // Check if the user is an admin

  return (
    <div className="relative">
      <nav className="bg-white shadow-md py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  className="w-6 h-6"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path d="M9 22V12h6v10" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-blue-600">LeaseLink</span>
            </div>

            {/* Middle Section - Search Bar (when authenticated) or Nav Links (when public) */}
            {isAuthenticated ? (
              <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                <div className="relative w-full">
                  <div className="flex">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        placeholder="Search properties, locations..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                        onChange={(e) => {
                          handleSearchChange(e);
                          setIsAdminMenuOpen(false);
                          setIsFilterOpen(false);
                          setIsDropdownOpen(false);
                        }}
                        // onKeyPress={handleSearch} // Uncomment if you want to handle search on enter key press

                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <button
                      onClick={toggleFilter}
                      className="bg-gray-100 border border-l-0 border-gray-300 px-3 rounded-r-md hover:bg-gray-200 flex items-center"
                    >
                      <Filter className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                  
                  {/* Filter Dropdown */}
                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Filter Properties</h3>
                        <div className="border-b border-gray-200 pb-2"></div>
                      </div>
                      
                      {/* Price Range Filter */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
                        <div className="flex space-x-2">
                          <div className="w-1/2">
                            <label className="text-xs text-gray-500">Min Price</label>
                            <input 
                              type="number" 
                              placeholder="0" 
                              value={priceRange.min}
                              onChange={(e) => handlePriceChange('min', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div className="w-1/2">
                            <label className="text-xs text-gray-500">Max Price</label>
                            <input 
                              type="number" 
                              placeholder="1,00,000+" 
                              value={priceRange.max}
                              onChange={(e) => handlePriceChange('max', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Property Type Filter */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Property Type</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={propertyTypes.apartment}
                              onChange={() => handlePropertyTypeChange('apartment')}
                              className="rounded text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="text-sm text-gray-700">Apartment</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={propertyTypes.house}
                              onChange={() => handlePropertyTypeChange('house')}
                              className="rounded text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="text-sm text-gray-700">House</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={propertyTypes.condo}
                              onChange={() => handlePropertyTypeChange('condo')}
                              className="rounded text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="text-sm text-gray-700">Condo</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={propertyTypes.townhouse}
                              onChange={() => handlePropertyTypeChange('townhouse')}
                              className="rounded text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="text-sm text-gray-700">Townhouse</span>
                          </label>
                        </div>
                      </div>
                      
                      {/* Bedrooms & Bathrooms Filter */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Bedrooms & Bathrooms</h4>
                        <div className="flex space-x-4">
                          <div className="w-1/2 text-gray-700">
                            <label className="text-xs text-gray-500">Bedrooms</label>
                            <select 
                              value={bedrooms}
                              onChange={(e) => handleBedroomsChange(e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="">Any</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4+</option>
                            </select>
                          </div>
                          <div className="w-1/2">
                            <label className="text-xs text-gray-500">Bathrooms</label>
                            <select 
                              value={bathrooms}
                              onChange={(e) => handleBathroomsChange(e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="">Any</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4+</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      {/* Square Footage Filter */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Square Footage</h4>
                        <div className="flex space-x-2">
                          <div className="w-1/2">
                            <label className="text-xs text-gray-500">Min Sq.Ft</label>
                            <input 
                              type="number" 
                              placeholder="0" 
                              value={squareFootage.min}
                              onChange={(e) => handleSquareFootageChange('min', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div className="w-1/2">
                            <label className="text-xs text-gray-500">Max Sq.Ft</label>
                            <input 
                              type="number" 
                              placeholder="Any" 
                              value={squareFootage.max}
                              onChange={(e) => handleSquareFootageChange('max', e.target.value)}
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Amenities Filter */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Amenities</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={amenities.parking}
                              onChange={() => handleAmenityChange('parking')}
                              className="rounded text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="text-sm text-gray-700">Parking</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={amenities.pool}
                              onChange={() => handleAmenityChange('pool')}
                              className="rounded text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="text-sm text-gray-700">Pool</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={amenities.gym}
                              onChange={() => handleAmenityChange('gym')}
                              className="rounded text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="text-sm text-gray-700">Gym</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={amenities.petFriendly}
                              onChange={() => handleAmenityChange('petFriendly')}
                              className="rounded text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="text-sm text-gray-700">Pet Friendly</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={amenities.furnished}
                              onChange={() => handleAmenityChange('furnished')}
                              className="rounded text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="text-sm text-gray-700">Furnished</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={amenities.airConditioning}
                              onChange={() => handleAmenityChange('airConditioning')}
                              className="rounded text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="text-sm text-gray-700">Air Conditioning</span>
                          </label>
                        </div>
                      </div>
                      
                      {/* Virtual Options Filter
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Virtual Options</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={virtualOptions.virtualTour}
                              onChange={() => handleVirtualOptionChange('virtualTour')}
                              className="rounded text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="text-sm text-gray-700">Virtual Tour</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={virtualOptions.virtualOpenHouse}
                              onChange={() => handleVirtualOptionChange('virtualOpenHouse')}
                              className="rounded text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="text-sm text-gray-700">Virtual Open House</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={virtualOptions.videoAvailable}
                              onChange={() => handleVirtualOptionChange('videoAvailable')}
                              className="rounded text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="text-sm text-gray-700">Video Available</span>
                          </label>
                        </div>
                      </div> */}
                      
                      {/* Location Drawing Tool */}
                      {/* <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Location</h4>
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md flex items-center justify-center">
                          <span className="mr-2">Draw on Map</span>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                        </button>
                      </div> */}
                      
                      {/* Monthly Payment Calculator */}
                      {/* <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Monthly Payment Calculator</h4>
                        <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-md flex items-center justify-center">
                          <span className="mr-2">Calculate Monthly Payment</span>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div> */}
                      
                      {/* Filter Action Buttons */}
                      <div className="flex space-x-2 pt-2 border-t border-gray-200">
                        <button 
                          onClick={clearAllFilters}
                          className="w-1/2 bg-white text-gray-700 border border-gray-300 font-medium py-2 px-4 rounded-md hover:bg-gray-50"
                        >
                          Clear All
                        </button>
                        <button 
                          onClick={applyFilters}
                          className="w-1/2 bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
                <a
                  href="#features"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Contact
                </a>
              </div>
            )}

            {/* Right Section - Profile/Admin (when authenticated) or Sign In/Up (when public) */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>

              {isAuthenticated ? (
                <>
                  {/* Admin Badge/Button */}
                  {isAdmin && (
                    <div className="relative hidden md:block">
                      <button
                        onClick={toggleAdminMenu}
                        className="flex items-center space-x-2 bg-purple-100 text-purple-800 px-3 py-1.5 rounded-md hover:bg-purple-200 transition-colors"
                      >
                        <Shield className="h-4 w-4" />
                        <span className="text-sm font-medium">Admin</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>

                      {isAdminMenuOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <div className="px-4 py-2 border-b border-gray-100">
                              <p className="text-sm font-medium text-purple-800">
                                Admin Controls
                              </p>
                            </div>

                            <a
                              href="/analyticsDashboard"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <BarChart className="h-4 w-4 mr-3 text-gray-500" />
                              Analytics Dashboard
                            </a>

                            <a
                              href="/userManagement"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Users className="h-4 w-4 mr-3 text-gray-500" />
                              User Management
                            </a>

                            <a
                              href="/admin/properties"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Database className="h-4 w-4 mr-3 text-gray-500" />
                              Property Database
                            </a>

                            <a
                              href="/admin/reports"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <AlertTriangle className="h-4 w-4 mr-3 text-gray-500" />
                              Reports & Issues
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="relative">
                    <button
                      onClick={toggleDropdown}
                      className="flex items-center space-x-3 focus:outline-none"
                    >
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 mr-2 hidden md:inline">
                          Hi, {user?.name || "User"}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-500 hidden md:inline" />
                      </div>
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        <User className="h-5 w-5" />
                      </div>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">
                              {user?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user?.email || "user@example.com"}
                            </p>
                          </div>

                          <a
                            href="/DashBoard"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Home className="h-4 w-4 mr-3 text-gray-500" />
                            Dashboard
                          </a>

                          <a
                            href="/settings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Settings className="h-4 w-4 mr-3 text-gray-500" />
                            Settings
                          </a>

                          <div className="border-t border-gray-100">
                            <button
                              onClick={handleLogout}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            >
                              <LogOut className="h-4 w-4 mr-3 text-red-500" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <a
                    href="/login"
                    className="hidden md:inline-block text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Sign In
                  </a>
                  <a
                    href="/signup"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
                  >
                    Get Started
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default PrivateNavbar;
