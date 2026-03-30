/**
 * Role-based access control. Call after authenticate().
 * Usage: requireRoles('admin', 'manager')
 *
 * Roles are stored as strings on req.user.role (set during JWT signing).
 */
function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
  };
}

module.exports = { requireRoles };
