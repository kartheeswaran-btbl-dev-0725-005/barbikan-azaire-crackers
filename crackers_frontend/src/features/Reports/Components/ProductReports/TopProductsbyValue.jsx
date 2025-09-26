import { useState, useEffect } from 'react';
import TopItemsCard from '../../Shared/Components/TopItemsCard';
import apiClient, { getSession } from '../../../../Shared/Utils/apiClient';

function TopProductsbyValue({ fromDate, toDate }) {
	const [topProducts, setTopProducts] = useState([]);

	useEffect(() => {
		const fetchTopProducts = async () => {
			const session = getSession();
			if (!session) return;

			try {
				const end = toDate ? new Date(toDate) : new Date();
				const start = fromDate ? new Date(fromDate) : new Date();
				// `fromDate` already calculated from period in parent

				const formatDate = (date) => date.toISOString().split('T')[0];

				const response = await apiClient.get(
					`/product-reports/${session.tenantId}/${
						session.organizationId
					}/${formatDate(start)}/${formatDate(end)}/lists`
				);

				if (response.data.success) {
					setTopProducts(response.data.data.top_products_by_value || []);
				}
			} catch (error) {
				console.error('Error fetching product report:', error);
			}
		};

		fetchTopProducts();
	}, [fromDate, toDate]);

	const items = topProducts.map((p) => ({
		product: p.name,
		type: p.category,
		amount: `₹${p.total_value.toLocaleString()}`,
		units: p.stock_quantity,
	}));

	return (
		<TopItemsCard
			item={items}
			heading='Top Products by Value'
			tagline='Highest value inventory items'
		/>
	);
}

export default TopProductsbyValue;
