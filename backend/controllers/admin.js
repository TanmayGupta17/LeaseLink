const express = require('express');
const user = require('../models/user');
const property = require('../models/property');
const LogActivity = require('../models/Logactivity');

const DataAnalytics = async (req, res) => {
    try {
        const totalUsers = await user.countDocuments();
        const activeListings = await property.countDocuments({ status: "active" });
        const newThisWeek = await property.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        });
        // const totalRentals = await db.Rental.countDocuments();
        // const revenue = await db.Rental.aggregate([
        //   { $group: { _id: null, total: { $sum: "$price" } } },
        // ]);
    
        const lineData = await property.aggregate([
          {
            $group: {
              _id: { $month: "$createdAt" },
              listings: { $sum: 1 },
            },
          },
          { $sort: { "_id": 1 } },
        ]);
    
        // const barData = await property.Search.aggregate([
        //   { $group: { _id: "$location", searches: { $sum: 1 } } },
        //   { $sort: { searches: -1 } },
        //   { $limit: 5 },
        // ]);
    
        const pieData = await property.aggregate([
          { $group: { _id: "$type", value: { $sum: 1 } } },
        ]);
    
        res.json({
          kpis: [
            { label: "Total Users", value: totalUsers },
            { label: "Active Listings", value: activeListings },
            { label: "New This Week", value: newThisWeek },
            // { label: "Total Rentals", value: totalRentals },
            // { label: "Revenue", value: `₹${revenue[0]?.total || 0}` },
          ],
          line: lineData.map((d) => ({ month: `Month ${d._id}`, listings: d.listings })),
        //   bar: barData.map((d) => ({ location: d._id, searches: d.searches })),
          pie: pieData.map((d) => ({ type: d._id, value: d.value })),
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
      }
}

const UserManagement = async (req, res) => {
    try {
      const users = await user.find({}); // Fetch all users from the user model
      res.status(200).json({ message: "All Users", users });
    } catch (error) {
      console.log("Error while fetching users", error);
      res.status(500).json({ message: "Error while fetching users" });
    }
};

const GetAllUsers = async (req, res) => {
    try {
        const users = await user.find({}); // Fetch all users from the user model
        res.status(200).json({ message: "All Users", users });
    } catch (error) {
        console.log("Error while fetching users", error);
        res.status(500).json({ message: "Error while fetching users" });
    }
};

const GetUserProperties = async (req, res) => {
  const { userId } = req.query; // Get userId from query parameters
  console.log("User ID:", userId); // Log the userId for debugging
  if(!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const properties = await property.find({ owner: userId });
    if (!properties) {
      return res.status(404).json({ message: "No properties found for this user" });
    }
    res.status(200).json({ message: "User Properties", properties });
  } catch (error) {
    console.log("Error while fetching user properties", error);
    res.status(500).json({ message: "Error while fetching user properties" });
  }
}

const GetUserActivity = async (req, res) => {
  const { userId } = req.query; // Get userId from query parameters
  console.log("User ID:", userId); // Log the userId for debugging
  if(!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const activity = await LogActivity.find({ userId });
    if (!activity) {
      return res.status(404).json({ message: "No activity found for this user" });
    }
    res.status(200).json({ message: "User Activity", activity });
  } catch (error) {
    console.log("Error while fetching user activity", error);
    res.status(500).json({ message: "Error while fetching user activity" });
  }
}

const UpdateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;
  
    try {
      const userToUpdate = await user.findById(id);
      if (!userToUpdate) {
        return res.status(404).json({ message: "User not found" });
      }
  
      userToUpdate.name = name || userToUpdate.name;
      userToUpdate.email = email || userToUpdate.email;
      userToUpdate.role = role || userToUpdate.role;
  
      await userToUpdate.save();
  
      res.status(200).json({ message: "User updated successfully", user: userToUpdate });
    } catch (error) {
      console.log("Error while updating user", error);
      res.status(500).json({ message: "Error while updating user" });
    }
};

const DeleteUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      const userToDelete = await user.findById(id);
      if (!userToDelete) {
        return res.status(404).json({ message: "User not found" });
      }
  
      await user.findByIdAndDelete(id);
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.log("Error while deleting user", error);
      res.status(500).json({ message: "Error while deleting user" });
    }
};

const UpdateUserProperty = async (req, res) => {
    const { id } = req.params;
    const { title, description, price, type, status } = req.body;
  
    try {
      const propertyToUpdate = await property.findById(id);
      if (!propertyToUpdate) {
        return res.status(404).json({ message: "Property not found" });
      }
  
      propertyToUpdate.title = title || propertyToUpdate.title;
      propertyToUpdate.description = description || propertyToUpdate.description;
      propertyToUpdate.price = price || propertyToUpdate.price;
      propertyToUpdate.type = type || propertyToUpdate.type;
      propertyToUpdate.status = status || propertyToUpdate.status;
  
      await property.findByIdAndUpdate(id, propertyToUpdate, { new: true });
  
      res.status(200).json({ message: "Property updated successfully", property: propertyToUpdate });
    } catch (error) {
      console.log("Error while updating property", error);
      res.status(500).json({ message: "Error while updating property" });
    }
}

const DeleteUserProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const propertyToDelete = await property.findById(id);

    if (!propertyToDelete) {
      return res.status(404).json({ message: "Property not found" });
    }

    await property.findByIdAndDelete(id);

    return res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error while deleting property:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
    DataAnalytics,
    UserManagement,
    GetAllUsers,
    GetUserProperties,
    GetUserActivity,
    UpdateUser,
    DeleteUser,
    UpdateUserProperty,
    DeleteUserProperty,
};