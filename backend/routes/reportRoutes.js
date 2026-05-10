const express = require("express");
const router = express.Router();
const {
  getIssuedBooksReport,
  getBooksAddedReport,
  getFineCollectionReport,
  getMostIssuedBooks,
  getUsageReport,
  getDamagedBooksReport,
  getOverdueReport,
} = require("../controllers/reportController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// All reports are admin only
router.use(protect, adminOnly);

router.get("/issued", getIssuedBooksReport);
router.get("/books-added", getBooksAddedReport);
router.get("/fines", getFineCollectionReport);
router.get("/most-issued", getMostIssuedBooks);
router.get("/usage", getUsageReport);
router.get("/damaged", getDamagedBooksReport);
router.get("/overdue", getOverdueReport);

module.exports = router;
