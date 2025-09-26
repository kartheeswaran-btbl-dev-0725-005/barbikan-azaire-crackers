const moment = require('moment');

function formatDatesTime(data, options = { includeDeletedAt: false }) {
	if (!data) return [];

	const formatSingle = (item) => {
		const raw = item.dataValues || item;

		const formatted = {
			...raw,
			createdAt: raw.createdAt
				? moment(raw.createdAt).format('DD-MM-YYYY hh:mm A')
				: null,
			updatedAt: raw.updatedAt
				? moment(raw.updatedAt).format('DD-MM-YYYY hh:mm A')
				: null,
		};

		// Only add deletedAt if requested
		if (options.includeDeletedAt && raw.deletedAt) {
			formatted.deletedAt = moment(raw.deletedAt).format('DD-MM-YYYY hh:mm A');
		}

		delete formatted.password;
		return formatted;
	};

	return Array.isArray(data) ? data.map(formatSingle) : formatSingle(data);
}

module.exports = { formatDatesTime };
