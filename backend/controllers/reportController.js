const mongoose = require("mongoose");
const Book = require("../models/Book");
const IssuedBook = require("../models/IssuedBook");
const User = require("../models/User");

// Utility to build date match using $expr for year and month
const buildDateMatch = (year, month, dateField) => {
  const match = {};

  // Prevent MongoDB crash if the datefield is physically null when we cast it into date expressions
  match[dateField] = { $exists: true, $ne: null };

  if (year || month) {
    const expr = [];
    if (year) expr.push({ $eq: [{ $year: `$${dateField}` }, parseInt(year)] });
    if (month) expr.push({ $eq: [{ $month: `$${dateField}` }, parseInt(month)] });
    
    match.$expr = { $and: expr };
  }
  return match;
};

// 1. Books Issued Report
exports.getIssuedBooksReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const match = buildDateMatch(year, month, "issueDate");

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$issueDate" },
            month: { $month: "$issueDate" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ];

    const rawData = await IssuedBook.aggregate(pipeline);
    
    // Map to chart-friendly format
    const formatted = rawData.map((item) => ({
      label: `${item._id.month}/${item._id.year}`,
      value: item.count,
    }));

    // Fetch raw table data
    const tableData = await IssuedBook.find(match).populate("bookId").populate("userId", "fullName role").sort({ issueDate: -1 });

    res.json({ chartData: formatted, tableData });
  } catch (error) {
    res.status(500).json({ message: "Failed to load report", error: error.message });
  }
};

// 2. Books Added Report
exports.getBooksAddedReport = async (req, res) => {
  try {
    const { year } = req.query; // ONLY use year for purchaseYear
    const match = {};
    if (year) {
      match.purchaseYear = parseInt(year);
    }
    match.isDeleted = false;

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: "$purchaseYear",
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ];

    const rawData = await Book.aggregate(pipeline);
    const formatted = rawData.map((item) => ({
      label: item._id ? item._id.toString() : "Unknown Year",
      value: item.count,
    }));

    const tableData = await Book.find(match).populate("departmentId", "name").sort({ purchaseYear: -1, entryDate: -1 });

    res.json({ chartData: formatted, tableData });
  } catch (error) {
    res.status(500).json({ message: "Failed to load report", error: error.message });
  }
};

// 3. Fine Collection Report
exports.getFineCollectionReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const match = buildDateMatch(year, month, "returnDate");
    match.fineAmount = { $gt: 0 };

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$returnDate" },
            month: { $month: "$returnDate" },
          },
          totalFine: { $sum: "$fineAmount" },
          collectedFine: {
            $sum: { $cond: [{ $eq: ["$fineCollected", true] }, "$fineAmount", 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ];

    const rawData = await IssuedBook.aggregate(pipeline);
    const formatted = rawData.map((item) => ({
      label: `${item._id.month}/${item._id.year}`,
      total: item.totalFine,
      collected: item.collectedFine,
    }));

    const tableData = await IssuedBook.find(match).populate("userId", "fullName role").populate("bookId", "title").sort({ returnDate: -1 });

    res.json({ chartData: formatted, tableData });
  } catch (error) {
    res.status(500).json({ message: "Failed to load report", error: error.message });
  }
};

// 4. Most Issued Books
exports.getMostIssuedBooks = async (req, res) => {
  try {
    const { year, month } = req.query;
    const match = buildDateMatch(year, month, "issueDate");

    const pipeline = [
      { $match: match },
      { $group: { _id: "$bookId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
    ];

    const rawData = await IssuedBook.aggregate(pipeline);
    const formatted = rawData.map((item) => ({
      label: item.bookDetails.title,
      value: item.count,
    }));

    const tableData = rawData; 

    res.json({ chartData: formatted, tableData });
  } catch (error) {
    res.status(500).json({ message: "Failed to load report", error: error.message });
  }
};

// 5. Staff vs Student Usage
exports.getUsageReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const match = buildDateMatch(year, month, "issueDate");

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $group: {
          _id: "$userDetails.role",
          count: { $sum: 1 },
        },
      },
    ];

    const rawData = await IssuedBook.aggregate(pipeline);
    const formatted = rawData.map((item) => ({
      label: item._id,
      value: item.count,
    }));

    const tableData = await IssuedBook.find(match).populate("userId", "fullName role").populate("bookId", "title").sort({ issueDate: -1 });

    res.json({ chartData: formatted, tableData });
  } catch (error) {
    res.status(500).json({ message: "Failed to load report", error: error.message });
  }
};

// 6. Damaged Books Report
exports.getDamagedBooksReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const match = buildDateMatch(year, month, "updatedAt");
    match.status = "damaged";

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$updatedAt" },
            month: { $month: "$updatedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ];

    const rawData = await Book.aggregate(pipeline);
    const formatted = rawData.map((item) => ({
      label: `${item._id.month}/${item._id.year}`,
      value: item.count,
    }));

    const tableData = await Book.find(match).populate("departmentId", "name").sort({ updatedAt: -1 });

    res.json({ chartData: formatted, tableData });
  } catch (error) {
    res.status(500).json({ message: "Failed to load report", error: error.message });
  }
};

// 7. Returned & Overdue Books (Combined or generic)
exports.getOverdueReport = async (req, res) => {
  try {
    const today = new Date();
    // Overdue implicitly means it was due before today and not returned
    const tableData = await IssuedBook.find({
      isReturned: false,
      dueDate: { $lt: today },
    })
      .populate("userId", "fullName role")
      .populate("bookId", "title")
      .sort({ dueDate: 1 });

    let studentCount = 0;
    tableData.forEach(item => {
      if(item.userId && item.userId.role === 'student') studentCount++;
    });

    const formatted = [
      { label: "Students", value: studentCount },
      { label: "Staff", value: tableData.length - studentCount }
    ];

    res.json({ chartData: formatted, tableData });
  } catch (error) {
    res.status(500).json({ message: "Failed to load report", error: error.message });
  }
};
