import ProductReportStats from './ProductReportStats';
import CategoryDistribution from './CategoryDistribution';
import PriceRangeAnalysis from './PriceRangeAnalysis';
import StockLevelDistribution from './StockLevelDistribution';
import TopProductsbyValue from './TopProductsbyValue';

// Map dropdown labels to number of days
const PERIODS_IN_DAYS = {
	'Last 7 days': 7,
	'Last 30 days': 30,
	'Last 90 days': 90,
	'Last 6 Months': 180,
	'Last Year': 365,
};

function ProductReports({ period }) {
	// Calculate start and end dates based on period
	const endDate = new Date();
	const startDate = new Date();
	startDate.setDate(endDate.getDate() - (PERIODS_IN_DAYS[period] || 30));

	return (
		<>
			{/* Product summary stats */}
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5'>
				<ProductReportStats period={period} fromDate={startDate} toDate={endDate} />
			</div>

			{/* Detailed analysis */}
			<div className='flex flex-col'>
				<div className='grid gap-6 lg:grid-cols-2 mb-5'>
					<TopProductsbyValue fromDate={startDate} toDate={endDate} />
					<CategoryDistribution fromDate={startDate} toDate={endDate} />
				</div>
				<div className='grid gap-6 lg:grid-cols-2 mb-5'>
					<StockLevelDistribution fromDate={startDate} toDate={endDate} />
					<PriceRangeAnalysis fromDate={startDate} toDate={endDate} />
				</div>
			</div>
		</>
	);
}

export default ProductReports;
