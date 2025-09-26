import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '../../../shared/components/ui/Card';

function EstimationStats({ estimationData }) {
	return (
		<>
			{estimationData.map((stats) => (
				<Card className='flex flex-col justify-between' key={stats.title}>
					<CardHeader>
						<CardTitle className='text-xs font-medium'>{stats.title}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='text-xl font-bold'>{stats.value}</div>
					</CardContent>
				</Card>
			))}
		</>
	);
}

export default EstimationStats;
