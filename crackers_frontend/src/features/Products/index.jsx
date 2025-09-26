import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TitleCard from '../../shared/components/ui/TitleCard';
import ProductStats from './components/ProductStats';
import ToggleButton from '../../shared/components/common/HeadingToggle';
import ProductTableCard from './components/ProductTableCard/ProductTableCard';
import CategoryTableCard from './components/CategoryTableCard';
import apiClient, { getSession } from '@/shared/utils/apiClient';

function ProductManagement() {
	const productToggleList = ['Products', 'Categories'];
	const [selectedOption, setSelectedOption] = useState(productToggleList[0]);
	const { page, limit } = useSelector((state) => state.pagination);
	const [productStats, setProductStats] = useState([]);

	useEffect(() => {
		const fetchProducts = async () => {
			const session = getSession();
			if (!session) return;

			try {
				// Fetch products
				const productResponse = await apiClient.get(
					`/products/${session.tenantId}/${session.organizationId}/lists`,
					{ params: { page, limit } }
				);

				const categoryResponse = await apiClient.get(
					`/categories/${session.tenantId}/${session.organizationId}/lists`,
					{ params: { page, limit } }
				);

				console.log('✅ Products fetched:', productResponse.data);

				const { total_products, low_stock_count, total_value } =
					productResponse.data;

				setProductStats([
					{ title: 'Total Products', value: total_products || 0 },
					{ title: 'Total Categories', value: categoryResponse.data.total_categories || 0 },
					{ title: 'Low Stock Items', value: low_stock_count || 0 },
					{ title: 'Total Value', value: total_value || '₹0.00' },
				]);
			} catch (error) {
				console.error(
					'❌ Failed to fetch products:',
					error.response?.data || error.message
				);
			}
		};

		fetchProducts();
	}, [page, limit]);

	return (
		<div className='w-full'>
			<TitleCard
				heading='Product Management'
				tagline='Manage your products and categories'
				variant='dashboardSection'
			/>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5'>
				{<ProductStats productStats={productStats} />}
			</div>
			<div className='flex flex-col gap-2'>
				<ToggleButton
					toggleList={productToggleList}
					selectedOption={selectedOption}
					setSelectedOption={setSelectedOption}
				/>
				{selectedOption === 'Products' ? (
					<ProductTableCard />
				) : (
					<CategoryTableCard />
				)}
			</div>
		</div>
	);
}

export default ProductManagement;