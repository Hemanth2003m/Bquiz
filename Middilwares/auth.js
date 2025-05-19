const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const protect = (req, res, next) => {
  let token;

  // Usually token sent in Authorization header as "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // attach decoded token info to request object
    next();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token is not valid' });
  }
};

module.exports = protect;
