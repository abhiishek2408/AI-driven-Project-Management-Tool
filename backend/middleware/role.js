export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export const requireProjectManagerOrAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'ProjectManager' && req.user.role !== 'Admin')) {
    return res.status(403).json({ message: 'ProjectManager or Admin access required' });
  }
  next();
};
