import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import TitleCard from '../../shared/components/ui/TitleCard';
import CustomerStats from './components/CustomerStats';
import CustomersTableCard from './components/CustomersTableCard';
import apiClient, { getSession } from '@/shared/utils/apiClient';

function CustomerManagement() {
	const [customerStats, setCustomerStats] = useState([]);
	const [customersFromDb, setCustomersFromDb] = useState([]);
	const [total, setTotal] = useState(0);
	const { page, limit } = useSelector((state) => state.pagination);

	useEffect(() => {
		const fetchCustomers = async () => {
			const session = getSession();
			if (!session) return;

			try {
				console.log(page, limit);

				const response = await apiClient.get(
					`/customers/${session.tenantId}/${session.organizationId}/lists`,
					{ params: { page, limit } }
				);

				const { data, total_customers, new_this_month, active_count, total_spent } =
					response.data;

				setCustomerStats([
					{ title: 'Total Customers', value: total_customers || 0 },
					{ title: 'Active Customers', value: active_count || 0 },
					{ title: 'New This Month', value: new_this_month || 0 },
					{ title: 'Avg Order Value', value: total_spent },
				]);

				setCustomersFromDb(data || []);
				setTotal(active_count); // ✅ store total count
				console.log("customersFromDb", data);

			} catch (error) {
				console.error('❌ Failed to fetch customers:', error.response?.data || error.message);
			}
		};

		fetchCustomers();
	}, [page, limit]);


	return (
		<div className="w-full">
			<div className="flex justify-between items-center">
				<TitleCard
					heading="Customer Management"
					tagline="Manage your customer database and relationships"
					variant="dashboardSection"
				/>
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5'>
				<CustomerStats customerStats={customerStats} />
			</div>

			<div className="my-5">
				{/* ✅ pass customers + total */}
				<CustomersTableCard customersFromDb={customersFromDb} totalItems={total} />
			</div>
		</div>
	);
}

export default CustomerManagement;
