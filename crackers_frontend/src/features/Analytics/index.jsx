import { useState, useEffect } from 'react';
import TitleCard from '../../shared/components/ui/TitleCard';
import Button from '../../shared/components/ui/Button';
import DataSummary from './components/DataSummary';
import MonthlyRevenueChart from './components/MonthlyRevenueChart';
import ProductPerformance from './components/ProductPerformance';
import RecentOrders from './components/RecentOrders';
import LowStockAlert from './components/LowStockAlert';
import RecentNotifications from './components/Notifications';
import apiClient, { getSession } from '@/shared/utils/apiClient';

import {
	sampleRevenue,
	sampleProductData,
	sampleNotifications,
} from '../../shared/constants/mockData/sample_data';

const PERIODS_IN_DAYS = {
	'7 Days': 7,
	'30 Days': 30,
	'90 Days': 90,
};

function Analytics() {
	const [selectedCycle, setSelectedCycle] = useState('7 Days');
	const [summaryData, setSummaryData] = useState({
		total_orders: 0,
		total_orders_percentage: 0,
		online_enquiries: 0,
		online_enquiries_percentage: 0,
		total_sales: 0,
		total_sales_percentage: 0,
		recent_orders: [],
		low_stock_alert: [], // 🔹 Add this
	});

	useEffect(() => {
		const fetchSummaryData = async () => {
			const session = getSession();
			if (!session) return;

			try {
				const today = new Date();
				today.setHours(23, 59, 59, 999);

				const startDate = new Date();
				startDate.setDate(
					today.getDate() - (PERIODS_IN_DAYS[selectedCycle] || 7) + 1
				);
				startDate.setHours(0, 0, 0, 0);

				const formatDate = (d) => d.toISOString().split('T')[0];

				const res = await apiClient.get(
					`/analytics/${session.tenantId}/${session.organizationId}/${formatDate(
						startDate
					)}/${formatDate(today)}/lists`
				);

				const data = res.data.data || {};

				// Map recent_orders
				const mappedRecentOrders = (data.recent_orders || []).map((order) => ({
					id: order.estimate_id,
					customer_name: order.customer_name,
					amount: parseFloat(order.amount) || 0,
					status: order.status,
					estimate_code: order.estimate_code,
					created_at: order.created_at,
				}));

				// Map low_stock_alert
				const mappedLowStock = (data.low_stock_alert || []).map((item) => ({
					product_name: item.product_name,
					current: item.current,
					min: item.min,
					status: item.status,
				}));

				setSummaryData({
					total_orders: data.total_orders ?? 0,
					total_orders_percentage: data.total_orders_percentage ?? 0,
					online_enquiries: data.online_enquiries ?? 0,
					online_enquiries_percentage: data.online_enquiries_percentage ?? 0,
					total_sales: data.total_sales ?? 0,
					total_sales_percentage: data.total_sales_percentage ?? 0,
					recent_orders: mappedRecentOrders,
					low_stock_alert: mappedLowStock, // 🔹 pass API data
				});
			} catch (err) {
				console.error('❌ Analytics stats fetch failed:', err);
			}
		};

		fetchSummaryData();
	}, [selectedCycle]);

	const buttonsOnTop = [
		{ label: '7 Days', variant: 'manualToggle' },
		{ label: '30 Days', variant: 'manualToggle' },
		{ label: '90 Days', variant: 'manualToggle' },
	];

	return (
		<div className='flex flex-col'>
			<div className='flex justify-between items-center'>
				<TitleCard
					heading='Analytics Dashboard'
					tagline='Overview of your business performance'
					variant='dashboardSection'
				/>
				<div className='flex flex-wrap gap-2'>
					{buttonsOnTop.map((btn, index) => (
						<Button
							key={index}
							variant={btn.variant}
							isSelected={selectedCycle === btn.label}
							onClick={() => setSelectedCycle(btn.label)}
						>
							{btn.label}
						</Button>
					))}
				</div>
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5'>
				<DataSummary summaryData={summaryData} />
			</div>

			<div className='grid gap-6 lg:grid-cols-2 mb-5'>
				<MonthlyRevenueChart revenueData={sampleRevenue} />
				<ProductPerformance productData={sampleProductData} />
			</div>

			<div className='grid gap-6 lg:grid-cols-2 mb-5'>
				<RecentOrders
					ordersData={summaryData.recent_orders || []}
					selectedCycle={selectedCycle}
				/>
				<LowStockAlert
					lowStackData={summaryData.low_stock_alert || []} // 🔹 use API data
				/>
			</div>

			<div className='mb-10'>
				<RecentNotifications notifications={sampleNotifications} />
			</div>
		</div>
	);
}

export default Analytics;
