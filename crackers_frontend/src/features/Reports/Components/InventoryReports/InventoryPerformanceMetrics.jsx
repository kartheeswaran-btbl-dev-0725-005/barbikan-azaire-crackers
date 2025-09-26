import InfoCard from '../../Shared/Components/InfoCard';

function InventoryPerformanceMetrics({ performance }) {
	// Transform API response into InfoCard metrics
	const metrics = performance
		? [
				{
					label: 'Stock Coverage',
					value: parseFloat(performance.stock_coverage),
					percentage: parseFloat(performance.stock_coverage),
				},
				{
					label: 'Inventory Accuracy',
					value: parseFloat(performance.inventory_accuracy),
					percentage: parseFloat(performance.inventory_accuracy),
				},
				{
					label: 'Order Fulfillment Rate',
					value: parseFloat(performance.order_fulfillment_rate),
					percentage: parseFloat(performance.order_fulfillment_rate),
				},
				{
					label: 'Dead Stock Percentage',
					value: parseFloat(performance.dead_stock_percentage),
					percentage: parseFloat(performance.dead_stock_percentage),
				},
		  ]
		: [];

	return (
		<InfoCard
			title='Inventory Performance Metrics'
			subtitle='Key inventory indicators'
			metrics={metrics}
		/>
	);
}

export default InventoryPerformanceMetrics;
