"use client";
import React, { useEffect, useState } from 'react';
import UserCard from '@/Components/userCard';
import { Search, Filter, X, Users, Loader2, UserPlus, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const filters = [
    { id: 'all', label: 'All Users' },
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
    { id: 'admin', label: 'Admins' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'joinDate', label: 'Join Date' },
    { value: 'lastActive', label: 'Last Active' },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [users, searchTerm, activeFilter, sortBy, sortOrder]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login.');
      }
      
      const response = await fetch('http://localhost:8000/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Enhanced user data with status and additional fields
      const enhancedUsers = data.users.map(user => ({
        ...user,
        status: isUserActive(user) ? 'active' : 'offline',
        // Add default values for fields that might not exist in your API response
        joinDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
        lastActive: user.lastActivity? new Date(user.lastActivity).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }): 'N/A',
        role: user.role || (user.isAdmin ? 'Admin' : 'User'),
        location: user.location || 'Not specified',
      }));
      
      setUsers(enhancedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let result = [...users];
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name?.toLowerCase().includes(term) || 
        user.email?.toLowerCase().includes(term) ||
        user.role?.toLowerCase().includes(term) ||
        user.location?.toLowerCase().includes(term)
      );
    }
    
    // Apply filters
    if (activeFilter !== 'all') {
      switch (activeFilter) {
        case 'active':
          result = result.filter(user => user.status === 'active');
          break;
        case 'inactive':
          result = result.filter(user => user.status === 'offline');
          break;
        case 'admin':
          result = result.filter(user => user.role?.toLowerCase() === 'admin');
          break;
        default:
          break;
      }
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let valueA = a[sortBy] || '';
      let valueB = b[sortBy] || '';
      
      // Handle case-insensitive string comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }
      
      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredUsers(result);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const exportUsers = () => {
    const data = filteredUsers.map(user => ({
      Name: user.name,
      Email: user.email,
      Role: user.role,
      Status: user.status,
      'Join Date': user.joinDate,
      'Last Active': user.lastActivity,
      Location: user.location
    }));
    
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      Object.keys(data[0]).join(',') + '\n' +
      data.map(row => Object.values(row).join(',')).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isUserActive = (user) => {
    // Active if seen in last 5 minutes
    const FIVE_MIN = 5 * 60 * 1000;
    if (!user.lastActivity) return false;
  
    return new Date() - new Date(user.lastActivity) < FIVE_MIN;
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and monitor all users in your platform
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button 
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add New User
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white p-4 shadow-sm rounded-lg mb-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0">
            {/* Search Input */}
            <div className="relative md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search users by name, email..."
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 md:ml-6">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => handleFilterChange(filter.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    activeFilter === filter.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Sorting Options */}
            <div className="flex items-center ml-auto space-x-1">
              <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={handleSortChange}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-gray-700 rounded-md shadow-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} >
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={toggleSortOrder}
                className="p-2 rounded-md hover:bg-gray-100"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
          
          {/* Results Stats & Export */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>
                {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
                {activeFilter !== 'all' && ` in ${filters.find(f => f.id === activeFilter)?.label}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={fetchUsers} 
                className="flex items-center text-gray-600 hover:text-gray-800"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button 
                onClick={exportUsers} 
                className="flex items-center text-gray-600 hover:text-gray-800"
                disabled={filteredUsers.length === 0}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Loading, Error and Empty States */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <p className="mt-4 text-gray-500">Loading users...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-red-800">Error loading users</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button 
              onClick={fetchUsers}
              className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && filteredUsers.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-gray-100 p-3 rounded-full">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? `No users match your search for "${searchTerm}". Try a different search term.` 
                : 'No users match the selected filters.'}
            </p>
            <button
              onClick={clearSearch}
              className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* User Cards Grid */}
        {!isLoading && !error && filteredUsers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
                <Link href={`/AdminDashboard/${user._id}`} key={user._id}> 
              <UserCard 
                key={user._id} 
                name={user.name}
                email={user.email}
                avatar={user.avatar || "/api/placeholder/150/150"}
                phone={user.phone}
                location={user.location}
                position={user.role}
                joinDate={user.joinDate}
                status={user.status}
                stats={[
                  { label: "Last Active", value: user.lastActive },
                ]}
                actions={[
                  { 
                    label: "Edit", 
                    onClick: () => console.log("Edit user", user._id),
                    primary: true
                  },
                  { 
                    label: "View", 
                    onClick: () => console.log("View user", user._id) 
                  }
                ]}
              />
                </Link>
            ))}

          </div>
        )}

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
            <div className="flex flex-1 justify-between sm:hidden">
              <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
                  <span className="font-medium">{filteredUsers.length}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 ring-1 ring-inset ring-blue-600 focus:outline-offset-0">
                    1
                  </button>
                  <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;