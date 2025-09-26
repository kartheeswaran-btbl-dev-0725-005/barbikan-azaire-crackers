import { useState } from 'react';
import TitleCard from '../../shared/components/ui/TitleCard';
import ToggleButton from '../../shared/components/common/HeadingToggle';
import DropDown from '../../shared/components/ui/DropDown';
import { CiCalendar } from 'react-icons/ci';
import CustomerReports from './Components/CustomerReports';
import SalesReports from './Components/SalesReports';
import InventoryReports from './Components/InventoryReports';
import ProductReports from './Components/ProductReports';

function Reports() {
	const reportsToggleList = [
		'Customer Analysis',
		'Product Analysis',
		'Sales Reports',
		'Inventory Reports',
	];
	const [selectedOption, setSelectedOption] = useState(reportsToggleList[0]);
	const reportsDateList = [
		'Last 7 days',
		'Last 30 days',
		'Last 90 days',
		'Last 6 Months',
		'Last Year',
	];
	const [selected, setSelected] = useState(reportsDateList[1]); // default Last 30 days

	return (
		<div className='w-full'>
			<TitleCard
				heading='Reports & Analytics'
				tagline='Comprehensive business reports and insights'
				variant='dashboardSection'
			/>
			<div className='mt-5'>
				<div className='flex justify-between'>
					<ToggleButton
						toggleList={reportsToggleList}
						selectedOption={selectedOption}
						setSelectedOption={setSelectedOption}
					/>
					<DropDown
						value={selected}
						onChange={setSelected}
						position='top'
						options={reportsDateList}
						icon={<CiCalendar size={18} />}
						className='pl-10 w-full'
					/>
				</div>
			</div>

			<div>
				{selectedOption === 'Customer Analysis' && (
					<CustomerReports period={selected} />
				)}
				{selectedOption === 'Product Analysis' && (
					<ProductReports period={selected} />
				)}
				{selectedOption === 'Sales Reports' && <SalesReports period={selected} />}
				{selectedOption === 'Inventory Reports' && (
					<InventoryReports period={selected} />
				)}
			</div>
		</div>
	);
}

export default Reports;
