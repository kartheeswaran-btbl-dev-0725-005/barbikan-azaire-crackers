import { useState, useEffect } from 'react';
import { FiUsers, FiShoppingCart } from 'react-icons/fi';
import { LuIndianRupee } from 'react-icons/lu';
import { CiStar } from 'react-icons/ci';
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

function CustomerReportStats({ period }) {
	const [stats, setStats] = useState([]);

	useEffect(() => {
		const fetchCustomerStats = async () => {
			const session = getSession();
			if (!session) return;

			try {
				const endDate = new Date();
				const startDate = new Date();
				startDate.setDate(endDate.getDate() - (PERIODS_IN_DAYS[period] || 30));

				const formatDate = (date) => date.toISOString().split('T')[0];

				const response = await apiClient.get(
					`/customer-reports/${session.tenantId}/${
						session.organizationId
					}/${formatDate(startDate)}/${formatDate(endDate)}/lists`
				);

				const data = response.data.data;

				const statsData = [
					{
						title: 'Total Customers',
						value: data.stats.total_customers,
						message: 'active customers',
						icon: FiUsers,
					},
					{
						title: 'Total Revenue',
						value: `₹${data.stats.total_revenue.toLocaleString()}`,
						message: 'From customer orders',
						icon: LuIndianRupee,
					},
					{
						title: 'Avg Order Value',
						value: `₹${data.stats.avg_order_value.toLocaleString()}`,
						message: 'Per customer order',
						icon: FiShoppingCart,
					},
					{
						title: 'Retention Rate',
						value: data.stats.retention_rate,
						message: 'Customer retention',
						icon: CiStar,
					},
				];

				setStats(statsData);
			} catch (error) {
				console.error(
					'❌ Failed to fetch customer report stats:',
					error.response?.data || error.message
				);
			}
		};

		fetchCustomerStats();
	}, [period]);

	return (
		<>
			{stats.map((item) => (
				<Card key={item.title}>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-xs font-medium'>{item.title}</CardTitle>
						<item.icon size={16} style={{ color: 'var(--color-muted)' }} />
					</CardHeader>
					<CardContent>
						<div className='text-xl font-bold'>{item.value}</div>
						<div className='text-xs text-muted-foreground mt-1'>{item.message}</div>
					</CardContent>
				</Card>
			))}
		</>
	);
}

export default CustomerReportStats;
