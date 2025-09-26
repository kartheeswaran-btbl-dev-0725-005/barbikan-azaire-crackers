import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
} from "../../../shared/components/ui/Card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

function ProductPerformance({ productData }) {
    return (
        <Card>
            <CardHeader className="flex-col">
                <CardTitle className="text-sm">Product Performance</CardTitle>
                <CardDescription>Sales distribution by product categories</CardDescription>
            </CardHeader>
            <CardContent>
                {productData && productData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                fontSize="14px"
                                data={productData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {productData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-[300px]">
                        <p className="text-muted-foreground">No data available</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default ProductPerformance