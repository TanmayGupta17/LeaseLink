"use client";
import React, { useEffect, useState, useCallback } from "react";
import Propertycard from "@/Components/Propertycard";
import { 
  Building, 
  Loader2, 
  AlertTriangle, 
  Home, 
  Filter, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  Download, 
  Calendar, 
  TrendingUp,
  BellRing,
  Eye
} from "lucide-react";
import { toast } from "react-hot-toast";

const Page = (props) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New inquiry for Luxury Villa", isRead: false },
    { id: 2, message: "Rent payment due in 3 days", isRead: false },
    { id: 3, message: "Maintenance request submitted", isRead: true }
  ]);
  const [stats, setStats] = useState({
    totalValue: 0,
    occupancyRate: 0,
    averageRent: 0
  });

  const propertiesPerPage = 6;

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("http://localhost:8000/property/userproperties", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch properties");
      }

      setProperties(data.properties || []);
      
      // Calculate portfolio statistics
      if (data.properties && data.properties.length > 0) {
        const totalValue = data.properties.reduce((sum, prop) => sum + (Number(prop.price) || 0), 0);
        const occupied = data.properties.filter(prop => prop.status === "occupied").length;
        const occupancyRate = Math.round((occupied / data.properties.length) * 100);
        const averageRent = Math.round(totalValue / data.properties.length);
        
        setStats({
          totalValue,
          occupancyRate,
          averageRent
        });
      }
      
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError(err.message);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleAddProperty = () => {
    // Implementation would be added here
    toast.success("Add property feature coming soon!");
  };

  const handleDeleteProperty = (propertyId) => {
    // Implementation would be added here
    toast.success("Property deleted successfully!");
    // Filter out the deleted property from the state
    setProperties(properties.filter(property => property._id !== propertyId));
  };

  const handleExportData = () => {
    // Implementation would be added here
    toast.success("Exporting property data...");
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Filter properties by type and search query
  const filteredProperties = properties
    .filter(property => filterType === "all" || property.type === filterType)
    .filter(property => {
      const query = searchQuery.toLowerCase();
      return (
        property.title?.toLowerCase().includes(query) ||
        property.location?.toLowerCase().includes(query) ||
        property.type?.toLowerCase().includes(query)
      );
    });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortOrder) {
      case "price-high":
        return (b.price || 0) - (a.price || 0);
      case "price-low":
        return (a.price || 0) - (b.price || 0);
      case "alphabetical":
        return (a.title || "").localeCompare(b.title || "");
      case "newest":
      default:
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
  });

  // Paginate properties
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = sortedProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage);

  // Property types for filter
  const propertyTypes = ["all", ...new Set(properties.map(property => property.type))];

  // User avatar fallback
  const userAvatar = props.avatar || "/api/placeholder/100/100";

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top Stats Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Property Portfolio Dashboard</h1>
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <BellRing size={20} />
                {notifications.some(n => !n.isRead) && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-blue-800"></span>
                )}
              </button>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center gap-2">
              <img src={userAvatar} alt="User" className="w-10 h-10 rounded-full border-2 border-white/20" />
              <div className="hidden md:block">
                <p className="font-medium text-sm">{props.name || "Property Manager"}</p>
                <p className="text-xs text-blue-100">{props.position || "Real Estate Professional"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Portfolio Value</p>
                <h3 className="text-2xl font-bold text-gray-800">${stats.totalValue.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Occupancy Rate</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.occupancyRate}%</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <Home size={24} className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Average Rent</p>
                <h3 className="text-2xl font-bold text-gray-800">${stats.averageRent.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <Calendar size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img 
                src={userAvatar} 
                alt="User Avatar" 
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-50"
              />
              <span className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></span>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-800">{props.name || "Property Manager"}</h1>
              <p className="text-gray-500">{props.position || "Real Estate Professional"}</p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {properties.length} Properties
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Verified Agent
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Premium Plan
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mt-4 md:mt-0">
              <button 
                onClick={handleAddProperty}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 font-medium"
              >
                <Plus size={16} />
                Add Property
              </button>
              <button className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition duration-200 font-medium">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center">
              <Building size={20} className="text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Your Property Portfolio</h2>
            </div>
            
            <div className="flex w-full md:w-auto items-center gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button 
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition duration-200 flex items-center gap-1"
              >
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Filters</span>
                <ChevronDown size={16} className={`transform transition-transform ${isFilterExpanded ? 'rotate-180' : ''}`} />
              </button>
              <button 
                onClick={handleExportData}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition duration-200 flex items-center gap-1"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
          
          {/* Expanded Filter Options */}
          {isFilterExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-sm text-gray-500 mr-2">Property Type:</span>
                  <div className="inline-flex flex-wrap gap-2 mt-1">
                    {propertyTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleFilterChange(type)}
                        className={`px-3 py-1 text-sm rounded-full transition-all ${
                          filterType === type
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500 mr-2">Sort By:</span>
                  <div className="inline-flex flex-wrap gap-2 mt-1">
                    <button
                      onClick={() => handleSort("newest")}
                      className={`px-3 py-1 text-sm rounded-full transition-all ${
                        sortOrder === "newest"
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Newest
                    </button>
                    <button
                      onClick={() => handleSort("price-high")}
                      className={`px-3 py-1 text-sm rounded-full transition-all ${
                        sortOrder === "price-high"
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Price (High-Low)
                    </button>
                    <button
                      onClick={() => handleSort("price-low")}
                      className={`px-3 py-1 text-sm rounded-full transition-all ${
                        sortOrder === "price-low"
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Price (Low-High)
                    </button>
                    <button
                      onClick={() => handleSort("alphabetical")}
                      className={`px-3 py-1 text-sm rounded-full transition-all ${
                        sortOrder === "alphabetical"
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Alphabetical
                    </button>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-gray-500 mr-2">View:</span>
                  <div className="inline-flex gap-1 mt-1 border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-1 text-sm transition-all ${
                        viewMode === "grid"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-1 text-sm transition-all ${
                        viewMode === "list"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      List
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Properties Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <Loader2 size={36} className="text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Loading your properties...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center justify-center">
            <AlertTriangle size={36} className="text-red-500 mb-2" />
            <p className="text-red-600 font-medium">Error: {error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
              onClick={() => fetchProperties()}
            >
              Try Again
            </button>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center">
            <Home size={40} className="text-gray-400 mb-3" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No properties found</h3>
            <p className="text-gray-500 max-w-md mb-6">
              {searchQuery ? 
                `No properties match your search for "${searchQuery}".` : 
                filterType === "all" 
                  ? "You haven't added any properties to your portfolio yet." 
                  : `You don't have any "${filterType}" properties in your portfolio.`}
            </p>
            <button 
              onClick={handleAddProperty}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 font-medium flex items-center gap-2"
            >
              <Plus size={16} />
              Add Your First Property
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProperties.map((property) => (
              <div 
                className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden" 
                key={property._id}
              >
                <Propertycard
                  img={property.images?.[0] || "/api/placeholder/400/250"}
                  title={property.title || "No Title"}
                  location={property.location || "No Location"}
                  price={property.price || "N/A"}
                  type={property.type || "N/A"}
                  bedrooms={property.bedrooms || 0}
                  bathrooms={property.bathrooms || 0}
                  area={property.area || "N/A"}
                  leaseDuration={property.leaseDuration || "N/A"}
                  status={property.status || "vacant"}
                />
                <div className="flex justify-between p-4 bg-gray-50 border-t border-gray-100">
                  <button className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center gap-1 transition-colors">
                    <Eye size={14} />
                    <span>View Details</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProperty(property._id)}
                      className="text-gray-600 hover:text-red-600 text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProperties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-md object-cover" src={property.images?.[0] || "/api/placeholder/40/40"} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{property.title || "No Title"}</div>
                          <div className="text-sm text-gray-500">{property.bedrooms || 0} bd | {property.bathrooms || 0} ba | {property.area || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.location || "No Location"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {property.type || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${property.price?.toLocaleString() || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        property.status === "occupied" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {property.status === "occupied" ? "Occupied" : "Vacant"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button className="text-blue-600 hover:text-blue-900">View</button>
                        <button className="text-gray-600 hover:text-gray-900">Edit</button>
                        <button 
                          onClick={() => handleDeleteProperty(property._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredProperties.length > propertiesPerPage && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 bg-white border border-gray-200 rounded-md ${
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                } text-gray-500`}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                  } rounded-md`}
                >
                  {page}
                </button>
              ))}
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 bg-white border border-gray-200 rounded-md ${
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                } text-gray-500`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
      
      {/* Notification Panel - Hidden by default, would be shown when notification bell is clicked */}
      <div className="hidden fixed inset-0 bg-black bg-opacity-25 z-50 flex justify-end">
        <div className="bg-white w-full max-w-md h-full overflow-auto shadow-xl">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleMarkAllNotificationsAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Close panel</span>
                &times;
              </button>
            </div>
          </div>
          
          <div className="p-4">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`mb-3 p-3 rounded-lg ${
                  notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
                } border ${
                  notification.isRead ? 'border-gray-100' : 'border-blue-100'
                }`}
              >
                <p className={`text-sm ${notification.isRead ? 'text-gray-700' : 'text-blue-700 font-medium'}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;