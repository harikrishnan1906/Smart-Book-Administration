const express = require("express");
const router = express.Router();

const {
  addBook,
  searchBooks,
  markDamaged,
  getDamagedBooks,
  restoreBook,
  requestBook,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  returnBook,
  getIssuedBooks,
  collectFine,
  getMyRequests,
  getMyIssuedBooks,
  getLibrarianStats,
} = require("../controllers/bookController");


const { protect, librarianOnly, adminOrLibrarian, adminOnly } = require("../middleware/authMiddleware");

// librarian adds book
router.post("/add", protect, librarianOnly, addBook);

// admin get all books
router.get("/all", protect, adminOnly, require("../controllers/bookController").getAllBooks);

// librarian stats
router.get("/librarian-stats", protect, librarianOnly, getLibrarianStats);

// all logged-in users can search
router.get("/search", protect, searchBooks);

//Mark damaged books
router.put("/damaged/:bookId", protect, adminOrLibrarian, markDamaged);

//Get damaged books
router.get("/damaged", protect, librarianOnly, getDamagedBooks);

//Restore damaged books
router.put("/restore/:bookId", protect, librarianOnly, restoreBook);

//Once one request exists, block others.
router.post("/request/:bookId", protect, requestBook);

//Get pending request
router.get("/requests/pending", protect, librarianOnly, getPendingRequests);

//Aprove book request
router.put(
  "/requests/approve/:requestId",
  protect,
  librarianOnly,
  approveRequest,
);


//Reject books
router.put(
  "/requests/reject/:requestId",
  protect,
  librarianOnly,
  rejectRequest,
);


//Return book
router.put("/return/:issuedId", protect, librarianOnly, returnBook);

//Get issued books
router.get("/issued", protect, librarianOnly, getIssuedBooks);

//Fine collection
router.put("/fine/collect/:issuedId", protect, librarianOnly, collectFine);



//Get my request (student)
router.get("/requests/my", protect, getMyRequests);

//Get my issued books (student)
router.get("/issued/my", protect, getMyIssuedBooks);

module.exports = router;
