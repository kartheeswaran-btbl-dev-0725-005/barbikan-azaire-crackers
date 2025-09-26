import {
  Card,
  CardHeader,
  CardContent,
} from "../../../../shared/components/ui/Card";
import TitleCard from "../../../../shared/components/ui/TitleCard";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

function DistributionCard({ heading, tagline, item, valueType = "percentage" }) {
    return (
        <Card>
            <CardHeader className="flex-col">
                <TitleCard
                    heading={heading}
                    tagline={tagline}
                    variant="cardArea"
                />
            </CardHeader>
            <CardContent>
                {item && item.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                fontSize="14px"
                                data={item}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) =>
                                    valueType === "currency"
                                        ? `${name}: ₹${value.toLocaleString()}`
                                        : `${name}: ${value}%`
                                }
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {item.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(val) =>
                                    valueType === "currency"
                                        ? `₹${val.toLocaleString()}`
                                        : `${val}%`
                                }
                            />
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

export default DistributionCard;
