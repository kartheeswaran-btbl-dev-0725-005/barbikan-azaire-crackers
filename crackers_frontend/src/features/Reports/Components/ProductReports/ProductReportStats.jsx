import { useState, useEffect } from 'react';
import { FiTrendingDown, FiBox, FiAlertCircle } from 'react-icons/fi';
import { LuIndianRupee } from 'react-icons/lu';
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

function ProductReportStats({ period }) {
	const [stats, setStats] = useState([]);

	useEffect(() => {
		const fetchProductStats = async () => {
			const session = getSession();
			if (!session) return;

			try {
				const endDate = new Date();
				const startDate = new Date();
				startDate.setDate(endDate.getDate() - (PERIODS_IN_DAYS[period] || 30));

				const formatDate = (date) => date.toISOString().split('T')[0];

				const response = await apiClient.get(
					`/product-reports/${session.tenantId}/${
						session.organizationId
					}/${formatDate(startDate)}/${formatDate(endDate)}/lists`
				);

				const data = response.data.data.stats || {};

				const statsData = [
					{
						title: 'Total Products',
						value: data.total_products || 0,
						message: `Categories: ${data.category_count || 0}`,
						icon: FiBox,
					},
					{
						title: 'Inventory Value',
						value: `₹${(data.inventory_value || 0).toLocaleString()}`,
						message: 'Total stock value',
						icon: LuIndianRupee,
					},
					{
						title: 'Low Stock Items',
						value: data.low_stock_count || 0,
						message: 'Need reordering',
						icon: FiAlertCircle,
					},
					{
						title: 'Out of Stock',
						value: data.out_of_stock_count || 0,
						message: 'Urgent attention',
						icon: FiTrendingDown,
					},
				];

				setStats(statsData);
			} catch (error) {
				console.error(
					'❌ Failed to fetch product report stats:',
					error.response?.data || error.message
				);
			}
		};

		fetchProductStats();
	}, [period]);

	return (
		<>
			{stats.map((item) => {
				const IconToRender = item.icon;

				const isCritical =
					(item.title === 'Low Stock Items' && item.value <= 5) ||
					(item.title === 'Out of Stock' && item.value > 0);

				return (
					<Card key={item.title}>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-xs font-medium'>{item.title}</CardTitle>
							<IconToRender size={16} style={{ color: 'var(--color-muted)' }} />
						</CardHeader>
						<CardContent>
							<div className={`text-xl font-bold ${isCritical ? 'text-red-500' : ''}`}>
								{item.value}
							</div>
							<div className='text-xs text-muted-foreground mt-1'>{item.message}</div>
						</CardContent>
					</Card>
				);
			})}
		</>
	);
}

export default ProductReportStats;
