"use client";
import React, { useEffect, useState, useRef } from "react";
import { 
  MapPin, BedDouble, Bath, Square, Calendar, Eye, 
  Home, CheckSquare, Loader2, Heart, Share2, 
  ChevronLeft, ChevronRight, X, Camera, DollarSign,
  Clock, Maximize2, MessageSquare, Phone, Calendar as CalendarIcon
} from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";

const PropertyDetails = ({ params }) => {
  const [propertyId, setPropertyId] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [viewingModalOpen, setViewingModalOpen] = useState(false);
  const [fullscreenGallery, setFullscreenGallery] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('details');
  
  // Form states
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: 'I\'m interested in this property and would like to know more information.'
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  
  // Refs for smooth scrolling
  const detailsRef = useRef(null);
  const amenitiesRef = useRef(null);
  const galleryRef = useRef(null);
  const locationRef = useRef(null);

  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const resolvedParams = await params;
        setPropertyId(resolvedParams.propertyId);
      } catch (error) {
        setError("Invalid property parameters");
        setLoading(false);
      }
    };

    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!propertyId) return;

    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8000/property/${propertyId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch property (${res.status})`);
        }
        
        const data = await res.json();
        setProperty(data.property);
        
        // Record view
        recordPropertyView(propertyId);
        
        // Fetch similar properties
        fetchSimilarProperties(data.property);
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch property", error);
        setError("Unable to load property details. Please try again later.");
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  // Record property view
  const recordPropertyView = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8000/property/${id}/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Failed to record view", error);
    }
  };

  // Fetch similar properties
  const fetchSimilarProperties = async (currentProperty) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/properties/similar?type=${currentProperty.type}&location=${currentProperty.location}&exclude=${propertyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setSimilarProperties(data.properties.slice(0, 3));
      }
    } catch (error) {
      console.error("Failed to fetch similar properties", error);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format price with commas
  const formatPrice = (price) => {
    return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "N/A";
  };

  const handleNextImage = () => {
    if (property?.images?.length) {
      setActiveImage((prev) => (prev + 1) % property.images.length);
    }
  };

  const handlePrevImage = () => {
    if (property?.images?.length) {
      setActiveImage((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      const method = isFavorite ? "DELETE" : "POST";
      
      const res = await fetch(`http://localhost:8000/property/${propertyId}/favorite`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Failed to update favorite status", error);
    }
  };

  const handleShareProperty = () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: shareUrl,
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          alert("Link copied to clipboard!");
        })
        .catch(err => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setFormSubmitting(false);
      setFormSuccess(true);
      
      setTimeout(() => {
        setContactModalOpen(false);
        setFormSuccess(false);
        // Reset form
        setContactForm({
          name: '',
          email: '',
          phone: '',
          message: 'I\'m interested in this property and would like to know more information.'
        });
      }, 2000);
    }, 1500);
  };

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Loading property details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-lg text-center">
          <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h2>
          <p className="text-gray-600">The property you're looking for might have been removed or doesn't exist.</p>
          <a 
            href="/properties" 
            className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Properties
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Top Status Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7.5xl mx-auto px-4 py-3 flex  justify-between">
          <div className="flex items-center">
            <a href="/allProperties" className="text-blue-600 hover:text-blue-800 flex items-center">
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span className="font-medium">Back to Properties</span>
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-full ${isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:bg-gray-200 transition-colors`}
              aria-label="Add to favorites"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShareProperty}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Share property"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section with Gallery */}
      <div className="relative bg-gray-900">
        {property.images && property.images.length > 0 ? (
          <div className="relative h-96 md:h-[30rem] lg:h-[35rem] overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10 z-10"></div>
            <img 
              src={property.images[activeImage]} 
              alt={property.title} 
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            />

            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 z-20 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              {activeImage + 1} / {property.images.length}
            </div>

            {/* Gallery Controls */}
            {property.images.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 text-gray-800 hover:bg-white shadow-lg transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 text-gray-800 hover:bg-white shadow-lg transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Fullscreen Button */}
            <button 
              onClick={() => setFullscreenGallery(true)}
              className="absolute top-4 right-4 z-20 p-3 rounded-full bg-white/90 text-gray-800 hover:bg-white shadow-lg transition-all"
              aria-label="View fullscreen gallery"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="h-96 md:h-[30rem] bg-gradient-to-r from-blue-800 to-purple-800 flex items-center justify-center">
            <Camera className="w-24 h-24 text-white/30" />
          </div>
        )}
        
        {/* Property Overview Banner */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20">
          <div className="max-w-7xl mx-auto">
            <div className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md mb-2">
              {property.status}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{property.title}</h1>
            <div className="flex items-center text-white/90 mb-3">
              <MapPin className="w-5 h-5 mr-1" />
              <span>{property.location}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-2xl md:text-3xl font-bold text-white flex items-center">
                <FaRupeeSign className="w-6 h-6" />
                {formatPrice(property.price)}
              </div>
              <div className="text-white/90 flex items-center">
                <Eye className="w-5 h-5 mr-1" />
                <span>{property.views} views</span>
              </div>
              <div className="text-white/90 flex items-center">
                <Clock className="w-5 h-5 mr-1" />
                <span>Listed {formatDate(property.listedDate || new Date())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-14 bg-white shadow-sm z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              onClick={() => {
                setActiveTab('details');
                scrollToSection(detailsRef);
              }}
              className={`px-6 py-4 font-medium text-base whitespace-nowrap ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                setActiveTab('amenities');
                scrollToSection(amenitiesRef);
              }}
              className={`px-6 py-4 font-medium text-base whitespace-nowrap ${activeTab === 'amenities' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Amenities
            </button>
            <button
              onClick={() => {
                setActiveTab('gallery');
                scrollToSection(galleryRef);
              }}
              className={`px-6 py-4 font-medium text-base whitespace-nowrap ${activeTab === 'gallery' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Gallery
            </button>
            <button
              onClick={() => {
                setActiveTab('location');
                scrollToSection(locationRef);
              }}
              className={`px-6 py-4 font-medium text-base whitespace-nowrap ${activeTab === 'location' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Location
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <BedDouble className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-gray-600 text-sm">Bedrooms</span>
                </div>
                <div className="text-xl font-bold text-gray-800">{property.bedrooms}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <Bath className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-gray-600 text-sm">Bathrooms</span>
                </div>
                <div className="text-xl font-bold text-gray-800">{property.bathrooms}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <Square className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-gray-600 text-sm">Area</span>
                </div>
                <div className="text-xl font-bold text-gray-800">{property.area} sq ft</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <Home className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-gray-600 text-sm">Type</span>
                </div>
                <div className="text-xl font-bold text-gray-800">{property.type}</div>
              </div>
            </div>

            {/* Description Section */}
            <section ref={detailsRef} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
              <div className="prose max-w-none text-gray-600 leading-relaxed">
                <p>{property.description}</p>
                
                {/* Key highlights - Additional content */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Highlights</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckSquare className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Prime location with easy access to public transport</span>
                    </li>
                    <li className="flex items-start">
                      <CheckSquare className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Recently renovated with modern appliances</span>
                    </li>
                    <li className="flex items-start">
                      <CheckSquare className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Energy-efficient heating and cooling systems</span>
                    </li>
                    <li className="flex items-start">
                      <CheckSquare className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Ample natural lighting throughout the property</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Amenities Section */}
            <section ref={amenitiesRef} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Amenities & Features</h2>
              
              {/* Categorized Amenities */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Interior Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.amenities.filter(a => a.includes("kitchen") || a.includes("floor") || a.includes("storage") || a.includes("appliance") || a.includes("interior")).map((amenity, index) => (
                      <div key={`interior-${index}`} className="flex items-center bg-gray-50 p-2 rounded-md">
                        <CheckSquare className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Exterior & Community</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.amenities.filter(a => a.includes("parking") || a.includes("garden") || a.includes("pool") || a.includes("community") || a.includes("exterior")).map((amenity, index) => (
                      <div key={`exterior-${index}`} className="flex items-center bg-gray-50 p-2 rounded-md">
                        <CheckSquare className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Utilities & Other</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.amenities.filter(a => !a.includes("kitchen") && !a.includes("floor") && !a.includes("storage") && 
                                                  !a.includes("appliance") && !a.includes("interior") && !a.includes("parking") && 
                                                  !a.includes("garden") && !a.includes("pool") && !a.includes("community") && 
                                                  !a.includes("exterior")).map((amenity, index) => (
                      <div key={`utility-${index}`} className="flex items-center bg-gray-50 p-2 rounded-md">
                        <CheckSquare className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Gallery Section */}
            <section ref={galleryRef} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Property Gallery</h2>
                <button 
                  onClick={() => setFullscreenGallery(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  <Maximize2 className="w-4 h-4 mr-1" />
                  View All Photos
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {property.images && property.images.slice(0, 6).map((img, index) => (
                  <div 
                    key={index} 
                    className="relative overflow-hidden rounded-lg shadow-sm cursor-pointer group"
                    onClick={() => {
                      setActiveImage(index);
                      setFullscreenGallery(true);
                    }}
                  >
                    <img 
                      src={img} 
                      alt={`${property.title} - Image ${index + 1}`} 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {index === 5 && property.images.length > 6 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white font-medium text-lg">+{property.images.length - 6} more</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Location Section */}
            <section ref={locationRef} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Location</h2>
              <div className="aspect-w-16 aspect-h-9 mb-4">
                {/* Map placeholder - would be a real map integration in production */}
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">{property.location}</p>
                    <p className="text-sm text-gray-400 mt-1">Map integration would appear here</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Neighborhood Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Schools</h4>
                      <p className="text-gray-600 text-sm">Multiple top-rated schools within 2 miles</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Shopping</h4>
                      <p className="text-gray-600 text-sm">Retail centers and grocery stores nearby</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.5V10a2 2 0 00-2-2H5a2 2 0 00-2 2v5.5M5 19h14a2 2 0 002-2v-1.5M12 3v4"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Transportation</h4>
                      <p className="text-gray-600 text-sm">Easy access to public transit and highways</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-yellow-100 p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Entertainment</h4>
                      <p className="text-gray-600 text-sm">Parks, restaurants, and entertainment venues</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Similar Properties Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Properties You May Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarProperties.length > 0 ? (
                  similarProperties.map((prop, index) => (
                    <a key={index} href={`/property/${prop.id}`} className="group">
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={prop.images[0]} 
                            alt={prop.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                            {prop.status}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">{prop.title}</h3>
                          <div className="flex items-center text-gray-600 text-sm mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{prop.location}</span>
                          </div>
                          <div className="font-bold text-gray-900 mb-2">${formatPrice(prop.price)}</div>
                          <div className="flex items-center justify-between text-gray-500 text-sm">
                            <div className="flex items-center">
                              <BedDouble className="w-4 h-4 mr-1" />
                              <span>{prop.bedrooms} beds</span>
                            </div>
                            <div className="flex items-center">
                              <Bath className="w-4 h-4 mr-1" />
                              <span>{prop.bathrooms} baths</span>
                            </div>
                            <div className="flex items-center">
                              <Square className="w-4 h-4 mr-1" />
                              <span>{prop.area} sq ft</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 bg-gray-50 rounded-lg">
                    <Home className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No similar properties found at this time</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column - Summary and Contact */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              {/* Property Overview Card */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Property Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium text-gray-800">{property.status}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-medium text-gray-800">{property.type}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Price</span>
                    <span className="font-bold text-blue-600">₹{formatPrice(property.price)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Area</span>
                    <span className="font-medium text-gray-800">{property.area} sq ft</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Bedrooms</span>
                    <span className="font-medium text-gray-800">{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bathrooms</span>
                    <span className="font-medium text-gray-800">{property.bathrooms}</span>
                  </div>
                </div>
              </div>

              {/* Lease Information Card */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Lease Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium text-gray-800">{property.leaseDuration}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-medium text-gray-800">{formatDate(property.leaseStartDate)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">End Date</span>
                    <span className="font-medium text-gray-800">{formatDate(property.leaseEndDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Availability</span>
                    <span className="font-medium text-green-600">Available Now</span>
                  </div>
                </div>
              </div>

              {/* Agent Card */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mr-4">
                    <img 
                      src="/api/placeholder/100/100" 
                      alt="Agent" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Property Agent</h3>
                    <p className="text-gray-600">Real Estate Professional</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <button 
                    onClick={() => setContactModalOpen(true)}
                    className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Contact Agent
                  </button>
                  
                  <button 
                    onClick={() => setViewingModalOpen(true)}
                    className="w-full flex items-center justify-center py-3 px-4 bg-white text-blue-600 font-medium rounded-md border border-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    Schedule Viewing
                  </button>

                  <a 
                    href="tel:+1234567890" 
                    className="w-full flex items-center justify-center py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call Agent
                  </a>
                </div>
              </div>

              {/* Mortgage Calculator Teaser */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg text-white">
                <h3 className="font-bold text-xl mb-2">Estimate Your Mortgage</h3>
                <p className="text-blue-100 mb-4">Calculate your monthly payments for this property</p>
                <div className="bg-white/20 p-4 rounded-md mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Estimated payment:</span>
                    <span className="font-bold">${Math.round(property.price / 360 * 1.25).toLocaleString()}/mo</span>
                  </div>
                  <div className="text-xs text-blue-100">Based on 30-year fixed rate, 4.5% interest</div>
                </div>
                <button className="w-full bg-white text-blue-600 font-medium py-2 rounded-md hover:bg-blue-50 transition-colors">
                  Use Mortgage Calculator
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Contact Agent About This Property</h3>
              <button 
                onClick={() => setContactModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {formSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h4>
                  <p className="text-gray-600">The agent will contact you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleContactFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactFormChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={contactForm.email}
                      onChange={handleContactFormChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleContactFormChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea 
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactFormChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32" 
                      placeholder="I'm interested in this property..."
                      required
                    ></textarea>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="consent" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                      required
                    />
                    <label htmlFor="consent" className="ml-2 block text-sm text-gray-700">
                      I consent to being contacted about this property
                    </label>
                  </div>
                  <button 
                    type="submit"
                    disabled={formSubmitting}
                    className={`w-full py-3 px-4 ${formSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium rounded-md transition-colors flex items-center justify-center`}
                  >
                    {formSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Viewing Schedule Modal */}
      {viewingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Schedule Property Viewing</h3>
              <button 
                onClick={() => setViewingModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                  <input 
                    type="date" 
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                  <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                    <option value="">Select a time</option>
                    <option>Morning (9:00 AM - 12:00 PM)</option>
                    <option>Afternoon (12:00 PM - 3:00 PM)</option>
                    <option>Evening (3:00 PM - 6:00 PM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="(123) 456-7890"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24" 
                    placeholder="Additional information or questions..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Schedule Viewing
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Gallery Modal */}
      {fullscreenGallery && (
        <div className="fixed inset-0 bg-black z-50 overflow-hidden animate-fadeIn">
          <div className="absolute top-4 right-4 z-10 space-x-2 flex">
            <button 
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-colors"
              onClick={() => setFullscreenGallery(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="h-full flex items-center justify-center px-8">
            <img 
              src={property.images[activeImage]} 
              alt={`${property.title} - Image ${activeImage + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-6 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <p className="text-white font-medium">{activeImage + 1} / {property.images.length}</p>
                <h3 className="text-white font-medium">{property.title}</h3>
              </div>
              
              <div className="relative">
                <div className="flex overflow-x-auto space-x-2 pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {property.images.map((img, index) => (
                    <div 
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-24 h-16 flex-shrink-0 rounded overflow-hidden border-2 ${activeImage === index ? 'border-white' : 'border-transparent'} cursor-pointer`}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;