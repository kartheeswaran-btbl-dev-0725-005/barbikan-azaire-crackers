import TitleCard from '../../shared/components/ui/TitleCard';
import EstimationStats from './components/EstimationStats';
import EnquiriesTableManagement from './components/EnquiriesTableCard/EnquiriesTableManagement';
import apiClient, { getSession } from '@/shared/utils/apiClient';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function OnlineEstimation() {
	const [estimates, setEstimates] = useState([]);
	const [estimationStatsData, setEstimationStatsData] = useState([]);
	const { page, limit } = useSelector((state) => state.pagination);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const fetchEstimates = async () => {
		const session = getSession();
		if (!session) {
			setError("No active session found");
			return;
		}

		try {
			setLoading(true);
			const response = await apiClient.get(
				`/estimates/${session.tenantId}/${session.organizationId}/lists`,
				{ params: { page, limit } }
			);
			const { data, total_estimates, new_count, couriered_estimates, total_value } = response.data;
			console.log('✅ Estimates fetched:', response.data);

			setEstimates(data || []);
			setEstimationStatsData([
				{ title: 'Total Estimates', value: total_estimates || 0 },
				{ title: 'New Estimates', value: new_count || 0 },
				{ title: 'Couriered Estimates', value: couriered_estimates || 0 },
				{ title: 'Total Value', value: total_value || '₹0.00' },
			]);
			setError(null);
		} catch (error) {
			setError(error.response?.data?.message || "Failed to fetch estimates");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchEstimates();
	}, [page, limit]);

	return (
		<div className='w-full'>
			<TitleCard
				heading='Online Estimate'
				tagline='Manage online enquiries and estimates'
				variant='dashboardSection'
			/>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5'>
				<EstimationStats estimationData={estimationStatsData} />
			</div>
			<div>
				<EnquiriesTableManagement enquiryData={estimates} refreshEstimates={fetchEstimates} />
			</div>
		</div>
	);
}

export default OnlineEstimation;
