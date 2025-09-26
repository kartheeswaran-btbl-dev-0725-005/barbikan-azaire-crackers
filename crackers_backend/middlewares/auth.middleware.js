const jwt = require('jsonwebtoken');
const config = require('../config/db.config');

exports.authenticate = (req, res, next) => {
	try {
		const authHeader = req.headers['authorization'];
		if (!authHeader) {
			return res.status(401).json({ message: 'Authorization header missing' });
		}

		const token = authHeader.split(' ')[1];
		if (!token) {
			return res.status(401).json({ message: 'Access Token missing' });
		}

		const decoded = jwt.verify(token, config.ACCESS_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(403).json({ message: 'Invalid or expired token' });
	}
};
