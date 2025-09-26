import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '../../../shared/components/ui/Card';

function ProductStats({ productStats }) {
	return (
		<>
			{productStats.map((stat) => (
				<Card key={stat.title}>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-10'>
						<CardTitle className='text-xs font-medium'>{stat.title}</CardTitle>
					</CardHeader>
					<CardContent>
						<div
							className={`${stat.title === 'Low Stock Items' && stat.value <= 5
								? 'text-red-500'
								: ''
								} text-xl font-bold`}
						>
							{stat.value}
						</div>
					</CardContent>
				</Card>
			))}
		</>
	);
}

export default ProductStats;
