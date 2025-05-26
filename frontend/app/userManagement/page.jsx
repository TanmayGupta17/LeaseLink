"use client"
import { useState, useEffect } from 'react';
import { 
  User, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Home, 
  CheckCircle,
  X,
  Search,
  Clock,
  Activity,
  CalendarClock,
  Eye,
  Building,
  BadgeCheck,
  UserCog,
  AlertCircle,
  Info
} from 'lucide-react';

// Toast component
const Toast = ({ message, type, onClose }) => {
  return (
    <div className={`fixed bottom-4 right-4 flex items-center p-4 rounded-md shadow-lg ${
      type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      <div className="mr-2">
        {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      </div>
      <p>{message}</p>
      <button onClick={onClose} className="ml-4">
        <X size={16} />
      </button>
    </div>
  );
};

// Modal component
const Modal = ({ title, children, isOpen, onClose, type }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className={`flex items-center justify-between p-4 border-b ${
          type === 'delete' ? 'bg-red-50' : 'bg-gray-50'
        }`}>
          <h3 className="text-lg font-medium">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard Component
export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [toast, setToast] = useState(null);
  const [editUserData, setEditUserData] = useState(null);
  const [editPropertyData, setEditPropertyData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyAction, setPropertyAction] = useState('edit'); // 'edit' or 'delete'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/allusers`, {
od: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data.users || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
        // If API fails, we could implement a fallback or retry mechanism here
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPropertiesForUser = async (userId) => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/properties?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }

    const data = await response.json();
    return data.properties || [];
  } catch (error) {
    console.error("Error fetching properties:", error);
    showToast(`Failed to fetch properties: ${error.message}`, "error");
    return [];
  } finally {
    setLoading(false);
  }
};

const fetchActivityLogsForUser = async (userId) => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    console.log("API URL:", `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/activitylog?userId=${userId}`); // Debugging
    console.log("Token:", token); // Debugging
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/activitylog?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch activity logs");
    }

    const data = await response.json();
    console.log("Fetched activity logs:", data); // Log the response
    return data.activity || [];
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    showToast(`Failed to fetch activity logs: ${error.message}`, "error");
    return [];
  } finally {
    setLoading(false);
  }
};

  const handleEditUser = async () => {
    if (!editUserData) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/UpdateUser/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editUserData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      // Update local state after successful API call
      const updatedUsers = users.map(user => 
        user._id === selectedUser._id ? { ...user, ...editUserData } : user
      );
      
      setUsers(updatedUsers);
      setSelectedUser({ ...selectedUser, ...editUserData });
      setIsEditModalOpen(false);
      showToast(`User ${selectedUser.name} has been updated successfully`);
    } catch (error) {
      console.error("Error updating user:", error);
      showToast(`Failed to update user: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/deleteUser/${selectedUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      // Update local state after successful API call
      const updatedUsers = users.filter(user => user._id !== selectedUser._id);
      setUsers(updatedUsers);
      setSelectedUser(null);
      setIsDeleteModalOpen(false);
      showToast(`User ${selectedUser.name} has been deleted`, 'success');
    } catch (error) {
      console.error("Error deleting user:", error);
      showToast(`Failed to delete user: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProperty = async () => {
    if (!editPropertyData || !selectedProperty) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/properties/${selectedProperty._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editPropertyData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update property');
      }
      
      // Update local state after successful API call
      const updatedProperties = selectedUser.properties.map(property => 
        property._id === selectedProperty._id ? { ...property, ...editPropertyData } : property
      );
      
      const updatedUser = { ...selectedUser, properties: updatedProperties };
      const updatedUsers = users.map(user => 
        user._id === selectedUser._id ? updatedUser : user
      );
      
      setUsers(updatedUsers);
      setSelectedUser(updatedUser);
      setIsPropertyModalOpen(false);
      showToast(`Property "${selectedProperty.name}" has been updated`);
    } catch (error) {
      console.error("Error updating property:", error);
      showToast(`Failed to update property: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/admin/properties/${selectedProperty._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete property');
      }
      
      // Update local state after successful API call
      const updatedProperties = selectedUser.properties.filter(property => 
        property._id !== selectedProperty._id
      );
      
      const updatedUser = { ...selectedUser, properties: updatedProperties };
      const updatedUsers = users.map(user => 
        user._id === selectedUser._id ? updatedUser : user
      );
      
      setUsers(updatedUsers);
      setSelectedUser(updatedUser);
      setIsPropertyModalOpen(false);
      showToast(`Property "${selectedProperty.name}" has been deleted`, 'success');
    } catch (error) {
      console.error("Error deleting property:", error);
      showToast(`Failed to delete property: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };

  const getRoleBadgeColor = (role) => {
  if (role === 'Admin') return 'bg-purple-200 text-purple-800';
  if (role === 'agent') return 'bg-blue-100 text-blue-800';
  return 'bg-gray-100 text-gray-800';
};
//getRoleBadgeColor
  const getStatusBadgeColor = (status) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getPropertyStatusColor = (status) => {
    const statusColors = {
      Active: 'bg-green-100 text-green-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Inactive: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleUserSelection = async (user) => {
    setSelectedUser(null); // Clear the previous selection
    const [properties, activityLogs] = await Promise.all([
      fetchPropertiesForUser(user._id), 
      fetchActivityLogsForUser(user._id), 
    ]);
    console.log("Fetched Activity Logs:", activityLogs); // Debugging
    setSelectedUser({ ...user, properties, activity: activityLogs }); 
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {/* <div className="hidden md:flex md:w-64 flex-col bg-white border-r">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4">
          <div className="mb-6">
            <h3 className="text-xs uppercase font-semibold text-gray-500 mb-3">Management</h3>
            <a href="#" className="flex items-center px-4 py-2 rounded-md bg-blue-50 text-blue-700 mb-1">
              <User size={18} className="mr-3" />
              <span>Users</span>
            </a>
            <a href="#" className="flex items-center px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 mb-1">
              <Home size={18} className="mr-3" />
              <span>Properties</span>
            </a>
          </div>
        </nav>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {loading && !users.length ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            </div>
          ) : error && !users.length ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p>Error loading users: {error}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Users List */}
              <div className={`bg-white rounded-lg shadow p-6 ${selectedUser ? 'w-full md:w-1/3' : 'w-full'}`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">All Users</h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border rounded-md text-sm w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[calc(100vh-240px)]">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">No users found</div>
                  ) : (
                    filteredUsers.map(user => (
                      <div 
                        key={user._id}
                        onClick={() => handleUserSelection(user)} // Use the new handler
                        className={`p-4 border rounded-md mb-3 cursor-pointer transition-colors ${
                          selectedUser?._id === user._id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                              {user.name?.charAt(0) || '?'}
                            </div>
                            <div className="ml-3">
                              <h3 className="font-medium text-gray-800">{user.name || 'Unnamed User'}</h3>
                              <p className="text-sm text-gray-500">{user.email || 'No email'}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className={`text-xs px-2.5 py-0.5 rounded-full ${getRoleBadgeColor(user.role)}`}>
                              {user.role || 'No role'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* User Details */}
              {selectedUser && (
                <div className="bg-white rounded-lg shadow p-6 w-full md:w-2/3">
                  {/* User Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl">
                        {selectedUser.name?.charAt(0) || '?'}
                      </div>
                      <div className="ml-4">
                        <h2 className="text-xl font-semibold text-gray-800">{selectedUser.name || 'Unnamed User'}</h2>
                        <p className="text-gray-500">{selectedUser.email || 'No email'}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setEditUserData(selectedUser);
                          setIsEditModalOpen(true);
                        }}
                        className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                      >
                        <Edit size={16} className="mr-2" />
                        Edit User
                      </button>
                      <button 
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="border-b mb-6">
                    <nav className="flex space-x-4">
                      <button
                        onClick={() => setActiveTab('info')}
                        className={`py-2 px-1 -mb-px ${
                          activeTab === 'info'
                            ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        User Information
                      </button>
                      <button
                        onClick={() => setActiveTab('properties')}
                        className={`py-2 px-1 -mb-px ${
                          activeTab === 'properties'
                            ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Properties ({selectedUser.properties?.length || 0})
                      </button>
                      <button
                        onClick={() => setActiveTab('activity')}
                        className={`py-2 px-1 -mb-px ${
                          activeTab === 'activity'
                            ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Activity Log
                      </button>
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="overflow-y-auto max-h-[calc(100vh-350px)]">
                    {/* User Info Tab */}
                    {activeTab === 'info' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 p-4 rounded-md">
                            <div className="flex items-center mb-2">
                              <UserCog size={18} className="mr-2 text-gray-500" />
                              <h3 className="font-medium text-gray-700">Role</h3>
                            </div>
                            <span className={`text-sm px-2.5 py-1 rounded-full ${getRoleBadgeColor(selectedUser.role)}`}>
                              {selectedUser.role || 'No role assigned'}
                            </span>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-md">
                            <div className="flex items-center mb-2">
                              <BadgeCheck size={18} className="mr-2 text-gray-500" />
                              <h3 className="font-medium text-gray-700">Status</h3>
                            </div>
                            <span className={`text-sm px-2.5 py-1 rounded-full ${getStatusBadgeColor(selectedUser.status)}`}>
                              {selectedUser.status || 'Unknown'}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="flex items-center mb-2">
                            <CalendarClock size={18} className="mr-2 text-gray-500" />
                            <h3 className="font-medium text-gray-700">Time Information</h3>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Last Login:</span>
                              <span className='text-gray-700'>{formatDate(selectedUser.lastActivity)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Account Created:</span>
                              <span className='text-gray-700'>{formatDate(selectedUser.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="flex items-center mb-2">
                            <Building size={18} className="mr-2 text-gray-500" />
                            <h3 className="font-medium text-gray-700">Property Statistics</h3>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Properties:</span>
                              <span className='text-gray-700'>{selectedUser?.properties?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Active Properties:</span>
                              <span className='text-gray-700'>{selectedUser?.properties?.filter(p => p.status === 'Active').length || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Properties Tab */}
                    {activeTab === 'properties' && (
                      <div>
                        {!selectedUser.properties || selectedUser.properties.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Building size={48} className="mx-auto mb-4 opacity-30" />
                            <p>This user has no properties listed</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {selectedUser.properties.map(property => (
                              <div key={property._id} className="border rounded-md p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium text-gray-800">{property.title || 'Unnamed Property'}</h3>
                                    <p className="text-sm text-gray-600">{property.location || 'No address'}</p>
                                    <div className="flex items-center mt-2">
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                                        {property.type || 'No type'}
                                      </span>
                                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getPropertyStatusColor(property.status)}`}>
                                        {property.status || 'No status'}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button 
                                      onClick={() => {
                                        setSelectedProperty(property);
                                        setEditPropertyData(property);
                                        setPropertyAction('edit');
                                        setIsPropertyModalOpen(true);
                                      }}
                                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setSelectedProperty(property);
                                        setPropertyAction('delete');
                                        setIsPropertyModalOpen(true);
                                      }}
                                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Activity Log Tab */}
                    {activeTab === 'activity' && (
                      <div className="space-y-4">
                        {console.log("Activity Logs in Tab:", selectedUser.activity)} {/* Debugging */}
                        {!selectedUser.activity || selectedUser.activity.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <Activity size={48} className="mx-auto mb-4 opacity-30" />
                            <p>No activity recorded for this user</p>
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />
                            {selectedUser.activity.map((activity, index) => (
                              <div key={activity._id} className="ml-10 relative mb-6">
                                <div className="absolute -left-10 mt-1.5 w-5 h-5 rounded-full bg-blue-50 border-2 border-blue-500 z-10" />
                                <div className="flex items-center mb-1">
                                  <Clock size={14} className="mr-2 text-gray-400" />
                                  <span className="text-sm text-gray-500">
                                    {formatDate(activity.timestamp)}
                                  </span>
                                </div>
                                <p className="text-gray-800">{activity.action || 'Unknown action'}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Edit User Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
      >
        {editUserData && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={editUserData.name || ''}
                onChange={(e) => setEditUserData({...editUserData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-md text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={editUserData.email || ''}
                onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                className="w-full px-3 py-2 border rounded-md text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={editUserData.role || ''}
                onChange={(e) => setEditUserData({...editUserData, role: e.target.value})}
                className="w-full px-3 py-2 border rounded-md text-gray-700"
              >
                <option value="">Select a role</option>
                <option value="user">User</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editUserData.status || ''}
                onChange={(e) => setEditUserData({...editUserData, status: e.target.value})}
                className="w-full px-3 py-2 border rounded-md text-gray-700"
              >
                <option value="">Select a status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete User Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
        type="delete"
      >
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Are you sure you want to delete this user?</p>
              <p className="text-gray-600 mt-1">This action cannot be undone. All properties and data associated with this user will be permanently removed.</p>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="font-medium text-gray-800">{selectedUser?.name || 'Unnamed User'}</p>
            <p className="text-gray-600">{selectedUser?.email || 'No email'}</p>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Property Modal */}
      <Modal 
        isOpen={isPropertyModalOpen} 
        onClose={() => setIsPropertyModalOpen(false)}
        title={propertyAction === 'edit' ? "Edit Property" : "Delete Property"}
        type={propertyAction === 'delete' ? 'delete' : ''}
      >
        {propertyAction === 'edit' && editPropertyData && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
              <input
                type="text"
                value={editPropertyData.name || ''}
                onChange={(e) => setEditPropertyData({...editPropertyData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-md text-gray-700"
                placeholder={`${selectedProperty?.name || 'Unnamed Property'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={editPropertyData.address || ''}
                onChange={(e) => setEditPropertyData({...editPropertyData, address: e.target.value})}
                className="w-full px-3 py-2 border rounded-md text-gray-700"
                placeholder={`${selectedProperty?.address || 'No address'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Price</label>
              <input
                type="text"
                value={editPropertyData.name || ''}
                onChange={(e) => setEditPropertyData({...editPropertyData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-md text-gray-700"
                placeholder={`${selectedProperty?.price || 'No price'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={editPropertyData.type || ''}
                onChange={(e) => setEditPropertyData({...editPropertyData, type: e.target.value})}
                className="w-full px-3 py-2 border rounded-md text-gray-700"
              >
                <option value="">Select a type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Vacation">Vacation</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editPropertyData.status || ''}
                onChange={(e) => setEditPropertyData({...editPropertyData, status: e.target.value})}
                className="w-full px-3 py-2 border rounded-md text-gray-700"
              >
                <option value="">Select a status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsPropertyModalOpen(false)}
                className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleEditProperty}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
        
        {propertyAction === 'delete' && selectedProperty && (
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Are you sure you want to delete this property?</p>
                <p className="text-gray-600 mt-1">This action cannot be undone. All data associated with this property will be permanently removed.</p>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="font-medium text-gray-800">{selectedProperty.name || 'Unnamed Property'}</p>
              <p className="text-gray-600">{selectedProperty.address || 'No address'}</p>
              <div className="flex mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 mr-2">
                  {selectedProperty.type || 'No type'}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getPropertyStatusColor(selectedProperty.status)}`}>
                  {selectedProperty.status || 'No status'}
                </span>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsPropertyModalOpen(false)}
                className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProperty}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Property'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
