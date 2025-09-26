import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '../../../shared/components/ui/Card';

function UserStats({ userData }) {
	return (
		<>
			{userData.map((stats) => (
				<Card key={stats.title}>
					<CardHeader className='flex flex-row items-center justify-between pb-10'>
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

export default UserStats;
