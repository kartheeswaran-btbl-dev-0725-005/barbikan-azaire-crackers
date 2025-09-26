import DistributionCard from "../../Shared/Components/DistributionCard";
import { sampleStockData } from "../../Shared/Constants/data"; 

function StockLevelDistribution() {
  return (
    <DistributionCard heading="Stock Level Distribution"
      tagline="Product stock analysis"
      item={sampleStockData} />
  )
}

export default StockLevelDistribution