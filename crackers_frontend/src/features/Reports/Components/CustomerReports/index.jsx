import { useEffect, useState } from 'react';
import CustomerReportStats from './CustomerReportStats';
import InfoCard from '../../Shared/Components/InfoCard';
import TopCustomersspending from './TopCustomersspending';
import CustomerAcquisitionTrend from './CustomerAcquistionTrend';
import DistributionCard from '../../Shared/Components/DistributionCard';
import { sampleStockData } from '../../Shared/Constants/data';
import apiClient, { getSession } from '@/shared/utils/apiClient';

const PERIODS_IN_DAYS = {
	'Last 7 days': 7,
	'Last 30 days': 30,
	'Last 90 days': 90,
	'Last 6 Months': 180,
	'Last Year': 365,
};

function CustomerReport({ period }) {
	const [detailedMetrics, setDetailedMetrics] = useState([]);

	useEffect(() => {
		const fetchDetailedAnalysis = async () => {
			const session = getSession();
			if (!session) return;

			try {
				const endDate = new Date();
				const startDate = new Date();
				startDate.setDate(endDate.getDate() - (PERIODS_IN_DAYS[period] || 30));

				const formatDate = (d) => d.toISOString().split('T')[0];

				const res = await apiClient.get(
					`/customer-reports/${session.tenantId}/${
						session.organizationId
					}/${formatDate(startDate)}/${formatDate(endDate)}/lists`
				);

				const data = res.data.data?.detailed_analysis || {};

				// 🔹 Convert "1/1" string values into {value, total}
				const parseMetric = (label, key) => {
					const raw = data[key];
					if (!raw) return { label, value: 0, total: 0 };

					const [val, tot] = raw.split('/').map(Number);
					return { label, value: val || 0, total: tot || 0 };
				};

				setDetailedMetrics([
					parseMetric('Active Customers', 'active_customers'),
					parseMetric('High-Value Customers (₹50k+)', 'high_value_customers'),
					parseMetric('Regular Customers (10+ orders)', 'regular_customers'),
				]);
			} catch (err) {
				console.error('❌ Failed to fetch detailed analysis', err);
			}
		};

		fetchDetailedAnalysis();
	}, [period]);

	return (
		<div>
			<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 my-5'>
				<CustomerReportStats period={period} />
			</div>

			<div className='flex flex-row gap-6 mb-5'>
				<div className='flex-1'>
					<TopCustomersspending period={period} />
				</div>
				<div className='flex-1'>
					<CustomerAcquisitionTrend period={period} />
				</div>
			</div>

			<div className='flex flex-row gap-6 mb-5'>
				<div className='flex-1'>
					<DistributionCard stockData={sampleStockData} />
				</div>
				<div className='flex-1'>
					<InfoCard
						title='Customer Detailed Analysis'
						subtitle='Comprehensive customer metrics'
						metrics={detailedMetrics} // ✅ dynamic now
					/>
				</div>
			</div>
		</div>
	);
}

export default CustomerReport;
