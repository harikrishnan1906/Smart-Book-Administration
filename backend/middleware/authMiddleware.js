const jwt = require("jsonwebtoken");

// verify token
exports.protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role, departmentId }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// allow only admin
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

// allow only librarian
exports.librarianOnly = (req, res, next) => {
  if (req.user.role !== "librarian") {
    return res.status(403).json({ message: "Librarian access only" });
  }
  next();
};

// allow admin or librarian
exports.adminOrLibrarian = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "librarian") {
    return res.status(403).json({ message: "Admin or Librarian access only" });
  }
  next();
};

// allow staff or student
exports.staffStudentOnly = (req, res, next) => {
  if (req.user.role !== "staff" && req.user.role !== "student") {
    return res
      .status(403)
      .json({ message: "Staff or student access only" });
  }
  next();
};

// allow any logged-in user
exports.anyUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Login required" });
  }
  next();
};
