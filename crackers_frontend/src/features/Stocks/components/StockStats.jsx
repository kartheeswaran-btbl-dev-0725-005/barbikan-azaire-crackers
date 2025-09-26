import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '../../../shared/components/ui/Card';
import { FiAlertTriangle } from 'react-icons/fi';

function StockStats({ stockStats }) {
	return (
		<>
			{stockStats.map((stat) => (
				<Card key={stat.title}>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-10'>
						<CardTitle className='text-xs font-medium'>{stat.title}</CardTitle>
					</CardHeader>
					<CardContent>
						<div
							className={`flex items-center gap-2 ${
								(stat.title === 'Low Stock Items' || stat.title === 'Critical Stock') &&
								stat.value <= 5
									? 'text-red-500'
									: ''
							} text-xl font-bold`}
						>
							{stat.value}
							{(stat.title === 'Low Stock Items' || stat.title === 'Critical Stock') &&
								stat.value <= 5 && <FiAlertTriangle size={15} />}
						</div>
					</CardContent>
				</Card>
			))}
		</>
	);
}

export default StockStats;
