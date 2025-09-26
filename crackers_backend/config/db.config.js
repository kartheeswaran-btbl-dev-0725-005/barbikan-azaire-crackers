require('dotenv').config();

module.exports = {
	// JWT secret key used for signing and verifying authentication tokens
	ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
	REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

	// Database connection configuration
	DB: {
		HOST: process.env.DB_HOST || 'localhost', // Database server host
		USER: process.env.DB_USER || 'root', // Database username
		PASSWORD: process.env.DB_PASSWORD || '', // Database password
		NAME: process.env.DB_NAME, // Database name
		DIALECT: 'mysql', // Database dialect (MySQL)
	},
};
