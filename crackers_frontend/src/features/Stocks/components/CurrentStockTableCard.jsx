import { useState, useEffect } from 'react';
import {
	Card,
	CardHeader,
	CardContent,
} from '../../../shared/components/ui/Card';
import TitleCard from '../../../shared/components/ui/TitleCard';
import DropDown from '../../../shared/components/ui/DropDown';
import Search from '../../../shared/components/common/Search';
import { usePagination } from '../../../shared/hooks/usePagination';
import Button from '../../../shared/components/ui/Button';
import CustomTable from '../../../shared/components/Table/Table';
import { FaPlus } from 'react-icons/fa6';
import apiClient, { getSession } from '@/shared/utils/apiClient';

function CurrentStockTableCard() {
	const [loading, setLoading] = useState(true);
	const [products, setProducts] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [statusFilter, setStatusFilter] = useState('All Status');
	const [categoryFilter, setCategoryFilter] = useState('All Categories');
	const [categoryOptions, setCategoryOptions] = useState(['All Categories']);

	const tableHeaders = [
		{ key: 'productName', label: 'Product' },
		{ key: 'categoryName', label: 'Category' },
		{ key: 'currentStock', label: 'Current Stock' },
		{ key: 'minimumStock', label: 'Min Stock' },
		{ key: 'maximumStock', label: 'Max Stock' },
		{ key: 'status', label: 'Status' },
		{ key: 'lastUpdated', label: 'Last Updated' },
	];

	const {
		currentPage,
		rowsPerPage,
		setRowsPerPage,
		totalPages,
		currentItems,
		handlePageChange,
		scrollRef,
	} = usePagination(products, 10);

	useEffect(() => {
		const fetchProducts = async () => {
			const session = getSession();
			if (!session) return;

			setLoading(true);
			try {
				const res = await apiClient.get(
					`/products/${session.tenantId}/${session.organizationId}/lists`,
					{ params: { page: 1, limit: 100 } }
				);

				const data = res.data.data || [];

				// Map API response to table-friendly structure with status colors
				const mappedProducts = data.map((item) => {
					let statusColor = '';
					switch (item.status) {
						case 'active':
							statusColor = 'bg-green-100 text-green-800';
							break;
						case 'inactive':
							statusColor = 'bg-gray-200 text-gray-700';
							break;
						case 'deleted':
							statusColor = 'bg-red-100 text-red-800';
							break;
						default:
							statusColor = '';
					}

					return {
						productName: { value: item.product_name },
						categoryName: { value: item.category_name },
						currentStock: { value: item.stock_quantity },
						minimumStock: { value: item.minimum_stock },
						maximumStock: { value: item.maximum_stock },
						status: {
							value: item.status,
							customStyle: `px-2 py-1 rounded text-center font-medium ${statusColor}`,
						},
						lastUpdated: { value: item.updatedAt },
					};
				});

				setProducts(mappedProducts);

				// Set categories
				const categories = [
					'All Categories',
					...new Set(mappedProducts.map((p) => p.categoryName.value)),
				];
				setCategoryOptions(categories);

				setLoading(false);
			} catch (err) {
				console.error('❌ Failed to fetch products:', err);
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	// Filter products locally
	const filteredProducts = products.filter((p) => {
		const matchesSearch = p.productName.value
			.toLowerCase()
			.includes(searchText.toLowerCase());
		const matchesStatus =
			statusFilter === 'All Status' ||
			p.status.value.toLowerCase() === statusFilter.toLowerCase();
		const matchesCategory =
			categoryFilter === 'All Categories' ||
			p.categoryName.value === categoryFilter;
		return matchesSearch && matchesStatus && matchesCategory;
	});

	return (
		<div ref={scrollRef}>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between gap-4'>
					<TitleCard
						heading='Current Stock Levels'
						tagline='Real-time inventory status'
						variant='cardArea'
					/>
					<div className='flex items-center justify-between gap-2'>
						<Search
							placeholder='Search products...'
							onChange={(e) => setSearchText(e.target.value)}
							searchTerm={searchText}
							customStyle='w-48'
						/>
						<DropDown
							value={categoryFilter}
							onChange={setCategoryFilter}
							options={categoryOptions}
							position='top'
						/>
						<DropDown
							value={statusFilter}
							onChange={setStatusFilter}
							options={['All Status', 'active', 'inactive', 'deleted']}
							position='top'
						/>
						<Button variant='themeContrast' customStyle='flex items-center gap-2'>
							<FaPlus /> Add Transaction
						</Button>
					</div>
				</CardHeader>

				<CardContent>
					<CustomTable
						tableName='Current Stock'
						tableHeaders={tableHeaders}
						tableData={filteredProducts}
						loading={loading}
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
						rowsPerPage={rowsPerPage}
						setRowsPerPage={setRowsPerPage}
					/>
				</CardContent>
			</Card>
		</div>
	);
}

export default CurrentStockTableCard;
