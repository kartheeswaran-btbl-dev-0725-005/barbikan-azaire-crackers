import { useEffect, useState } from 'react';
import TitleCard from '../../shared/components/ui/TitleCard';
import ToggleButton from '../../shared/components/common/HeadingToggle';
import StockStats from './components/StockStats';
import CurrentStockTableCard from './components/CurrentStockTableCard';
import StockMovementsTableCard from './components/StockMovementsTableCard';
import LowStockAlertsTableCard from './components/LowStockAlertsTableCard';
import apiClient, { getSession } from '@/shared/utils/apiClient';

function StockManagement() {
	const stocksToggleList = [
		'Current Stock',
		'Stock Movements',
		'Low Stock Alerts',
	];
	const [selectedOption, setSelectedOption] = useState(stocksToggleList[0]);

	const [stockStats, setStockStats] = useState([]);
	const [page, setPage] = useState(1);
	const [limit] = useState(5);

	useEffect(() => {
		const fetchStocks = async () => {
			const session = getSession();
			if (!session) return;

			try {
				const response = await apiClient.get(
					`/products/${session.tenantId}/${session.organizationId}/lists`,
					{ params: { page, limit } }
				);

				const {
					total_products,
					low_stock_count,
					critical_stock_count,
					total_value,
				} = response.data;

				setStockStats([
					{ title: 'Total Items', value: total_products || 0 },
					{ title: 'Low Stock Items', value: low_stock_count || 0 },
					{ title: 'Critical Stock', value: critical_stock_count || 0 },
					{ title: 'Total Value', value: total_value || '₹0.00' },
				]);
			} catch (error) {
				console.error(
					'❌ Failed to fetch stock stats:',
					error.response?.data || error.message
				);
			}
		};

		fetchStocks();
	}, [page, limit]);

	return (
		<div className='w-full'>
			<TitleCard
				heading='Stock Management'
				tagline='Monitor and manage your inventory levels'
				variant='dashboardSection'
			/>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5'>
				<StockStats stockStats={stockStats} />
			</div>
			<div className='flex flex-col gap-2'>
				<ToggleButton
					toggleList={stocksToggleList}
					selectedOption={selectedOption}
					setSelectedOption={setSelectedOption}
				/>
				{selectedOption === 'Current Stock' && <CurrentStockTableCard />}
				{selectedOption === 'Stock Movements' && <StockMovementsTableCard />}
				{selectedOption === 'Low Stock Alerts' && <LowStockAlertsTableCard />}
			</div>
		</div>
	);
}

export default StockManagement;
