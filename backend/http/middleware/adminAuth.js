export const adminAuth = (req, res, next) => {
  const isAdmin = req.headers["x-admin-key"] === process.env.ADMIN_KEY;

  if (!isAdmin) {
    return res.status(403).json({ message: "Admin access denied" });
  }

  next();
};
