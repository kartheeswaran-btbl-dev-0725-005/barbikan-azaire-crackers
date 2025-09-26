import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '../../../shared/components/ui/Card';

function CustomerStats({ customerStats }) {
	return (
		<>
			{customerStats.map((stat) => (
				<Card key={stat.title}>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-10'>
						<CardTitle className='text-xs font-medium'>{stat.title}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-xl font-bold'>{stat.value}</div>
					</CardContent>
				</Card>
			))}
		</>
	);
}

export default CustomerStats;
