import {
    Card,
    CardHeader,
    CardContent
} from "../../../../shared/components/ui/Card";
import TitleCard from "../../../../shared/components/ui/TitleCard";
import { sampleStockMovementData } from "../../Shared/Constants/data";
import {
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Legend,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
const EmptyLegend = () => null;
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const sortedPayload = [...payload].sort((a, b) => {
            if (a.dataKey === "inStockValue") return -1;
            if (b.dataKey === "inStockValue") return 1;
            return 0;
        });

        return (
            <div className="bg-white p-2 shadow text-sm">
                <p className="font-medium mb-1">{label}</p>
                {sortedPayload.map((entry, index) => (
                    <p key={`tooltip-${index}`} style={{ color: entry.color }} >
                        {entry.dataKey === "inStockValue" ? "inStock" : "outStock"} : {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

function StockMovementTrend({ item }) {
    return (
        <Card key={"Title"}>
            <CardHeader className="flex-col items-start">
                <div className="flex w-full justify-between items-center">
                    <TitleCard
                        heading="Stock Movement Trend"
                        tagline="Inventory changes over time"
                        variant="cardArea"
                    />
                </div>
            </CardHeader>
            <CardContent>
                {sampleStockMovementData && sampleStockMovementData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={sampleStockMovementData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Legend content={<EmptyLegend />} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="inStockValue" stroke="#8190c9ff" fill="#a49febff" fillOpacity={0.75} stackId="1" />
                            <Area type="monotone" dataKey="outStockValue" stroke="#42c070ff" fill="#82c59bff" fillOpacity={0.75} stackId="1" />
                        </AreaChart>
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

export default StockMovementTrend;
