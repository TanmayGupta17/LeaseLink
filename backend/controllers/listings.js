const Property = require("../models/property");

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

module.exports = { 
    CreateProperty,
    GetAllProperties 
};