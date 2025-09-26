import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '../../../shared/components/ui/Card';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { FiShoppingCart, FiUsers, FiFileText } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';

function DataSummary({ summaryData }) {
	const {
		total_orders = 0,
		total_orders_percentage = null,
		online_enquiries = 0,
		online_enquiries_percentage = null,
		total_sales = 0,
		total_sales_percentage = null,
	} = summaryData || {};

	const summary = [
		{
			title: 'Total Orders',
			value: total_orders,
			percentage: total_orders_percentage,
			icon: FiShoppingCart,
		},
		{
			title: 'Online Enquiries',
			value: online_enquiries,
			percentage: online_enquiries_percentage,
			icon: FiUsers,
		},
		{
			title: 'Invoices Created',
			value: 0,
			percentage: null,
			icon: FiFileText,
		},
		{
			title: 'Total Sales',
			value: `₹${total_sales.toLocaleString()}`,
			percentage: total_sales_percentage,
			icon: FaRupeeSign,
		},
	];

	return (
		<>
			{summary.map((item) => {
				const hasPercentage =
					item.percentage !== null && item.percentage !== undefined;

				// Show "--" if percentage is null
				const percentage = hasPercentage
					? Number(item.percentage).toFixed(1)
					: '--';

				// Up if positive or null
				const isUp = hasPercentage ? Number(item.percentage) >= 0 : true;

				return (
					<Card key={item.title}>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-xs font-medium'>{item.title}</CardTitle>
							<item.icon size={12} style={{ color: 'var(--color-muted)' }} />
						</CardHeader>
						<CardContent>
							<div className='text-xl font-bold'>{item.value}</div>
							<div className='flex items-center text-[10px] text-muted-foreground'>
								{hasPercentage && (
									<>
										{isUp ? (
											<FiTrendingUp className='mr-1 h-3 w-3 text-green-500' />
										) : (
											<FiTrendingDown className='mr-1 h-3 w-3 text-red-500' />
										)}
										<span className={isUp ? 'text-green-500' : 'text-red-500'}>
											{percentage}%
										</span>
									</>
								)}
								<span className='ml-1' style={{ color: 'var(--color-muted)' }}>
									from last month
								</span>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</>
	);
}

export default DataSummary;
