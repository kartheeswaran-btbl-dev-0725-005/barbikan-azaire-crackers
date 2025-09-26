import { useState, useEffect } from 'react';
import { FaRupeeSign, FaShoppingCart, FaStar } from 'react-icons/fa';
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '../../../../shared/components/ui/Card';
import apiClient, { getSession } from '@/shared/utils/apiClient';

// Map dropdown labels to number of days
const PERIODS_IN_DAYS = {
	'Last 7 days': 7,
	'Last 30 days': 30,
	'Last 90 days': 90,
	'Last 6 Months': 180,
	'Last Year': 365,
};

function SalesReportStats({ period }) {
	const [stats, setStats] = useState([]);

	useEffect(() => {
		const fetchSalesStats = async () => {
			const session = getSession();
			if (!session) return;

			try {
				const endDate = new Date(); // today
				const startDate = new Date();
				startDate.setDate(endDate.getDate() - (PERIODS_IN_DAYS[period] || 30));

				const formatDate = (date) => date.toISOString().split('T')[0];

				const response = await apiClient.get(
					`/sales-reports/${session.tenantId}/${session.organizationId}/${formatDate(
						startDate
					)}/${formatDate(endDate)}/lists`
				);

				const data = response.data.data;

				const statsData = [
					{
						title: 'Total Orders',
						value: data.total_orders,
						icon: FaShoppingCart,
						percentage: data.total_orders_percentage,
					},
					{
						title: 'Total Sales',
						value: `₹${data.total_sales.toLocaleString()}`,
						icon: FaRupeeSign,
						percentage: data.total_sales_percentage,
					},
					{
						title: 'Avg Order Value',
						value: `₹${data.avg_order_value.toLocaleString()}`,
						icon: FaRupeeSign,
						percentage: data.avg_order_percentage,
					},
					{
						title: 'Conversion Rate',
						value: `${data.conversion_rate}%`,
						icon: FaStar,
						percentage: data.conversion_rate_percentage,
					},
				];

				setStats(statsData);
			} catch (error) {
				console.error(
					'❌ Failed to fetch sales report stats:',
					error.response?.data || error.message
				);
			}
		};

		fetchSalesStats();
	}, [period]);

	return (
		<>
			{stats.map((item) => {
				const IconToRender = item.icon;
				const formattedPercentage =
					item.percentage !== null
						? `${item.percentage >= 0 ? '+' : ''}${item.percentage.toFixed(
								1
						  )}% from last period`
						: '–';

				return (
					<Card key={item.title}>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-xs font-medium'>{item.title}</CardTitle>
							<IconToRender size={16} style={{ color: 'var(--color-muted)' }} />
						</CardHeader>
						<CardContent>
							<div className='text-xl font-bold'>{item.value}</div>
							<div className='text-xs text-muted-foreground mt-1'>
								{formattedPercentage}
							</div>
						</CardContent>
					</Card>
				);
			})}
		</>
	);
}

export default SalesReportStats;
