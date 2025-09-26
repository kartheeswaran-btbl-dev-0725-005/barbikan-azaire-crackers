import { useEffect, useState } from 'react';
import {
	Card,
	CardHeader,
	CardContent,
} from '../../../../shared/components/ui/Card';
import TitleCard from '../../../../shared/components/ui/TitleCard';
import Form from '../../../../shared/components/Form/Form';
import ToggleButton from '../../../../shared/components/ui/ToggleButton';
import Button from '../../../../shared/components/ui/Button';
import { FiSave } from 'react-icons/fi';
import { formData } from './constants/data';

import apiClient, { getSession } from '@/shared/utils/apiClient';

function GeneralTableCard() {
	const [formValues, setFormValues] = useState({
		storeName: '',
		storeDescription: '',
		minimumOrderValue: '',
		phone: '',
		email: '',
		addressLine1: '',
		addressLine2: '',
		city: '',
		state: '',
		postalCode: '',
		country: '',
	});

	const [stores, setStores] = useState([]);
	const [toggleState, setToggleState] = useState(false);

	// 🔍 Fetch all stores
	const fetchStores = async () => {
		const session = getSession();
		if (!session) return;

		try {
			const response = await apiClient.get(
				`/stores/${session.tenantId}/${session.organizationId}/lists`
			);
			console.log("store response: ", response.data);

		} catch (error) {
			console.error(
				'❌ Failed to fetch stores:',
				error.response?.data || error.message
			);
		}
	};

	useEffect(() => {
		fetchStores();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormValues((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setSuccess('');

		const session = getSession();
		if (!session) {
			setError('❌ Missing session data. Please log in again.');
			false;
			return;
		}

		try {
			await apiClient.post(
				`/stores/${session.tenantId}/${session.organizationId}/add`,
				{
					name: formValues.storeName,
					description: formValues.storeDescription,
					min_order_value: formValues.minimumOrderValue,
					online_orders_enabled: toggleState,
				} // ✅ send full form data
			);

			setSuccess('✅ Store created successfully');
			setFormValues({
				storeName: '',
				storeDescription: '',
				minimumOrderValue: '',
			}); // reset form
			fetchStores(); // refresh list
		} catch (err) {
			setError(err.response?.data?.message || '❌ Failed to create store');
		}
	};
	return (
		<Card className='w-full'>
			<CardHeader className='flex justify-between items-center'>
				<TitleCard
					heading='General Store Settings'
					tagline='Basic store information and configuration'
					variant='cardArea'
				/>
				<Button
					variant='themeContrast'
					customStyle='flex items-center gap-2'
					buttonType='submit'
					formId='generalSettingsForm'
				>
					<FiSave size={15} /> Save Settings
				</Button>
			</CardHeader>
			<CardContent>
				<Form
					id='generalSettingsForm'
					onSubmit={handleSubmit}
					formData={formData.general_settings}
					values={formValues}
					handleChange={handleChange}
				/>
				<div className='flex font-medium items-center text-xs mt-4'>
					<ToggleButton
						value={toggleState}
						onToggle={() => {
							setToggleState(!toggleState);
							console.log(toggleState);
						}}
					/>
					<span className='ml-2'>Enable Online Orders</span>
				</div>
				<div></div>
				{stores.length > 0 && (
					<div className='mt-4 p-4 bg-gray-50 rounded-md'>
						<h3 className='text-sm font-semibold mb-2'>Current Settings:</h3>

						{stores.map((store) => (
							<div key={store.store_id} className='mb-3 p-3 border rounded bg-white'>
								<p>
									<strong>Store Name:</strong> {store.name}
								</p>
								<p>
									<strong>Store Description:</strong>{' '}
									{store.description || 'No description'}
								</p>
								<p>
									<strong>Minimum Order Value:</strong> ₹{store.min_order_value || 0}
								</p>
								<p>
									<strong>Online Orders Enabled:</strong>{' '}
									{store.online_orders_enabled ? 'Yes' : 'No'}
								</p>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export default GeneralTableCard;
