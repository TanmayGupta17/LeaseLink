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

// Mock data for users
const mockUsers = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: 'admin', 
    lastLogin: '2025-05-08T14:32:11',
    createdAt: '2024-01-15T09:22:43',
    status: 'active',
    properties: [
      { id: 101, name: 'Sunset Villa', address: '123 Ocean Dr', type: 'Residential', status: 'Active' },
      { id: 102, name: 'Downtown Office', address: '456 Business Ave', type: 'Commercial', status: 'Active' }
    ],
    activity: [
      { id: 1001, action: 'Login', timestamp: '2025-05-08T14:32:11' },
      { id: 1002, action: 'Updated property #102', timestamp: '2025-05-08T15:10:22' },
      { id: 1003, action: 'Created new property listing', timestamp: '2025-05-07T11:45:33' }
    ]
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    role: 'user', 
    lastLogin: '2025-05-09T09:14:32',
    createdAt: '2024-03-22T13:11:05',
    status: 'active',
    properties: [
      { id: 103, name: 'Mountain Retreat', address: '789 Alpine Rd', type: 'Vacation', status: 'Active' }
    ],
    activity: [
      { id: 1004, action: 'Login', timestamp: '2025-05-09T09:14:32' },
      { id: 1005, action: 'Updated profile information', timestamp: '2025-05-09T09:20:15' }
    ]
  },
  { 
    id: 3, 
    name: 'Robert Johnson', 
    email: 'robert@example.com', 
    role: 'agent', 
    lastLogin: '2025-05-07T16:45:23',
    createdAt: '2024-02-18T10:33:21',
    status: 'inactive',
    properties: [
      { id: 104, name: 'City Apartment', address: '101 Urban St', type: 'Residential', status: 'Pending' },
      { id: 105, name: 'Beachfront Condo', address: '202 Coastal Hwy', type: 'Vacation', status: 'Active' },
      { id: 106, name: 'Industrial Space', address: '303 Factory Rd', type: 'Commercial', status: 'Inactive' }
    ],
    activity: [
      { id: 1006, action: 'Login', timestamp: '2025-05-07T16:45:23' },
      { id: 1007, action: 'Added new property listing', timestamp: '2025-05-07T17:12:45' },
      { id: 1008, action: 'Updated property #105', timestamp: '2025-05-06T14:22:37' }
    ]
  },
  { 
    id: 4, 
    name: 'Sarah Williams', 
    email: 'sarah@example.com', 
    role: 'user', 
    lastLogin: '2025-05-05T11:32:18',
    createdAt: '2024-05-10T15:42:19',
    status: 'active',
    properties: [],
    activity: [
      { id: 1009, action: 'Login', timestamp: '2025-05-05T11:32:18' },
      { id: 1010, action: 'Password reset', timestamp: '2025-05-05T11:30:55' }
    ]
  }
];

// const [users, setUsers] = useState([]);

React.useEffect(() => {
    try {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8000/admin/allusers", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
              });
            
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            console.log("Fetched properties:", data); // Log the response
            setUsers(data.users); // Access the correct array
                
        };
        fetchUsers();
    }catch (error) {
        console.error("Error fetching users:", error);
    }
});

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

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEditUser = () => {
    if (!editUserData) return;
    
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? { ...user, ...editUserData } : user
    );
    
    setUsers(updatedUsers);
    setSelectedUser({ ...selectedUser, ...editUserData });
    setIsEditModalOpen(false);
    showToast(`User ${selectedUser.name} has been updated successfully`);
  };

  const handleDeleteUser = () => {
    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    setSelectedUser(null);
    setIsDeleteModalOpen(false);
    showToast(`User ${selectedUser.name} has been deleted`, 'success');
  };

  const handleEditProperty = () => {
    if (!editPropertyData || !selectedProperty) return;
    
    const updatedProperties = selectedUser.properties.map(property => 
      property.id === selectedProperty.id ? { ...property, ...editPropertyData } : property
    );
    
    const updatedUser = { ...selectedUser, properties: updatedProperties };
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? updatedUser : user
    );
    
    setUsers(updatedUsers);
    setSelectedUser(updatedUser);
    setIsPropertyModalOpen(false);
    showToast(`Property "${selectedProperty.name}" has been updated`);
  };

  const handleDeleteProperty = () => {
    const updatedProperties = selectedUser.properties.filter(property => 
      property.id !== selectedProperty.id
    );
    
    const updatedUser = { ...selectedUser, properties: updatedProperties };
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? updatedUser : user
    );
    
    setUsers(updatedUsers);
    setSelectedUser(updatedUser);
    setIsPropertyModalOpen(false);
    showToast(`Property "${selectedProperty.name}" has been deleted`, 'success');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'agent': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 flex-col bg-white border-r">
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
      </div>

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
                    className="pl-10 pr-4 py-2 border rounded-md text-sm w-full"
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
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`p-4 border rounded-md mb-3 cursor-pointer transition-colors ${
                        selectedUser?.id === user.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                            {user.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium text-gray-800">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
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
                      {selectedUser.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-semibold text-gray-800">{selectedUser.name}</h2>
                      <p className="text-gray-500">{selectedUser.email}</p>
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
                      Properties ({selectedUser.properties.length})
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
                            <h3 className="font-medium">Role</h3>
                          </div>
                          <span className={`text-sm px-2.5 py-1 rounded-full ${getRoleBadgeColor(selectedUser.role)}`}>
                            {selectedUser.role}
                          </span>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="flex items-center mb-2">
                            <BadgeCheck size={18} className="mr-2 text-gray-500" />
                            <h3 className="font-medium">Status</h3>
                          </div>
                          <span className={`text-sm px-2.5 py-1 rounded-full ${getStatusBadgeColor(selectedUser.status)}`}>
                            {selectedUser.status}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center mb-2">
                          <CalendarClock size={18} className="mr-2 text-gray-500" />
                          <h3 className="font-medium">Time Information</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Login:</span>
                            <span>{formatDate(selectedUser.lastLogin)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Account Created:</span>
                            <span>{formatDate(selectedUser.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center mb-2">
                          <Building size={18} className="mr-2 text-gray-500" />
                          <h3 className="font-medium">Property Statistics</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Properties:</span>
                            <span>{selectedUser.properties.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Active Properties:</span>
                            <span>{selectedUser.properties.filter(p => p.status === 'Active').length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Properties Tab */}
                  {activeTab === 'properties' && (
                    <div>
                      {selectedUser.properties.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Building size={48} className="mx-auto mb-4 opacity-30" />
                          <p>This user has no properties listed</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {selectedUser.properties.map(property => (
                            <div key={property.id} className="border rounded-md p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-gray-800">{property.name}</h3>
                                  <p className="text-sm text-gray-600">{property.address}</p>
                                  <div className="flex items-center mt-2">
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                                      {property.type}
                                    </span>
                                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                      property.status === 'Active' ? 'bg-green-100 text-green-800' :
                                      property.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {property.status}
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
                      {selectedUser.activity.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Activity size={48} className="mx-auto mb-4 opacity-30" />
                          <p>No activity recorded for this user</p>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />
                          {selectedUser.activity.map((activity, index) => (
                            <div key={activity.id} className="ml-10 relative mb-6">
                              <div className="absolute -left-10 mt-1.5 w-5 h-5 rounded-full bg-blue-50 border-2 border-blue-500 z-10" />
                              <div className="flex items-center mb-1">
                                <Clock size={14} className="mr-2 text-gray-400" />
                                <span className="text-sm text-gray-500">
                                  {formatDate(activity.timestamp)}
                                </span>
                              </div>
                              <p className="text-gray-800">{activity.action}</p>
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
                value={editUserData.name}
                onChange={(e) => setEditUserData({...editUserData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={editUserData.email}
                onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={editUserData.role}
                onChange={(e) => setEditUserData({...editUserData, role: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="user">User</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editUserData.status}
                onChange={(e) => setEditUserData({...editUserData, status: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
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
            <p className="font-medium text-gray-800">{selectedUser?.name}</p>
            <p className="text-gray-600">{selectedUser?.email}</p>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete User
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
                value={editPropertyData.name}
                onChange={(e) => setEditPropertyData({...editPropertyData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={editPropertyData.address}
                onChange={(e) => setEditPropertyData({...editPropertyData, address: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={editPropertyData.type}
                onChange={(e) => setEditPropertyData({...editPropertyData, type: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Vacation">Vacation</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editPropertyData.status}
                onChange={(e) => setEditPropertyData({...editPropertyData, status: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsPropertyModalOpen(false)}
                className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditProperty}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
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
              <p className="font-medium text-gray-800">{selectedProperty.name}</p>
              <p className="text-gray-600">{selectedProperty.address}</p>
              <div className="flex mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 mr-2">
                  {selectedProperty.type}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedProperty.status === 'Active' ? 'bg-green-100 text-green-800' :
                  selectedProperty.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedProperty.status}
                </span>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsPropertyModalOpen(false)}
                className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProperty}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Property
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