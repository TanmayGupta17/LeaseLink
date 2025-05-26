"use client";
import { useState, useEffect } from 'react';
import { 
  Home, 
  Filter, 
  Search, 
  Edit, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  X,
  ShieldAlert,
  Eye
} from 'lucide-react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel
} from '@tanstack/react-table';

// Mock data - replace with API calls
const mockProperties = [
  {
    id: '1',
    title: 'Downtown Luxury Loft',
    owner: { name: 'Sarah Johnson', contact: 'sarah@example.com' },
    location: { city: 'New York', address: '123 Main St' },
    status: 'Available',
    verification: 'Verified',
    dateAdded: '2025-05-10',
    reports: [],
    price: '$3500/mo',
    amenities: ['Pool', 'Gym', 'Parking'],
    description: 'Modern loft with panoramic city views'
  },
  // Add more mock entries...
];

const columnHelper = createColumnHelper();

const AdminDashboard = () => {
  const [data, setData] = useState(() => [...mockProperties]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('listings');
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    status: '',
    verification: ''
  });

  // Table configuration
  const columns = [
    columnHelper.accessor('title', {
      header: 'Property Title',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('owner.name', {
      header: 'Owner',
      cell: info => (
        <div>
          <p className="font-medium">{info.getValue()}</p>
          <p className="text-sm text-gray-500">{info.row.original.owner.contact}</p>
        </div>
      )
    }),
    columnHelper.accessor('location.city', {
      header: 'Location',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(info.getValue())}`}>
          {info.getValue()}
        </span>
      )
    }),
    columnHelper.accessor('verification', {
      header: 'Verification',
      cell: info => (
        <div className="flex items-center">
          {info.getValue() === 'Verified' ? (
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
          ) : (
            <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
          )}
          {info.getValue()}
        </div>
      )
    }),
    columnHelper.accessor('dateAdded', {
      header: 'Date Added',
      cell: info => new Date(info.getValue()).toLocaleDateString()
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleView(row.original)}
            className="text-blue-600 hover:bg-blue-50 p-1 rounded"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleEdit(row.original)}
            className="text-gray-600 hover:bg-gray-50 p-1 rounded"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="text-red-600 hover:bg-red-50 p-1 rounded"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )
    })
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filters.search
    },
    onGlobalFilterChange: value => 
      setFilters(prev => ({ ...prev, search: value }))
  });

  // Style helpers
  const getStatusStyle = (status) => {
    const styles = {
      Available: 'bg-green-100 text-green-800',
      Rented: 'bg-gray-100 text-gray-800',
      Draft: 'bg-yellow-100 text-yellow-800'
    };
    return styles[status] || '';
  };

  // Handlers
  const handleView = (property) => {
    setSelectedProperty(property);
    setIsDetailPanelOpen(true);
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const handleDelete = (property) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const filteredData = data.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      property.owner.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCity = !filters.city || property.location.city === filters.city;
    const matchesStatus = !filters.status || property.status === filters.status;
    const matchesVerification = !filters.verification || property.verification === filters.verification;
    
    return matchesSearch && matchesCity && matchesStatus && matchesVerification;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r h-screen p-4 fixed">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-gray-800">LeaseLink Admin</h1>
            <p className="text-sm text-gray-500">Property Moderation</p>
          </div>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('listings')}
              className={`w-full flex items-center px-3 py-2 rounded-md ${
                activeTab === 'listings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Home className="w-5 h-5 mr-2" />
              All Listings
            </button>
            <button
              onClick={() => setActiveTab('reported')}
              className={`w-full flex items-center px-3 py-2 rounded-md ${
                activeTab === 'reported' ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ShieldAlert className="w-5 h-5 mr-2" />
              Reported Listings
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 p-8 flex-1">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 pr-4 py-2 border rounded-md w-full"
                />
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              </div>
              <select
                value={filters.city}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                className="px-4 py-2 border rounded-md"
              >
                <option value="">All Cities</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-4 py-2 border rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
                <option value="Draft">Draft</option>
              </select>
              <select
                value={filters.verification}
                onChange={(e) => setFilters(prev => ({ ...prev, verification: e.target.value }))}
                className="px-4 py-2 border rounded-md"
              >
                <option value="">Verification Status</option>
                <option value="Verified">Verified</option>
                <option value="Unverified">Unverified</option>
              </select>
            </div>
          </div>

          {/* Content Tabs */}
          {activeTab === 'listings' ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <span className="text-sm text-gray-700">
                  Page {table.getState().pagination.pageIndex + 1} of{' '}
                  {table.getPageCount()}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Reported Listings</h2>
              {/* Reported listings implementation similar to main table */}
            </div>
          )}
        </div>
      </div>

      {/* Property Detail Side Panel */}
      {isDetailPanelOpen && selectedProperty && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{selectedProperty.title}</h2>
            <button
              onClick={() => setIsDetailPanelOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Owner</p>
                <p className="font-medium">{selectedProperty.owner.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium">{selectedProperty.price}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-700">{selectedProperty.description}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Amenities</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedProperty.amenities.map(amenity => (
                  <span
                    key={amenity}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditPropertyModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        property={selectedProperty}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setData(data.filter(p => p.id !== selectedProperty.id));
          setIsDeleteModalOpen(false);
        }}
      />
    </div>
  );
};

// Modal Components
const EditPropertyModal = ({ isOpen, onClose, property }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Property</h2>
          <button onClick={onClose} className="text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Add form fields here */}
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
          <h2 className="text-xl font-bold">Delete Property</h2>
        </div>
        <p className="text-gray-600 mb-6">Are you sure you want to permanently delete this property listing?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
