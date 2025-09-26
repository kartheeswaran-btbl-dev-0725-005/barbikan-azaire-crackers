import { useState, useEffect } from 'react';
import InventoryReportStats from './InventoryReportStats';
import StockMovementTrend from './StockMovementTrend';
import StockbyCategory from './StockbyCategory';
import InventoryValuationbyCategory from './InventoryValuationbyCategory';
import InventoryPerformanceMetrics from './InventoryPerformanceMetrics';
import apiClient, { getSession } from '@/shared/utils/apiClient';

const PERIODS_IN_DAYS = {
	'Last 7 days': 7,
	'Last 30 days': 30,
	'Last 90 days': 90,
	'Last 6 Months': 180,
	'Last Year': 365,
};

function InventoryReports({ period }) {
	const [stats, setStats] = useState({});
	const [stockByCategory, setStockByCategory] = useState([]);
	const [performance, setPerformance] = useState({});

	useEffect(() => {
		const fetchInventoryData = async () => {
			const session = getSession();
			if (!session) return;

			try {
				// Calculate start and end dates for filter
				const today = new Date();
				today.setHours(23, 59, 59, 999);

				const startDate = new Date();
				startDate.setDate(today.getDate() - (PERIODS_IN_DAYS[period] || 30) + 1);
				startDate.setHours(0, 0, 0, 0);

				const formatDate = (d) => d.toISOString().split('T')[0];

				const response = await apiClient.get(
					`/inventory-reports/${session.tenantId}/${
						session.organizationId
					}/${formatDate(startDate)}/${formatDate(today)}/lists`
				);

				const data = response.data.data || {};
				setStats(data.stats || {});
				setStockByCategory(data.stock_by_category || []);
				setPerformance(data.inventory_performance || {});
			} catch (err) {
				console.error('❌ Failed to fetch inventory report:', err);
			}
		};

		fetchInventoryData();
	}, [period]);

	return (
		<>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5'>
				<InventoryReportStats stats={stats} />
			</div>

			<div className='flex flex-col'>
				<div className='grid gap-6 lg:grid-cols-2 mb-5'>
					<StockMovementTrend />
					<StockbyCategory stockData={stockByCategory} />
				</div>
				<div className='grid gap-6 lg:grid-cols-2 mb-5'>
					<InventoryValuationbyCategory stockData={stockByCategory} />
					<InventoryPerformanceMetrics performance={performance} />
				</div>
			</div>
		</>
	);
}

export default InventoryReports;
