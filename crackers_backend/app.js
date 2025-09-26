const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');
const path = require('path');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// ✅ CORS setup
const allowAll = process.env.ALLOW_ALL_ORIGINS === 'true';
const allowedOrigins = process.env.ALLOWED_ORIGINS
	? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
	: [];

app.use(
	cors({
		origin: allowAll ? true : allowedOrigins,
		credentials: true,
	})
);

app.use(express.json());
app.use('/api/v1/uploads', express.static(path.join(__dirname, 'uploads'))); // Safe and reliable (absolute path)
app.use('/api/v1', routes);

module.exports = app;
