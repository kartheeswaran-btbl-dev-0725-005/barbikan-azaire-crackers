import {
  Card,
  CardHeader,
  CardContent,
} from "../../../../shared/components/ui/Card";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import TitleCard from "../../../../shared/components/ui/TitleCard";
import { sampleCategoryDistribution } from "../../Shared/Constants/data";

function CategoryDistribution() {

    return (
        <Card key={"Title"}>
            <CardHeader className="flex-col items-start">
                <div className="flex w-full justify-between items-center">
                    <TitleCard
                        heading="Category Distribution"
                        tagline="Products by category"
                        variant="cardArea"
                    />
                </div>
            </CardHeader>
            <CardContent>
                {sampleCategoryDistribution && sampleCategoryDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={sampleCategoryDistribution}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="product" fontSize="14px" />
                            <YAxis fontSize="14px" />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-[300px]">
                        <p className="text-muted-foreground">No data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default CategoryDistribution;
