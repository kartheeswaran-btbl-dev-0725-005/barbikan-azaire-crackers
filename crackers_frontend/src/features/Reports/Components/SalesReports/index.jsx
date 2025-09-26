import SalesReportStats from './SalesReportStats';

function SalesReport({ period }) {
	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-5'>
			<SalesReportStats period={period} />
		</div>
	);
}

export default SalesReport;
