import InfoCard from '../../Shared/Components/InfoCard';

function StockbyCategory({ stockData }) {
	// Transform API data to InfoCard format
	const metrics =
		stockData?.map((item) => ({
			label: item.category,
			value: item.units,
			percentage: parseFloat(item.percentage), // convert "100.0%" to 100.0 if needed
		})) || [];

	return (
		<InfoCard
			title='Stock by Category'
			subtitle='Inventory distribution across categories'
			metrics={metrics}
		/>
	);
}

export default StockbyCategory;
