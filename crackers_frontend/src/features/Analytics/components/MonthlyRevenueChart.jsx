import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
} from "../../../shared/components/ui/Card";
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar
} from "recharts";

function MonthlyRevenueChart({ revenueData }) {
    return (
        <Card>
            <CardHeader className="flex-col">
                <CardTitle className="text-sm">Monthly Revenue & Orders</CardTitle>
                <CardDescription className="text-sm">Revenue and order trends over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
                {revenueData.monthlyData && revenueData.monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueData.monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" fontSize="14px" />
                            <YAxis fontSize="14px" />
                            <Tooltip />
                            <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                        </BarChart>
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

export default MonthlyRevenueChart