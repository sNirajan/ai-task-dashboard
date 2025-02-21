const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin'){
        return res.status(403).json({ message: 'Access denied. Admins only'});
    }
    next();
};

module.exports = isAdmin;


/* Explanation: This middleware checks if the user's role is admin before allowing access */