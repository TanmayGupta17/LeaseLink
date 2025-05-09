const Property = require("../models/property");
const LogActivity = require("../models/Logactivity");
const User = require("../models/user");

const CreateProperty = async (req, res) => {
  try {
    const {
      title, description, price, location, type, bathrooms,
      bedrooms, area, amenities, leaseDuration, leaseStartDate, leaseEndDate
    } = req.body;

    // Validate required fields
    if (
      !title || !description || !price || !location || !type ||
      !bathrooms || !bedrooms || !area || !amenities || !leaseDuration ||
      !leaseStartDate || !leaseEndDate
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate that at least one image is uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required." });
    }

    // Convert amenities to an array if it is a comma-separated string
    const amenitiesArray = Array.isArray(amenities) ? amenities : amenities.split(',').map(item => item.trim());

    // Validate amenities
    if (!Array.isArray(amenitiesArray) || amenitiesArray.length === 0) {
      return res.status(400).json({ message: "Amenities must be a non-empty array." });
    }

    // Validate and convert leaseStartDate and leaseEndDate
    const startDate = new Date(leaseStartDate);
    const endDate = new Date(leaseEndDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format for leaseStartDate or leaseEndDate." });
    }

    // Ensure leaseEndDate is after leaseStartDate
    if (endDate <= startDate) {
      return res.status(400).json({ message: "leaseEndDate must be after leaseStartDate." });
    }

    // Extract image URLs from req.files
    const imageUrls = req.files.map(file => file.path); // Cloudinary gives secure URLs

    // Create the property
    const property = await Property.create({
      title,
      description,
      price,
      location,
      images: imageUrls,
      type,
      bathrooms,
      bedrooms,
      area,
      amenities: amenitiesArray, // Use the parsed amenities array
      leaseDuration,
      leaseStartDate: startDate, // Save as Date object
      leaseEndDate: endDate,     // Save as Date object
      owner: req.user._id // Assuming `req.user` contains the authenticated user's data
    });
     
    const logActivity = await LogActivity.create({
      userId: req.user._id,
      activityType: "property_creation",
      action: "User created a property",
      details: { propertyId: property._id, title: property.title, location: property.location },
    });
    const updateUser = await User.findByIdAndUpdate(existingUser._id, {
            lastActivity: new Date(),
        }, { new: true });
    // Send success response
    return res.status(201).json({ message: "Property created successfully", property });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error while creating property" });
  }
};

const GetAllProperties = async(req,res) => {
    try {
        const allProperties = await Property.find({});
        console.log(allProperties.title );
        return res.status(200).json({message: "All Properties", allProperties});
    } catch (error) {
        console.log("Error while fetching properties",error);
        return res.status(500).json({message:"Error while fetching properties"});
    }
}

const GetPropertyById = async (req, res) => {
    try {
        const propertyId = req.params.id;
        console.log("Property ID:", propertyId); // Log the property ID for debugging
        const property = await Property.findById(propertyId);
        console.log("Fetched Property:", property); // Log the fetched property for debugging
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        const logActivity = await LogActivity.create({
          userId: req.user._id,
          activityType: "property_view",
          action: "User viewed property",
          details: {propertyId: property._id, title: property.title, location: property.location },
      });
      console.log(req.user._id);
      const updateUser = await User.findByIdAndUpdate(req.user._id, {
        lastActivity: new Date(),
      }, { new: true });
        return res.status(200).json({ message: "Property found", property });
    }
    catch (error) {
        console.error("Error while fetching property by ID", error);
        return res.status(500).json({ message: "Error while fetching property" });
    }
}

const GetUserProperties = async (req, res) => {
  try {
      const userId = req.user._id;
      console.log("User ID:", userId);

      const properties = await Property.find({ owner: userId });

      if (!properties || properties.length === 0) {
          return res.status(404).json({ message: "No properties found for this user" });
      }

      return res.status(200).json({ message: "User properties found", properties });
  } catch (error) {
      console.error("Error while fetching user properties", error);
      return res.status(500).json({ message: "Error while fetching user properties", error: error.message });
  }
};


module.exports = { 
    CreateProperty,
    GetAllProperties,
    GetPropertyById,
    GetUserProperties
};