const Book = require("../models/Book");
const IssuedBook = require("../models/IssuedBook");
const BookRequest = require("../models/BookRequest");
const User = require("../models/User");

// ---------------- ADD BOOK (LIBRARIAN) ----------------
exports.addBook = async (req, res) => {
  try {
    const {
      serialNumber,
      accessionNumber,
      title,
      author,
      publication,
      edition,
      purchaseYear,
      price,
      shelf,
      rack,
    } = req.body;

    // basic validation
    if (!accessionNumber || !title || !author) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // check duplicate accession number
    const existingBook = await Book.findOne({ accessionNumber });
    if (existingBook) {
      return res
        .status(409)
        .json({ message: "Accession number already exists" });
    }

    const book = new Book({
      serialNumber,
      accessionNumber,
      title,
      author,
      publication,
      edition,
      purchaseYear,
      price,
      shelf,
      rack,
      departmentId: req.user.departmentId, // librarian’s department
      status: "available",
    });

    await book.save();

    res.status(201).json({
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add book",
      error: error.message,
    });
  }
};

// ---------------- SEARCH BOOKS ----------------
exports.searchBooks = async (req, res) => {
  try {
    const { q } = req.query;

    const searchQuery = {
      departmentId: req.user.departmentId,
      isDeleted: false,
      status: { $ne: "damaged" },
    };

    if (q) {
      searchQuery.$or = [
        { title: { $regex: q, $options: "i" } },
        { author: { $regex: q, $options: "i" } },
        { publication: { $regex: q, $options: "i" } },
        { accessionNumber: { $regex: q, $options: "i" } },
      ];
    }

    const books = await Book.find(searchQuery).sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: "Failed to search books",
      error: error.message,
    });
  }
};

// ---------------- MARK BOOK AS DAMAGED ----------------
exports.markDamaged = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { reason } = req.body;

    const book = await Book.findById(bookId);

    if (!book || book.isDeleted) {
      return res.status(404).json({ message: "Book not found" });
    }

    // ensure librarian only affects own department
    if (req.user.role !== 'admin' && book.departmentId !== req.user.departmentId) {
      return res.status(403).json({ message: "Access denied" });
    }

    book.status = "damaged";
    book.damagedReason = reason || "Not specified";

    await book.save();

    res.json({ message: "Book marked as damaged", book });
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark damaged",
      error: error.message,
    });
  }
};

// ---------------- GET DAMAGED BOOKS ----------------
exports.getDamagedBooks = async (req, res) => {
  try {
    const books = await Book.find({
      departmentId: req.user.departmentId,
      status: "damaged",
      isDeleted: false,
    }).sort({ updatedAt: -1 });

    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch damaged books",
      error: error.message,
    });
  }
};

// ---------------- RESTORE BOOK ----------------
exports.restoreBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);

    if (!book || book.isDeleted) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.departmentId !== req.user.departmentId) {
      return res.status(403).json({ message: "Access denied" });
    }

    book.status = "available";
    book.damagedReason = null;

    await book.save();

    res.json({ message: "Book restored successfully", book });
  } catch (error) {
    res.status(500).json({
      message: "Failed to restore book",
      error: error.message,
    });
  }
};


// ---------------- REQUEST BOOK ----------------
exports.requestBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);

    if (!book || book.isDeleted) {
      return res.status(404).json({ message: "Book not found" });
    }

    // department isolation
    if (book.departmentId !== req.user.departmentId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // must be available
    if (book.status !== "available") {
      return res.status(400).json({ message: "Book not available" });
    }

    // check if already requested
    const existingRequest = await BookRequest.findOne({
      bookId,
      status: "pending",
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Book already requested by someone" });
    }

    const request = new BookRequest({
      bookId,
      userId: req.user.userId,
      departmentId: req.user.departmentId,
      status: "pending",
    });

    await request.save();

    // update book status
    book.status = "requested";
    await book.save();

    res.status(201).json({
      message: "Book request submitted",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to request book",
      error: error.message,
    });
  }
};

// ---------------- GET PENDING REQUESTS (LIBRARIAN) ----------------
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await BookRequest.find({
      departmentId: req.user.departmentId,
      status: "pending",
    })
      .populate("bookId")
      .populate("userId", "-password")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch requests",
      error: error.message,
    });
  }
};


// ---------------- APPROVE REQUEST ----------------
exports.approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await BookRequest.findById(requestId);

    if (!request || request.status !== "pending") {
      return res.status(404).json({ message: "Invalid request" });
    }

    // department protection
    if (request.departmentId !== req.user.departmentId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const book = await Book.findById(request.bookId);
    const user = await User.findById(request.userId);

    if (!book || !user) {
      return res.status(404).json({ message: "Book or user not found" });
    }

    // update request status
    request.status = "approved";
    await request.save();

    // update book status
    book.status = "issued";
    await book.save();

    // calculate due date (only for students)
    let dueDate = null;

    if (user.role === "student") {
      const returnDays = 7; // temporary fixed value
      dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + returnDays);
    }

    const issued = new IssuedBook({
      bookId: book._id,
      userId: user._id,
      librarianId: req.user.userId, // 👈 ADD THIS
      departmentId: request.departmentId,
      issueDate: new Date(),
      dueDate: dueDate,
      status: "issued",
    });

    await issued.save();

    res.json({
      message: "Request approved and book issued",
      issued,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to approve request",
      error: error.message,
    });
  }
};

// ---------------- REJECT REQUEST ----------------
exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { reason } = req.body;

    const request = await BookRequest.findById(requestId);

    if (!request || request.status !== "pending") {
      return res.status(400).json({ message: "Invalid request" });
    }

    if (request.departmentId !== req.user.departmentId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const book = await Book.findById(request.bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // update request
    request.status = "rejected";
    request.rejectionReason = reason || "Not specified";
    await request.save();

    // restore book availability
    book.status = "available";
    await book.save();

    res.json({
      message: "Request rejected",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to reject request",
      error: error.message,
    });
  }
};

// ---------------- RETURN BOOK ----------------
exports.returnBook = async (req, res) => {
  try {
    const { issuedId } = req.params;

    const issued = await IssuedBook.findById(issuedId)
      .populate("bookId")
      .populate("userId", "-password");

    if (!issued || issued.isReturned) {
      return res.status(400).json({ message: "Invalid or already returned" });
    }

    // department protection
    if (String(issued.departmentId) !== String(req.user.departmentId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const today = new Date();
    let fine = 0;

    // calculate fine only for students
    if (issued.userId && issued.userId.role === "student" && issued.dueDate) {
      if (today > issued.dueDate) {
        const diffTime = today - issued.dueDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const finePerDay = 10; // temporary fixed fine
        fine = diffDays * finePerDay;
      }
    }

    // update issued record
    issued.isReturned = true;
    issued.returnDate = today;
    issued.fineAmount = fine;

    await issued.save();

    // update book
    if (issued.bookId) {
      const book = await Book.findById(issued.bookId._id);
      if (book) {
        book.status = "available";
        await book.save();
      }
    }

    res.json({
      message: "Book returned successfully",
      fineAmount: fine,
      issued,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to return book",
      error: error.message,
    });
  }
};

// ---------------- GET ISSUED BOOKS ----------------
exports.getIssuedBooks = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {
      departmentId: req.user.departmentId, // 👈 important
    };

    if (status === "active") {
      filter.isReturned = false;
    } else if (status === "returned") {
      filter.isReturned = true;
    }

    const issuedBooks = await IssuedBook.find(filter)
      .populate("bookId")
      .populate("userId", "-password")
      .populate("librarianId", "-password")
      .sort({ createdAt: -1 });

    res.json(issuedBooks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch issued books",
      error: error.message,
    });
  }
};

// ---------------- COLLECT FINE ----------------
exports.collectFine = async (req, res) => {
  try {
    const { issuedId } = req.params;

    const issued = await IssuedBook.findById(issuedId);

    if (!issued) {
      return res.status(404).json({ message: "Issued record not found" });
    }

    if (!issued.isReturned) {
      return res.status(400).json({ message: "Book not yet returned" });
    }

    if (issued.fineAmount <= 0) {
      return res.status(400).json({ message: "No fine to collect" });
    }

    if (issued.fineCollected) {
      return res.status(400).json({ message: "Fine already collected" });
    }

    issued.fineCollected = true;
    await issued.save();

    res.json({
      message: "Fine collected successfully",
      issued,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to collect fine",
      error: error.message,
    });
  }
};

// ---------------- GET MY REQUESTS (STUDENT) ----------------
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await BookRequest.find({
      userId: req.user.userId,
    })
      .populate("bookId")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch requests",
      error: error.message,
    });
  }
};

// ---------------- GET MY ISSUED BOOKS (STUDENT) ----------------
exports.getMyIssuedBooks = async (req, res) => {
  try {
    const issuedBooks = await IssuedBook.find({
      userId: req.user.userId,
    })
      .populate("bookId")
      .sort({ createdAt: -1 });

    res.json(issuedBooks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch issued books",
      error: error.message,
    });
  }
};

// ---------------- LIBRARIAN STATS ----------------
exports.getLibrarianStats = async (req, res) => {
  try {
    const deptId = req.user.departmentId;

    const books = await Book.find({ departmentId: deptId, isDeleted: false });
    const issuedBooks = await IssuedBook.find({ departmentId: deptId });

    // Calculate unique students and staff served
    const uniqueUserIds = [...new Set(issuedBooks.map(i => i.userId.toString()))];
    const usersServed = await User.find({ _id: { $in: uniqueUserIds } });

    res.json({
      totalBooks: books.length,
      issuedBooks: issuedBooks.filter(i => !i.isReturned).length,
      returnedBooks: issuedBooks.filter(i => i.isReturned).length,
      availableBooks: books.filter(b => b.status === "available").length,
      staffServed: usersServed.filter(u => u.role === "staff").length,
      studentsServed: usersServed.filter(u => u.role === "student").length,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch librarian stats", error: error.message });
  }
};

// ---------------- GET ALL BOOKS (ADMIN) ----------------
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books", error: error.message });
  }
};
