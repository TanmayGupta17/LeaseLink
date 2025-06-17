"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
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
  Eye,
  Plus,
  Download,
  Upload,
  RefreshCw,
} from "lucide-react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

// Enhanced API service functions with proper error handling
const apiService = {
  async fetchAllProperties() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/Property/allproperty`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Raw API response:", result);

      // Handle different response structures consistently
      let properties = [];
      if (result.allProperties) {
        properties = result.allProperties;
      } else if (Array.isArray(result)) {
        properties = result;
      } else if (result.data) {
        properties = result.data;
      }

      return {
        data: properties,
        allProperties: properties, // Include both for compatibility
        total: properties.length,
      };
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw new Error(`Failed to fetch properties: ${error.message}`);
    }
  },

  async fetchAllReportedProperties() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/admin/getReportedproperty`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Raw reported properties response:", result);

      // Handle different response structures consistently
      let reportedProperties = [];
      if (result.reportedProperties) {
        reportedProperties = result.reportedProperties;
      } else if (Array.isArray(result)) {
        reportedProperties = result;
      } else if (result.data) {
        reportedProperties = result.data;
      }

      return {
        data: reportedProperties,
        reportedProperties: reportedProperties, // Include both for compatibility
        total: reportedProperties.length,
      };
    } catch (error) {
      console.error("Error fetching reported properties:", error);
      throw new Error(`Failed to fetch reported properties: ${error.message}`);
    }
  },

  async updateProperty(id, data) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/admin/UpdateUserProperty/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok)
        throw new Error(`Failed to update property: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  },

  async deleteProperty(_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/admin/deleteUserProperty/${_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok)
        throw new Error(`Failed to delete property: ${response.statusText}`);
      return true;
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  },

  async verifyProperty(_id) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/admin/verifyProperty/${_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok)
        throw new Error(`Failed to verify property: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Error verifying property:", error);
      throw error;
    }
  },
};

const columnHelper = createColumnHelper();

const AdminDashboard = () => {
  // Core data states
  const [allProperties, setProperties] = useState([]);

  const [allReportedProperties, setAllReportedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // UI states
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("listings");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Table states
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    status: "",
    verification: "",
    priceMin: "",
    priceMax: "",
    dateFrom: "",
    dateTo: "",
  });

  // Dynamic filter options derived from data
  const filterOptions = useMemo(() => {
    const currentData =
      activeTab === "listings" ? allProperties : allReportedProperties;
    const cities = [
      ...new Set(
        currentData.map((item) => item.location?.city).filter(Boolean)
      ),
    ];

    return {
      cities: cities.sort(),
      statuses: ["Available", "Rented", "Draft", "Under Review"],
      verificationStatuses: ["Verified", "Unverified", "Pending"],
    };
  }, [allProperties, allReportedProperties, activeTab]);

  // Frontend filtering logic using useMemo for performance
  const filteredData = useMemo(() => {
    const sourceData =
      activeTab === "listings" ? allProperties : allReportedProperties;

    if (!sourceData || !Array.isArray(sourceData) || sourceData.length === 0) {
      return [];
    }

    return sourceData.filter((property) => {
      // Search filter (title, address, owner name)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          property.title?.toLowerCase().includes(searchTerm) ||
          property.location?.address?.toLowerCase().includes(searchTerm) ||
          property.owner?.name?.toLowerCase().includes(searchTerm);

        if (!matchesSearch) return false;
      }

      // City filter
      if (filters.city && property.location?.city !== filters.city) {
        return false;
      }

      // Status filter
      if (filters.status && property.status !== filters.status) {
        return false;
      }

      // Verification filter
      if (
        filters.verification &&
        property.verification !== filters.verification
      ) {
        return false;
      }

      // Price range filter
      if (filters.priceMin) {
        const minPrice = parseFloat(filters.priceMin);
        if (property.price < minPrice) return false;
      }

      if (filters.priceMax) {
        const maxPrice = parseFloat(filters.priceMax);
        if (property.price > maxPrice) return false;
      }

      // Date range filter
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        const propertyDate = new Date(property.dateAdded);
        if (propertyDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        const propertyDate = new Date(property.dateAdded);
        if (propertyDate > toDate) return false;
      }

      return true;
    });
  }, [allProperties, allReportedProperties, activeTab, filters]);

  // Sorted and paginated data
  const processedData = useMemo(() => {
    let sortedData = [...filteredData];

    // Apply sorting
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      sortedData.sort((a, b) => {
        let aValue = a[id];
        let bValue = b[id];

        // Handle nested properties
        if (id.includes(".")) {
          const keys = id.split(".");
          aValue = keys.reduce((obj, key) => obj?.[key], a);
          bValue = keys.reduce((obj, key) => obj?.[key], b);
        }

        // Handle different data types
        if (typeof aValue === "string" && typeof bValue === "string") {
          return desc
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return desc ? bValue - aValue : aValue - bValue;
        }

        // Handle dates
        if (id === "dateAdded") {
          const dateA = new Date(aValue);
          const dateB = new Date(bValue);
          return desc ? dateB - dateA : dateA - dateB;
        }

        return 0;
      });
    }

    return sortedData;
  }, [filteredData, sorting]);

  // Paginated data for display
  const paginatedData = useMemo(() => {
    const startIndex = pagination.pageIndex * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return processedData.slice(startIndex, endIndex);
  }, [processedData, pagination]);

  // Enhanced fetch function with better error handling
  // Remove useCallback and make it a regular async function
  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Starting to fetch data...");

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to access the admin dashboard");
      }

      const [propertiesResult, reportedResult] = await Promise.allSettled([
        apiService.fetchAllProperties(),
        apiService.fetchAllReportedProperties(),
      ]);

      // Handle properties result
      if (propertiesResult.status === "fulfilled") {
        console.log("Properties fetched successfully:", propertiesResult.value);
        // Fix: Use the correct data structure
        const propertiesData =
          propertiesResult.value.data ||
          propertiesResult.value.allProperties ||
          [];
        setProperties(propertiesData);
      } else {
        console.error("Failed to fetch properties:", propertiesResult.reason);
        setProperties([]);
      }

      // Handle reported properties result
      if (reportedResult.status === "fulfilled") {
        console.log(
          "Reported properties fetched successfully:",
          reportedResult.value
        );
        // Fix: Use the correct data structure
        const reportedData =
          reportedResult.value.data ||
          reportedResult.value.reportedProperties ||
          [];
        setAllReportedProperties(reportedData);
      } else {
        console.error(
          "Failed to fetch reported properties:",
          reportedResult.reason
        );
        setAllReportedProperties([]);
      }

      setInitialDataLoaded(true);

      if (
        propertiesResult.status === "rejected" &&
        reportedResult.status === "rejected"
      ) {
        throw new Error(
          "Failed to fetch any data. Please check your connection and try again."
        );
      }
    } catch (err) {
      console.error("Error fetching initial data:", err);
      setError(err.message || "Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data once on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);
  // Reset pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters, activeTab]);

  // Table configuration
  const columns = [
    columnHelper.accessor("title", {
      header: "Property Title",
      cell: (info) => (
        <div className="max-w-xs">
          <p className="font-medium truncate text-gray-700">
            {info.getValue() || "N/A"}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {info.row.original.location?.address || "No address"}
          </p>
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("owner.name", {
      header: "Owner",
      cell: (info) => (
        <div>
          <p className="font-medium text-gray-600">
            {info.getValue() || "N/A"}
          </p>
          <p className="text-sm text-gray-500">
            {info.row.original.owner?.contact || "No contact"}
          </p>
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("location.city", {
      header: "Location",
      cell: (info) => info.getValue() || "N/A",
      enableSorting: true,
    }),
    columnHelper.accessor("price", {
      header: "Price",
      cell: (info) => (
        <span className="font-medium text-green-600">
          {formatPrice(info.getValue())}
        </span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(
            info.getValue()
          )}`}
        >
          {info.getValue() || "Unknown"}
        </span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("verification", {
      header: "Verification",
      cell: (info) => (
        <div className="flex items-center">
          {info.getValue() === "Verified" ? (
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
          ) : info.getValue() === "Pending" ? (
            <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
          ) : (
            <X className="w-4 h-4 text-red-500 mr-2" />
          )}
          <span className="text-sm">{info.getValue() || "Unverified"}</span>
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("dateAdded", {
      header: "Date Added",
      cell: (info) => {
        const date = info.getValue();
        return date ? new Date(date).toLocaleDateString() : "N/A";
      },
      enableSorting: true,
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-1">
          <button
            onClick={() => handleView(row.original)}
            className="text-blue-600 hover:bg-blue-50 p-2 rounded-md transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(row.original)}
            className="text-gray-600 hover:bg-gray-50 p-2 rounded-md transition-colors"
            title="Edit Property"
          >
            <Edit className="w-4 h-4" />
          </button>
          {row.original.verification !== "Verified" && (
            <button
              onClick={() => handleVerify(row.original)}
              className="text-green-600 hover:bg-green-50 p-2 rounded-md transition-colors"
              title="Verify Property"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleDelete(row.original)}
            className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
            title="Delete Property"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }),
  ];

  // Configure table with processed data
  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil(processedData.length / pagination.pageSize),
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  // Utility functions
  const getStatusStyle = (status) => {
    const styles = {
      Available: "bg-green-100 text-green-800",
      Rented: "bg-gray-100 text-gray-800",
      Draft: "bg-yellow-100 text-yellow-800",
      "Under Review": "bg-blue-100 text-blue-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const formatPrice = (price) => {
    if (typeof price === "number") {
      return `$${price.toLocaleString()}/mo`;
    }
    return price || "N/A";
  };

  const showNotification = (message, type = "success") => {
    if (type === "success") {
      setSuccess(message);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(null), 3000);
    }
  };

  // Event handlers
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

  const handleVerify = async (property) => {
    try {
      await apiService.verifyProperty(property._id);

      // Update local data immediately
      if (activeTab === "listings") {
        setProperties((prev) =>
          prev.map((p) =>
            p._id === property._id ? { ...p, verification: "Verified" } : p
          )
        );
      } else {
        setAllReportedProperties((prev) =>
          prev.map((p) =>
            p._id === property._id ? { ...p, verification: "Verified" } : p
          )
        );
      }

      showNotification("Property verified successfully");
    } catch (error) {
      showNotification("Failed to verify property", "error");
    }
  };

  const confirmDelete = async () => {
    try {
      await apiService.deleteProperty(selectedProperty._id);

      // Remove from local data immediately
      if (activeTab === "listings") {
        setProperties((prev) =>
          prev.filter((p) => p._id !== selectedProperty._id)
        );
      } else {
        setAllReportedProperties((prev) =>
          prev.filter((p) => p.id !== selectedProperty.id)
        );
      }

      showNotification("Property deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      showNotification("Failed to delete property", "error");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      city: "",
      status: "",
      verification: "",
      priceMin: "",
      priceMax: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      await fetchInitialData();
      showNotification("Data refreshed successfully");
    } catch (error) {
      showNotification("Failed to refresh data. Please try again.", "error");
    }
  };

  const exportData = async () => {
    try {
      const dataToExport = filteredData;
      const csvContent = convertToCSV(dataToExport);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `properties-${activeTab}-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      showNotification("Data exported successfully");
    } catch (error) {
      showNotification("Failed to export data", "error");
    }
  };

  const convertToCSV = (data) => {
    if (!data.length) return "";

    const headers = [
      "Title",
      "Owner",
      "City",
      "Price",
      "Status",
      "Verification",
      "Date Added",
    ];
    const csvRows = [headers.join(",")];

    data.forEach((item) => {
      const row = [
        `"${item.title || ""}"`,
        `"${item.owner?.name || ""}"`,
        `"${item.location?.city || ""}"`,
        item.price || 0,
        `"${item.status || ""}"`,
        `"${item.verification || ""}"`,
        `"${item.dateAdded || ""}"`,
      ];
      csvRows.push(row.join(","));
    });

    return csvRows.join("\n");
  };

  // Show error state
  if (error && !initialDataLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">
              Error Loading Data
            </h2>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex space-x-3">
            <button
              onClick={refreshData}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r h-screen p-4 fixed">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-gray-800">LeaseLink Admin</h1>
            <p className="text-sm text-gray-500">Property Management</p>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("listings")}
              className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                activeTab === "listings"
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Home className="w-5 h-5 mr-2" />
              All Listings ({allProperties.length})
            </button>

            <button
              onClick={() => setActiveTab("reported")}
              className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                activeTab === "reported"
                  ? "bg-red-50 text-red-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ShieldAlert className="w-5 h-5 mr-2" />
              Reported Listings ({allReportedProperties.length})
            </button>
          </nav>

          <div className="mt-8 pt-4 border-t">
            <button
              onClick={exportData}
              className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Export Filtered Data
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 p-8 flex-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === "listings"
                  ? "Property Listings"
                  : "Reported Properties"}
              </h2>
              <p className="text-gray-600">
                {activeTab === "listings"
                  ? "Manage and moderate property listings"
                  : "Review and handle reported properties"}
              </p>
              {initialDataLoaded && (
                <p className="text-sm text-gray-500 mt-1">
                  Showing {filteredData.length} of{" "}
                  {activeTab === "listings"
                    ? allProperties.length
                    : allReportedProperties.length}{" "}
                  total properties
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={refreshData}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-400"
                />
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              </div>

              <select
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-400"
              >
                <option value="">All Cities</option>
                {filterOptions.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-400"
              >
                <option value="">All Statuses</option>
                {filterOptions.statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                value={filters.verification}
                onChange={(e) =>
                  handleFilterChange("verification", e.target.value)
                }
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-400"
              >
                <option value="">Verification Status</option>
                {filterOptions.verificationStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-400"
              />

              <input
                type="number"
                placeholder="Max Price"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-400"
              />

              <input
                type="date"
                placeholder="From Date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-400"
              />

              <div className="flex space-x-2">
                <input
                  type="date"
                  placeholder="To Date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent flex-1 text-gray-400"
                />
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  title="Clear Filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading && !initialDataLoaded ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">
                  Loading properties...
                </span>
              </div>
            ) : processedData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Properties Found
                </h3>
                <p className="text-gray-500 text-center max-w-sm">
                  {activeTab === "listings"
                    ? "No property listings available. Properties will appear here once they are added to the system."
                    : "No reported properties found. This is good news - it means there are no properties that need review."}
                </p>
                {filteredData.length === 0 &&
                  (allProperties.length > 0 ||
                    allReportedProperties.length > 0) && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <div className="flex items-center space-x-1">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {header.column.getIsSorted() && (
                                  <span className="text-blue-600">
                                    {header.column.getIsSorted() === "desc"
                                      ? "↓"
                                      : "↑"}
                                  </span>
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {table.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="px-6 py-4 whitespace-nowrap"
                            >
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
                </div>

                {/* Enhanced Pagination */}
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">Show</span>
                    <select
                      value={table.getState().pagination.pageSize}
                      onChange={(e) => {
                        setPagination((prev) => ({
                          ...prev,
                          pageSize: Number(e.target.value),
                        }));
                      }}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          {pageSize}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-700">entries</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, pageIndex: 0 }))
                      }
                      disabled={pagination.pageIndex === 0}
                      className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                      First
                    </button>
                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          pageIndex: prev.pageIndex - 1,
                        }))
                      }
                      disabled={pagination.pageIndex === 0}
                      className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>

                    <span className="text-sm text-gray-700 px-4">
                      Page {pagination.pageIndex + 1} of{" "}
                      {Math.ceil(processedData.length / pagination.pageSize) ||
                        1}
                    </span>

                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          pageIndex: prev.pageIndex + 1,
                        }))
                      }
                      disabled={
                        pagination.pageIndex >=
                        Math.ceil(processedData.length / pagination.pageSize) -
                          1
                      }
                      className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                      Next
                    </button>
                    <button
                      onClick={() =>
                        setPagination((prev) => ({
                          ...prev,
                          pageIndex:
                            Math.ceil(
                              processedData.length / pagination.pageSize
                            ) - 1,
                        }))
                      }
                      disabled={
                        pagination.pageIndex >=
                        Math.ceil(processedData.length / pagination.pageSize) -
                          1
                      }
                      className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    >
                      Last
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Property Detail Side Panel */}
      {isDetailPanelOpen && selectedProperty && (
        <PropertyDetailPanel
          property={selectedProperty}
          onClose={() => setIsDetailPanelOpen(false)}
          onEdit={handleEdit}
          onVerify={handleVerify}
          formatPrice={formatPrice}
          getStatusStyle={getStatusStyle}
        />
      )}

      {/* Edit Property Modal */}
      <EditPropertyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        property={selectedProperty}
        onSave={async (updatedProperty) => {
          try {
            await apiService.updateProperty(
              selectedProperty.id,
              updatedProperty
            );

            // Update local data immediately
            const updateData = (prevData) =>
              prevData.map((p) =>
                p.id === selectedProperty.id ? { ...p, ...updatedProperty } : p
              );

            if (activeTab === "listings") {
              setProperties(updateData);
            } else {
              setAllReportedProperties(updateData);
            }

            showNotification("Property updated successfully");
            setIsEditModalOpen(false);
          } catch (error) {
            showNotification("Failed to update property", "error");
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        property={selectedProperty}
      />
    </div>
  );
};

// Property Detail Panel Component (same as before, no changes needed)
const PropertyDetailPanel = ({
  property,
  onClose,
  onEdit,
  onVerify,
  formatPrice,
  getStatusStyle,
}) => (
  <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl p-6 overflow-y-auto z-40">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-700">{property.title}</h2>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"
      >
        <X className="w-6 h-6" />
      </button>
    </div>

    <div className="space-y-6">
      {/* Property Images */}
      {property.images && property.images.length > 0 && (
        <div>
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Owner</p>
          <p className="font-medium">{property.owner?.name || "N/A"}</p>
          <p className="text-sm text-gray-600">
            {property.owner?.contact || "No contact"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Price</p>
          <p className="font-medium text-green-600">
            {formatPrice(property.price)}
          </p>
        </div>
      </div>

      {/* Status and Verification */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <span
            className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusStyle(
              property.status
            )}`}
          >
            {property.status || "Unknown"}
          </span>
        </div>
        <div>
          <p className="text-sm text-gray-500">Verification</p>
          <div className="flex items-center">
            {property.verification === "Verified" ? (
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
            )}
            <span className="text-sm">
              {property.verification || "Unverified"}
            </span>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <p className="text-sm text-gray-500">Location</p>
        <p className="font-medium">{property.location?.city || "N/A"}</p>
        <p className="text-gray-700">
          {property.location?.address || "No address"}
        </p>
      </div>

      {/* Description */}
      <div>
        <p className="text-sm text-gray-500">Description</p>
        <p className="text-gray-700">
          {property.description || "No description available"}
        </p>
      </div>

      {/* Amenities */}
      {property.amenities && property.amenities.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {property.amenities.map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 rounded-full text-sm"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reports (if any) */}
      {property.reports && property.reports.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Reports</p>
          <div className="space-y-2">
            {property.reports.map((report, index) => (
              <div key={index} className="p-3 bg-red-50 rounded-md">
                <p className="text-sm font-medium text-red-800">
                  {report.reason}
                </p>
                <p className="text-sm text-red-600">{report.description}</p>
                <p className="text-xs text-red-500 mt-1">
                  {new Date(report.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-4 border-t">
        <button
          onClick={() => onEdit(property)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Edit Property
        </button>
        {property.verification !== "Verified" && (
          <button
            onClick={() => onVerify(property)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Verify
          </button>
        )}
      </div>
    </div>
  </div>
);

// Enhanced Edit Property Modal Component (same as before, no changes needed)
const EditPropertyModal = ({ isOpen, onClose, property, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    status: "",
    verification: "",
    location: { city: "", address: "" },
    amenities: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || "",
        description: property.description || "",
        price: property.price || "",
        status: property.status || "",
        verification: property.verification || "",
        location: {
          city: property.location?.city || "",
          address: property.location?.address || "",
        },
        amenities: property.amenities || [],
      });
    }
  }, [property]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Property</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
                <option value="Draft">Draft</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.location.city}
                onChange={(e) =>
                  handleInputChange("location.city", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Status
              </label>
              <select
                value={formData.verification}
                onChange={(e) =>
                  handleInputChange("verification", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Verification</option>
                <option value="Verified">Verified</option>
                <option value="Unverified">Unverified</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={formData.location.address}
              onChange={(e) =>
                handleInputChange("location.address", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Enhanced Delete Confirmation Modal (same as before, no changes needed)
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, property }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
          <h2 className="text-xl font-bold">Delete Property</h2>
        </div>

        <p className="text-gray-600 mb-2">
          Are you sure you want to permanently delete this property listing?
        </p>

        {property && (
          <div className="bg-gray-50 p-3 rounded-md mb-6">
            <p className="font-medium">{property.title}</p>
            <p className="text-sm text-gray-600">{property.location?.city}</p>
          </div>
        )}

        <p className="text-sm text-red-600 mb-6">
          This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
