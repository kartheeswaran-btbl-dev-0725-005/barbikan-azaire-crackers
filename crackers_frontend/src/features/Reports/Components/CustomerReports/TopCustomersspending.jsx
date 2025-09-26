import { useState, useEffect } from 'react';
import {
	Card,
	CardHeader,
	CardContent,
} from '../../../../shared/components/ui/Card';
import { MdOutlineFileDownload } from 'react-icons/md';
import Button from '../../../../shared/components/ui/Button';
import TitleCard from '../../../../shared/components/ui/TitleCard';
import apiClient, { getSession } from '@/shared/utils/apiClient';

// Map dropdown labels to number of days
const PERIODS_IN_DAYS = {
	'Last 7 days': 7,
	'Last 30 days': 30,
	'Last 90 days': 90,
	'Last 6 Months': 180,
	'Last Year': 365,
};

function TopCustomerSpending({ period }) {
	const [topCustomers, setTopCustomers] = useState([]);

	useEffect(() => {
		const fetchTopCustomers = async () => {
			const session = getSession();
			if (!session) return;

			try {
				const endDate = new Date();
				const startDate = new Date();
				startDate.setDate(endDate.getDate() - (PERIODS_IN_DAYS[period] || 30));

				const formatDate = (date) => date.toISOString().split('T')[0];

				const response = await apiClient.get(
					`/customer-reports/${session.tenantId}/${
						session.organizationId
					}/${formatDate(startDate)}/${formatDate(endDate)}/lists`
				);

				const data = response.data.data;
				setTopCustomers(data.top_customers || []);
			} catch (error) {
				console.error('❌ Failed to fetch top customers:', error);
			}
		};

		fetchTopCustomers();
	}, [period]);

	return (
		<Card className='col-span-2 w-full mt-1 h-[355px]'>
			<CardHeader className='flex justify-between'>
				<TitleCard
					heading='Top Customers by Spending'
					tagline='Highest Value Spenders'
					variant='gridCardArea'
					customStyles={{
						containerClass: 'pl-1 mt-3 mb-3',
						taglineClass: 'text-sm text-muted',
					}}
				/>
				<div className='mt-1 px-3'>
					<Button className='flex items-center gap-2 px-1.5 py-0.5 hover:bg-gray-100 text-sm border border-gray-200 rounded'>
						<MdOutlineFileDownload size={20} />
						Export
					</Button>
				</div>
			</CardHeader>

			{topCustomers.length > 0 ? (
				topCustomers.map((user, index) => (
					<div key={user.rank} className='flex items-center relative -top-4'>
						<div className='w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center ml-5'>
							{index + 1}
						</div>
						<div className='flex items-center w-full px-4 py-3'>
							<div className='flex-1'>
								<TitleCard
									heading={user.name}
									tagline={`${user.orders} orders`}
									variant='CardArea'
									customStyles={{ containerClass: 'pl-0 mt-0 mb-0' }}
								/>
							</div>
							<CardContent className='font-bold'>
								₹{user.total_spent.toLocaleString()}
							</CardContent>
						</div>
					</div>
				))
			) : (
				<div className='text-center text-sm text-muted mt-10'>
					No customer data available for this period
				</div>
			)}
		</Card>
	);
}

export default TopCustomerSpending;
