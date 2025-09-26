import TitleCard from '../../shared/components/ui/TitleCard';
import UserTableCard from './components/UserTableCard';
import UserStats from './components/UserStats';
import Button from '../../shared/components/ui/Button';
import { FaPlus } from 'react-icons/fa6';
import { sampleUserData } from '../../shared/constants/mockData/sample_data';
import apiClient, { getSession } from '@/shared/utils/apiClient';
import { useEffect, useState } from 'react';

function UserManagement() {
	const [users, setUsers] = useState([]);
	const [userStats, setUserStats] = useState([]);
	const [page, setPage] = useState(1);
	const [limit] = useState(5);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		const fetchTenantUsers = async () => {
			const session = getSession();
			if (!session) return;

			try {
				const response = await apiClient.get(
					`/tenantusers/${session.tenantId}/${session.organizationId}/lists`,
					{ params: { page, limit } }
				);

				const { data, total_users, active_users, owner_count, totalPages } =
					response.data;
				console.log(data);
				// Set paginated users
				setUsers(data || []);

				// Set stats for dashboard
				setUserStats([
					{ title: 'Total Users', value: total_users || 0 },
					{ title: 'Active Users', value: active_users || 0 },
					{ title: 'Owner Users', value: owner_count || 0 },
				]);

				setTotalPages(totalPages || 1);
			} catch (error) {
				console.error(
					'❌ Failed to fetch tenant users:',
					error.response?.data || error.message
				);
			}
		};

		fetchTenantUsers();
	}, [page, limit]);
	return (
		<div className='w-full'>
			<div className='flex justify-between items-center'>
				<TitleCard
					heading='User Management'
					tagline='Manage staff and admin accounts'
					variant='dashboardSection'
				/>
				<Button variant='themeContrast' customStyle='flex items-center gap-2'>
					<FaPlus /> Add User
				</Button>
			</div>
			<div className='grid gap-4 md:grid-cols-3 sm:grid-cols-1 my-5'>
				<UserStats userData={userStats} />
			</div>
			<div>
				<UserTableCard />
			</div>
		</div>
	);
}

export default UserManagement;
