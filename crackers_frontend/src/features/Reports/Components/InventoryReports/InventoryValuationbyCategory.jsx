import DistributionCard from '../../Shared/Components/DistributionCard';
import { sampleStockvaluedistribution } from '../../Shared/Constants/data';
function InventoryValuationbyCategory() {
	return (
		<DistributionCard
			heading='Inventory Valuation by Category'
			tagline='Valuation distribution across categories'
			item={sampleStockvaluedistribution}
			valueType='currency'
		/>
	);
}

export default InventoryValuationbyCategory;
