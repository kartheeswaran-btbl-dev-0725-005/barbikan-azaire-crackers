import {
    Card,
    CardHeader,
    CardContent
} from "../../../../shared/components/ui/Card";
import TitleCard from "../../../../shared/components/ui/TitleCard";
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar
} from "recharts";
import { samplePriceRange } from "../../Shared/Constants/data";

function PriceRangeAnalysis() {

    return (
        <Card key={"Title"}>
            <CardHeader className="flex-col items-start">
                <div className="flex w-full justify-between items-center">
                    <TitleCard
                        heading="Price Range Analysis"
                        tagline="Products by price ranges"
                        variant="cardArea"
                    />
                </div>
            </CardHeader>
            <CardContent>
                {samplePriceRange && samplePriceRange.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={samplePriceRange}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="price" fontSize="14px" />
                            <YAxis fontSize="14px" />
                            <Tooltip />
                            <Bar dataKey="count" fill="#82ca9d" />
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

export default PriceRangeAnalysis;
