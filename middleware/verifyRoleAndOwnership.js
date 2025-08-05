
const verifyRoleAndOwnership = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    console.log("🧪 verifyRoleAndOwnership called with:", allowedRoles);
    console.log("👤 req.user:", req.user);
    console.log("🧑‍💼 user.role:", user.role);

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    console.log("🧩 Final allowed roles array:", roles);
    console.log("👤 User role from token:", user.role);

    if (!user || !roles.includes(user.role)) {
      console.log("❌ Rejected due to role mismatch.");
      return res.status(403).json({ message: 'Access denied: Invalid role' });
    }

    if (user.role === 'admin') {
      return next();
    }

    if (user.role === 'student') {
      if (!req.params.id) return next(); // /me
      const requestedId = parseInt(req.params.id, 10);
      const studentId = parseInt(user.studentId, 10);
      if (studentId === requestedId) return next();
      return res.status(403).json({ message: 'Access denied: Not your record' });
    }

    if (user.role === 'instructor') {
      // Allow access if route is /me or /my-courses
      if (!req.params.id) return next(); // i.e., no ID in path
      const requestedId = parseInt(req.params.id, 10);
      const instructorId = parseInt(user.id, 10);

      console.log("📌 instructorId from token:", instructorId);
      if (instructorId === requestedId) return next();
      return res.status(403).json({ message: 'Access denied: Not your record' });
    }

    return res.status(403).json({ message: 'Access denied' });
  };
};

module.exports = verifyRoleAndOwnership;