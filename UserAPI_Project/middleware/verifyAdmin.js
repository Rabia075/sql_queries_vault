// middleware/verifyAdmin.js
module.exports = (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      next(); // allow
    } else {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};