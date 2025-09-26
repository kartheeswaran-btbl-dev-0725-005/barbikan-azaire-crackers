import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '../../../../shared/components/ui/Card';
import { LuPackage, LuBox, LuRepeat } from 'react-icons/lu';
import { FiAlertTriangle } from 'react-icons/fi';

function mapInventoryStats(stats) {
	return [
		{
			title: 'Total Stock Value',
			value: `₹${stats.total_stock_value?.toLocaleString() || 0}`,
			icon: LuPackage,
			message: 'Overall stock worth',
			trend: 'neutral',
		},
		{
			title: 'Total Units',
			value: stats.total_units || 0,
			icon: LuBox,
			message: 'Total available units',
			trend: 'neutral',
		},
		{
			title: 'Reorder Alerts',
			value: stats.reorder_alerts || 0,
			icon: FiAlertTriangle,
			message: 'Items need restocking',
			trend: stats.reorder_alerts > 0 ? 'down' : 'neutral',
		},
		{
			title: 'Stock Turnover',
			value: stats.stock_turnover || '0.00x',
			icon: LuRepeat,
			message: 'Movement of stock',
			trend: stats.stock_turnover === '0.00x' ? 'down' : 'neutral',
		},
	];
}

function InventoryReportStats({ stats }) {
	const data = mapInventoryStats(stats);

	return (
		<>
			{data.map((item) => {
				let iconColor = 'var(--color-muted)';
				if (
					(item.title === 'Reorder Alerts' && item.trend === 'down') ||
					(item.title === 'Stock Turnover' && item.trend === 'down')
				) {
					iconColor = 'red';
				}

				return (
					<Card key={item.title}>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-xs font-medium'>{item.title}</CardTitle>
							<item.icon size={16} style={{ color: iconColor }} />
						</CardHeader>
						<CardContent>
							<div
								className={`${
									item.title === 'Reorder Alerts' && item.value > 0 ? 'text-red-500' : ''
								} text-xl font-bold`}
							>
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

export default InventoryReportStats;
