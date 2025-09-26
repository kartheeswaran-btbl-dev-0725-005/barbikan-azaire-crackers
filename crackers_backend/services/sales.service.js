const { Sales } = require('../models');
const { formatDatesTime } = require('../utils/formatdatetime.util');
const { checkPermission } = require('../utils/permission.util');

exports.getAllSales = async (tenantUserPayload) => {
	await checkPermission(tenantUserPayload, 'sales');

	const sales = await Sales.findAll({
		where: { tenant_id: tenantUserPayload.tenant_id },
		paranoid: false,
		order: [['createdAt', 'ASC']],
	});

	if (!sales || sales.length === 0) {
		return {
			success: true,
			message: 'No sales found',
			total_count: 0,
			today_count: 0,
			week_count: 0,
			month_count: 0,
			today_total: 0,
			week_total: 0,
			month_total: 0,
			digital_total: 0,
			cash_total: 0,
			data: [],
		};
	}

	const now = new Date();

	const isToday = (date) => new Date(date).toDateString() === now.toDateString();

	const isThisWeek = (date) => {
		const d = new Date(date);
		const start = new Date(now);
		start.setDate(now.getDate() - now.getDay()); // Sunday
		start.setHours(0, 0, 0, 0);
		const end = new Date(start);
		end.setDate(start.getDate() + 7);
		return d >= start && d < end;
	};

	const isThisMonth = (date) => {
		const d = new Date(date);
		return (
			d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
		);
	};

	let todayCount = 0,
		weekCount = 0,
		monthCount = 0,
		todayTotal = 0,
		weekTotal = 0,
		monthTotal = 0,
		digitalTotal = 0,
		cashTotal = 0;

	for (const sale of sales) {
		const date = sale.date || sale.createdAt;

		if (isToday(date)) {
			todayCount++;
			todayTotal += parseFloat(sale.total_amount);
		}
		if (isThisWeek(date)) {
			weekCount++;
			weekTotal += parseFloat(sale.total_amount);
		}
		if (isThisMonth(date)) {
			monthCount++;
			monthTotal += parseFloat(sale.total_amount);
		}

		if (sale.payment_method === 'UPI' || sale.payment_method === 'Card') {
			digitalTotal += parseFloat(sale.total_amount);
		} else if (sale.payment_method === 'Cash') {
			cashTotal += parseFloat(sale.total_amount);
		}
	}

	return {
		success: true,
		message: 'Sales fetched successfully',
		total_count: sales.length,
		today_count: todayCount,
		week_count: weekCount,
		month_count: monthCount,
		today_total: todayTotal,
		week_total: weekTotal,
		month_total: monthTotal,
		digital_total: digitalTotal,
		cash_total: cashTotal,
		data: formatDatesTime(sales, { includeDeletedAt: true }),
	};
};
