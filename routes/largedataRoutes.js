const express = require("express");
const LargeData = require("../models/LargeData"); // Mongoose model for MongoDB

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    // Assuming you want to search based on a query parameter called 'message'
    const message = req.query.key;

    // If message is not provided, return a bad request response
    if (!message) {
      return res.status(400).json({ error: "Message query parameter is required" });
    }


    // Use a regular expression to perform a case-insensitive search
    const regex = new RegExp(message, 'i'); // 'i' for case-insensitive

    // Find data in the database using the regex to match any message containing the given string
    const data = await LargeData.countDocuments({ message: { $regex: message, $options: "i" } });

    // For demonstration, we'll just return the message
    res.status(200).json({
      message: "Data retrieved successfully",
      searchKey: message,
      data: data,
    });

  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/store", async (req, res) => {
  try {
    const totalDocuments = 200000; // Adjust the number as needed
    const batchSize = 20000; // Insert data in batches
    const batches = Math.ceil(totalDocuments / batchSize);

    for (let i = 0; i < batches; i++) {
      const batch = [];
      for (let j = 0; j < batchSize; j++) {
        batch.push({
          senderId: "67615705292b72d386fe94ca",
          receiverId: "676180ad1b09737888e6a41a",
          message: Math.random().toString(36).substr(2, 10),
          timestamp: new Date(),
          status: "sent",
          chatRoomId: "676180ad1b09737888e6a41a",
          isEncrypted: Math.random() < 0.5,
          isDeleted: false,
        });
      }

      // Insert the batch into MongoDB
      await LargeData.insertMany(batch);
      console.log(`Batch ${i + 1}/${batches} inserted`);
    }

    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
